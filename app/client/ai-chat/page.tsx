"use client";

import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslations } from "next-intl";
import { useAiChat } from "@/lib/hooks/useAiChat";

const AIChatPage = () => {
  const t = useTranslations();
  const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState<null | HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatMenuOpen = Boolean(chatMenuAnchorEl);
  const {
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
  } = useAiChat({
    welcome: t("ai_chat_welcome"),
    sendError: t("ai_chat_send_error"),
    quotaExceeded: t("ai_chat_quota_exceeded"),
    quotaExceededWithRetry: (seconds) => t("ai_chat_quota_exceeded_with_retry", { seconds }),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <AppLayout title={t("sidebar_ai_chat")}>
      <Box>
        <Box sx={styles.chatContainer}>
          <Box sx={styles.toolbar}>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowDropDownRoundedIcon />}
              onClick={(e) => setChatMenuAnchorEl(e.currentTarget)}
              disabled={loadingSessions}
              sx={styles.chatSelectBtn}
            >
              {activeChat?.title || t("ai_chat_chats")}
            </Button>
            <Button size="small" startIcon={<AddRoundedIcon />} onClick={startNewChat}>
              {t("ai_chat_new")}
            </Button>
          </Box>

          <Menu
            anchorEl={chatMenuAnchorEl}
            open={chatMenuOpen}
            onClose={() => setChatMenuAnchorEl(null)}
            PaperProps={{ sx: styles.chatMenuPaper }}
          >
            {loadingSessions && (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">{t("ai_chat_loading")}</Typography>
              </MenuItem>
            )}
            {!loadingSessions && sessions.length === 0 && (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">{t("ai_chat_no_chats")}</Typography>
              </MenuItem>
            )}
            {sessions.map((s) => (
              <MenuItem
                key={s.id}
                selected={activeChatId === s.id}
                onClick={() => {
                  setActiveChatId(s.id);
                  setChatMenuAnchorEl(null);
                }}
                sx={styles.chatMenuItem}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{s.title}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>{s.last_message}</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDeleteSession(s.id);
                  }}
                  disabled={deletingId === s.id || sending}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            ))}
          </Menu>

          <Paper elevation={0} sx={styles.chatCard}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={styles.messagesArea}>
                {loadingMessages && <Typography variant="body2" color="text.secondary">{t("ai_chat_loading")}</Typography>}
                {messages.map((msg, idx) => (
                  <Box key={idx} sx={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
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
                            msg.kind === "info" ? <InfoOutlinedIcon fontSize="small" /> : <ReportProblemOutlinedIcon fontSize="small" />
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
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{msg.text}</Typography>
                    </Paper>
                  </Box>
                ))}
                {sending && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Paper sx={{ ...styles.messageBubble, bgcolor: "grey.50", borderColor: "grey.200" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src="/images/aichat_banner.png" alt="AI avatar" sx={styles.aiAvatarTiny} />
                        <Typography variant="body2" color="text.secondary">{t("ai_chat_typing")}</Typography>
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
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 0.5,
  },
  chatSelectBtn: {
    maxWidth: { xs: "72vw", md: 420 },
    justifyContent: "space-between",
    textTransform: "none" as const,
  },
  chatMenuPaper: {
    width: { xs: "86vw", sm: 420 },
    maxHeight: 360,
  },
  chatMenuItem: {
    gap: 1,
    alignItems: "flex-start",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: { xs: "calc(100vh - 92px)", md: "calc(100vh - 100px)" },
    minHeight: { xs: 420, md: 500 },
    maxHeight: { xs: "none", md: 800 },
    gap: 1.25,
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