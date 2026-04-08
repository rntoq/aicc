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
import { OptionQuestionCard } from "../components/OptionQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import LEADERSHIP_DATA from "./leadership_questions.json";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";

type PairKey = "a" | "b";
type LeadershipDimensionKey = "openness" | "conscientiousness" | "agreeableness";

type LeadershipLocalResult = {
  test_title: string;
  test_type: string;
  dimension_scores: Record<LeadershipDimensionKey, number>;
  leadership_type: {
    code: string;
    name: string;
    tagline: string;
  } | null;
};

const DIMENSION_LABELS: Record<LeadershipDimensionKey, { ru: string; kk: string; en: string }> = {
  openness: { ru: "Открытость", kk: "Ашықтық", en: "Openness" },
  conscientiousness: { ru: "Добросовестность", kk: "Ұқыптылық", en: "Conscientiousness" },
  agreeableness: { ru: "Доброжелательность", kk: "Келісімшілдік", en: "Agreeableness" },
};

const LEADERSHIP_TYPES: Record<
  string,
  { name: { ru: string; kk: string; en: string }; tagline: string }
> = {
  influencer: {
    name: { ru: "Вдохновитель", kk: "Ілгерілетуші", en: "The Influencer" },
    tagline: "Empathetic, supportive, coaching style",
  },
  visionary: {
    name: { ru: "Визионер", kk: "Болжамшы", en: "The Visionary" },
    tagline: "Strategic, long-term, decisive",
  },
  innovator: {
    name: { ru: "Инноватор", kk: "Жаңашыл", en: "The Innovator" },
    tagline: "Flexible, creative problem-solver",
  },
  muse: {
    name: { ru: "Муза", kk: "Сезімтал жетекші", en: "The Muse" },
    tagline: "Creative, motivating, empathetic",
  },
  cheerleader: {
    name: { ru: "Поддерживающий лидер", kk: "Қолдаушы көшбасшы", en: "The Cheerleader" },
    tagline: "Positive, inclusive, people-focused",
  },
  action_hero: {
    name: { ru: "Герой действия", kk: "Әрекет адамы", en: "The Action Hero" },
    tagline: "Direct, resourceful, decisive",
  },
  giver: {
    name: { ru: "Даритель", kk: "Қамқор", en: "The Giver" },
    tagline: "Reliable, empathetic, team-building",
  },
  pillar_of_strength: {
    name: { ru: "Опора силы", kk: "Тұрақты тірек", en: "Pillar of Strength" },
    tagline: "Practical, organized, honest",
  },
};

