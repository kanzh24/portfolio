"use client";

import { useState, useRef, useEffect } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { MagneticButton } from "./MagneticButton";
import { useLocale } from "./LocaleProvider";
import { getUi, type UiStrings } from "@/lib/i18n";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function contactErrorMessage(code: string | undefined, ui: UiStrings): string {
  switch (code) {
    case "too_fast":
      return ui.formErrorTooFast;
    case "too_old":
      return ui.formErrorTooOld;
    case "turnstile_failed":
      return ui.formErrorTurnstile;
    case "turnstile_config":
      return ui.formErrorTurnstileConfig;
    case "not_configured":
      return ui.formErrorConfig;
    case "validation":
      return ui.formErrorValidation;
    case "server_error":
      return ui.formErrorServer;
    default:
      return ui.formError;
  }
}

export function ContactForm() {
  const { locale } = useLocale();
  const ui = getUi(locale);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formOpenedAtRef = useRef(Date.now());
  const turnstileRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    formOpenedAtRef.current = Date.now();
  }, []);

  const siteKeyOk = Boolean(TURNSTILE_SITE_KEY);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!siteKeyOk) {
      setStatus("error");
      setFeedback(ui.formErrorTurnstileConfig);
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setFeedback(ui.formErrorTurnstile);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const website = (formData.get("website") as string) ?? "";
    if (website.trim().length > 0) {
      setStatus("error");
      setFeedback(ui.formErrorValidation);
      return;
    }

    const name = (formData.get("name") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const message = (formData.get("message") as string)?.trim() ?? "";

    setStatus("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: "",
          turnstileToken,
          formOpenedAt: formOpenedAtRef.current,
          locale,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setFeedback(contactErrorMessage(data.error, ui));
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      setStatus("success");
      setFeedback(ui.formSuccess);
      form.reset();
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      formOpenedAtRef.current = Date.now();
    } catch {
      setStatus("error");
      setFeedback(ui.formError);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  };

  return (
    <form className="relative space-y-6 sm:space-y-8" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — ẩn khỏi người dùng; bot hay điền */}
      <div
        className="absolute left-0 top-0 w-px h-px p-0 overflow-hidden [clip:rect(0,0,0,0)] border-0 opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="space-y-2 group">
        <label
          htmlFor="name"
          className="text-[10px] font-mono text-outline uppercase group-focus-within:text-primary transition-colors block"
        >
          {ui.formName}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          minLength={2}
          maxLength={120}
          disabled={status === "sending"}
          className="w-full bg-surface-container-lowest/20 border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 transition-all text-sm py-3 sm:py-4 focus:placeholder:opacity-0 rounded-none disabled:opacity-60"
        />
      </div>
      <div className="space-y-2 group">
        <label
          htmlFor="email"
          className="text-[10px] font-mono text-outline uppercase group-focus-within:text-primary transition-colors block"
        >
          {ui.formEmail}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          maxLength={254}
          disabled={status === "sending"}
          className="w-full bg-surface-container-lowest/20 border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 transition-all text-sm py-3 sm:py-4 focus:placeholder:opacity-0 rounded-none disabled:opacity-60"
        />
      </div>
      <div className="space-y-2 group">
        <label
          htmlFor="message"
          className="text-[10px] font-mono text-outline uppercase group-focus-within:text-primary transition-colors block"
        >
          {ui.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Project requirements..."
          rows={3}
          required
          minLength={3}
          maxLength={8000}
          disabled={status === "sending"}
          className="w-full bg-surface-container-lowest/20 border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 transition-all text-sm py-3 sm:py-4 focus:placeholder:opacity-0 rounded-none resize-none disabled:opacity-60"
        />
      </div>

      {siteKeyOk ? (
        <div className="min-h-[65px]">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            options={{ theme: "auto", size: "flexible" }}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        </div>
      ) : (
        <p className="text-sm text-error" role="alert">
          {ui.formErrorTurnstileConfig}
        </p>
      )}

      {feedback && (
        <div
          className={`text-sm py-3 px-4 rounded-sm ${
            status === "success"
              ? "bg-primary/20 text-primary"
              : status === "error"
                ? "bg-error-container/20 text-error"
                : ""
          }`}
        >
          {feedback}
        </div>
      )}

      <MagneticButton
        as="button"
        type="submit"
        disabled={
          status === "sending" || !siteKeyOk || !turnstileToken
        }
        className="w-full py-4 sm:py-5 bg-primary text-on-primary font-bold rounded-sm flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <span className="material-symbols-outlined text-sm animate-spin">
              progress_activity
            </span>
            {ui.formSending}
          </>
        ) : (
          <>
            {ui.formSubmit}
            <span className="material-symbols-outlined text-sm">send</span>
          </>
        )}
      </MagneticButton>
    </form>
  );
}
