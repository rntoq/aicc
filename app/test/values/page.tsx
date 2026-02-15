"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useValuesStore } from "@/lib/store/valuesStore";
import { VALUES_QUESTIONS } from "./questions";
import { ValuesQuestionRow } from "./components/QuestionRow";
import { calculateValuesResult } from "./utils/scoring";
import { useTestsStore } from "@/lib/store/testsStore";

export default function CareerValuesPage() {
  const router = useRouter();
  const { answers, setAnswer, startTest, getProgress } = useValuesStore();
  const { setCompleted } = useTestsStore();

  useEffect(() => {
    startTest();
  }, [startTest]);

  const total = VALUES_QUESTIONS.length;
  const progress = getProgress(total);
  const allAnswered = Object.keys(answers).length === total;

  const handleSubmit = () => {
    if (!allAnswered) return;
    const result = calculateValuesResult(answers, VALUES_QUESTIONS);
    setCompleted("career-values");
    router.push(`/test/values/result?top=${result.top5[0]?.category ?? ""}`);
  };

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, mb: 1 }}>
            Тест карьерных ценностей
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оцените, насколько каждая из ситуаций важна для вас в работе. Используйте шкалу от 1
            (совсем не важно) до 5 (очень важно).
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
            Ответили на {Object.keys(answers).length} из {total}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {VALUES_QUESTIONS.map((q) => (
            <ValuesQuestionRow
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
}

