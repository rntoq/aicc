"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/store/useAuthStore";
import { authServices, useChangePassword, useUpdateProfile } from "@/lib/services/authServices";
import { arePasswordsMatching } from "@/utils/validators";

type SettingsI18n = {
  profileSaved: string;
  profileError: string;
  passwordsMismatch: string;
  passwordChanged: string;
  passwordError: string;
};

export function useSettingsPageState(i18n: SettingsI18n) {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  useEffect(() => {
    let cancelled = false;
    const syncProfile = async () => {
      const { body } = await authServices.me();
      if (!cancelled && body) setUser(body);
    };
    void syncProfile();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  useEffect(() => {
    if (!user) return;
    setForm({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      city: user.city ?? "",
    });
    setAvatarPreview(user.avatar ?? "");
  }, [user]);

  useEffect(() => {
    if (!avatarFile) return;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormFromUser = () => {
    if (!user) return;
    setForm({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      city: user.city ?? "",
    });
    setAvatarFile(null);
    setAvatarPreview(user.avatar ?? "");
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append("first_name", form.first_name);
      payload.append("last_name", form.last_name);
      if (form.phone) payload.append("phone", form.phone);
      if (form.city) payload.append("city", form.city);
      if (avatarFile) payload.append("avatar", avatarFile);

      const updated = await updateProfile.mutateAsync(payload);
      setUser(updated);
      setAvatarFile(null);
      setAvatarPreview(updated.avatar ?? "");
      toast.success(i18n.profileSaved);
    } catch {
      toast.error(i18n.profileError);
    }
  };

  const handleChangePassword = async () => {
    if (!arePasswordsMatching(passwordForm.new_password, passwordForm.new_password_confirm)) {
      toast.error(i18n.passwordsMismatch);
      return;
    }
    try {
      await changePassword.mutateAsync(passwordForm);
      toast.success(i18n.passwordChanged);
      setPasswordForm({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch {
      toast.error(i18n.passwordError);
    }
  };

  return {
    user,
    form,
    avatarPreview,
    passwordForm,
    updateProfile,
    changePassword,
    handleChange,
    handleAvatarChange,
    handlePasswordChange,
    resetFormFromUser,
    handleSave,
    handleChangePassword,
  };
}
