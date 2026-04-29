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
import { useLandingAiChatPreview } from "@/lib/hooks/useLandingAiChatPreview";
import BANNER_IMAGE from "../../../public/images/aichat_banner.png";

export const AIChatBlock = () => {
  const t = useTranslations();
  const { messages, input, setInput, sending, canSend, handleSend } = useLandingAiChatPreview({
    initialAiText: t("aichat_example_ai"),
    authRequiredToast: t("analysis_auth_required_body"),
    sendErrorText: t("ai_chat_send_error"),
    aiLimitText: t("ai_chat_quota_exceeded"),
    aiLimitRetrySuffix: (seconds) => ` ${t("ai_chat_quota_exceeded_with_retry", { seconds })}`,
  });

  return (
    <Box component="section" sx={styles.section}>
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
                          {msg.role === "system" ? t("ai_chat_system_label") : t("aichat_ai")}
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
                  </Box>
                </Box>
              ))}
              {sending && (
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Box sx={{ ...styles.messageBubble, bgcolor: "grey.50", borderColor: "grey.200" }}>
                    <Box sx={styles.metaRow}>
                      <Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />
                      <Typography variant="body2" color="text.secondary">
                        {t("ai_chat_typing")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
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
