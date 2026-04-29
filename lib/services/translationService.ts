"use server";

type SupportedLocale = "ru" | "kk" | "en";

const GOOGLE_API_URL = "https://translation.googleapis.com/language/translate/v2";
const translationCache = new Map<string, string>();

function getApiKey(): string | null {
  return process.env.GOOGLE_TRANSLATE_API_KEY ?? null;
}

function cacheKey(text: string, targetLang: SupportedLocale): string {
  return `${targetLang}:${text}`;
}

export async function translateBatch(texts: string[], targetLang: SupportedLocale): Promise<string[]> {
  if (targetLang === "ru") return texts;

  const apiKey = getApiKey();
  if (!apiKey) return texts;

  const normalized = texts.map((t) => (typeof t === "string" ? t : ""));
  const pending: Array<{ index: number; text: string }> = [];
  const out = [...normalized];

  for (let i = 0; i < normalized.length; i++) {
    const text = normalized[i];
    if (!text.trim()) continue;
    const key = cacheKey(text, targetLang);
    const cached = translationCache.get(key);
    if (cached != null) {
      out[i] = cached;
    } else {
      pending.push({ index: i, text });
    }
  }

  if (pending.length === 0) return out;

  try {
    const url = `${GOOGLE_API_URL}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: pending.map((x) => x.text),
        target: targetLang,
        source: "ru",
        format: "text",
      }),
      cache: "no-store",
    });

    if (!response.ok) return texts;
    const json = (await response.json()) as {
      data?: { translations?: Array<{ translatedText?: string }> };
    };
    const translated = json.data?.translations ?? [];

    for (let i = 0; i < pending.length; i++) {
      const original = pending[i];
      const value = translated[i]?.translatedText ?? original.text;
      out[original.index] = value;
      translationCache.set(cacheKey(original.text, targetLang), value);
    }
    return out;
  } catch {
    return texts;
  }
}

export async function translateText(text: string, targetLang: SupportedLocale): Promise<string> {
  const [translated] = await translateBatch([text], targetLang);
  return translated ?? text;
}

export async function translateBatchWithMeta(texts: string[], targetLang: SupportedLocale): Promise<{
  translations: string[];
  meta: {
    usedFallback: boolean;
    reason?: string;
    httpStatus?: number;
    googleError?: string;
  };
}> {
  if (targetLang === "ru") {
    return { translations: texts, meta: { usedFallback: false } };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      translations: texts,
      meta: { usedFallback: true, reason: "missing_api_key" },
    };
  }

  const normalized = texts.map((t) => (typeof t === "string" ? t : ""));
  try {
    const url = `${GOOGLE_API_URL}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: normalized,
        target: targetLang,
        source: "ru",
        format: "text",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        translations: texts,
        meta: {
          usedFallback: true,
          reason: "google_non_200",
          httpStatus: response.status,
          googleError: errText.slice(0, 500),
        },
      };
    }

    const json = (await response.json()) as {
      data?: { translations?: Array<{ translatedText?: string }> };
      error?: { message?: string };
    };
    const translated = json.data?.translations?.map((x) => x.translatedText ?? "") ?? [];
    if (translated.length !== normalized.length) {
      return {
        translations: texts,
        meta: {
          usedFallback: true,
          reason: "google_unexpected_shape",
          googleError: json.error?.message,
        },
      };
    }

    return { translations: translated, meta: { usedFallback: false } };
  } catch (e) {
    return {
      translations: texts,
      meta: {
        usedFallback: true,
        reason: "fetch_error",
        googleError: e instanceof Error ? e.message : "unknown_error",
      },
    };
  }
}
