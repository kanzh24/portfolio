import { NextResponse } from "next/server";
import { UI_STRINGS, type Locale } from "@/lib/i18n";

const MIN_FORM_MS = 3_000;
const MAX_FORM_MS = 60 * 60 * 1000;
const MAX_NAME = 120;
const MAX_MESSAGE = 8_000;
const MIN_MESSAGE = 3;

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

function isLocale(x: unknown): x is Locale {
  return x === "en" || x === "vi";
}

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(s: string, max: number): string {
  return s.replace(/\0/g, "").trim().slice(0, max);
}

async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export async function POST(req: Request) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? process.env.EMAILJS_SERVICE_ID;
  const templateId =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? process.env.EMAILJS_TEMPLATE_ID;
  const publicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? process.env.EMAILJS_PUBLIC_KEY;
  /** Bắt buộc khi bật Restrict API / strict mode trong EmailJS (Dashboard → Account → API keys) */
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  if (!serviceId || !templateId || !publicKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    return NextResponse.json({ error: "turnstile_config" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const p = payload as Record<string, unknown>;

  const honeypot = typeof p.website === "string" ? p.website : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const formOpenedAt = typeof p.formOpenedAt === "number" ? p.formOpenedAt : NaN;
  if (!Number.isFinite(formOpenedAt)) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const now = Date.now();
  const elapsed = now - formOpenedAt;
  if (elapsed < MIN_FORM_MS) {
    return NextResponse.json({ error: "too_fast" }, { status: 400 });
  }
  if (elapsed > MAX_FORM_MS) {
    return NextResponse.json({ error: "too_old" }, { status: 400 });
  }

  const turnstileToken = typeof p.turnstileToken === "string" ? p.turnstileToken.trim() : "";
  if (!turnstileToken) {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 400 });
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const remoteip = forwarded?.split(",")[0]?.trim();

  const turnstileOk = await verifyTurnstile(turnstileToken, remoteip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 400 });
  }

  const locale = p.locale;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const name = typeof p.name === "string" ? sanitizeText(p.name, MAX_NAME) : "";
  const email = typeof p.email === "string" ? sanitizeText(p.email, 254) : "";
  const message = typeof p.message === "string" ? sanitizeText(p.message, MAX_MESSAGE) : "";

  if (name.length < 2) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (message.length < MIN_MESSAGE) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const time = new Date().toLocaleString(locale === "vi" ? "vi-VN" : "en-US");
  const title = UI_STRINGS[locale].emailJsTitle;

  try {
    const emailPayload: Record<string, unknown> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        title,
        name,
        time,
        message,
        email,
      },
    };
    if (privateKey) {
      emailPayload.accessToken = privateKey;
    }

    const emailRes = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text();
      console.error("[contact] EmailJS error", emailRes.status, text.slice(0, 200));
      if (
        emailRes.status === 403 &&
        /strict mode|Private Key|private key/i.test(text) &&
        !privateKey
      ) {
        console.error(
          "[contact] EmailJS strict mode: set EMAILJS_PRIVATE_KEY in .env (Dashboard → Account → API keys → Private Key)"
        );
      }
      return NextResponse.json({ error: "server_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "server_error" }, { status: 502 });
  }
}