export default function LeadershipTestPage() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestions, setBackendQuestions] = useState<
    { id: number; questionType: string; answers: { code: string }[] }[]
  >([]);

  type LeadershipQuestion =
    | {
        id: string;
        type: "pair";
        number: number;
        dimension: LeadershipDimensionKey;
        option_a: LocalizedText;
        option_b: LocalizedText;
        scoring?: Partial<
          Record<PairKey, Partial<Record<LeadershipDimensionKey, number>>>
        >;
      }
    | {
        id: string;
        type: "frequency";
        number: number;
        dimension: LeadershipDimensionKey;
        text?: LocalizedText;
        statement?: LocalizedText;
        reverse_scored?: boolean;
      };

  type LeadershipJson = {
    test?: { title?: LocalizedText };
    questions?: LeadershipQuestion[];
    scales?: { frequency?: { labels?: Record<string, LocalizedText> } };
  };

  const leadershipData = LEADERSHIP_DATA as unknown as LeadershipJson;
  const questions = leadershipData.questions ?? [];
  const scaleLabels = leadershipData.scales?.frequency?.labels ?? {};
  const emptyLabel: LocalizedText = { ru: "", kk: "", en: "" };

  const stepTotal = 3;
  const [step, setStep] = useState<number>(1);
  const pairQuestions = useMemo(
    () => questions.filter((q) => q.type === "pair"),
    [questions]
  );
  const frequencyQuestions = useMemo(
    () => questions.filter((q) => q.type === "frequency"),
    [questions]
  );

  const stepQuestions = useMemo(() => {
    if (step === 1) return pairQuestions.slice(0, 12);
    if (step === 2) return frequencyQuestions;
    return pairQuestions.slice(12, 24);
  }, [step, pairQuestions, frequencyQuestions]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(initializing || submitting);

  useEffect(() => {
    let cancelled = false;
    const initSession = async () => {
      setInitializing(true);
      const { body: tests } = await quizServices.listTests({ type: "leadership" });
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

      const bqs = (testDetail.questions ?? []).map((q) => ({
        id: q.id,
        questionType: q.question_type ?? "",
        answers: (q.answers ?? []).map((a) => ({ code: a.code })),
      }));
      if (!cancelled) {
        setSessionId(session.id);
        setSession("leadership", session.id);
        setBackendQuestions(bqs);
      }
      if (!cancelled) setInitializing(false);
    };
    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

  const frequencyScaleOptions = useMemo<LocalizedText[]>(
    () => [1, 2, 3, 4, 5].map((v) => scaleLabels[String(v)] ?? emptyLabel),
    [scaleLabels]
  );
  const frequencyLeftLabel = scaleLabels["1"] ?? emptyLabel;
  const frequencyRightLabel = scaleLabels["5"] ?? emptyLabel;

  const canProceed = stepQuestions.every((q) => answers[q.id] != null);

  const computeResult = (): LeadershipLocalResult => {
    const dimScores: Record<LeadershipDimensionKey, number> = {
      openness: 0,
      conscientiousness: 0,
      agreeableness: 0,
    };

    for (const q of questions) {
      const raw = answers[q.id];
      if (raw == null) continue;

      if (q.type === "pair") {
        const selected: PairKey = raw === 1 ? "a" : "b";
        const dimension: LeadershipDimensionKey = q.dimension;
        const contribution = q.scoring?.[selected]?.[dimension];
        if (typeof contribution === "number") dimScores[dimension] += contribution;
      } else {
        // frequency
        const dimension: LeadershipDimensionKey = q.dimension;
        let value = raw; // 1..5
        if (q.reverse_scored) value = 6 - value;
        dimScores[dimension] += value - 3; // -> [-2..+2]
      }
    }

    const oHigh = dimScores.openness > 0;
    const cHigh = dimScores.conscientiousness > 0;
    const aHigh = dimScores.agreeableness > 0;

    const key =
      oHigh && cHigh && aHigh
        ? "influencer"
        : oHigh && cHigh && !aHigh
          ? "visionary"
          : oHigh && !cHigh && !aHigh
            ? "innovator"
            : oHigh && !cHigh && aHigh
              ? "muse"
              : !oHigh && !cHigh && aHigh
                ? "cheerleader"
                : !oHigh && !cHigh && !aHigh
                  ? "action_hero"
                  : !oHigh && cHigh && aHigh
                    ? "giver"
                    : "pillar_of_strength";

    const type = LEADERSHIP_TYPES[key] ?? null;

    return {
      test_title: leadershipData.test?.title?.[locale] ?? leadershipData.test?.title?.en ?? "Leadership Style Assessment",
      test_type: "leadership",
      dimension_scores: dimScores,
      leadership_type: type
        ? {
            code: key,
            name: type.name[locale],
            tagline: type.tagline,
          }
        : null,
    };
  };

  const handlePrev = () => {
    if (step <= 1 || submitting) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!canProceed || submitting) return;
    if (step < stepTotal) setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!canProceed || submitting) return;
    setSubmitting(true);

    const finish = async () => {
      let backendResult: QuizResult | null = null;
      if (sessionId && backendQuestions.length > 0) {
        const count = Math.min(backendQuestions.length, questions.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = [];

        for (let idx = 0; idx < count; idx++) {
          const q = questions[idx];
          const bq = backendQuestions[idx];
          if (!q || !bq) continue;

          const raw = answers[q.id] ?? 3;
          if (bq.questionType === "pair") {
            const answerIdx = raw === 2 ? 1 : 0;
            const code = bq.answers?.[answerIdx]?.code;
            if (!code) continue;
            answersPayload.push({ question_id: bq.id, answer_code: code });
          } else {
            answersPayload.push({ question_id: bq.id, scale_value: raw });
          }
        }

        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body;
        }
      }
      setResult("leadership", backendResult ?? computeResult());
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
            total={stepTotal}
            title={t("tests_leadership_name") as string}
            subtitle={t("tests_leadership_subtitle")}
            stepLabel={t("step_x_of_y", { step, total: stepTotal }) as string}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stepQuestions.map((q) => {
              if (q.type === "pair") {
                const optionA = q.option_a?.[locale] ?? q.option_a?.ru ?? "";
                const optionB = q.option_b?.[locale] ?? q.option_b?.ru ?? "";
                return (
                  <OptionQuestionCard
                    key={q.id}
                    questionNumber={q.number}
                    questionText=""
                    options={[optionA, optionB]}
                    value={answers[q.id] ?? null}
                    onChange={(v) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: v,
                      }))
                    }
                  />
                );
              }

              const statement = q.statement?.[locale] ?? q.statement?.ru ?? q.statement?.en ?? "";
              return (
                <LikertWordQuestionCard
                  key={q.id}
                  value={answers[q.id] ?? null}
                  onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  title={{
                    ru: q.statement?.ru ?? q.statement?.en ?? statement,
                    kk: q.statement?.kk ?? q.statement?.ru ?? q.statement?.en ?? statement,
                    en: q.statement?.en ?? q.statement?.ru ?? statement,
                  }}
                  leftLabel={frequencyLeftLabel}
                  rightLabel={frequencyRightLabel}
                  options={frequencyScaleOptions}
                />
              );
            })}
          </Box>

          <Divider sx={{ mt: 2, mb: 3 }} />

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

            {step < stepTotal ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {t("holland_next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!canProceed || submitting}
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

