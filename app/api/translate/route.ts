import { NextResponse } from "next/server";
import { translateBatchWithMeta } from "@/lib/services/translationService";

type SupportedLocale = "ru" | "kk" | "en";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      texts?: unknown;
      targetLang?: unknown;
    };
    const texts = Array.isArray(payload.texts) ? payload.texts : null;
    const targetLang = payload.targetLang;

    if (!texts || !["ru", "kk", "en"].includes(String(targetLang))) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const stringTexts = texts.map((x) => (typeof x === "string" ? x : ""));
    const { translations, meta } = await translateBatchWithMeta(stringTexts, targetLang as SupportedLocale);
    return NextResponse.json({ translations, meta });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
