import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies/cookieClient";
import { BASE_URL } from "@/lib/constants";

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

    if (
      error.response?.status === 401 &&
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

export const api = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.get<T>(url, config);
  },

  post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return axiosInstance.post<T>(url, body, config);
  },

  put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return axiosInstance.put<T>(url, body, config);
  },

  patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return axiosInstance.patch<T>(url, body, config);
  },

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.delete<T>(url, config);
  },
};
