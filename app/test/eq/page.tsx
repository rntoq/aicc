"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import { useQuizSessionFlow } from "@/lib/hooks/useQuizSessionFlow";
import { EqResultPanel, type EqLocalResult } from "./eqResultDialog";
import { TestResultActions } from "../../components/tests/TestResultActions";
import { TestHeader } from "../../components/tests/TestHeader";
import { LikertWordQuestionCard } from "../../components/tests/RadioQuestionCard";
import { LoadingScreen } from "../../components/tests/LoadingScreen";
import { useDelayedFlag } from "../../components/tests/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import {
  getCurrentLocaleForTranslation,
  translateQuizResultForLocale,
} from "@/lib/utils/quizResultTranslation";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";
import EQ_DATA from "./eq_question.json";
import { TEST_DISPLAY_NAMES } from "@/utils/constants";

const EMPTY_LABEL: LocalizedText = { ru: "", kk: "", en: "" };

type EqDimensionKey =
  | "self_awareness"
  | "other_awareness"
  | "emotional_control"
  | "empathy"
  | "wellbeing";

const SESSION_KEY = "eq";
const PAGE_TITLE = TEST_DISPLAY_NAMES.eq;

const STEPS_COUNT = 7;
const QUESTIONS_PER_STEP = 9; // 7 × 9 = 63

const eqIdsByDimension = (): Record<EqDimensionKey, number[]> => ({
  self_awareness: Array.from({ length: 13 }, (_, i) => i + 1),
  other_awareness: Array.from({ length: 11 }, (_, i) => i + 14),
  emotional_control: [
    ...Array.from({ length: 13 }, (_, i) => i + 25),
    60,
    61,
    62,
  ],
  empathy: Array.from({ length: 9 }, (_, i) => i + 38),
  wellbeing: [...Array.from({ length: 13 }, (_, i) => i + 47), 63],
});

const computeEqSuperpower = (scores: Record<EqDimensionKey, number>) => {
  // Heuristic thresholds; backend is not required for UX.
  const HIGH = 65;
  const LOW = 50;
  const isHigh = (k: EqDimensionKey) => scores[k] >= HIGH;
  const isLow = (k: EqDimensionKey) => scores[k] < LOW;

  if (isHigh("self_awareness") && isHigh("empathy")) {
    return {
      archetype: "The Poet",
      title: "You have exceptional self-awareness and empathy",
      description: "You understand your emotional experiences deeply and relate strongly to others' feelings.",
    };
  }
  if (isHigh("other_awareness") && isHigh("empathy")) {
    return {
      archetype: "The Empath",
      title: "You read emotions very well",
      description: "You notice nonverbal cues and empathize with others’ emotional states.",
    };
  }
  if (isHigh("emotional_control") && isHigh("self_awareness")) {
    return {
      archetype: "The Navigator",
      title: "You stay calm under pressure",
      description: "You manage your emotions and make decisions with clarity and control.",
    };
  }
  if (isHigh("wellbeing") && isHigh("other_awareness")) {
    return {
      archetype: "The Connector",
      title: "You’re socially confident and emotionally tuned",
      description: "You bring positive energy to interactions and understand others’ feelings.",
    };
  }
  if (isHigh("emotional_control") && isLow("empathy")) {
    return {
      archetype: "The Stoic",
      title: "Calm and rational emotional style",
      description: "You can regulate emotions well, while empathy may be lower than your control.",
    };
  }
  if (isHigh("other_awareness") && isLow("self_awareness")) {
    return {
      archetype: "The Observer",
      title: "Strong social perception",
      description: "You focus outward and perceive others well, while self-awareness may need support.",
    };
  }
  if (isHigh("wellbeing") && isLow("emotional_control")) {
    return {
      archetype: "The Spark",
      title: "Positive energy, emotions can be intense",
      description: "You enjoy life and social energy, but your emotional control may lag behind.",
    };
  }

  return {
    archetype: "The Diplomat",
    title: "Balanced emotional intelligence profile",
    description: "Your EQ dimensions are relatively even, helping you adapt across situations.",
  };
};

