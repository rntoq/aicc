"use client";

import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useHollandStore } from "@/lib/store/hollandStore";
import { HOLLAND_QUESTIONS } from "./questions";
import { QuestionCard } from "./components/QuestionCard";
import { ProgressBar } from "./components/ProgressBar";
import { calculateHollandResult } from "./utils/scoring";
import { useTestsStore } from "@/lib/store/testsStore";

export default function HollandTestPage() {
  const t = useTranslations();
  const router = useRouter();
  const {
    answers,
    currentQuestionIndex,
    setAnswer,
    setCurrentQuestion,
    startTest,
    getProgress,
    reset,
  } = useHollandStore();
  const { setCompleted } = useTestsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startTest();
    return () => {
      // Don't reset on unmount - preserve answers
    };
  }, [startTest]);

  const totalQuestions = HOLLAND_QUESTIONS.length;
  const currentQuestion = HOLLAND_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || null;
  const progress = getProgress();

  const handleAnswerChange = (value: number) => {
    // Сохраняем ответ
    setAnswer(currentQuestion.id, value);

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const allAnsweredAfter =
      Object.keys(updatedAnswers).length === totalQuestions;

    if (isLastQuestion && allAnsweredAfter) {
      handleSubmit(updatedAnswers);
    } else if (!isLastQuestion) {
      setCurrentQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (finalAnswers?: typeof answers) => {
    const usedAnswers = finalAnswers ?? answers;
    if (Object.keys(usedAnswers).length !== totalQuestions) return;
    setIsSubmitting(true);
    
    // Calculate results
    const result = calculateHollandResult(usedAnswers, HOLLAND_QUESTIONS);
    
    // Save to stores
    useHollandStore
      .getState()
      .saveResult(result.hollandCode.code, result.normalizedScores as unknown as Record<string, number>);
    useTestsStore.getState().setCompleted("holland");
    
    // Navigate to results
    router.push(`/test/holland/result?code=${result.hollandCode.code}`);
  };

  return (
    <Box component="main" sx={styles.root}>
      <Container maxWidth="md">
        <Box sx={styles.header}>
          <Typography component="h1" variant="h1" sx={styles.title}>
            {t("holland_title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("holland_subtitle")}
          </Typography>
        </Box>

        <ProgressBar
          progress={progress}
          current={Object.keys(answers).length}
          total={totalQuestions}
        />

        <QuestionCard
          question={currentQuestion}
          value={currentAnswer}
          onChange={handleAnswerChange}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />

        <Box sx={styles.navigation}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            sx={styles.navButton}
          >
            {t("holland_back")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

const styles = {
  root: {
    py: { xs: 4, md: 6 },
    minHeight: "80vh",
  },
  header: {
    mb: 4,
    textAlign: "center",
  },
  title: {
    mb: 1,
    fontSize: "1.75rem",
    fontWeight: 700,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    mt: 4,
  },
  navButton: {
    borderRadius: 2,
    px: 3,
  },
};
