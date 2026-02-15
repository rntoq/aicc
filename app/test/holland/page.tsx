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
  const { answers, currentQuestionIndex, setAnswer, setCurrentQuestion, startTest, getProgress, reset } = useHollandStore();
  const { setCompleted } = useTestsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startTest();
    return () => {
      // Don't reset on unmount - preserve answers
    };
  }, [startTest]);

  const currentQuestion = HOLLAND_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || null;
  const progress = getProgress();
  const isLastQuestion = currentQuestionIndex === HOLLAND_QUESTIONS.length - 1;
  const allAnswered = Object.keys(answers).length === HOLLAND_QUESTIONS.length;

  const handleNext = () => {
    if (currentAnswer == null) return;
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    
    // Calculate results
    const result = calculateHollandResult(answers, HOLLAND_QUESTIONS);
    
    // Save to stores
    useHollandStore.getState().saveResult(result.hollandCode.code, result.normalizedScores);
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
          total={HOLLAND_QUESTIONS.length}
        />

        <QuestionCard
          question={currentQuestion}
          value={currentAnswer}
          onChange={(value) => setAnswer(currentQuestion.id, value)}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={HOLLAND_QUESTIONS.length}
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
          <Button
            variant="contained"
            endIcon={isLastQuestion ? null : <ArrowForwardOutlinedIcon />}
            onClick={handleNext}
            disabled={currentAnswer == null}
            sx={styles.navButton}
          >
            {isLastQuestion ? (allAnswered ? t("holland_finish") : t("holland_answerAll")) : t("holland_next")}
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
