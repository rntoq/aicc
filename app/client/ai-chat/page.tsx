"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
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
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { analyseServices } from "@/lib/services/analyseServices";
import {
  classifyAiChatResponseRole,
  extractTextFromResponse,
  formatTime,
  type ChatRole,
} from "@/utils/functions";

type ChatMessage = { role: ChatRole; text: string; at: number; kind?: "info" | "warning" };

const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai" as const,
      text: "Hello! I'm your AI career advisor. How can I help you today?",
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
        text: "Hello! I'm your AI career advisor. How can I help you today?",
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
        { role: "system", text: "Failed to send message. Please try again.", at: Date.now() },
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
        const retrySuffix = retryMatch ? ` Try again in ~${Math.ceil(Number(retryMatch[1]))}s.` : "";
        text = `AI limit/quota exceeded.${retrySuffix}`;
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
    <AppLayout title="AI Chat">
      <Box>
        <Box sx={styles.chatContainer}>
          <Box sx={styles.toolbar}>
            <Chip
              icon={<SmartToyOutlinedIcon />}
              label={sending ? "Thinking…" : "AI Assistant"}
              variant="outlined"
              sx={{ borderRadius: 999 }}
            />
            <IconButton onClick={clearChat} aria-label="Clear chat" size="small" disabled={sending}>
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
                            <SmartToyOutlinedIcon fontSize="small" />
                          )}
                          <Typography variant="caption" fontWeight={600}>
                            {msg.role === "system" ? "System" : "AI Assistant"}
                          </Typography>
                        </Box>
                      )}
                      {msg.role === "user" && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, justifyContent: "flex-end" }}>
                          <Typography variant="caption" fontWeight={600} sx={{ opacity: 0.85 }}>
                            You
                          </Typography>
                          <PersonOutlineRoundedIcon fontSize="small" />
                        </Box>
                      )}
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {msg.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 1,
                          opacity: msg.role === "ai" ? 0.6 : msg.role === "system" ? 0.7 : 0.85,
                          textAlign: msg.role === "user" ? "right" : "left",
                        }}
                      >
                        {formatTime(msg.at)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                {sending && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Paper sx={{ ...styles.messageBubble, bgcolor: "grey.50", borderColor: "grey.200" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SmartToyOutlinedIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Typing…
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
                  placeholder="Ask about your career…"
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
    height: "calc(100vh - 100px)",
    minHeight: 500,
    maxHeight: 800,
    gap: 1.25,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 0.5,
  },
  chatCard: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    bgcolor: "background.paper",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    mb: 2,
    px: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    mb: 2,
    p: 2,
    borderRadius: 2,
    border: "1px solid",
  },
  inputPaper: {
    display: "flex",
    alignItems: "center",
    p: 1,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
  },
};