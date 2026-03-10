import { api } from "@/lib/api/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RefreshResponse,
  User,
} from "@/lib/types";



export const authServices = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse, LoginPayload>(
      `/api/v1/auth/login/`,
      payload
    );
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse, RegisterPayload>(
      `/api/v1/auth/register/`,
      payload
    );
    return data;
  },

  async refresh(refresh: string): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse, { refresh: string }>(
      `/api/v1/auth/refresh/`,
      { refresh }
    );
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>(`/api/v1/auth/me/`);
    return data;
  },

  async logout(refresh: string): Promise<void> {
    await api.post<unknown, { refresh: string }>(
      `/api/v1/auth/logout/`,
      { refresh }
    );
  },

  async updateProfile(payload: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    city?: string;
    date_of_birth?: string;
    age?: number;
  }): Promise<User> {
    const { data } = await api.patch<User, typeof payload>(
      `/api/v1/auth/me/`,
      payload
    );
    return data;
  },

  async changePassword(payload: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ detail: string }> {
    const { data } = await api.post<{ detail: string }, typeof payload>(
      `/api/v1/auth/change-password/`,
      payload
    );
    return data;
  },
};

