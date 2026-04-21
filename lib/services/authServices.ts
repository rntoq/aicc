import { api } from "@/lib/api/api";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RegisterPayload,
  RefreshResponse,
  UpdateMePayload,
  User,
} from "@/lib/types";

type ServiceResult<T> = { body: T | null; error: unknown | null };

export type { UpdateMePayload };

export const authServices = {
  async login(payload: LoginPayload): Promise<ServiceResult<AuthResponse>> {
    const { body, error } = await api.post<AuthResponse, LoginPayload>(`/api/v1/auth/login/`, payload);
    return { body: body ?? null, error };
  },

  async register(payload: RegisterPayload): Promise<ServiceResult<AuthResponse>> {
    const { body, error } = await api.post<AuthResponse, RegisterPayload>(`/api/v1/auth/register/`, payload);
    return { body: body ?? null, error };
  },

  async refresh(refresh: string): Promise<ServiceResult<RefreshResponse>> {
    const { body, error } = await api.post<RefreshResponse, { refresh: string }>(`/api/v1/auth/refresh/`, {
      refresh,
    });
    return { body: body ?? null, error };
  },

  async me(): Promise<ServiceResult<User>> {
    const { body, error } = await api.get<User>(`/api/v1/auth/me/`);
    return { body: body ?? null, error };
  },

  async updateMePut(payload: UpdateMePayload): Promise<ServiceResult<User>> {
    const { body, error } = await api.put<User, UpdateMePayload>(`/api/v1/auth/me/`, payload);
    return { body: body ?? null, error };
  },

  async logout(refresh: string): Promise<ServiceResult<unknown>> {
    const { body, error } = await api.post<unknown, { refresh: string }>(`/api/v1/auth/logout/`, { refresh });
    return { body: body ?? null, error };
  },

  async updateProfile(payload: UpdateMePayload | FormData): Promise<ServiceResult<User>> {
    const { body, error } = await api.patch<User, UpdateMePayload | FormData>(`/api/v1/auth/me/`, payload);
    return { body: body ?? null, error };
  },

  async changePassword(payload: ChangePasswordPayload): Promise<ServiceResult<Record<string, string>>> {
    const { body, error } = await api.post<Record<string, string>, ChangePasswordPayload>(
      `/api/v1/auth/change-password/`,
      payload
    );
    return { body: body ?? null, error };
  },

  async requestPasswordReset(payload: PasswordResetRequestPayload): Promise<ServiceResult<Record<string, string>>> {
    const { body, error } = await api.post<Record<string, string>, PasswordResetRequestPayload>(
      "/api/v1/auth/password-reset/request/",
      payload
    );
    return { body: body ?? null, error };
  },

  async confirmPasswordReset(payload: PasswordResetConfirmPayload): Promise<ServiceResult<Record<string, string>>> {
    const { body, error } = await api.post<Record<string, string>, PasswordResetConfirmPayload>(
      "/api/v1/auth/password-reset/confirm/",
      payload
    );
    return { body: body ?? null, error };
  },
};

// --------------------------------------------------
// TanStack Query mutations (settings/profile)
// --------------------------------------------------

export const useUpdateProfile = (): UseMutationResult<
  User,
  unknown,
  Parameters<typeof authServices.updateProfile>[0]
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { body, error } = await authServices.updateProfile(payload);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body;
    },
  });
};

export const useChangePassword = (): UseMutationResult<
  Record<string, string>,
  unknown,
  Parameters<typeof authServices.changePassword>[0]
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { body, error } = await authServices.changePassword(payload);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body;
    },
  });
};

