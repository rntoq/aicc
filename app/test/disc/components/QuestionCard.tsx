"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { DiscQuestion } from "../questions";

export interface DiscQuestionCardProps {
  question: DiscQuestion;
  most: string | null;
  least: string | null;
  onChange: (most: string | null, least: string | null) => void;
}

export const DiscQuestionCard = ({
  question,
  most,
  least,
  onChange,
}: DiscQuestionCardProps) => {
  const handleMostChange = (_: unknown, value: string | null) => {
    if (!value) {
      onChange(null, least);
      return;
    }
    const newLeast = value === least ? null : least;
    onChange(value, newLeast);
  };

  const handleLeastChange = (_: unknown, value: string | null) => {
    if (!value) {
      onChange(most, null);
      return;
    }
    const newMost = value === most ? null : most;
    onChange(newMost, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card sx={styles.card}>
        <CardContent sx={styles.content}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Вопрос {question.number} из 24
          </Typography>
          <Typography variant="h3" sx={styles.title}>
            Выберите утверждения, которые БОЛЬШЕ всего и МЕНЬШЕ всего похожи на вас
          </Typography>

          <Box sx={styles.labelsRow}>
            <Chip label="MOST — больше всего про меня" color="primary" size="small" />
            <Chip label="LEAST — меньше всего про меня" variant="outlined" size="small" />
          </Box>

          <Box sx={styles.grid}>
            {question.statements.map((s) => (
              <Box key={s.id} sx={styles.row}>
                <Typography variant="body1" sx={styles.statementText}>
                  {s.text}
                </Typography>
                <Box sx={styles.controls}>
                  <ToggleButtonGroup
                    exclusive
                    value={most === s.id ? s.id : null}
                    onChange={handleMostChange}
                    size="small"
                    color="primary"
                  >
                    <ToggleButton value={s.id}>MOST</ToggleButton>
                  </ToggleButtonGroup>
                  <ToggleButtonGroup
                    exclusive
                    value={least === s.id ? s.id : null}
                    onChange={handleLeastChange}
                    size="small"
                    color="secondary"
                  >
                    <ToggleButton value={s.id}>LEAST</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const styles = {
  card: {
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    maxWidth: 900,
    mx: "auto",
    mb: 3,
  },
  content: {
    p: { xs: 2.5, md: 3 },
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: 600,
    mb: 2,
  },
  labelsRow: {
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
    mb: 2,
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },
  row: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "flex-start", md: "center" },
    justifyContent: "space-between",
    gap: 1.5,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    p: 1.5,
  },
  statementText: {
    flex: 1,
  },
  controls: {
    display: "flex",
    gap: 1,
  },
};

