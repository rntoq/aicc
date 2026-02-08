"use client";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import Image from "next/image";
import { motion } from "framer-motion";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/landingConstants";

export function AIChatBlock() {
  return (
    <Box
      component="section"
      id="ai-chat"
      sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h2"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          AI-чат консультант
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mb: 4, maxWidth: 480, mx: "auto" }}
        >
          Задайте вопрос по результатам анализа — получите понятный ответ
        </Typography>

        <Box sx={styles.illustrationWrap}>
          <Image
            src={BANNER_PLACEHOLDER_IMAGE}
            alt=""
            fill
            sizes="200px"
            style={{ objectFit: "cover" }}
          />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={styles.paper}>
            <Box sx={styles.dialogColumn}>
              <Box sx={styles.userBubble}>
                <Typography variant="caption" color="text.secondary" sx={styles.bubbleLabel}>
                  Вы:
                </Typography>
                <Typography variant="body2" fontStyle="italic">
                  Почему мне подходит аналитика?
                </Typography>
              </Box>
              <Box sx={styles.aiBubble}>
                <Typography variant="caption" sx={styles.aiBubbleLabel}>
                  AI:
                </Typography>
                <Typography variant="body2">
                  Потому что твои интересы к данным и логическому мышлению хорошо
                  сочетаются с этой областью. В тесте по ценностям важны структура
                  и развитие — в аналитике это есть. Рекомендую посмотреть курсы
                  по SQL и визуализации.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SmartToyOutlinedIcon />}
                href="#ai-chat"
                sx={{ borderRadius: 2 }}
              >
                Задать вопрос AI
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

const styles = {
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
  dialogColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
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
    bgcolor: "primary.main",
    color: "white",
  },
  bubbleLabel: {
    flexShrink: 0,
  },
  aiBubbleLabel: {
    opacity: 0.9,
    flexShrink: 0,
  },
};
