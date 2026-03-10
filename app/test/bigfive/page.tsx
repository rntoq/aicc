"use client";

import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import QUESTIONS_DATA from "./bigfive_questions.json";
import { QuestionRow, type BigFiveQuestion } from "./components/QuestionRow";
import { useTestsStore } from "@/lib/store/testsStore";

const questions = QUESTIONS_DATA as unknown as BigFiveQuestion[];

const BigFivePage = () => {
  const t = useTranslations();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { setCompleted } = useTestsStore();

  useEffect(() => {
    // можно добавить сохранение в localStorage при желании
  }, []);

  const total = questions.length;
  const answeredCount = questions.filter((q) => answers[q.id] != null).length;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;
  const allAnswered = answeredCount === total && total > 0;

  const handleFinish = () => {
    if (!allAnswered) return;
    setCompleted("big-five");
    router.push("/test");
  };

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t("tests_big-five_name")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {t("test_subtitle")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 999 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {answeredCount}/{total}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {questions.map((q, index) => (
            <QuestionRow
              key={q.id}
              question={q}
              index={index}
              total={total}
              value={answers[q.id] ?? null}
              onChange={(val) =>
                setAnswers((prev) => ({ ...prev, [q.id]: val }))
              }
            />
          ))}
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleFinish}
            disabled={!allAnswered}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {allAnswered ? t("holland_finish") : t("holland_answerAll")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BigFivePage;

