import { apiServer } from "@/lib/api/apiServer";
import type { User } from "@/lib/types";

/**
 * Server-side helper to get initial logged-in user.
 *
 * Reads access token from cookies (handled inside apiServer) and,
 * if present and valid, fetches current user from backend.
 *
 * Usage (only in server components / layouts):
 *   const { initialUser } = await initLogin();
 */
export async function initLogin(): Promise<{ initialUser: User | null }> {
  // apiServer already injects Authorization header if `access` cookie exists
  const { body, error } = await apiServer.get<User>("/api/v1/auth/me/");

  if (error || !body) {
    return { initialUser: null };
  }

  return { initialUser: body };
}

