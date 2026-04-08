"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import ENNEAGRAM_DATA from "./enneagram_questions.json";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";

type EnneagramTypeKey =
  | "type_1"
  | "type_2"
  | "type_3"
  | "type_4"
  | "type_5"
  | "type_6"
  | "type_7"
  | "type_8"
  | "type_9";

type EnneagramLocalResult = {
  test_title: string;
  test_type: "enneagram";
  scores: Record<EnneagramTypeKey, number>; // 0-100
  primary_type: EnneagramTypeKey;
  primary_name: string;
  wing_notation: string; // e.g., 9w1
  triad: { code: "heart" | "head" | "body"; label: string; description?: string };
  summary: string | null;
};

const STEPS_COUNT = 7;
const QUESTIONS_PER_STEP = 15; // 7 × 15 = 105

const parseTypeNumber = (t: EnneagramTypeKey) => t.replace("type_", "");

const typeNames: Record<
  EnneagramTypeKey,
  { ru: string; kk: string; en: string }
> = {
  type_1: { ru: "Перфекционист", kk: "Перфекционист", en: "The Perfectionist" },
  type_2: { ru: "Даритель", kk: "Дариет", en: "The Giver" },
  type_3: { ru: "Достигатель", kk: "Жетістікке жетуші", en: "The Achiever" },
  type_4: { ru: "Индивидуалист", kk: "Индивидуалист", en: "The Individualist" },
  type_5: { ru: "Исследователь", kk: "Зерттеуші", en: "The Investigator" },
  type_6: { ru: "Скептик", kk: "Скептик", en: "The Skeptic" },
  type_7: { ru: "Энтузиаст", kk: "Энтузиаст", en: "The Enthusiast" },
  type_8: { ru: "Борец", kk: "Батыл", en: "The Challenger" },
  type_9: { ru: "Миротворец", kk: "Татуластырушы", en: "The Peacemaker" },
};

const wingMap: Record<EnneagramTypeKey, EnneagramTypeKey[]> = {
  type_1: ["type_9", "type_2"],
  type_2: ["type_1", "type_3"],
  type_3: ["type_2", "type_4"],
  type_4: ["type_3", "type_5"],
  type_5: ["type_4", "type_6"],
  type_6: ["type_5", "type_7"],
  type_7: ["type_6", "type_8"],
  type_8: ["type_7", "type_9"],
  type_9: ["type_8", "type_1"],
};

const triadMap: Record<EnneagramTypeKey, "heart" | "head" | "body"> = {
  type_1: "body",
  type_2: "heart",
  type_3: "heart",
  type_4: "heart",
  type_5: "head",
  type_6: "head",
  type_7: "head",
  type_8: "body",
  type_9: "body",
};

