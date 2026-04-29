"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { analyseServices } from "@/lib/services/analyseServices";
import { useAuth } from "@/lib/store/useAuthStore";
import { classifyAiChatResponseRole, extractTextFromResponse, type ChatRole } from "@/utils/functions";

export type LandingChatMessage = { role: ChatRole; text: string; at: number; kind?: "info" | "warning" };

type I18n = {
  initialAiText: string;
  authRequiredToast: string;
  sendErrorText: string;
  aiLimitText: string;
  aiLimitRetrySuffix: (seconds: number) => string;
};

export function useLandingAiChatPreview(i18n: I18n) {
  const router = useRouter();
  const { isAuthenticated, hydrated: authHydrated } = useAuth();
  const [messages, setMessages] = useState<LandingChatMessage[]>([
    { role: "ai", text: i18n.initialAiText, at: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const handleSend = async () => {
    if (!canSend) return;
    if (!authHydrated || !isAuthenticated) {
      toast.info(i18n.authRequiredToast);
      router.push("/login?redirect=/client/ai-chat");
      return;
    }
    const msg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg, at: Date.now() }]);
    setSending(true);

    const { body, error } = await analyseServices.aiChat({ message: msg });
    if (error) {
      setMessages((prev) => [...prev, { role: "system", text: i18n.sendErrorText, at: Date.now(), kind: "warning" }]);
      setSending(false);
      return;
    }

    const role = classifyAiChatResponseRole(body);
    const outOfScope = body != null && typeof body === "object" && (body as Record<string, unknown>).in_scope === false;
    const outOfScopeAnswer =
      body != null && typeof body === "object" && typeof (body as Record<string, unknown>).answer === "string"
        ? String((body as Record<string, unknown>).answer)
        : "";
    let text = extractTextFromResponse(body);
    const quotaOrRateLimited = text.includes("RESOURCE_EXHAUSTED") || text.includes("429");
    const providerError =
      /openrouter/i.test(outOfScopeAnswer) ||
      /ошибка/i.test(outOfScopeAnswer) ||
      /\berror\b/i.test(outOfScopeAnswer) ||
      /expecting value/i.test(outOfScopeAnswer);
    if (role === "system" && quotaOrRateLimited) {
      const retryMatch = text.match(/retry in\s+([0-9.]+)s/i) ?? text.match(/retryDelay'?\s*:\s*'?([0-9.]+)s'?/i);
      const retrySeconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null;
      text = retrySeconds != null ? `${i18n.aiLimitText}${i18n.aiLimitRetrySuffix(retrySeconds)}` : i18n.aiLimitText;
    }

    const kind: LandingChatMessage["kind"] =
      role !== "system" ? undefined : outOfScope ? (providerError ? "warning" : "info") : "warning";
    setMessages((prev) => [...prev, { role, text, at: Date.now(), kind }]);
    setSending(false);
  };

  return { messages, input, setInput, sending, canSend, handleSend };
}
