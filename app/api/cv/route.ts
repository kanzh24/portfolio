import { readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const dataDir = join(process.cwd(), "data");
const CV_CANDIDATES = ["cv.pdf", "CV.pdf", "Cv.pdf"];

export async function GET() {
  const pdfPath = CV_CANDIDATES.map((name) => join(dataDir, name)).find((p) =>
    existsSync(p)
  );
  if (!pdfPath) {
    return new NextResponse(
      "Chưa có file CV. Thêm data/cv.pdf (hoặc CV.pdf) cạnh data/cv.md.",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  let downloadFilename = "cv.pdf";
  const metaPath = join(dataDir, "cv.md");
  if (existsSync(metaPath)) {
    try {
      const raw = readFileSync(metaPath, "utf8");
      const { data } = matter(raw);
      if (typeof data.downloadFilename === "string" && data.downloadFilename.trim()) {
        downloadFilename = data.downloadFilename.trim();
      }
    } catch {
      /* giữ mặc định */
    }
  }

  const buf = readFileSync(pdfPath);
  const asciiName = downloadFilename.replace(/[^\x20-\x7E]/g, "_");
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`,
    },
  });
}
