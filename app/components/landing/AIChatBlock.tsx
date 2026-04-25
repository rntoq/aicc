"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { analyseServices } from "@/lib/services/analyseServices";
import {
  classifyAiChatResponseRole,
  extractTextFromResponse,
  formatTime,
  type ChatRole,
} from "@/utils/functions";
import { useAuth } from "@/lib/store/useAuthStore";
import BANNER_IMAGE from "../../../public/images/aichat_banner.png";

type ChatMessage = { role: ChatRole; text: string; at: number; kind?: "info" | "warning" };

export const AIChatBlock = () => {
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated, hydrated: authHydrated } = useAuth();
  const [timeHydrated, setTimeHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: t("aichat_example_ai"),
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

  useEffect(() => {
    setTimeHydrated(true);
  }, []);

  const handleSend = async () => {
    if (!canSend) return;
    if (!authHydrated || !isAuthenticated) {
      toast.info("Please login or register to ask AI questions.");
      router.push("/login?redirect=/client/ai-chat");
      return;
    }
    const msg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg, at: Date.now() }]);
    setSending(true);

    const { body, error } = await analyseServices.aiChat({ message: msg });
    if (error) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: "Failed to send message. Please try again.", at: Date.now(), kind: "warning" },
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
    if (role === "system" && quotaOrRateLimited) {
      const retryMatch = text.match(/retry in\s+([0-9.]+)s/i) ?? text.match(/retryDelay'?\s*:\s*'?([0-9.]+)s'?/i);
      const retrySuffix = retryMatch ? ` Try again in ~${Math.ceil(Number(retryMatch[1]))}s.` : "";
      text = `AI limit/quota exceeded.${retrySuffix}`;
    }

    const kind: ChatMessage["kind"] =
      role !== "system" ? undefined : outOfScope ? (providerError ? "warning" : "info") : "warning";
    setMessages((prev) => [...prev, { role, text, at: Date.now(), kind }]);
    setSending(false);
  };

  return (
    <Box component="section" id="ai-chat" sx={styles.section}>
      <Container maxWidth="lg">
        <Box sx={styles.illustrationWrap}>
          <Image
            src={BANNER_IMAGE}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Typography component="h2" variant="h2" textAlign="center" sx={styles.title}>
          <Box component="span" className="text_gradient">{t("aichat_title_part1")}</Box>
          <Box component="span" color="text.primary" sx={{ml: 1}}>
            {t("aichat_title_part2")}
          </Box>
        </Typography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={styles.paper}>
            <Box sx={styles.chatScroll} className="chat-messages">
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
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
                      <Box sx={styles.metaRow}>
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
                          {msg.role === "system" ? "System" : t("aichat_ai")}
                        </Typography>
                      </Box>
                    )}
                    {msg.role === "user" && (
                      <Box sx={{ ...styles.metaRow, justifyContent: "flex-end" }}>
                        <Typography variant="caption" fontWeight={600} sx={{ opacity: 0.85 }}>
                          {t("aichat_you")}
                        </Typography>
                        <PersonOutlineRoundedIcon fontSize="small" />
                      </Box>
                    )}
                    <Typography variant="body2">
                      {msg.text}
                    </Typography>
                    <Typography variant="caption" sx={styles.timestamp}>
                      {timeHydrated ? formatTime(msg.at) : "--:--"}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {sending && (
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Box sx={{ ...styles.messageBubble, bgcolor: "grey.50", borderColor: "grey.200" }}>
                    <Box sx={styles.metaRow}>
                      <Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />
                      <Typography variant="body2" color="text.secondary">
                        Typing...
                      </Typography>
                    </Box>
                  </Box>
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
              sx={styles.inputWrap}
            >
              <InputBase
                placeholder={t("aichat_placeholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                disabled={sending}
                fullWidth
                sx={styles.input}
                multiline
                maxRows={4}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!canSend}
                sx={styles.sendButton}
                aria-label={t("aichat_send")}
              >
                <SendRoundedIcon />
              </IconButton>
            </Paper>

            <Box sx={styles.ctaWrap}>
              <Button
                variant="outlined"
                startIcon={<Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />}
                href="/client/ai-chat"
                sx={styles.ctaButton}
              >
                {t("aichat_cta")}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

const styles = {
  section: {
    py: { xs: 6, md: 8 },
    bgcolor: "background.default",
  },
  title: {
    mb: 1,
  },
  subtitle: {
    mb: 4,
    maxWidth: 480,
    mx: "auto",
  },
  illustrationWrap: {
    position: "relative",
    width: 220,
    height: 150,
    overflow: "hidden",
    mx: "auto",
    mb: 3,
  },
  paper: {
    maxWidth: 560,
    mx: "auto",
    p: { xs: 2, md: 2.5 },
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    backgroundImage: "url('/images/aichat_background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.1) 100%)",
      pointerEvents: "none",
    },
  },
  chatScroll: {
    maxHeight: { xs: 220, md: 250 },
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 1.25,
    mb: 1.4,
    pr: 0.5,
    position: "relative",
    zIndex: 1,
    "&::-webkit-scrollbar": { width: 6 },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 3,
      bgcolor: "grey.300",
    },
  },
  messageBubble: {
    maxWidth: "92%",
    p: { xs: 1.1, md: 1.3 },
    borderRadius: 2,
    border: "1px solid",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.8,
    mb: 0.7,
  },
  timestamp: { display: "block", mt: 0.7, opacity: 0.7 },
  aiAvatarTiny: { width: 20, height: 20, bgcolor: "transparent" },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    p: 0.5,
    borderRadius: 999,
    border: "1px solid",
    borderColor: "rgba(27, 46, 94, 0.18)",
    bgcolor: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(2px)",
    position: "relative",
    zIndex: 1,
  },
  input: {
    fontSize: "0.92rem",
    px: 1.2,
    "& .MuiInputBase-input": { py: 0.7 },
  },
  sendButton: {
    flexShrink: 0,
  },
  ctaWrap: {
    mt: 1.5,
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  ctaButton: {
    borderRadius: 999,
    bgcolor: "rgba(255,255,255,0.95)",
    border: "1px solid #06b6d4",
    color: "#06b6d4",
    "&:hover": {
      bgcolor: "#06b6d4",
      color: "#fff",
    },
  },
};
