"use client";

import { useEffect, useMemo, useState } from "react";

type SupportedLocale = "ru" | "kk" | "en";

const clientCache = new Map<string, string>();

function keyOf(text: string, lang: SupportedLocale) {
  return `${lang}:${text}`;
}

function sameArray(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useBackendTranslations(texts: string[], targetLang: SupportedLocale) {
  const [translated, setTranslated] = useState<string[]>(texts);

  const stableTexts = useMemo(() => texts.map((x) => (x ?? "").toString()), [texts]);
  const signature = useMemo(() => `${targetLang}::${stableTexts.join("\u241E")}`, [stableTexts, targetLang]);

  useEffect(() => {
    let cancelled = false;

    if (targetLang === "ru") {
      setTranslated(stableTexts);
      return;
    }

    const out = [...stableTexts];
    const missing: Array<{ index: number; text: string }> = [];
    for (let i = 0; i < stableTexts.length; i++) {
      const text = stableTexts[i];
      if (!text.trim()) continue;
      const hit = clientCache.get(keyOf(text, targetLang));
      if (hit != null) out[i] = hit;
      else missing.push({ index: i, text });
    }

    if (missing.length === 0) {
      setTranslated((prev) => (sameArray(prev, out) ? prev : out));
      return;
    }

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: missing.map((x) => x.text),
        targetLang,
      }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as { translations?: string[] };
      })
      .then((json) => {
        if (!json?.translations) return;
        const next = [...out];
        for (let i = 0; i < missing.length; i++) {
          const src = missing[i];
          const translatedText = json.translations[i] ?? src.text;
          next[src.index] = translatedText;
          clientCache.set(keyOf(src.text, targetLang), translatedText);
        }
        if (!cancelled) {
          setTranslated((prev) => (sameArray(prev, next) ? prev : next));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTranslated((prev) => (sameArray(prev, stableTexts) ? prev : stableTexts));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [signature, targetLang]);

  return translated;
}
