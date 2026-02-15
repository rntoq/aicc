"use client";

import {
  Box,
  Button,
  Container,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePhotoQuizStore } from "@/lib/store/photoQuizStore";
import { PHOTO_QUESTIONS } from "./questions";
import { PhotoPair } from "./components/PhotoPair";
import { calculatePhotoQuizResult } from "./utils/scoring";
import { useTestsStore } from "@/lib/store/testsStore";

export default function PhotoCareerQuizPage() {
  const t = useTranslations();
  const router = useRouter();
  const { answers, setAnswer, startTest } = usePhotoQuizStore();
  const { setCompleted } = useTestsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startTest();
  }, [startTest]);

  const allAnswered = Object.keys(answers).length === PHOTO_QUESTIONS.length;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    
    // Calculate results
    const result = calculatePhotoQuizResult(answers, PHOTO_QUESTIONS);
    
    // Save to store
    useTestsStore.getState().setCompleted("photo-career");
    
    // Navigate to results
    router.push(`/test/photo-career/result?code=${result.hollandCode}`);
  };

  return (
    <Box component="main" sx={styles.root}>
      <Container maxWidth="xl" sx={styles.container}>
        {PHOTO_QUESTIONS.map((question, index) => {
          const questionAnswer = answers[question.id] || null;
          return (
            <PhotoPair
              key={question.id}
              question={question}
              selected={questionAnswer}
              onSelect={(option) => setAnswer(question.id, option)}
            />
          );
        })}

        {allAnswered && (
          <Box sx={styles.submitContainer}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={styles.submitButton}
            >
              {isSubmitting ? "Отправка..." : t("holland_finish")}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

const styles = {
  root: {
    py: { xs: 2, md: 4 },
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: { xs: 2, md: 4 },
  },
  submitContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: { xs: 4, md: 6 },
    position: "sticky",
    bottom: 0,
    bgcolor: "background.default",
    zIndex: 10,
    mt: 4,
  },
  submitButton: {
    borderRadius: 2,
    px: 6,
    py: 1.5,
    fontSize: "1.125rem",
    fontWeight: 600,
  },
};
