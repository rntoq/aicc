"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import QUESTIONS from "./career_questions.json";
import { QuestionCard, type CareerAptitudeQuestion } from "./components/QuestionCard";
import { CareerResultDialog } from "./components/careerResultDialog";
import { useTestsStore } from "@/lib/store/testsStore";

const STORAGE_KEY = "career-aptitude-answers";

type AnswersMap = Record<string, number>;

function readStoredAnswers(): AnswersMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswersMap) : {};
  } catch {
    return {};
  }
}

function writeStoredAnswers(next: AnswersMap) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export default function CareerAptitudePage() {
  const t = useTranslations();
  const router = useRouter();
  const { setCompleted } = useTestsStore();

  const questions = useMemo(
    () => (QUESTIONS as unknown as CareerAptitudeQuestion[]).slice().sort((a, b) => a.question_number - b.question_number),
    []
  );

  const [answers, setAnswers] = useState<AnswersMap>({});
  const [idx, setIdx] = useState(0);
  const [resultOpen, setResultOpen] = useState(false);

  useEffect(() => {
    setAnswers(readStoredAnswers());
  }, []);

  const total = questions.length;
  const current = questions[idx] ?? null;
  const currentValue = current ? answers[current.id] ?? null : null;

  const answeredCount = questions.filter((q) => answers[q.id] != null).length;
  const allAnswered = total > 0 && answeredCount === total;

  const setCurrentValue = (value: number) => {
    if (!current) return;
    setAnswers((prev) => {
      const next = { ...prev, [current.id]: value };
      writeStoredAnswers(next);
      return next;
    });
  };

  const canNext = current != null && currentValue != null;

  const goPrev = () => setIdx((p) => Math.max(0, p - 1));
  const goNext = () => {
    if (!canNext) return;
    setIdx((p) => Math.min(total - 1, p + 1));
  };

  const finish = () => {
    if (!allAnswered) return;
    setCompleted("career-aptitude");
    setResultOpen(true);
  };

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {t("tests_career-aptitude_name")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {answeredCount}/{total}
          </Typography>
        </Box>

        {current ? (
          <QuestionCard
            question={current}
            value={currentValue}
            onChange={setCurrentValue}
            total={total}
          />
        ) : (
          <Typography color="text.secondary">Нет вопросов</Typography>
        )}

        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "space-between", gap: 1.5 }}>
          <Button variant="outlined" onClick={goPrev} disabled={idx === 0}>
            {t("holland_back")}
          </Button>

          {idx < total - 1 ? (
            <Button variant="contained" onClick={goNext} disabled={!canNext}>
              {t("holland_next")}
            </Button>
          ) : (
            <Button variant="contained" onClick={finish} disabled={!allAnswered}>
              {t("holland_finish")}
            </Button>
          )}
        </Box>
      </Container>

      <CareerResultDialog
        open={resultOpen}
        onClose={() => {
          setResultOpen(false);
          router.push("/test");
        }}
      />
    </Box>
  );
}
