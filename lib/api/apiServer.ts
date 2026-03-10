import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/constants";

const axiosServer: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access")?.value ?? null;
}

type ServerResult<T> = { body: T | null; error: unknown };

async function handleRequest<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ServerResult<T>> {
  try {
    const token = await getServerToken();
    const headers = {
      ...(config?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await axiosServer.request<T>({
      method,
      url,
      data,
      ...config,
      headers,
    });

    return { body: response.data, error: null };
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
