"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { api } from "@/lib/api/api";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import TYPEFINDER_DATA from "./../typefinder/typefinder_question.json";

const QUESTIONS_PER_STEP = 15;

const parseIdNumber = (id: string): number => {
  const m = String(id).match(/\d+/);
  return m ? Number(m[0]) : 0;
};

type Locale = "ru" | "kk" | "en";

type TypeFinderQuestionPair = {
  id: string;
  type: "pair";
  left: { text: LocalizedText };
  right: { text: LocalizedText };
};

type TypeFinderQuestionSingle = {
  id: string;
  type: "single";
  text: LocalizedText;
};

type TypeFinderQuestion = TypeFinderQuestionPair | TypeFinderQuestionSingle;

type TypeFinderData = {
  test?: {
    title?: LocalizedText;
  };
  questions?: TypeFinderQuestion[];
  scales?: {
    pair?: { meaning?: Record<string, LocalizedText | null> };
    single?: { labels?: Record<string, LocalizedText | null> };
  };
};

export default function TypeFinder16Page() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();

  const data = TYPEFINDER_DATA as unknown as TypeFinderData;
  const questions = data.questions ?? [];

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => parseIdNumber(a.id) - parseIdNumber(b.id));
  }, [questions]);

  const pairMeaning: Record<string, LocalizedText | null> = data.scales?.pair?.meaning ?? {};
  const singleLabels: Record<string, LocalizedText | null> = data.scales?.single?.labels ?? {};

  const optionsPair = useMemo<LocalizedText[]>(() => {
    return [1, 2, 3, 4, 5]
      .map((n) => pairMeaning[String(n)] ?? null)
      .filter((v): v is LocalizedText => v != null);
  }, [pairMeaning]);

  const optionsSingle = useMemo<LocalizedText[]>(() => {
    return [1, 2, 3, 4, 5]
      .map((n) => singleLabels[String(n)] ?? null)
      .filter((v): v is LocalizedText => v != null);
  }, [singleLabels]);

  const leftTitleEmpty: LocalizedText = { ru: "", kk: "", en: "" };

  const stepsCount = Math.ceil(sortedQuestions.length / QUESTIONS_PER_STEP);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestions, setBackendQuestions] = useState<
    { id: number; questionType: string; answers: { code: string }[] }[]
  >([]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = sortedQuestions.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        const { data: tests } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
          params: { type: "mbti" },
        });
        const slug = tests[0]?.slug;
        if (!slug) return;

        const { data: session } = await api.post<QuizSession, StartQuizSessionVariables>(
          "/api/v1/quizzes/sessions/start/",
          { test_slug: slug }
        );

        const { data: testDetail } = await api.get<{
          questions: { id: number; question_type: string; answers: { code: string }[] }[];
        }>(`/api/v1/quizzes/tests/${slug}/`);

        const bqs = (testDetail.questions ?? []).map((q) => ({
          id: q.id,
          questionType: q.question_type,
          answers: (q.answers ?? []).map((a) => ({ code: a.code })),
        }));

        if (!cancelled && bqs.length > 0) {
          setSessionId(session.id);
          setSession("typefinder-16", session.id);
          setBackendQuestions(bqs);
        }
      } catch {
        // Backend unavailable — still allow placeholder completion.
      }
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [setSession]);

  const handlePrev = () => {
    if (step <= 1 || submitting) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!allStepAnswered || submitting) return;
    if (step < stepsCount) setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!allStepAnswered || submitting) return;
    setSubmitting(true);

    const finish = async () => {
      let backendResult: QuizResult | null = null;
      try {
        if (sessionId && backendQuestions.length > 0) {
          const count = Math.min(backendQuestions.length, sortedQuestions.length);
          const answersPayload: BulkAnswerQuizPayload["answers"] = sortedQuestions
            .slice(0, count)
            .flatMap((q, idx) => {
              const bq = backendQuestions[idx];
              if (!bq) return [];
              const userAnswer = answers[q.id] ?? 3;
              if (bq.questionType === "pair") {
                // Convert 1-5 scale to binary: ≤3 = left, ≥4 = right
                return [{ question_id: bq.id, answer_code: userAnswer >= 4 ? "right" : "left" }];
              }
              return [{ question_id: bq.id, scale_value: userAnswer }];
            });

          await api.post<unknown, BulkAnswerQuizPayload>("/api/v1/quizzes/sessions/bulk-answer/", {
            session_id: sessionId,
            answers: answersPayload,
          });

          const { data } = await api.post<QuizResult, FinishQuizSessionVariables>(
            "/api/v1/quizzes/sessions/finish/",
            { session_id: sessionId }
          );

          backendResult = data;
        }
      } catch {
        backendResult = null;
      } finally {
        const placeholderTitle =
          locale === "ru"
            ? data.test?.title?.ru ?? "TypeFinder (16 personalities)"
            : locale === "kk"
              ? data.test?.title?.kk ?? "TypeFinder (16 personalities)"
              : data.test?.title?.en ?? "TypeFinder (16 personalities)";

        const placeholder: QuizResult = {
          id: Date.now(),
          test_title: placeholderTitle,
          test_type: "typefinder-16",
          summary:
            locale === "ru"
              ? "Результат не удалось получить с сервера. Проверьте доступность backend и повторите позже."
              : locale === "kk"
                ? "Серверден нәтижені алу мүмкін болмады. Backend қолжетімділігін тексеріп, кейінірек қайталаңыз."
                : "Could not fetch the result from the server. Please check backend availability and try again later.",
          created_at: new Date().toISOString(),
        };

        setResult("typefinder-16", backendResult ?? placeholder);
        router.push("/test");
        setSubmitting(false);
      }
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
            total={stepsCount}
            title={t("tests_typefinder-16_name") as string}
            subtitle={locale === "ru" ? "Ответьте, насколько каждое утверждение похоже на вас" : undefined}
            stepLabel={t("step_x_of_y", { step, total: stepsCount })}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stepQuestions.map((q) => {
              if (q.type === "pair") {
                const leftText = q.left.text;
                const rightText = q.right.text;
                return (
                  <LikertWordQuestionCard
                    key={q.id}
                    title={leftTitleEmpty}
                    value={answers[q.id] ?? null}
                    onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                    leftLabel={leftText}
                    rightLabel={rightText}
                    options={optionsPair}
                  />
                );
              }

              const title = q.text;
              const leftLabel = singleLabels["1"] ?? leftTitleEmpty;
              const rightLabel = singleLabels["5"] ?? leftTitleEmpty;
              return (
                <LikertWordQuestionCard
                  key={q.id}
                  title={title}
                  value={answers[q.id] ?? null}
                  onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  leftLabel={leftLabel}
                  rightLabel={rightLabel}
                  options={optionsSingle}
                />
              );
            })}
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
              {locale === "ru" ? "Назад" : locale === "kk" ? "Артқа" : "Back"}
            </Button>

            {step < stepsCount ? (
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
                {submitting ? "..." : locale === "ru" ? "Завершить" : locale === "kk" ? "Аяқтау" : "Finish"}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

