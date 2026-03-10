"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

const AIChatPage = () => {
  const [messages] = useState([
    { role: "ai" as const, text: "Hello! I'm your AI career advisor. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setInput("");
    // TODO: integrate with AI API
  };

  return (
    <AppLayout title="AI Chat">
      <Box>
        <Box sx={styles.chatContainer}>
          <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={styles.messagesArea}>
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: msg.role === "ai" ? "flex-start" : "flex-end",
                  }}
                >
                  <Paper
                    sx={{
                      ...styles.messageBubble,
                      bgcolor: msg.role === "ai" ? "grey.100" : "primary.main",
                      color: msg.role === "ai" ? "text.primary" : "white",
                    }}
                  >
                    {msg.role === "ai" && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <SmartToyOutlinedIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={600}>
                          AI Assistant
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="body2">{msg.text}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>

            <Paper component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} sx={styles.inputPaper}>
              <InputBase
                fullWidth
                placeholder="Ask about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{ px: 1.5 }}
              />
              <IconButton type="submit" color="primary" disabled={!input.trim()}>
                <SendRoundedIcon />
              </IconButton>
            </Paper>
          </CardContent>
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
  },
  inputPaper: {
    display: "flex",
    alignItems: "center",
    p: 1,
    borderRadius: 2,
  },
};