import { create } from "zustand";
import { authServices } from "@/lib/services/authServices";
import { quizServices } from "@/lib/services/quizServices";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies/cookieClient";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import type { AuthResponse, LoginPayload, QuizSessionsListItem, RegisterPayload, User } from "@/lib/types";

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

const SESSION_IDS_STORAGE_KEY = "quiz-session-ids";

function readGuestSessionIdsFromStorage(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSION_IDS_STORAGE_KEY);
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

function normalizeQuizSessionKey(session: QuizSessionsListItem): string {
  const slug = session.test_slug?.toLowerCase();
  if (slug === "big-five") return "bigfive";
  if (slug === "photo") return "photo-career";
  if (slug) return slug;

  const type = String(session.test_type ?? "").toLowerCase();
  if (type === "big_five") return "bigfive";
  if (type === "career_aptitude") return "career-aptitude";
  return type.replace(/_/g, "-");
}

async function syncQuizSessionIdsToLocalStorage() {
  if (typeof window === "undefined") return;

  try {
    const { body, error } = await quizServices.listSessions();
    if (error || !body?.length) {
      localStorage.setItem(SESSION_IDS_STORAGE_KEY, JSON.stringify([]));
      return;
    }

    const uniqueSessionIds = Array.from(new Set(body.map((s) => s.id)));
    localStorage.setItem(SESSION_IDS_STORAGE_KEY, JSON.stringify(uniqueSessionIds));

    const latestByTest = new Map<string, QuizSessionsListItem>();
    body.forEach((session) => {
      const key = normalizeQuizSessionKey(session);
      const prev = latestByTest.get(key);
      if (!prev || prev.id < session.id) {
        latestByTest.set(key, session);
      }
    });

    const quizState = useQuizSessionStore.getState();
    latestByTest.forEach((session, key) => {
      quizState.setSession(key, session.id);
    });
  } catch {
    // ignore sync failures: auth should still complete successfully
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
      const guestSessionIds = readGuestSessionIdsFromStorage();
      const loginPayload: LoginPayload =
        guestSessionIds.length > 0
          ? { ...payload, guest_session_ids: guestSessionIds }
          : payload;
      const { body: resp, error } = await authServices.login(loginPayload);
      if (error || !resp) {
        const message = messageFromUnknown(error, "Не удалось выполнить вход");
        set({ error: message });
        throw error ?? new Error(message);
      }
      get().setFromResponse(resp);
      await syncQuizSessionIdsToLocalStorage();
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
      const registerPayload: RegisterPayload =
        guestSessionIds.length > 0
          ? { ...payload, guest_session_ids: guestSessionIds }
          : payload;
      const { body: resp, error } = await authServices.register(registerPayload);
      if (error || !resp) {
        const message = messageFromUnknown(error, "Не удалось выполнить регистрацию");
        set({ error: message });
        throw error ?? new Error(message);
      }
      get().setFromResponse(resp);
      await syncQuizSessionIdsToLocalStorage();
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

