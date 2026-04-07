import { create } from "zustand";
import { authServices } from "@/lib/services/authServices";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies/cookieClient";
import type { AuthResponse, User } from "@/lib/types";

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  /** Bootstrap auth state on client from server-provided user (no extra network) */
  bootstrap: (user: User | null) => void;
  setFromResponse: (resp: AuthResponse) => void;
  setUser: (user: User | null) => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    age?: number;
    phone?: string;
    city?: string;
    role?: User["role"];
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const ACCESS_COOKIE = "access";
const REFRESH_COOKIE = "refresh";

function messageFromUnknown(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  return fallback;
}

function readTokensFromCookies(): { access: string | null; refresh: string | null } {
  if (typeof window === "undefined") {
    return { access: null, refresh: null };
  }
  return {
    access: getCookie(ACCESS_COOKIE),
    refresh: getCookie(REFRESH_COOKIE),
  };
}

function persistTokens(access: string | null, refresh: string | null) {
  if (typeof window === "undefined") return;
  if (access) {
    setCookie(ACCESS_COOKIE, access);
  } else {
    removeCookie(ACCESS_COOKIE);
  }
  if (refresh) {
    setCookie(REFRESH_COOKIE, refresh);
  } else {
    removeCookie(REFRESH_COOKIE);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  access: null,
  refresh: null,
  hydrated: false,
  loading: false,
  error: null,
  isAuthenticated: false,

  bootstrap: (user) => {
    const { access, refresh } = readTokensFromCookies();
    set({
      user,
      access,
      refresh,
      hydrated: true,
      isAuthenticated: !!user && !!access,
      loading: false,
      error: null,
    });
  },

  setFromResponse: (resp) => {
    persistTokens(resp.access, resp.refresh);
    set({
      user: resp.user,
      access: resp.access,
      refresh: resp.refresh,
      hydrated: true,
      isAuthenticated: true,
      error: null,
    });
  },

  setUser: (user) => set({ user }),

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { body: resp, error } = await authServices.login(payload);
      if (error || !resp) {
        const message = messageFromUnknown(error, "Не удалось выполнить вход");
        set({ error: message });
        throw error ?? new Error(message);
      }
      get().setFromResponse(resp);
    } catch (e) {
      const message = messageFromUnknown(e, "Не удалось выполнить вход");
      set({ error: message });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { body: resp, error } = await authServices.register(payload);
      if (error || !resp) {
        const message = messageFromUnknown(error, "Не удалось выполнить регистрацию");
        set({ error: message });
        throw error ?? new Error(message);
      }
      get().setFromResponse(resp);
    } catch (e) {
      const message = messageFromUnknown(e, "Не удалось выполнить регистрацию");
      set({ error: message });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    const { refresh } = get();
    set({ loading: true, error: null });

    try {
      if (refresh) {
        await authServices.logout(refresh);
      }
    } catch {
      // ignore backend logout failure; всё равно чистим локальное состояние
    } finally {
      persistTokens(null, null);
      set({
        user: null,
        access: null,
        refresh: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

// Small alias to keep naming stable across app
export const useAuth = useAuthStore;

export const useUserLabel = (): string => {
  const { user } = useAuthStore();
  if (!user) return "";
  if (user.first_name || user.last_name) {
    return `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  }
  return user.email ?? "";
};

