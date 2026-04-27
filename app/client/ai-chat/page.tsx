"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { analyseServices } from "@/lib/services/analyseServices";
import { useTranslations } from "next-intl";
import {
  classifyAiChatResponseRole,
  extractTextFromResponse,
  type ChatRole,
} from "@/utils/functions";

type ChatMessage = { role: ChatRole; text: string; at: number; kind?: "info" | "warning" };

const AIChatPage = () => {
  const t = useTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai" as const,
      text: t("ai_chat_welcome"),
      at: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        text: t("ai_chat_welcome"),
        at: Date.now(),
      },
    ]);
    setInput("");
  };

  const handleSend = async () => {
    if (!canSend) return;
    const msg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg, at: Date.now() }]);
    setSending(true);

    const { body, error } = await analyseServices.aiChat({ message: msg });
    if (error) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: t("ai_chat_send_error"), at: Date.now() },
      ]);
      setSending(false);
      return;
    }

    const role = classifyAiChatResponseRole(body);
    const outOfScope =
      body != null &&
      typeof body === "object" &&
      (body as Record<string, unknown>).in_scope === false;
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
    if (role === "system") {
      // Make quota/rate-limit failures more readable (backend may still return 200 OK).
      if (quotaOrRateLimited) {
        const retryMatch = text.match(/retry in\\s+([0-9.]+)s/i) ?? text.match(/retryDelay'?\\s*:\\s*'?([0-9.]+)s'?/i);
        const retrySeconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null;
        text =
          retrySeconds != null
            ? t("ai_chat_quota_exceeded_with_retry", { seconds: retrySeconds })
            : t("ai_chat_quota_exceeded");
      }
    }

    const kind: ChatMessage["kind"] =
      role !== "system"
        ? undefined
        : outOfScope
          ? providerError
            ? "warning"
            : "info"
          : quotaOrRateLimited
            ? "warning"
            : "warning";
    setMessages((prev) => [...prev, { role, text, at: Date.now(), kind }]);
    setSending(false);
  };

  return (
    <AppLayout title={t("sidebar_ai_chat")}>
      <Box>
        <Box sx={styles.chatContainer}>
          <Box sx={styles.toolbar}>
            {/* <Chip
              avatar={<Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />}
              label={sending ? "Thinking…" : "AI Counsellor"}
              variant="outlined"
              sx={styles.assistantChip}
            /> */}
            <IconButton onClick={clearChat} aria-label={t("ai_chat_clear")} size="small" disabled={sending}>
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Box>

          <Paper elevation={0} sx={styles.chatCard}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={styles.messagesArea}>
                {messages.map((msg, idx) => (
                  // "system" can be informational (out-of-scope) or warning (quota/errors)
                  // We style "info" system messages to avoid looking like an error.
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      sx={{
                        ...styles.messageBubble,
                        bgcolor:
                          msg.role === "ai"
                            ? "grey.50"
                            : msg.role === "system"
                              ? msg.kind === "info"
                                ? "grey.50"
                                : "warning.50"
                              : "primary.100",
                        color:
                          msg.role === "ai"
                            ? "text.primary"
                            : msg.role === "system"
                              ? msg.kind === "info"
                                ? "text.secondary"
                                : "warning.dark"
                              : "text.primary",
                        borderColor:
                          msg.role === "ai"
                            ? "grey.200"
                            : msg.role === "system"
                              ? msg.kind === "info"
                                ? "grey.300"
                                : "warning.main"
                              : "primary.200",
                      }}
                    >
                      {(msg.role === "ai" || msg.role === "system") && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          {msg.role === "system" ? (
                            msg.kind === "info" ? (
                              <InfoOutlinedIcon fontSize="small" />
                            ) : (
                              <ReportProblemOutlinedIcon fontSize="small" />
                            )
                          ) : (
                            <Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />
                          )}
                          <Typography variant="caption" fontWeight={600}>
                            {msg.role === "system" ? t("ai_chat_system_label") : t("ai_chat_assistant_label")}
                          </Typography>
                        </Box>
                      )}
                      {msg.role === "user" && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, justifyContent: "flex-end" }}>
                          <Typography variant="caption" fontWeight={600} sx={{ opacity: 0.85 }}>
                            {t("ai_chat_you_label")}
                          </Typography>
                          <PersonOutlineRoundedIcon fontSize="small" />
                        </Box>
                      )}
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {msg.text}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                {sending && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Paper sx={{ ...styles.messageBubble, bgcolor: "grey.50", borderColor: "grey.200" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />
                        <Typography variant="body2" color="text.secondary">
                          {t("ai_chat_typing")}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                <div ref={bottomRef} />
              </Box>

              <Paper
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                sx={styles.inputPaper}
              >
                <InputBase
                  fullWidth
                  placeholder={t("ai_chat_input_placeholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  sx={{ px: 1.5, py: 1.25 }}
                  disabled={sending}
                  multiline
                  maxRows={5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                />
                <IconButton type="submit" color="primary" disabled={!canSend}>
                  <SendRoundedIcon />
                </IconButton>
              </Paper>
            </CardContent>
          </Paper>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default AIChatPage;

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: { xs: "calc(100vh - 92px)", md: "calc(100vh - 100px)" },
    minHeight: { xs: 420, md: 500 },
    maxHeight: { xs: "none", md: 800 },
    gap: 1.25,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: 0.5,
  },
  assistantChip: {
    borderRadius: 999,
    bgcolor: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(1.5px)",
    borderColor: "rgba(27, 46, 94, 0.18)",
  },
  aiAvatarTiny: {
    width: 22,
    height: 22,
    bgcolor: "transparent",
  },
  chatCard: {
    position: "relative",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    bgcolor: "background.paper",
    backgroundImage: "url('/images/aichat_background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.09) 100%)",
      pointerEvents: "none",
    },
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    mb: { xs: 1.25, md: 2 },
    px: { xs: 0.25, sm: 0.75, md: 1 },
  },
  messageBubble: {
    maxWidth: { xs: "90%", sm: "82%", md: "75%" },
    mb: { xs: 1.25, md: 2 },
    p: { xs: 1.4, md: 2 },
    borderRadius: 2,
    border: "1px solid",
  },
  inputPaper: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    p: { xs: 0.65, md: 1 },
    borderRadius: 999,
    border: "1px solid",
    borderColor: "rgba(27, 46, 94, 0.2)",
    bgcolor: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(2px)",
  },
};