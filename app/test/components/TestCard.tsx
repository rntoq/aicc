"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { TestItem } from "../constants";
import { useTestsStore } from "@/lib/store/testsStore";

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export interface TestCardProps {
  test: TestItem;
  variant: "recommended" | "custom";
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  disabled?: boolean;
  index?: number;
}

export function TestCard({
  test,
  variant,
  selected = false,
  onSelect,
  disabled = false,
  index = 0,
}: TestCardProps) {
  const t = useTranslations();
  const { isCompleted, setOpenResultModalId } = useTestsStore();
  const completed = isCompleted(test.id);

  const handleStart = () => {
    // In real app: navigate to test. For demo, mark as completed and open modal.
    useTestsStore.getState().setCompleted(test.id);
    setOpenResultModalId(test.id);
  };

  const handleShowResult = () => {
    setOpenResultModalId(test.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <StyledCard
        sx={{
          ...(variant === "recommended" && test.required === true
            ? { borderLeft: "4px solid", borderColor: "primary.main" }
            : {}),
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ color: "primary.main", mt: 0.5 }}>{test.icon}</Box>
            {variant === "recommended" && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: test.required ? "primary.main" : "grey.200",
                  color: test.required ? "white" : "text.secondary",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontWeight: 600,
                }}
              >
                {test.required ? t("required") : t("optional")}
              </Typography>
            )}
            {variant === "custom" && onSelect != null && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected}
                    disabled={disabled && !selected}
                    onChange={(_, checked) => onSelect(checked)}
                    color="primary"
                    size="small"
                  />
                }
                label=""
                sx={{ mr: 0 }}
              />
            )}
          </Box>
          <Typography variant="h3" sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
            {test.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {test.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {completed ? (
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                fullWidth
                onClick={handleShowResult}
                sx={{ borderRadius: 2 }}
              >
                {t("showResult")}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                fullWidth
                onClick={handleStart}
                sx={{ borderRadius: 2 }}
              >
                {t("start")}
              </Button>
            )}
          </Box>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
}
