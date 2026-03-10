import { useAuthStore } from "@/lib/store/authStore";

export const useAuth = () => useAuthStore();

/**
 * Small helper hook to format user label consistently.
 */
export const useUserLabel = (): string => {
  const { user } = useAuthStore();
  if (!user) return "";
  if (user.first_name || user.last_name) {
    return `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  }
  return user.email ?? "";
};