export default function EnneagramTestPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale() as "ru" | "kk" | "en";
  const { setSession, setResult } = useQuizSessionStore();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);
  const [initializing, setInitializing] = useState(true);

  type EnneagramJson = {
    test?: { title?: LocalizedText };
    questions?: Array<{
      id: number;
      text: LocalizedText;
      scoring: { type: EnneagramTypeKey; reverse_scored: boolean };
    }>;
    scale?: { labels?: Record<string, LocalizedText> };
  };

  const data = ENNEAGRAM_DATA as unknown as EnneagramJson;
  const QUESTIONS: Array<{
    id: number;
    text: LocalizedText;
    scoring: { type: EnneagramTypeKey; reverse_scored: boolean };
  }> = data.questions ?? [];

  const labels = data.scale?.labels ?? {};
  const scaleOptions: LocalizedText[] = useMemo(
    () => [1, 2, 3, 4, 5].map((v) => labels[String(v)] as LocalizedText),
    [labels]
  );
  const leftLabel = labels["1"] as LocalizedText;
  const rightLabel = labels["5"] as LocalizedText;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const showLoading = useDelayedFlag(initializing || submitting);

  useEffect(() => {
    let cancelled = false;
    const initSession = async () => {
      setInitializing(true);
      const { body: tests } = await quizServices.listTests({ type: "enneagram" });
      const slug = tests?.[0]?.slug ?? null;
      if (!slug) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const { body: session } = await quizServices.startSession({ test_slug: slug });
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const ids = (testDetail.questions ?? []).map((q) => q.id);
      if (!cancelled) {
        setSessionId(session.id);
        setSession("enneagram", session.id);
        setBackendQuestionIds(ids);
      }
      if (!cancelled) setInitializing(false);
    };
    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = QUESTIONS.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  const computeResult = (): EnneagramLocalResult => {
    const raw: Record<EnneagramTypeKey, number> = {
      type_1: 0,
      type_2: 0,
      type_3: 0,
      type_4: 0,
      type_5: 0,
      type_6: 0,
      type_7: 0,
      type_8: 0,
      type_9: 0,
    };

    const counts: Record<EnneagramTypeKey, number> = {
      type_1: 0,
      type_2: 0,
      type_3: 0,
      type_4: 0,
      type_5: 0,
      type_6: 0,
      type_7: 0,
      type_8: 0,
      type_9: 0,
    };

    for (const q of QUESTIONS) {
      const type = q.scoring.type;
      counts[type] += 1;
      const responseRaw = answers[q.id];
      if (responseRaw == null) continue;
      const response = q.scoring.reverse_scored ? 6 - responseRaw : responseRaw;
      raw[type] += response;
    }

    const scores: Record<EnneagramTypeKey, number> = { ...raw };
    const typeKeys = Object.keys(counts) as EnneagramTypeKey[];
    for (const key of typeKeys) {
      const c = counts[key];
      const minPossible = c * 1;
      const maxPossible = c * 5;
      const denom = maxPossible - minPossible;
      const v = denom === 0 ? 0 : ((raw[key] - minPossible) / denom) * 100;
      scores[key] = Math.round(v);
    }

    const sorted = typeKeys.sort((a, b) => scores[b] - scores[a]);
    const primary = sorted[0];
    const primaryNum = parseTypeNumber(primary);

    const possibleWings = wingMap[primary];
    const dominantWing = possibleWings.sort((a, b) => scores[b] - scores[a])[0];
    const wingNotation = `${primaryNum}w${parseTypeNumber(dominantWing)}`;

    const triadCode = triadMap[primary];
    const triadLabel = triadCode === "heart" ? "Heart" : triadCode === "head" ? "Head" : "Body";
    const primary_name = typeNames[primary][locale];

    const summary = t("enneagram_summary");

    return {
      test_title: data.test?.title?.[locale] ?? data.test?.title?.en ?? "Enneagram Personality Test",
      test_type: "enneagram",
      scores,
      primary_type: primary,
      primary_name,
      wing_notation: wingNotation,
      triad: { code: triadCode, label: triadLabel, description: undefined },
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

      setResult("enneagram", backendResult ?? computeResult());
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      router.push("/test");
      setSubmitting(false);
    };

    void finish();
  };

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Header />
      <Box component="main" sx={{ pt: { xs: 15, md: 12 }, minHeight: "80vh" }}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={STEPS_COUNT}
            title={t("tests_enneagram_name") as string}
            subtitle={
              t("tests_enneagram_subtitle")
            }
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT }) as string}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stepQuestions.map((q) => (
              <LikertWordQuestionCard
                key={q.id}
                title={q.text}
                value={answers[q.id] ?? null}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                leftLabel={leftLabel}
                rightLabel={rightLabel}
                options={scaleOptions}
              />
            ))}
          </Box>

          <Divider sx={{ mt: 3, mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 4, mb: 6 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handlePrev}
              disabled={step === 1 || submitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {t("holland_back")}
            </Button>

            {step < STEPS_COUNT ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {t("holland_next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {submitting ? "..." : t("holland_finish")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

