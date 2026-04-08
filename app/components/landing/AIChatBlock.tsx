"use client";

import {
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/utils/constants";

export const AIChatBlock = () => {
  const t = useTranslations();
  const exampleMessages = [
    { role: "user" as const, text: t("aichat_example_user") },
    { role: "ai" as const, text: t("aichat_example_ai") },
  ];
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setInput("");
  };

  return (
    <Box component="section" id="ai-chat" sx={styles.section}>
      <Container maxWidth="lg">
        <Box sx={styles.illustrationWrap}>
          <Image
            src={BANNER_PLACEHOLDER_IMAGE}
            alt=""
            fill
            sizes="200px"
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
              {exampleMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Box
                    sx={
                      msg.role === "user"
                        ? styles.userBubble
                        : styles.aiBubble
                    }
                  >
                    <Typography variant="caption" sx={styles.bubbleLabel}>
                      {msg.role === "user" ? t("aichat_you") : t("aichat_ai")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={msg.role === "user" ? { fontStyle: "italic" } : {}}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            <Box
              sx={[
                styles.inputWrap,
                focused && styles.inputWrapFocused,
              ]}
            >
              <InputBase
                placeholder={t("aichat_placeholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                fullWidth
                sx={styles.input}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                sx={styles.sendButton}
                aria-label={t("aichat_send")}
              >
                <SendRoundedIcon />
              </IconButton>
            </Box>

            <Box sx={styles.ctaWrap}>
              <Button
                variant="contained"
                startIcon={<SmartToyOutlinedIcon />}
                href="#ai-chat"
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
    width: 120,
    height: 120,
    borderRadius: "50%",
    overflow: "hidden",
    mx: "auto",
    mb: 3,
  },
  paper: {
    maxWidth: 560,
    mx: "auto",
    p: 3,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  chatScroll: {
    maxHeight: 280,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    mb: 2,
    pr: 0.5,
    "&::-webkit-scrollbar": { width: 6 },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 3,
      bgcolor: "grey.300",
    },
  },
  userBubble: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
    p: 1.5,
    borderRadius: 2,
    bgcolor: "grey.50",
  },
  aiBubble: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
    p: 1.5,
    borderRadius: 2,
    bgcolor: "#ADF7F2",
    color: "white",
    "& .MuiTypography-caption": { opacity: 0.9 },
  },
  bubbleLabel: {
    flexShrink: 0,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    p: 1,
    borderRadius: 2,
    border: "2px solid",
    borderColor: "divider",
    bgcolor: "grey.50",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  inputWrapFocused: {
    borderColor: "primary.main",
    boxShadow: "0 0 0 3px rgba(30, 58, 138, 0.12)",
  },
  input: {
    fontSize: "0.9375rem",
    px: 1,
    "& .MuiInputBase-input": { py: 1 },
  },
  sendButton: {
    flexShrink: 0,
  },
  ctaWrap: {
    mt: 2,
    textAlign: "center",
  },
  ctaButton: {
    borderRadius: 2,
    bgcolor: "#fff",
    border: "1px solid #06b6d4",
    color: "#06b6d4",
    "&:hover": {
      bgcolor: "#06b6d4",
      color: "#fff",
    },
  },
};
