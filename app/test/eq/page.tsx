"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";
import EQ_DATA from "./eq_question.json";

const EMPTY_LABEL: LocalizedText = { ru: "", kk: "", en: "" };

type EqDimensionKey =
  | "self_awareness"
  | "other_awareness"
  | "emotional_control"
  | "empathy"
  | "wellbeing";

type EqLocalResult = {
  test_title: string;
  test_type: "eq5";
  overall_eq: number;
  eq_superpower: {
    archetype: string;
    title: string;
    description: string;
  } | null;
  dimension_scores: Record<EqDimensionKey, number>;
  summary: string | null;
};

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

export default function EqTestPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale() as "ru" | "kk" | "en";
  const { setSession, setResult } = useQuizSessionStore();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    const initSession = async () => {
      const { body: tests } = await quizServices.listTests({ type: "eq" });
      const slug = tests?.[0]?.slug ?? null;
      if (!slug) return;

      const { body: session } = await quizServices.startSession({ test_slug: slug });
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) return;

      const ids = (testDetail.questions ?? []).map((q) => q.id);
      if (!cancelled) {
        setSessionId(session.id);
        setSession("eq", session.id);
        setBackendQuestionIds(ids);
      }
    };
    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

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
    const summary =
      locale === "ru"
        ? "Ваш EQ-профиль показывает, как вы понимаете свои и чужие эмоции, контролируете эмоциональные реакции и выстраиваете отношения."
        : locale === "kk"
          ? "Сіздің EQ-профиль эмоцияларды түсіну, эмоцияны бақылау және қарым-қатынас құрудағы ерекшеліктеріңізді көрсетеді."
          : "Your EQ profile reflects how you understand emotions, regulate responses, and build relationships.";

    return {
      test_title: eqData.test?.title?.[locale] ?? eqData.test?.title?.en ?? "Emotional Intelligence Assessment",
      test_type: "eq5",
      overall_eq,
      eq_superpower: power,
      dimension_scores,
      summary,
    };
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

      setResult("eq", backendResult ?? computeResult());
      router.push("/test");
      setSubmitting(false);
    };

    void finish();
  };

  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 15, md: 12 }, minHeight: "80vh" }}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={STEPS_COUNT}
            title={t("tests_eq_name") as string}
            subtitle={
              locale === "ru"
                ? "Оцените, насколько каждое утверждение описывает вас"
                : locale === "kk"
                  ? "Әрбір тұжырым сізге қаншалықты сәйкес келеді деп бағалаңыз"
                  : "Rate how well each statement describes you"
            }
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT }) as string}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Box sx={{ width: "100%" }}>
              {/* Render current step questions */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              <Divider sx={{ mt: 3, mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 6 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackOutlinedIcon />}
                  onClick={handlePrev}
                  disabled={step === 1 || submitting}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  {locale === "ru" ? "Назад" : locale === "kk" ? "Артқа" : "Back"}
                </Button>

                {step < STEPS_COUNT ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!allStepAnswered || submitting}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    {locale === "ru" ? "Далее" : locale === "kk" ? "Келесі" : "Next"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!allStepAnswered || submitting}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    {submitting
                      ? "..."
                      : locale === "ru"
                        ? "Завершить"
                        : locale === "kk"
                          ? "Аяқтау"
                          : "Finish"}
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

