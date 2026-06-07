"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAuth } from "@/lib/store/useAuthStore";
import { authServices } from "@/lib/services/authServices";
import { validateRegisterForm } from "@/utils/validators";
import { extractApiErrorMessage } from "@/utils/functions";

type TranslateFn = (key: string) => string;

const isUnverifiedEmailError = (message: string): boolean => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("verify") ||
    normalized.includes("verified") ||
    normalized.includes("confirmation") ||
    normalized.includes("подтверж") ||
    normalized.includes("вериф")
  );
};

export function useLoginPageState(t: TranslateFn) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerifyCta, setShowVerifyCta] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/client";
  const sessionExpired = searchParams.get("sessionExpired") === "1";

  useEffect(() => {
    if (!sessionExpired) return;
    toast.info(t("session_expired_toast"));
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sessionExpired");
    const next = params.toString();
    router.replace(next ? `/login?${next}` : "/login");
  }, [router, searchParams, sessionExpired, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    setShowVerifyCta(false);

    try {
      await login({ email, password });
      router.push(redirect);
    } catch (err: unknown) {
      const apiMessage = extractApiErrorMessage(err);
      if (apiMessage) {
        toast.error(apiMessage);
        setShowVerifyCta(isUnverifiedEmailError(apiMessage));
      } else {
        toast.error(t("error_generic"));
        setShowVerifyCta(false);
      }
    }
  };

  return {
    loading,
    email,
    setEmail,
    password,
    setPassword,
    showVerifyCta,
    handleSubmit,
  };
}

export function useRegisterPageState(t: TranslateFn) {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const errorKey = validateRegisterForm({
      email: form.email,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
    });
    if (errorKey) {
      setLocalError(t(errorKey));
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        password_confirm: form.passwordConfirm,
        first_name: form.firstName,
        last_name: form.lastName,
      });
      router.push(`/verify-email?email=${encodeURIComponent(form.email.trim())}`);
    } catch (err: unknown) {
      const apiMessage = extractApiErrorMessage(err);
      if (apiMessage) {
        setLocalError(apiMessage);
      } else {
        setLocalError(null);
        toast.error(t("error_generic"));
      }
    }
  };

  return {
    loading,
    error,
    localError,
    form,
    handleChange,
    handleSubmit,
  };
}

export function useEmailActionPageState(params: {
  initialEmail?: string;
  successFallbackText: string;
  errorText: string;
  request: (email: string) => Promise<{ body: unknown | null; error: unknown | null }>;
  /** Seconds the resend button stays disabled after a send (0 disables the cooldown). */
  cooldownSeconds?: number;
  /** Start the cooldown immediately when an email is pre-filled (e.g. it was just sent on register). */
  startCooldownOnMount?: boolean;
}) {
  const cooldownSeconds = params.cooldownSeconds ?? 0;
  const [email, setEmail] = useState(params.initialEmail ?? "");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(
    params.startCooldownOnMount && (params.initialEmail ?? "").trim() ? cooldownSeconds : 0
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading || cooldown > 0) return;

    setLoading(true);
    const { body, error } = await params.request(email.trim());
    setLoading(false);

    if (error) {
      toast.error(params.errorText);
      return;
    }

    toast.success((body as { detail?: string } | null)?.detail || params.successFallbackText);
    if (cooldownSeconds > 0) setCooldown(cooldownSeconds);
  };

  return { email, setEmail, loading, cooldown, handleSubmit };
}

export function useResetPasswordPageState(t: TranslateFn) {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params?.token || "";
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !password || !passwordConfirm || loading) return;
    if (password !== passwordConfirm) {
      toast.error(t("settings_passwords_mismatch"));
      return;
    }

    setLoading(true);
    const { body, error } = await authServices.confirmPasswordReset({
      token,
      new_password: password,
      new_password_confirm: passwordConfirm,
    });
    setLoading(false);

    if (error) {
      toast.error(t("reset_password_error"));
      return;
    }

    toast.success((body as { detail?: string } | null)?.detail || t("reset_password_success"));
    router.push("/login");
  };

  return {
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    loading,
    handleSubmit,
  };
}

type VerifyStatus = "loading" | "success" | "error";

export function useVerifyEmailConfirmPageState(t: TranslateFn) {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        if (!isMounted) return;
        setStatus("error");
        setErrorText(t("verify_email_confirm_empty_token"));
        return;
      }

      const { body, error } = await authServices.confirmEmailVerify({ token });

      if (!isMounted) return;
      if (error) {
        const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
        setStatus("error");
        setErrorText(typeof detail === "string" ? detail : t("verify_email_confirm_error"));
        return;
      }

      const apiDetail = (body as { detail?: unknown } | null)?.detail;
      if (typeof apiDetail === "string" && apiDetail.length > 0) setErrorText(apiDetail);
      setStatus("success");
    };

    void run();
    return () => {
      isMounted = false;
    };
  }, [t, token]);

  const ui = useMemo(() => {
    if (status === "success") {
      return {
        title: t("verify_email_confirm_success_title"),
        message: errorText || t("verify_email_confirm_success"),
      };
    }
    if (status === "error") {
      return {
        title: t("verify_email_confirm_error_title"),
        message: errorText || t("verify_email_confirm_error"),
      };
    }
    return {
      title: t("verify_email_confirm_loading_title"),
      message: t("verify_email_confirm_loading"),
    };
  }, [errorText, status, t]);

  return { status, ui };
}
