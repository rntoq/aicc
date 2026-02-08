"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Locale = "ru" | "kk";

const LOCALE_STORAGE_KEY = "kariera-pro-locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "ru";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "kk" ? "kk" : "ru";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    setLocaleState(getStoredLocale());
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
