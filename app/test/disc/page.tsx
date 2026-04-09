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
import { useEffect, useMemo, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import DISC_DATA from "./disk_questions.json";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { OptionQuestionCard } from "../components/OptionQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import { TestHeader } from "../components/TestHeader";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizResult,
  StartQuizSessionVariables,
} from "@/lib/types";

type DiscPair = {
  id: string;
  left: { text: { ru: string; kk: string; en: string } };
  right: { text: { ru: string; kk: string; en: string } };
};
type DiscSingleWord = {
  id: string;
  text: { ru: string; kk: string; en: string };
};
type DiscScenario = {
  id: string;
  question: { ru: string; kk: string; en: string };
  options: { id: string; label: { ru: string; kk: string; en: string } }[];
};
type DiscData = {
  pairs: DiscPair[];
  singleWords: DiscSingleWord[];
  scenarios: DiscScenario[];
};

const DISC = DISC_DATA as unknown as DiscData;
const PAIRS: DiscPair[] = DISC.pairs ?? [];
const SINGLE_WORDS: DiscSingleWord[] = DISC.singleWords ?? [];
const SINGLE_WORD_ITEMS: string[] = SINGLE_WORDS.map((w) => w.id);
const SCENARIO_ITEMS: DiscScenario[] = DISC.scenarios ?? [];

const PAIR_STEPS: DiscPair[][] = [PAIRS.slice(0, 8), PAIRS.slice(8, 16), PAIRS.slice(16, 24)];

type DiscStepQuestion =
  | { type: "pair"; id: string; left: DiscPair["left"]; right: DiscPair["right"] }
  | { type: "single"; id: string; text: DiscSingleWord["text"] }
  | { type: "scenario"; id: string; question: DiscScenario["question"]; options: DiscScenario["options"] };

const DiscPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(initializing || submitting);
  const [pairValues, setPairValues] = useState<Record<string, number>>({});
  const [singleValues, setSingleValues] = useState<Record<string, number>>({});
  const [scenarioValues, setScenarioValues] = useState<Record<string, number>>({});

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      setInitializing(true);
      const { body: tests } = await quizServices.listTests({ type: "disc" });
      const slug = tests?.[0]?.slug ?? null;
      if (!slug) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const { body: session } = await quizServices.startSession({ test_slug: slug } as StartQuizSessionVariables);
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const questionIds = (testDetail.questions ?? [])
        .map((q) => q.id)
        .filter((id): id is number => typeof id === "number" && id > 0);

      if (!cancelled && questionIds.length > 0) {
        setSessionId(session.id);
        setSession("disc", session.id);
        setBackendQuestionIds(questionIds);
      }
      if (!cancelled) setInitializing(false);
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [setSession]);

  const leftTitleEmpty = { ru: "", kk: "", en: "" } as const;

  const stepQuestions: DiscStepQuestion[] = useMemo(() => {
    if (step <= 2) {
      return (PAIR_STEPS[step] ?? []).map((q) => ({ type: "pair", id: q.id, left: q.left, right: q.right }));
    }
    if (step === 3) {
      return SINGLE_WORDS.map((w) => ({ type: "single", id: w.id, text: w.text }));
    }
    if (step === 4) {
      return SCENARIO_ITEMS.map((q) => ({ type: "scenario", id: q.id, question: q.question, options: q.options }));
    }
    return [];
  }, [step]);

  const stepQuestionType = stepQuestions[0]?.type;
  const helperTitle = stepQuestionType === "pair" ? t("pairs_title") : stepQuestionType === "single" ? t("single_title") : undefined;
  const optionsHeader =
    stepQuestionType === "single"
      ? [t("not_like_me"), t("somewhat_not_like_me"), t("neutral"), t("somewhat_like_me"), t("like_me")]
      : undefined;

  const canGoNext = () => {
    if (stepQuestions.length === 0) return false;
    for (const q of stepQuestions) {
      if (q.type === "pair" && pairValues[q.id] == null) return false;
      if (q.type === "single" && singleValues[q.id] == null) return false;
      if (q.type === "scenario" && scenarioValues[q.id] == null) return false;
    }
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
      if (!sessionId || backendQuestionIds.length === 0) {
        toast.error(t("toast_test_error"));
        setSubmitting(false);
        return;
      }

      // Submit all answers as scale_value mapped by backend question order.
      // Local order: 24 pairs + single words + scenarios.
      const localValues: number[] = [];
      for (const q of PAIRS) localValues.push(pairValues[q.id] ?? 3);
      for (const id of SINGLE_WORD_ITEMS) localValues.push(singleValues[id] ?? 3);
      for (const q of SCENARIO_ITEMS) localValues.push(scenarioValues[q.id] ?? 1);

      const count = Math.min(backendQuestionIds.length, localValues.length);
      const answersPayload: BulkAnswerQuizPayload["answers"] = [];
      for (let i = 0; i < count; i++) {
        const qid = backendQuestionIds[i];
        const v = localValues[i];
        if (typeof qid === "number" && qid > 0 && typeof v === "number") {
          answersPayload.push({ question_id: qid, scale_value: v });
        }
      }

      const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
      if (bulkRes.error) {
        toast.error(t("toast_test_error"));
        setSubmitting(false);
        return;
      }

      const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
      const backendResult = (finishRes.body ?? null) as QuizResult | null;
      if (!backendResult || finishRes.error) {
        toast.error(t("toast_test_error"));
        setSubmitting(false);
        return;
      }

      setResult("disc", backendResult);
      toast.success(t("toast_test_success"));
      router.push(`/test`);
      setSubmitting(false);
    };

    void finish();
  };

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={step + 1}
            totalSteps={5}
            helperTitle={helperTitle}
            optionsHeader={optionsHeader}
          />
          <Box sx={styles.header}>
            <Typography component="h2" variant="h2" sx={styles.title}>
              {t("disc_title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("disc_subtitle")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: stepQuestionType === "scenario" ? 3 : 2 }}>
            {stepQuestions.map((q, index) => {
              if (q.type === "pair") {
                return (
                  <LikertWordQuestionCard
                    key={q.id}
                    title={leftTitleEmpty}
                    value={pairValues[q.id] ?? null}
                    onChange={(val) => setPairValues((prev) => ({ ...prev, [q.id]: val }))}
                    leftLabel={q.left.text}
                    rightLabel={q.right.text}
                    options={[
                      t("not_like_me"),
                      t("somewhat_not_like_me"),
                      t("neutral"),
                      t("somewhat_like_me"),
                      t("like_me"),
                    ]}
                  />
                );
              }

              if (q.type === "single") {
                return (
                  <LikertWordQuestionCard
                    key={q.id}
                    title={q.text}
                    value={singleValues[q.id] ?? null}
                    onChange={(val) => setSingleValues((prev) => ({ ...prev, [q.id]: val }))}
                  />
                );
              }

              const loc = locale as keyof typeof q.question;
              const questionText = q.question[loc] ?? q.question.ru;
              const optionLabels = q.options.map((opt) => opt.label[loc] ?? opt.label.ru);
              return (
                <OptionQuestionCard
                  key={q.id}
                  questionNumber={index + 1}
                  questionText={questionText}
                  options={optionLabels}
                  value={scenarioValues[q.id] ?? null}
                  onChange={(val) => setScenarioValues((prev) => ({ ...prev, [q.id]: val }))}
                />
              );
            })}
          </Box>

          <Box sx={styles.navigation}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => setStep((prev) => prev - 1)}
              disabled={step === 0}
              sx={styles.navButton}
            >
              {t("back")}
            </Button>
            <Button
              variant="contained"
              endIcon={step === 4 ? null : <ArrowForwardOutlinedIcon />}
              onClick={handleNext}
              disabled={!canGoNext() || submitting}
              sx={styles.navButton}
            >
              {step === 4 ? t("finish") : t("next")}
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
    pt: { xs: 3, md: 3 },
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
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: { xs: 1.5, md: 2 },
    p: 2,
  },
  pairLabelLeft: {
    fontWeight: 500,
    textAlign: "right",
  },
  pairLabelRight: {
    fontWeight: 500,
    textAlign: "left",
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

