import { AxiosRequestConfig } from "axios";
import { BASE_URL } from "@/utils/constants";
import { getCookie } from "@/lib/cookies/cookieServer";

type ServerResult<T> = { body: T | null; error: unknown | null };

const buildUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, BASE_URL).toString();
};

const toHeaders = (
  token: string | null,
  extra?: AxiosRequestConfig["headers"]
): HeadersInit => {
  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (extra && typeof extra === "object") {
    Object.entries(extra as Record<string, string>).forEach(([k, v]) => {
      if (typeof v === "string") headers.set(k, v);
    });
  }

  return headers;
};

async function handleRequest<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ServerResult<T>> {
  try {
    const token = await getCookie("access");
    const headers = toHeaders(token, config?.headers);
    const response = await fetch(buildUrl(url), {
      method: method.toUpperCase(),
      headers,
      body: data != null ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        body: null,
        error: {
          status: response.status,
          statusText: response.statusText,
        },
      };
    }

    if (response.status === 204) return { body: null, error: null };

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return { body: null, error: null };
    }

    const body = (await response.json()) as T;
    return { body, error: null };
  } catch (error) {
    return { body: null, error };
  }
}

export const apiServer = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return handleRequest<T>("get", url, undefined, config);
  },

  post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return handleRequest<T>("post", url, body, config);
  },

  put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return handleRequest<T>("put", url, body, config);
  },

  patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return handleRequest<T>("patch", url, body, config);
  },

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return handleRequest<T>("delete", url, undefined, config);
  },
};
