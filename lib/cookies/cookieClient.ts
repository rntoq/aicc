import { parse, serialize } from "cookie";

const toMaxAge = (days: number) => 60 * 60 * 24 * days;
const isSecureContext = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

export const getCookie = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  const parsed = parse(document.cookie || "");
  return parsed[key] || null;
};

export const setCookie = (key: string, value: string, maxAge = 7): void => {
  document.cookie = serialize(key, value, {
    path: "/",
    maxAge: toMaxAge(maxAge),
    sameSite: "lax",
    secure: isSecureContext(),
  });
};

export const removeCookie = (key: string): void => {
  document.cookie = serialize(key, "", {
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
    secure: isSecureContext(),
  });
};
