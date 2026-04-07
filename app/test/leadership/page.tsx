"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { OptionQuestionCard } from "../components/OptionQuestionCard";
import LEADERSHIP_DATA from "./leadership_questions.json";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";

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
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

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

  const stepTotal = 3;
  const [step, setStep] = useState<number>(1);
  const pairQuestions = useMemo(
    () => questions.filter((q) => q.type === "pair").sort((a, b) => a.number - b.number),
    [questions]
  );
  const frequencyQuestions = useMemo(
    () => questions.filter((q) => q.type === "frequency").sort((a, b) => a.number - b.number),
    [questions]
  );

  const stepQuestions = useMemo(() => {
    if (step === 1) return pairQuestions.slice(0, 12);
    if (step === 2) return frequencyQuestions;
    return pairQuestions.slice(12, 24);
  }, [step, pairQuestions, frequencyQuestions]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const initSession = async () => {
      const { body: tests } = await quizServices.listTests({ type: "leadership" });
      const slug = tests?.[0]?.slug ?? null;
      if (!slug) return;

      const { body: session } = await quizServices.startSession({ test_slug: slug });
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) return;

      const ids = (testDetail.questions ?? []).map((q) => q.id);
      if (!cancelled) {
        setSessionId(session.id);
        setSession("leadership", session.id);
        setBackendQuestionIds(ids);
      }
    };
    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

  const frequencyOptions = useMemo(() => {
    return [1, 2, 3, 4, 5].map((v) => {
      const item = scaleLabels[String(v)];
      return item?.[locale] ?? item?.ru ?? String(v);
    });
  }, [scaleLabels, locale]);

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
      if (sessionId && backendQuestionIds.length === questions.length) {
        const orderedQuestions = [...questions].sort((a, b) => a.number - b.number);
        const answersPayload: BulkAnswerQuizPayload["answers"] = orderedQuestions.map((q, idx) => ({
          question_id: backendQuestionIds[idx],
          scale_value: answers[q.id] ?? 3,
        }));
        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body;
        }
      }
      setResult("leadership", backendResult ?? computeResult());
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
            total={stepTotal}
            title={t("tests_leadership_name") as string}
            subtitle={
              locale === "ru"
                ? "Определите, какой стиль лидерства вам ближе"
                : locale === "kk"
                  ? "Сізге қай көшбасшылық стилі жақын?"
                  : "Pick what fits you best"
            }
            stepLabel={t("step_x_of_y", { step, total: stepTotal }) as string}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stepQuestions.map((q) => {
              if (q.type === "pair") {
                const optionA = q.option_a?.[locale] ?? q.option_a?.ru ?? "";
                const optionB = q.option_b?.[locale] ?? q.option_b?.ru ?? "";
                const dimensionLabel =
                  DIMENSION_LABELS[q.dimension as LeadershipDimensionKey]?.[locale] ??
                  q.dimension ??
                  "";
                return (
                  <OptionQuestionCard
                    key={q.id}
                    questionNumber={q.number}
                    questionText={dimensionLabel}
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
                <OptionQuestionCard
                  key={q.id}
                  questionNumber={q.number}
                  questionText={statement}
                  options={frequencyOptions}
                  value={answers[q.id] ?? null}
                  onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
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
              {locale === "ru" ? "Назад" : locale === "kk" ? "Артқа" : "Back"}
            </Button>

            {step < stepTotal ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {locale === "ru" ? "Далее" : locale === "kk" ? "Келесі" : "Next"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!canProceed || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {submitting ? "..." : locale === "ru" ? "Завершить" : locale === "kk" ? "Аяқтау" : "Finish"}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

