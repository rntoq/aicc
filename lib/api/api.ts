import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies/cookieClient";
import { BASE_URL } from "@/utils/constants";
import type { User } from "@/lib/types";

type ApiResult<T> = { body: T | null; error: unknown | null };

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Raw instance (no interceptors) for refresh/me during refresh flow
const axiosRaw: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --------------------------------------------------
// Refresh state control
// --------------------------------------------------

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const shouldRedirectToLogin = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/client");
};

const redirectToLoginIfNeeded = () => {
  if (!shouldRedirectToLogin()) return;
  window.location.href = "/login";
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function toastSessionExpiredOnce() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __kariera_session_expired_toast__?: boolean };
  if (w.__kariera_session_expired_toast__) return;
  w.__kariera_session_expired_toast__ = true;
  try {
    const mod = await import("react-toastify");
    mod.toast.error("Сессия истекла. Пожалуйста, войдите снова.");
  } catch {
    // ignore toast failure (e.g., during early boot)
  }
}

async function fetchMeWithAccessToken(access: string): Promise<User | null> {
  try {
    const { data } = await axiosRaw.get<User>(`/api/v1/auth/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    return data;
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getCookie("refresh");

  if (!refreshToken) {
    removeCookie("access");
    removeCookie("refresh");
    redirectToLoginIfNeeded();
    throw new Error("Unauthorized");
  }

  try {
    const { data } = await axiosRaw.post<{ access: string }>(`/api/v1/auth/refresh/`, { refresh: refreshToken });
    const newToken = data.access;

    setCookie("access", newToken);
    setCookie("refresh", refreshToken);

    // Обновляем auth store (если он уже загружен на клиенте).
    // Динамический импорт разрывает циклическую зависимость api → auth store → authServices → api
    import("@/lib/store/useAuthStore").then(async ({ useAuthStore }) => {
      const store = useAuthStore.getState();
      if (!store.user) {
        const me = await fetchMeWithAccessToken(newToken);
        if (me) {
          store.setFromResponse({ access: newToken, refresh: refreshToken, user: me });
        }
      } else {
        store.setFromResponse({ access: newToken, refresh: refreshToken, user: store.user });
      }
    });

    return newToken;
  } catch (refreshError) {
    const refreshStatus = (refreshError as AxiosError | undefined)?.response?.status;
    if (refreshStatus === 401) {
      await toastSessionExpiredOnce();
    }

    removeCookie("access");
    removeCookie("refresh");
    redirectToLoginIfNeeded();

    throw refreshError;
  }
}

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = getCookie("access");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const status = error.response?.status;
    const url = originalRequest.url || "";

    // Для /auth/login/ и /auth/register/ не пытаемся делать refresh и не редиректим —
    // даём ошибке дойти до вызова (например, чтобы показать toast на /login).
    const isAuthEndpoint =
      url.includes("/api/v1/auth/login/") || url.includes("/api/v1/auth/register/");

    if (
      status === 401 &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      const hasRefreshToken = !!getCookie("refresh");
      if (!hasRefreshToken) {
        removeCookie("access");
        removeCookie("refresh");
        redirectToLoginIfNeeded();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

async function request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const res = await axiosInstance.request<T>(config);
    return { body: res.data, error: null };
  } catch (err) {
    return { body: null, error: err };
  }
}

export const api = {
  request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
    return request<T>(config);
  },

  get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return request<T>({ ...(config ?? {}), method: "GET", url });
  },

  post<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return request<T>({ ...(config ?? {}), method: "POST", url, data });
  },

  put<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return request<T>({ ...(config ?? {}), method: "PUT", url, data });
  },

  patch<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return request<T>({ ...(config ?? {}), method: "PATCH", url, data });
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return request<T>({ ...(config ?? {}), method: "DELETE", url });
  },
};
