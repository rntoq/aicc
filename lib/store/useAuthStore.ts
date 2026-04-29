import { create } from "zustand";
import { authServices } from "@/lib/services/authServices";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies/cookieClient";
import { useQuizSessionStore, QUIZ_SESSIONS_STORAGE_KEY_V1 } from "@/lib/store/useQuizStore";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/lib/types";
import {
  QUIZ_SESSION_IDS_LEGACY_KEY,
} from "@/lib/utils/syncCompletedQuizSessions";

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
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
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

function readGuestSessionIdsFromQuizSessionsPersist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUIZ_SESSIONS_STORAGE_KEY_V1);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { sessions?: Record<string, { sessionId?: number }> } };
    const sessions = parsed?.state?.sessions;
    if (!sessions) return [];
    return Object.values(sessions)
      .map((e) => e?.sessionId)
      .filter((id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0);
  } catch {
    return [];
  }
}

function readGuestSessionIdsFromLegacyArray(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUIZ_SESSION_IDS_LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v > 0);
  } catch {
    return [];
  }
}

/** Guest `sessionId` values from localStorage only (no in-memory/API sources). */
function readGuestSessionIdsFromStorage(): number[] {
  const ids = new Set<number>();
  for (const id of readGuestSessionIdsFromQuizSessionsPersist()) ids.add(id);
  for (const id of readGuestSessionIdsFromLegacyArray()) ids.add(id);
  return Array.from(ids);
}

async function afterAuthSuccessMergeGuestProgress(sentGuestSessionIds: boolean): Promise<void> {
  if (typeof window === "undefined") return;
  if (sentGuestSessionIds) {
    try {
      localStorage.removeItem(QUIZ_SESSIONS_STORAGE_KEY_V1);
      localStorage.removeItem(QUIZ_SESSION_IDS_LEGACY_KEY);
    } catch {
      /* ignore */
    }
  }
  useQuizSessionStore.getState().clearAll();
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
      const guestSessionIds = readGuestSessionIdsFromStorage();
      const loginPayload: LoginPayload = {
        ...payload,
        ...(guestSessionIds.length > 0 ? { guest_session_ids: guestSessionIds } : {}),
      };
      const { body: resp, error } = await authServices.login(loginPayload);
      if (error || !resp) {
        const message = messageFromUnknown(error, "Не удалось выполнить вход");
        set({ error: message });
        throw error ?? new Error(message);
      }
      get().setFromResponse(resp);
      await afterAuthSuccessMergeGuestProgress(guestSessionIds.length > 0);
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
      const guestSessionIds = readGuestSessionIdsFromStorage();
      const registerPayload: RegisterPayload = {
        ...payload,
        ...(guestSessionIds.length > 0 ? { guest_session_ids: guestSessionIds } : {}),
      };
      const { body: resp, error } = await authServices.register(registerPayload);
      if (error || !resp) {
        const message = messageFromUnknown(error, "Не удалось выполнить регистрацию");
        set({ error: message });
        throw error ?? new Error(message);
      }
      get().setFromResponse(resp);
      await afterAuthSuccessMergeGuestProgress(guestSessionIds.length > 0);
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

