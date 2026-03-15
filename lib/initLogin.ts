import axios from "axios";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api/apiServer";
import { BASE_URL } from "@/lib/constants";
import type { User } from "@/lib/types";

/**
 * Server-side helper to get initial logged-in user.
 *
 * 1. Tries GET /me/ with the current access token.
 * 2. If access token is expired (401), attempts a silent refresh using
 *    the refresh cookie and retries GET /me/ with the new token.
 *
 * Usage (only in server components / layouts):
 *   const { initialUser } = await initLogin();
 */
export async function initLogin(): Promise<{ initialUser: User | null }> {
  const { body, error } = await apiServer.get<User>("/api/v1/auth/me/");

  if (!error && body) {
    return { initialUser: body };
  }

  // Access token expired or missing — try a silent refresh server-side
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh")?.value;
  if (!refreshToken) return { initialUser: null };

  try {
    const refreshRes = await axios.post<{ access: string }>(
      `${BASE_URL}/api/v1/auth/refresh/`,
      { refresh: refreshToken }
    );
    const newAccess = refreshRes.data.access;

    const meRes = await axios.get<User>(`${BASE_URL}/api/v1/auth/me/`, {
      headers: { Authorization: `Bearer ${newAccess}` },
    });

    return { initialUser: meRes.data };
  } catch {
    return { initialUser: null };
  }
}

