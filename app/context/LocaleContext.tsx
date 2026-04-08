"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Locale } from "@/utils/locale";

export type { Locale } from "@/utils/locale";

const KEY = "kariera-pro-locale";

function getStored(): Locale {
  if (typeof window === "undefined") return "ru";
  const v = localStorage.getItem(KEY);
  return (v === "en" || v === "kk") ? v : "ru";
}

function persist(value: Locale) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, value);
  document.cookie = `${KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void } | null>(null);

export const LocaleProvider = ({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) => {
  const [locale, set] = useState<Locale>(() => initialLocale ?? getStored());

  useEffect(() => {
    const stored = getStored();
    if (stored !== locale) {
      set(stored);
      persist(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    set(next);
    persist(next);
  }, []);

  return <Ctx.Provider value={{ locale, setLocale }}>{children}</Ctx.Provider>;
};

export const useLocale = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
};
