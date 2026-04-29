"use client";

type Locale = "ru" | "kk" | "en";
type Path = Array<string | number>;

const TRANSLATABLE_RESULT_KEYS = new Set([
  "test_title",
  "primary_type",
  "secondary_type",
  "summary",
  "detailed_report",
]);

export function getCurrentLocaleForTranslation(): Locale {
  if (typeof window === "undefined") return "ru";
  const value = localStorage.getItem("kariera-pro-locale");
  return value === "kk" || value === "en" ? value : "ru";
}

function collectTranslatablePaths(value: unknown, path: Path = [], out: Path[] = []): Path[] {
  if (value == null) return out;
  if (typeof value === "string") {
    const last = path[path.length - 1];
    if (typeof last === "string" && TRANSLATABLE_RESULT_KEYS.has(last) && value.trim().length > 0) {
      out.push(path);
    }
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectTranslatablePaths(item, [...path, index], out));
    return out;
  }
  if (typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      collectTranslatablePaths(nested, [...path, key], out);
    });
  }
  return out;
}

function getAtPath(root: unknown, path: Path): unknown {
  let current: unknown = root;
  for (const segment of path) {
    if (current == null) return undefined;
    if (typeof segment === "number") {
      if (!Array.isArray(current)) return undefined;
      current = current[segment];
    } else {
      if (typeof current !== "object") return undefined;
      current = (current as Record<string, unknown>)[segment];
    }
  }
  return current;
}

function setAtPath(root: unknown, path: Path, value: unknown): void {
  let current: unknown = root;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    if (typeof segment === "number") {
      if (!Array.isArray(current)) return;
      current = current[segment];
    } else {
      if (typeof current !== "object" || current == null) return;
      current = (current as Record<string, unknown>)[segment];
    }
  }
  const last = path[path.length - 1];
  if (typeof last === "number") {
    if (Array.isArray(current)) current[last] = value;
    return;
  }
  if (typeof current === "object" && current != null) {
    (current as Record<string, unknown>)[last] = value;
  }
}

export async function translateQuizResultForLocale(result: unknown, locale: Locale): Promise<unknown> {
  if (locale === "ru" || result == null || typeof result !== "object") return result;

  const paths = collectTranslatablePaths(result);
  if (!paths.length) return result;

  const texts = paths
    .map((path) => getAtPath(result, path))
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  if (!texts.length) return result;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang: locale }),
    });
    if (!response.ok) return result;
    const data = (await response.json()) as { translations?: unknown };
    if (!Array.isArray(data.translations)) return result;
    const translations = data.translations as unknown[];

    const copy = structuredClone(result);
    paths.forEach((path, index) => {
      const translated = translations[index];
      if (typeof translated === "string" && translated.trim().length > 0) {
        setAtPath(copy, path, translated);
      }
    });
    return copy;
  } catch {
    return result;
  }
}
