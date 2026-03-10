"use client";

import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDiscStore } from "../../../lib/store/discStore";
import DISC_DATA from "./disk_questions.json";
import { useTestsStore } from "../../../lib/store/testsStore";
import { useLocale } from "next-intl";
import { LikertWordQuestionCard } from "@/app/test/components/QuestionCard";
import { OptionsHeader } from "@/app/test/components/OptionsHeader";
import { Header } from "@/app/components/layout/Header";

const PAIRS = (DISC_DATA as any).pairs || [];
const SINGLE_WORD_ITEMS: string[] =
  ((DISC_DATA as any).singleWords || []).map((w: any) => w.id) || [];
const SCENARIO_ITEMS: any[] = (DISC_DATA as any).scenarios || [];

const PAIR_STEPS = [
  PAIRS.slice(0, 8),
  PAIRS.slice(8, 16),
  PAIRS.slice(16, 24),
];

const cardStyle = {
  p: 2,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

const DiscPage = () => {
  const locale = useLocale();
  const router = useRouter();
  const { setResult } = useDiscStore();
  const { setCompleted } = useTestsStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pairValues, setPairValues] = useState<Record<string, number>>({});
  const [singleValues, setSingleValues] = useState<Record<string, number>>({});
  const [scenarioValues, setScenarioValues] = useState<Record<string, string>>({});
  const [surveyValues, setSurveyValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // init local-only state; store используется только для сохранения финального результата
  }, []);

  const handlePairChange = (questionId: string, value: number) => {
    const question = PAIRS.find((q: { id: string }) => q.id === questionId) as any;
    if (!question) return;

    setPairValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const canGoNext = () => {
    if (step <= 2)
      return PAIR_STEPS[step].every((q: { id: string }) => pairValues[q.id] != null);
    if (step === 3) return SINGLE_WORD_ITEMS.every((id: string) => singleValues[id] != null);
    if (step === 4) return SCENARIO_ITEMS.every((q: { id: string }) => scenarioValues[q.id]);
    return true;
  };

  const handleNext = () => {
    if (!canGoNext() || submitting) return;
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // финальная валидация по локальному состоянию
    const allAnsweredPairs =
      PAIRS.every((q: { id: string }) => pairValues[q.id] != null);
    if (!allAnsweredPairs) return;

    setResult({
      finishedAt: Date.now(),
      payload: {
        pairValues,
        singleValues,
        scenarioValues,
      },
    });
    setSubmitting(true);
    setCompleted("disc-assessment");
    router.push(`/test/disc/result`);
  };

  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 15, md: 12 }, minHeight: "80vh" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Шаг {step + 1} из 5
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 0.75 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    bgcolor: i <= step ? "primary.main" : "grey.300",
                    opacity: i <= step ? 1 : 0.6,
                  }}
                />
              ))}
            </Box>
          </Box>
          

          {step <= 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                В каждой паре отметьте, какое слово лучше описывает вас.
              </Typography>
              
              {PAIR_STEPS[step].map((q: any) => (
                <Box
                  key={q.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    p: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, textAlign: { xs: "center", md: "right" } }}>
                    {(q.left?.text as any)[locale] ?? ""}
                  </Typography>
                  <RadioGroup
                    row
                    sx={{ justifyContent: "center", gap: { xs: 0.5, md: 1 } }}
                    value={pairValues[q.id]?.toString() ?? ""}
                    onChange={(e) => handlePairChange(q.id, Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <FormControlLabel
                        key={v}
                        value={v.toString()}
                        control={<Radio size="small" />}
                        label=""
                        sx={{ m: 0 }}
                      />
                    ))}
                  </RadioGroup>
                  <Typography sx={{ fontWeight: 500, textAlign: { xs: "center", md: "left" } }}>
                    {(q.right?.text as any)[locale]}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {step === 3 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Оцените, насколько каждое слово похоже на вас.
              </Typography>
              <OptionsHeader options={["Совсем не про меня", "Скорее не про меня", "Нейтрально", "Скорее про меня", "Полностью про меня"]} />
              {SINGLE_WORD_ITEMS.map((wordId: string) => (
                <LikertWordQuestionCard
                  key={wordId}
                  title={
                    ((DISC_DATA as any).singleWords || []).find((w: any) => w.id === wordId)
                      ?.text ?? { ru: wordId, kk: wordId, en: wordId }
                  }
                  value={singleValues[wordId] ?? null}
                  onChange={(val) =>
                    setSingleValues((prev) => ({
                      ...prev,
                      [wordId]: val,
                    }))
                  }
                />
              ))}
            </Box>
          )}

          {step === 4 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {SCENARIO_ITEMS.map((q: any) => (
                <Box key={q.id} sx={cardStyle}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    {q.question?.ru ?? ""}
                  </Typography>
                  <RadioGroup
                    value={scenarioValues[q.id] ?? ""}
                    onChange={(e) =>
                      setScenarioValues((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                  >
                    {q.options?.map((opt: any) => (
                      <FormControlLabel
                        key={opt.id}
                        value={opt.id}
                        control={<Radio size="small" />}
                        label={opt.label?.ru ?? ""}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}
            </Box>
          )}


          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => setStep((prev) => prev - 1)}
              disabled={step === 0}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Назад
            </Button>
            <Button
              variant="contained"
              endIcon={step === 5 ? null : <ArrowForwardOutlinedIcon />}
              onClick={handleNext}
              disabled={!canGoNext() || submitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {step === 5 ? "Завершить" : "Далее"}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DiscPage;

