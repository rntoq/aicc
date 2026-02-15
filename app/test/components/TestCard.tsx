"use client";

import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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

const TEST_ACCENTS: Record<string, string> = {
  holland: "#1E3A8A",
  "photo-career": "#10B981",
  disc: "#6366F1",
  "career-values": "#F97316",
  "big-five": "#EC4899",
  skills: "#0EA5E9",
  eq: "#22C55E",
  "learning-style": "#8B5CF6",
  motivation: "#F59E0B",
  strengths: "#14B8A6",
};

const TEST_BACKGROUNDS: Record<string, string> = {
  holland: "#EEF2FF",
  "photo-career": "#ECFDF5",
  disc: "#EEF2FF",
  "career-values": "#FFF7ED",
  "big-five": "#FEF2F2",
  skills: "#E0F2FE",
  eq: "#ECFDF3",
  "learning-style": "#F5F3FF",
  motivation: "#FFFBEB",
  strengths: "#ECFEFF",
};

export function TestCard({
  test,
  variant,
  selected = false,
  onSelect,
  disabled = false,
  index = 0,
}: TestCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const { isCompleted, setOpenResultModalId } = useTestsStore();
  const completed = isCompleted(test.id);
  const accent = TEST_ACCENTS[test.id] ?? "primary.main";

  const handleStart = () => {
    if (test.id === "holland") {
      router.push("/test/holland");
    } else if (test.id === "photo-career") {
      router.push("/test/photo-career");
    } else if (test.id === "disc") {
      router.push("/test/disc");
    } else if (test.id === "career-values") {
      router.push("/test/values");
    } else if (test.id === "big-five") {
      router.push("/test/bigfive");
    } else {
      // For other tests: demo behavior
      useTestsStore.getState().setCompleted(test.id);
      setOpenResultModalId(test.id);
    }
  };

  const handleShowResult = () => {
    if (test.id === "holland") {
      router.push("/test/holland/result");
    } else if (test.id === "photo-career") {
      router.push("/test/photo-career/result");
    } else if (test.id === "disc") {
      router.push("/test/disc/result");
    } else if (test.id === "career-values") {
      router.push("/test/values/result");
    } else if (test.id === "big-five") {
      router.push("/test/bigfive/result");
    } else {
      setOpenResultModalId(test.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <StyledCard
        sx={{
          borderTop: `4px solid ${accent}`,
          ...(variant === "recommended" && test.required === true
            ? { boxShadow: "0 8px 24px rgba(79, 70, 229, 0.25)" }
            : {}),
          height: "100%",
          minHeight: 260,
          display: "flex",
          flexDirection: "column",
          bgcolor: TEST_BACKGROUNDS[test.id] ?? "background.paper",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Box
              sx={{
                mt: 0.5,
                p: 1,
                borderRadius: 2,
                bgcolor: `${accent}14`,
                color: accent,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {test.icon}
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
              {variant === "recommended" && (
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: test.required ? accent : "grey.100",
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
              {test.status === "paid" && test.price && (
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "secondary.main",
                    color: "white",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  {test.price} ₸
                </Typography>
              )}
              {test.status === "premium" && test.price && (
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "warning.main",
                    color: "white",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  {test.price} ₸
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
          </Box>
          <Typography variant="h3" sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
            {test.name}
          </Typography>
          {test.duration && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: -0.5 }}>
              {test.duration} мин
            </Typography>
          )}
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
