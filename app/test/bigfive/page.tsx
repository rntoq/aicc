"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBigFiveStore } from "@/lib/store/bigFiveStore";
import { BIG_FIVE_QUESTIONS } from "./questions";
import { BigFiveQuestionRow } from "./components/QuestionRow";
import { calculateBigFiveResult } from "./utils/scoring";
import { useTestsStore } from "@/lib/store/testsStore";

const BigFivePage = () => {
  const router = useRouter();
  const { hydrated, hydrate, answers, setAnswer, startTest } = useBigFiveStore();
  const { setCompleted } = useTestsStore();

  useEffect(() => {
    hydrate();
    startTest();
  }, [hydrate, startTest]);

  if (!hydrated) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  const total = BIG_FIVE_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / total) * 100);
  const allAnswered = answeredCount === total;

  const handleSubmit = () => {
    if (!allAnswered) return;
    const result = calculateBigFiveResult(answers, BIG_FIVE_QUESTIONS);
    setCompleted("big-five");
    router.push(`/test/bigfive/result?o=${result.normalized.OPENNESS.toFixed(0)}`);
  };

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, mb: 1 }}>
            Big Five (OCEAN) тест личности
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оцените, насколько вы согласны с каждым утверждением. Используйте шкалу от 1
            (совершенно не согласен) до 5 (полностью согласен).
          </Typography>
          <Box sx={{ mt: 2, height: 6, borderRadius: 999, bgcolor: "grey.200", overflow: "hidden" }}>
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                bgcolor: "primary.main",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            Ответили на {answeredCount} из {total}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {BIG_FIVE_QUESTIONS.map((q) => (
            <BigFiveQuestionRow
              key={q.id}
              question={q}
              value={answers[q.id] ?? null}
              onChange={(val) => setAnswer(q.id, val)}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            mt: 3,
            py: 2,
            bgcolor: "background.default",
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            disabled={!allAnswered}
            onClick={handleSubmit}
            sx={{ borderRadius: 2, px: 6 }}
          >
            Завершить тест
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BigFivePage;

