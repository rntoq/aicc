"use client";

import { Box, Button, Container } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDiscStore } from "@/lib/store/discStore";
import { DISC_QUESTIONS } from "./questions";
import { DiscQuestionCard } from "./components/QuestionCard";
import { calculateDiscResult } from "./utils/scoring";
import { useTestsStore } from "@/lib/store/testsStore";
import { ProgressBar } from "../holland/components/ProgressBar";

export default function DiscPage() {
  const router = useRouter();
  const { answers, setAnswer, startTest, getProgress } = useDiscStore();
  const { setCompleted } = useTestsStore();
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    startTest();
  }, [startTest]);

  const total = DISC_QUESTIONS.length;
  const question = DISC_QUESTIONS[index];
  const value = answers[question.id] || { most: null, least: null };
  const canNext = !!(value.most && value.least);
  const allAnswered =
    Object.values(answers).filter((a) => a.most && a.least).length === total;
  const progress = getProgress(total);

  const handleNext = () => {
    if (!canNext) return;
    if (index === total - 1) {
      handleSubmit();
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitting(true);
    const result = calculateDiscResult(answers, DISC_QUESTIONS);
    setCompleted("disc-assessment");
    router.push(`/test/disc/result?type=${result.profile.dominant}`);
  };

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <ProgressBar
          progress={progress}
          current={
            Object.values(answers).filter((a) => a.most && a.least).length
          }
          total={total}
        />

        <DiscQuestionCard
          question={question}
          most={value.most}
          least={value.least}
          onChange={(most, least) => setAnswer(question.id, most, least)}
        />

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={handlePrev}
            disabled={index === 0}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            endIcon={index === total - 1 ? null : <ArrowForwardOutlinedIcon />}
            onClick={handleNext}
            disabled={!canNext || submitting}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {index === total - 1 ? "Завершить" : "Далее"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

