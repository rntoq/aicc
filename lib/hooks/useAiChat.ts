"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { analyseServices, type AiChatMessage, type AiChatSession } from "@/lib/services/analyseServices";
import { classifyAiChatResponseRole, extractTextFromResponse, type ChatRole } from "@/utils/functions";

export type UiChatMessage = {
  role: ChatRole;
  text: string;
  at: number;
  kind?: "info" | "warning";
};

type UseAiChatI18n = {
  welcome: string;
  sendError: string;
  quotaExceeded: string;
  quotaExceededWithRetry: (seconds: number) => string;
};

function toUiMessage(msg: AiChatMessage): UiChatMessage {
  if (msg.role === "user") {
    return { role: "user", text: msg.message, at: Date.parse(msg.created_at) || Date.now() };
  }
  const role: ChatRole = msg.in_scope === false ? "system" : "ai";
  return {
    role,
    text: msg.message,
    at: Date.parse(msg.created_at) || Date.now(),
    kind: role === "system" && msg.in_scope === false ? "info" : undefined,
  };
}

export function useAiChat(i18n: UseAiChatI18n) {
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<UiChatMessage[]>([
    { role: "ai", text: i18n.welcome, at: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const loadSessions = useCallback(async (preferChatId?: number | null) => {
    setLoadingSessions(true);
    const { body, error } = await analyseServices.listAiChatSessions();
    if (error || !body) {
      setLoadingSessions(false);
      return;
    }
    setSessions(body);
    setLoadingSessions(false);

    const resolvedPreferred = preferChatId ?? activeChatId;
    if (resolvedPreferred && body.some((s) => s.id === resolvedPreferred)) {
      setActiveChatId(resolvedPreferred);
      return;
    }
    setActiveChatId(body[0]?.id ?? null);
  }, [activeChatId]);

  const loadMessages = useCallback(async (chatId: number | null) => {
    if (!chatId) {
      setMessages([{ role: "ai", text: i18n.welcome, at: Date.now() }]);
      return;
    }
    setLoadingMessages(true);
    const { body, error } = await analyseServices.listAiChatMessages({ chat_id: chatId, limit: 50 });
    if (error || !body) {
      setMessages((prev) => [...prev, { role: "system", text: i18n.sendError, at: Date.now() }]);
      setLoadingMessages(false);
      return;
    }
    const sorted = [...body].sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
    setMessages(sorted.map(toUiMessage));
    setLoadingMessages(false);
  }, [i18n.sendError, i18n.welcome]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    void loadMessages(activeChatId);
  }, [activeChatId, loadMessages]);

  const startNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([{ role: "ai", text: i18n.welcome, at: Date.now() }]);
    setInput("");
  }, [i18n.welcome]);

  const handleDeleteSession = useCallback(async (chatId: number) => {
    if (sending || deletingId != null) return;
    setDeletingId(chatId);
    const { error } = await analyseServices.deleteAiChatSession(chatId);
    setDeletingId(null);
    if (error) return;
    const nextId = activeChatId === chatId ? null : activeChatId;
    await loadSessions(nextId);
    if (activeChatId === chatId) {
      setMessages([{ role: "ai", text: i18n.welcome, at: Date.now() }]);
    }
  }, [activeChatId, deletingId, i18n.welcome, loadSessions, sending]);

  const handleSend = useCallback(async () => {
    if (!canSend) return;
    const msg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg, at: Date.now() }]);
    setSending(true);

    const { body, error } = await analyseServices.aiChat(
      activeChatId ? { message: msg, chat_id: activeChatId } : { message: msg }
    );
    if (error || !body) {
      setMessages((prev) => [...prev, { role: "system", text: i18n.sendError, at: Date.now() }]);
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
      text = retrySeconds != null ? i18n.quotaExceededWithRetry(retrySeconds) : i18n.quotaExceeded;
    }

    const kind: UiChatMessage["kind"] =
      role !== "system" ? undefined : outOfScope ? (providerError ? "warning" : "info") : "warning";
    setMessages((prev) => [...prev, { role, text, at: Date.now(), kind }]);

    const newChatId =
      body && typeof body === "object" && typeof (body as Record<string, unknown>).chat_id === "number"
        ? ((body as Record<string, unknown>).chat_id as number)
        : activeChatId;
    if (newChatId && activeChatId !== newChatId) {
      setActiveChatId(newChatId);
    }
    await loadSessions(newChatId ?? null);
    if (newChatId) await loadMessages(newChatId);
    setSending(false);
  }, [
    activeChatId,
    canSend,
    i18n.quotaExceeded,
    i18n.quotaExceededWithRetry,
    i18n.sendError,
    input,
    loadMessages,
    loadSessions,
  ]);

  const activeChat = sessions.find((s) => s.id === activeChatId) ?? null;

  return {
    sessions,
    activeChatId,
    setActiveChatId,
    activeChat,
    messages,
    input,
    setInput,
    loadingSessions,
    loadingMessages,
    sending,
    deletingId,
    canSend,
    startNewChat,
    handleDeleteSession,
    handleSend,
  };
}
