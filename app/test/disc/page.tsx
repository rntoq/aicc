"use client";

import { Box, Button, Container } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useMemo, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import { useQuizSessionFlow } from "@/lib/hooks/useQuizSessionFlow";
import DiscResultPanel from "./discResultDialog";
import { TestResultActions } from "../../components/tests/TestResultActions";
import DISC_DATA from "./disk_questions.json";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { LikertWordQuestionCard } from "../../components/tests/RadioQuestionCard";
import { OptionQuestionCard } from "../../components/tests/OptionQuestionCard";
import { LoadingScreen } from "../../components/tests/LoadingScreen";
import { useDelayedFlag } from "../../components/tests/useDelayedFlag";
import { TestHeader } from "../../components/tests/TestHeader";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizResult,
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

const SESSION_KEY = "disc";
const DISC_TOTAL_STEPS = 5;

type DiscStepQuestion =
  | { type: "pair"; id: string; left: DiscPair["left"]; right: DiscPair["right"] }
  | { type: "single"; id: string; text: DiscSingleWord["text"] }
  | { type: "scenario"; id: string; question: DiscScenario["question"]; options: DiscScenario["options"] };

const DiscPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const hydrated = useQuizSessionHydrated();
  const { setResult } = useQuizSessionStore();
  const finishedResult = useQuizSessionStore((s) => s.getSession(SESSION_KEY)?.result as QuizResult | null | undefined);
  const { phase, setPhase, sessionId, backendQuestionIds, initializing, retake } = useQuizSessionFlow({
    hydrated,
    sessionKey: SESSION_KEY,
    resolveSlug: async () => {
      const { body: tests } = await quizServices.listTests({ type: "disc" });
      return tests?.[0]?.slug ?? null;
    },
    mapQuestionIds: (ids) => ids.filter((id): id is number => typeof id === "number" && id > 0),
    onInitError: () => toast.error(t("toast_test_error")),
  });
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const showLoading = useDelayedFlag(phase === "quiz" && (initializing || submitting));
  const [pairValues, setPairValues] = useState<Record<string, number>>({});
  const [singleValues, setSingleValues] = useState<Record<string, number>>({});
  const [scenarioValues, setScenarioValues] = useState<Record<string, number>>({});


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
  const discFormatHelper =
    stepQuestionType === "pair"
      ? t("pairs_title")
      : stepQuestionType === "single"
        ? t("single_title")
        : stepQuestionType === "scenario"
          ? t("tests_disc_helper_scenario")
          : null;
  const discLikertFive = useMemo(
    () => [t("not_like_me"), t("somewhat_not_like_me"), t("neutral"), t("somewhat_like_me"), t("like_me")],
    [t],
  );
  const optionsHeader =
    stepQuestionType === "pair" || stepQuestionType === "single" ? discLikertFive : undefined;

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

      setResult(SESSION_KEY, backendResult);
      toast.success(t("toast_test_success"));
      setPhase("result");
      setSubmitting(false);
    };

    void finish();
  };

  if (!hydrated) {
    return <LoadingScreen open text={t("toast_test_loading")} />;
  }

  if (phase === "result") {
    const panelResult = (finishedResult ?? null) as QuizResult | null;
    return (
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={DISC_TOTAL_STEPS}
            totalSteps={DISC_TOTAL_STEPS}
            stepLabel={t("step_x_of_y", { step: DISC_TOTAL_STEPS, total: DISC_TOTAL_STEPS })}
            optionsHeader={discLikertFive}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("disc_title")}</Box>
          </Box>
          <DiscResultPanel result={panelResult} />
          <TestResultActions
            onRetake={retake}
          />
        </Container>
      </Box>
    );
  }

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={step + 1}
            totalSteps={DISC_TOTAL_STEPS}
            optionsHeader={optionsHeader}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("disc_title")}</Box>
            {discFormatHelper ? <Box sx={styles.pageHelper}>{discFormatHelper}</Box> : null}
          </Box>

          <Box
            sx={[
              styles.questionsColumn,
              stepQuestionType === "scenario" ? { gap: 3 } : null,
            ]}
          >
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
                    options={discLikertFive}
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
                    options={discLikertFive}
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
    pt: 3,
    minHeight: "80vh",
  },
  pageHeader: {
    mb: 3,
    textAlign: "center" as const,
  },
  pageTitle: {
    mb: 0.75,
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  pageHelper: {
    color: "text.secondary",
  },
  questionsColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
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

