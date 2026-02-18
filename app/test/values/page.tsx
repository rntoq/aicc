"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useValuesStore } from "@/lib/store/valuesStore";
import { useTestsStore } from "@/lib/store/testsStore";
import { VALUES_QUESTIONS } from "./questions";
import { ValuesQuestionRow } from "./components/QuestionRow";
import { calculateValuesResult } from "./utils/scoring";

const CareerValuesPage = () => {
  const router = useRouter();
  const { answers, setAnswer, startTest, getProgress } = useValuesStore();
  const { setCompleted } = useTestsStore();

  useEffect(() => {
    startTest();
  }, [startTest]);

  const total = VALUES_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progress = getProgress(total);
  const allAnswered = answeredCount === total;

  const handleSubmit = () => {
    if (!allAnswered) return;
    const result = calculateValuesResult(answers, VALUES_QUESTIONS);
    setCompleted("career-values");
    router.push(`/test/values/result?top=${result.top5[0]?.category ?? ""}`);
  };

  return (
    <Box component="main" sx={styles.main}>
      <Container maxWidth="lg">
        <Box sx={styles.header}>
          <Typography variant="h1" sx={styles.title}>
            Тест карьерных ценностей
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оцените, насколько каждая из ситуаций важна для вас в работе. Используйте шкалу от 1
            (совсем не важно) до 5 (очень важно).
          </Typography>
          <Box sx={styles.progressTrack}>
            <Box sx={styles.progressBar(progress)} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={styles.progressCaption}>
            Ответили на {answeredCount} из {total}
          </Typography>
        </Box>

        <Box sx={styles.questions}>
          {VALUES_QUESTIONS.map((q) => (
            <ValuesQuestionRow
              key={q.id}
              question={q}
              value={answers[q.id] ?? null}
              onChange={(val) => setAnswer(q.id, val)}
            />
          ))}
        </Box>

        <Box sx={styles.submitWrap}>
          <Button
            variant="contained"
            size="large"
            disabled={!allAnswered}
            onClick={handleSubmit}
            sx={styles.submitButton}
          >
            Завершить тест
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CareerValuesPage;

const styles = {
  main: { py: { xs: 3, md: 4 }, minHeight: "80vh" },
  header: { mb: 3 },
  title: { fontSize: "1.75rem", fontWeight: 700, mb: 1 },
  progressTrack: { mt: 2, height: 6, borderRadius: 999, bgcolor: "grey.200", overflow: "hidden" as const },
  progressBar: (pct: number) => ({ width: `${pct}%`, height: "100%", bgcolor: "primary.main", transition: "width 0.3s ease" }),
  progressCaption: { mt: 0.5, display: "block" as const },
  questions: { display: "flex", flexDirection: "column" as const, gap: 2 },
  submitWrap: {
    position: "sticky" as const,
    bottom: 0,
    mt: 3,
    py: 2,
    bgcolor: "background.default",
    borderTop: "1px solid",
    borderColor: "divider",
    display: "flex",
    justifyContent: "center",
  },
  submitButton: { borderRadius: 2, px: 6 },
};