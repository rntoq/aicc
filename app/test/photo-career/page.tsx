"use client";

import { Box, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePhotoQuizStore } from "@/lib/store/photoQuizStore";
import PHOTO_DATA from "./photo_questions.json";
import { PhotoPair, type PhotoQuestion } from "./components/PhotoPair";
import { useTestsStore } from "@/lib/store/testsStore";
import { Header } from "@/app/components/layout/Header";

const PhotoCareerQuizPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setResult } = usePhotoQuizStore();
  const { setCompleted } = useTestsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PHOTO_QUESTIONS: PhotoQuestion[] =
    (PHOTO_DATA as { PHOTO_QUESTIONS?: PhotoQuestion[] }).PHOTO_QUESTIONS ?? [];

  const [answers, setAnswers] = useState<Record<string, "optionA" | "optionB">>({});

  const allAnswered =
    PHOTO_QUESTIONS.length > 0 &&
    Object.keys(answers).length === PHOTO_QUESTIONS.length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    setResult({
      finishedAt: Date.now(),
      payload: answers,
    });
    setCompleted("photo-career");
    router.push("/test");
  };

  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="xl" sx={styles.container}>
          {PHOTO_QUESTIONS.map((question) => {
            const questionAnswer = answers[question.id] || null;
            return (
              <PhotoPair
                key={question.id}
                question={question}
                selected={questionAnswer}
                onSelect={(option) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: option }))
                }
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
    </>
  );
};

export default PhotoCareerQuizPage;

const styles = {
  root: {
    pt: { xs: 15, md: 12 },
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
    position: "sticky" as const,
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

