import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies/cookieClient";
import { BASE_URL } from "@/lib/constants";
import type { User } from "@/lib/types";

export type ApiResult<T> = { body: AxiosResponse<T> | null; error: unknown | null };

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
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

      const refreshToken = getCookie("refresh");

      if (!refreshToken) {
        removeCookie("access");
        removeCookie("refresh");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<{ access: string }>(
          `${BASE_URL}/api/v1/auth/refresh/`,
          { refresh: refreshToken }
        );

        const newToken = data.access;

        setCookie("access", newToken);
        setCookie("refresh", refreshToken);

        // Обновляем auth store: если user был null (bootstrap с истёкшим токеном),
        // подтягиваем пользователя и восстанавливаем isAuthenticated.
        // Динамический импорт разрывает циклическую зависимость api → auth store → authServices → api
        import("@/lib/store/useAuthStore").then(async ({ useAuthStore }) => {
          const store = useAuthStore.getState();
          if (!store.user) {
            try {
              const { data: userData } = await axios.get<User>(
                `${BASE_URL}/api/v1/auth/me/`,
                { headers: { Authorization: `Bearer ${newToken}` } }
              );
              store.setFromResponse({ access: newToken, refresh: refreshToken, user: userData });
            } catch {
              // Не критично — токен обновлён, следующий запрос пройдёт
            }
          } else {
            // user уже есть — просто обновляем токен в store
            store.setFromResponse({ access: newToken, refresh: refreshToken, user: store.user });
          }
        });

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        removeCookie("access");
        removeCookie("refresh");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

async function safeRequest<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const res = await axiosInstance.request<T>(config);
    return { body: res, error: null };
  } catch (err) {
    return { body: null, error: err };
  }
}

export const api = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return safeRequest<T>({ ...(config ?? {}), method: "GET", url });
  },

  post<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return safeRequest<T>({ ...(config ?? {}), method: "POST", url, data });
  },

  put<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return safeRequest<T>({ ...(config ?? {}), method: "PUT", url, data });
  },

  patch<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return safeRequest<T>({ ...(config ?? {}), method: "PATCH", url, data });
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return safeRequest<T>({ ...(config ?? {}), method: "DELETE", url });
  },
};