const styles = {
  root: { pt: 3, minHeight: "80vh" },
  pageHeader: { mb: 3, textAlign: "center" as const },
  pageTitle: { mb: 0.75, fontSize: "1.25rem", fontWeight: 700 },
  pageHelper: { color: "text.secondary" },
  quizOuter: { display: "flex", justifyContent: "center", mb: 1 },
  quizInner: { width: "100%" },
  questionsColumn: { display: "flex", flexDirection: "column" as const, gap: 2 },
  dividerMid: { mt: 3, mb: 2 },
  navRow: { display: "flex", justifyContent: "space-between", gap: 2, mb: 6 },
  navButton: { borderRadius: 2, px: 3 },
};

export default function EqTestPage() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
  const hydrated = useQuizSessionHydrated();
  const { setResult } = useQuizSessionStore();
  const finishedResult = useQuizSessionStore((s) => s.getSession(SESSION_KEY)?.result as EqLocalResult | null | undefined);
  const { phase, setPhase, sessionId, backendQuestionIds, initializing, retake } = useQuizSessionFlow({
    hydrated,
    sessionKey: SESSION_KEY,
    resolveSlug: async () => {
      const preferredSlug = "emotional-intelligence-eq5";
      let slug: string | null = preferredSlug;
      const { error: preflightErr } = await quizServices.getTestDetail(preferredSlug);
      if (preflightErr) {
        const { body: testsPrimary } = await quizServices.listTests({ type: "eq5" });
        slug = testsPrimary?.[0]?.slug ?? null;
        if (!slug) {
          const { body: testsFallback } = await quizServices.listTests({ type: "eq" });
          slug = testsFallback?.[0]?.slug ?? null;
        }
      }
      return slug;
    },
    onInitError: () => toast.error(t("toast_test_error")),
  });

  type EqJson = {
    test?: { title?: LocalizedText };
    questions?: Array<{
      id: number;
      text: LocalizedText;
      reverse_scored: boolean;
    }>;
    scale?: { labels?: Record<string, LocalizedText> };
  };

  const eqData = EQ_DATA as unknown as EqJson;
  const QUESTIONS = eqData.questions ?? [];

  const scaleLabels = eqData.scale?.labels ?? {};
  const scaleOptions = useMemo<LocalizedText[]>(
    () => [1, 2, 3, 4, 5].map((v) => scaleLabels[String(v)] ?? EMPTY_LABEL),
    [scaleLabels]
  );

  const leftLabel = scaleLabels["1"] ?? EMPTY_LABEL;
  const rightLabel = scaleLabels["5"] ?? EMPTY_LABEL;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const showLoading = useDelayedFlag(phase === "quiz" && (initializing || submitting));

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = QUESTIONS.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  const computeResult = (): EqLocalResult => {
    const dimMap = eqIdsByDimension();
    const dimensionScores: Record<EqDimensionKey, number> = {
      self_awareness: 0,
      other_awareness: 0,
      emotional_control: 0,
      empathy: 0,
      wellbeing: 0,
    };

    for (const q of QUESTIONS) {
      const responseRaw = answers[q.id];
      if (responseRaw == null) continue;
      const response = q.reverse_scored ? 6 - responseRaw : responseRaw;

      const dimensionKey = (Object.entries(dimMap).find(([, ids]) => ids.includes(q.id))?.[0] ??
        null) as EqDimensionKey | null;
      if (!dimensionKey) continue;
      dimensionScores[dimensionKey] += response;
    }

    const normalized: Record<EqDimensionKey, number> = {
      self_awareness: 0,
      other_awareness: 0,
      emotional_control: 0,
      empathy: 0,
      wellbeing: 0,
    };

    for (const key of Object.keys(dimMap) as EqDimensionKey[]) {
      const count = dimMap[key].length;
      const raw = dimensionScores[key];
      const minPossible = count * 1;
      const maxPossible = count * 5;
      const denom = maxPossible - minPossible;
      normalized[key] = denom === 0 ? 0 : ((raw - minPossible) / denom) * 100;
    }

    // Make ints for display
    const dimension_scores = Object.fromEntries(
      (Object.entries(normalized) as Array<[EqDimensionKey, number]>).map(([k, v]) => [k, Math.round(v)])
    ) as Record<EqDimensionKey, number>;

    const overall_eq = Math.round(
      (Object.values(dimension_scores).reduce((a, b) => a + b, 0) / 5) * 1
    );

    const power = computeEqSuperpower(dimension_scores);
    const summary = t("eq_summary");

    return {
      id: Date.now(),
      test_title: eqData.test?.title?.[locale] ?? eqData.test?.title?.en ?? "Emotional Intelligence Assessment",
      test_type: "eq5",
      overall_eq,
      eq_superpower: power,
      dimension_scores,
      summary,
      created_at: new Date().toISOString(),
    } as EqLocalResult;
  };

  const handlePrev = () => {
    if (step <= 1 || submitting) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!allStepAnswered || submitting) return;
    if (step < STEPS_COUNT) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!allStepAnswered || submitting) return;
    setSubmitting(true);

    const finish = async () => {
      let backendResult: QuizResult | null = null;
      if (sessionId && backendQuestionIds.length === QUESTIONS.length) {
        const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS.map((q, idx) => ({
          question_id: backendQuestionIds[idx],
          scale_value: answers[q.id] ?? 3,
        }));

        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body;
        }
      }

      const localizedResult = await translateQuizResultForLocale(
        backendResult ?? computeResult(),
        getCurrentLocaleForTranslation()
      );
      setResult(SESSION_KEY, localizedResult);
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      setPhase("result");
      setSubmitting(false);
    };

    void finish();
  };

  if (!hydrated) {
    return <LoadingScreen open text={t("toast_test_loading")} />;
  }

  if (phase === "result") {
    const result = (finishedResult ?? null) as EqLocalResult | null;
    return (
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={STEPS_COUNT}
            totalSteps={STEPS_COUNT}
            stepLabel={t("step_x_of_y", { step: STEPS_COUNT, total: STEPS_COUNT }) as string}
            optionsHeader={scaleOptions}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{PAGE_TITLE}</Box>
          </Box>
          <EqResultPanel result={result} />
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
            step={step}
            totalSteps={STEPS_COUNT}
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT }) as string}
            optionsHeader={scaleOptions}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{PAGE_TITLE}</Box>
            <Box sx={styles.pageHelper}>{t("tests_eq_helper")}</Box>
          </Box>

          <Box sx={styles.quizOuter}>
            <Box sx={styles.quizInner}>
              <Box sx={styles.questionsColumn}>
                {stepQuestions.map((q) => (
                  <LikertWordQuestionCard
                    key={q.id}
                    title={q.text}
                    value={answers[q.id] ?? null}
                    onChange={(v) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: v }))
                    }
                    leftLabel={leftLabel}
                    rightLabel={rightLabel}
                    options={scaleOptions}
                  />
                ))}
              </Box>
              <Divider sx={styles.dividerMid} />

              <Box sx={styles.navRow}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackOutlinedIcon />}
                  onClick={handlePrev}
                  disabled={step === 1 || submitting}
                  sx={styles.navButton}
                >
                  {t("back")}
                </Button>

                {step < STEPS_COUNT ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!allStepAnswered || submitting}
                    sx={styles.navButton}
                  >
                    {t("next")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!allStepAnswered || submitting}
                    sx={styles.navButton}
                  >
                    {submitting
                      ? "..."
                      : t("finish")}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

