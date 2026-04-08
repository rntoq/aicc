export type RegisterForm = {
  email: string;
  password: string;
  passwordConfirm: string;
};

/**
 * Возвращает ключ i18n для ошибки или null.
 * UI сам отображает текст через `t(key)`.
 */
export function validateRegisterForm(form: RegisterForm): string | null {
  if (!form.email || !form.password || !form.passwordConfirm) return "register_error_required";
  if (form.password.length < 8) return "register_error_length";
  if (form.password !== form.passwordConfirm) return "register_error_match";
  return null;
}

export function arePasswordsMatching(a: string, b: string): boolean {
  return a === b;
}

