import { cookies } from "next/headers";

export async function getCookie(key: string): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value ?? null;
}
