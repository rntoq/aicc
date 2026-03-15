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
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import DISC_DATA from "./disk_questions.json";
import { useLocale, useTranslations } from "next-intl";
import { LikertWordQuestionCard } from "@/app/test/components/RadioQuestionCard";
import { OptionsHeader } from "@/app/test/components/OptionsHeader";
import { OptionQuestionCard } from "@/app/test/components/OptionQuestionCard";
import { Header } from "@/app/components/layout/Header";
import { api } from "@/lib/api/api";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizSession,
  QuizTest,
  QuizResult,
  StartQuizSessionVariables,
} from "@/lib/types";

const PAIRS = (DISC_DATA as any).pairs || [];
const SINGLE_WORD_ITEMS: string[] =
  ((DISC_DATA as any).singleWords || []).map((w: any) => w.id) || [];
const SCENARIO_ITEMS: any[] = (DISC_DATA as any).scenarios || [];

const PAIR_STEPS = [
  PAIRS.slice(0, 8),
  PAIRS.slice(8, 16),
  PAIRS.slice(16, 24),
];

const DiscPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pairValues, setPairValues] = useState<Record<string, number>>({});
  const [singleValues, setSingleValues] = useState<Record<string, number>>({});
  const [scenarioValues, setScenarioValues] = useState<Record<string, number>>({});

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        const { data: tests } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
          params: { type: "disc" },
        });

        const slug = tests[0]?.slug;
        if (!slug) return;

        const { data: session } = await api.post<
          QuizSession,
          StartQuizSessionVariables
        >("/api/v1/quizzes/sessions/start/", { test_slug: slug });

        const { data: testDetail } = await api.get<{
          questions: { id: number }[];
        }>(`/api/v1/quizzes/tests/${slug}/`);

        const allBackendIds = (testDetail.questions ?? []).map((q) => q.id);
        const expectedCount =
          PAIRS.length + SINGLE_WORD_ITEMS.length + SCENARIO_ITEMS.length;

        if (!cancelled && allBackendIds.length === expectedCount) {
          setSessionId(session.id);
          setSession("disc", session.id);
          setBackendQuestionIds(allBackendIds);
        }
      } catch {
        // Если бэкенд недоступен — продолжаем работать в локальном режиме.
      }
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePairChange = (questionId: string, value: number) => {
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
    const allAnsweredSingles = SINGLE_WORD_ITEMS.every(
      (id: string) => singleValues[id] != null
    );
    const allAnsweredScenarios = SCENARIO_ITEMS.every(
      (q: { id: string }) => scenarioValues[q.id] != null
    );
    if (!allAnsweredPairs || !allAnsweredSingles || !allAnsweredScenarios)
      return;

    setSubmitting(true);
    const finish = async () => {
      let backendResult: QuizResult | null = null;

      try {
        if (sessionId && backendQuestionIds.length > 0) {
          const localOrder: { kind: "pair" | "single" | "scenario"; id: string }[] =
            [
              ...PAIRS.map((q: any) => ({ kind: "pair" as const, id: q.id })),
              ...SINGLE_WORD_ITEMS.map((id: string) => ({
                kind: "single" as const,
                id,
              })),
              ...SCENARIO_ITEMS.map((q: any) => ({
                kind: "scenario" as const,
                id: q.id,
              })),
            ];

          const maxCount = Math.min(
            backendQuestionIds.length,
            localOrder.length
          );

          const answersPayload: BulkAnswerQuizPayload["answers"] =
            localOrder.slice(0, maxCount).map((item, index) => {
              const question_id = backendQuestionIds[index];
              let scale_value: number | undefined;

              if (item.kind === "pair") {
                scale_value = pairValues[item.id];
              } else if (item.kind === "single") {
                scale_value = singleValues[item.id];
              } else {
                const raw = scenarioValues[item.id];
                if (raw == null) {
                  scale_value = undefined;
                } else {
                  scale_value = raw === 1 ? 1 : 5;
                }
              }

              return {
                question_id,
                scale_value: scale_value ?? 3,
              };
            });

          await api.post<unknown, BulkAnswerQuizPayload>(
            "/api/v1/quizzes/sessions/bulk-answer/",
            {
              session_id: sessionId,
              answers: answersPayload,
            }
          );

          const { data } = await api.post<
            QuizResult,
            FinishQuizSessionVariables
          >("/api/v1/quizzes/sessions/finish/", {
            session_id: sessionId,
          });

          backendResult = data;
          setResult("disc", backendResult);
        }
      } finally {
        router.push(`/test`);
        setSubmitting(false);
      }
    };

    void finish();
  };

  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <Box sx={styles.header}>
            <Typography component="h2" variant="h2" sx={styles.title}>
              {t("disc_title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("disc_subtitle")}
            </Typography>
            <Box sx={styles.stepsMeta}>
              <Typography variant="caption" color="text.secondary">
                {t("step_x_of_y", { step: step + 1, total: 5 } as any)}
              </Typography>
              <Box sx={styles.stepsBar}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    sx={{
                      ...styles.stepSegment,
                      bgcolor: i <= step ? "primary.main" : "grey.300",
                      opacity: i <= step ? 1 : 0.6,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {step <= 2 && (
            <Box sx={styles.section}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t("disc_pairs_title")}
              </Typography>
              
              {PAIR_STEPS[step].map((q: any) => (
                <Box key={q.id} sx={styles.pairRow}>
                  <Typography sx={styles.pairLabelLeft}>
                    {(q.left?.text as any)[locale] ?? ""}
                  </Typography>
                  <RadioGroup
                    row
                    sx={styles.pairRadioGroup}
                    value={pairValues[q.id]?.toString() ?? ""}
                    onChange={(e) => handlePairChange(q.id, Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <FormControlLabel
                        key={v}
                        value={v.toString()}
                        control={<Radio size="small" />}
                        label=""
                        sx={styles.pairRadioLabel}
                      />
                    ))}
                  </RadioGroup>
                  <Typography sx={styles.pairLabelRight}>
                    {(q.right?.text as any)[locale]}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {step === 3 && (
            <Box sx={styles.section}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t("disc_single_title")}
              </Typography>
              <OptionsHeader
                options={[
                  t("disc_single_scale_1", { defaultValue: "Not like me at all" } as any),
                  t("disc_single_scale_2", { defaultValue: "Rather not like me" } as any),
                  t("disc_single_scale_3", { defaultValue: "Neutral" } as any),
                  t("disc_single_scale_4", { defaultValue: "Rather like me" } as any),
                  t("disc_single_scale_5", { defaultValue: "Very much like me" } as any),
                ]}
              />
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
              {SCENARIO_ITEMS.map((q: any, index: number) => {
                const questionText =
                  q.question?.[locale as keyof typeof q.question] ??
                  q.question?.ru ??
                  q.question?.en ??
                  "";
                const optionLabels =
                  q.options?.map(
                    (opt: any) =>
                      opt.label?.[locale as keyof typeof opt.label] ??
                      opt.label?.ru ??
                      opt.label?.en ??
                      ""
                  ) ?? [];

                return (
                  <OptionQuestionCard
                    key={q.id}
                    questionNumber={index + 1}
                    questionText={questionText}
                    options={optionLabels}
                    value={scenarioValues[q.id] ?? null}
                    onChange={(val) =>
                      setScenarioValues((prev) => ({ ...prev, [q.id]: val }))
                    }
                  />
                );
              })}
            </Box>
          )}

          <Box sx={styles.navigation}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => setStep((prev) => prev - 1)}
              disabled={step === 0}
              sx={styles.navButton}
            >
              {t("holland_back")}
            </Button>
            <Button
              variant="contained"
              endIcon={step === 5 ? null : <ArrowForwardOutlinedIcon />}
              onClick={handleNext}
              disabled={!canGoNext() || submitting}
              sx={styles.navButton}
            >
              {step === 5 ? t("holland_finish") : t("holland_next")}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DiscPage;

const styles = {
  root: {
    pt: { xs: 15, md: 12 },
    minHeight: "80vh",
  },
  header: {
    mb: 3,
    textAlign: "center" as const,
  },
  title: {
    mb: 1,
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  stepsMeta: {
    mt: 2,
  },
  stepsBar: {
    mt: 1,
    display: "flex",
    gap: 0.75,
  },
  stepSegment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
  },
  pairRow: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
    alignItems: "center",
    gap: { xs: 1.5, md: 2 },
    p: 2,
  },
  pairLabelLeft: {
    fontWeight: 500,
    textAlign: { xs: "center", md: "right" } as const,
  },
  pairLabelRight: {
    fontWeight: 500,
    textAlign: { xs: "center", md: "left" } as const,
  },
  pairRadioGroup: {
    justifyContent: "center",
    gap: { xs: 0.5, md: 1 },
  },
  pairRadioLabel: {
    m: 0,
  },
  navigation: {
    mt: 3,
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
  },
  navButton: {
    borderRadius: 2,
    px: 3,
  },
};

