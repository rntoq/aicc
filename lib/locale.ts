export type Locale = "ru" | "kk" | "en";

export function isValidLocale(v: string): v is Locale {
  return v === "ru" || v === "kk" || v === "en";
}
