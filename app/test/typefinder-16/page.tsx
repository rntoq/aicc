"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TestHeader } from "../../components/tests/TestHeader";
import { LikertWordQuestionCard } from "../../components/tests/RadioQuestionCard";
import { LoadingScreen } from "../../components/tests/LoadingScreen";
import { useDelayedFlag } from "../../components/tests/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import TypeFinderResultPanel from "./typefinderResultPanel";
import { TestResultActions } from "../../components/tests/TestResultActions";
import TYPEFINDER_DATA from "./typefinder_question.json";

const SESSION_KEY = "typefinder-16";

const QUESTIONS_PER_STEP = 15;

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

const styles = {
  root: { pt: 3, minHeight: "80vh" },
  pageHeader: { mb: 3, textAlign: "center" as const },
  pageTitle: { mb: 0.75, fontSize: "1.25rem", fontWeight: 700 },
  pageHelper: { color: "text.secondary" },
  questionsColumn: { display: "flex", flexDirection: "column" as const, gap: 2 },
  dividerBeforeQuestions: { mb: 2 },
  dividerAfterQuestions: { mt: 3, mb: 2 },
  navRow: { display: "flex", justifyContent: "space-between", gap: 2, mt: 4, mb: 6 },
  navButton: { borderRadius: 2, px: 3 },
};

export default function TypeFinder16Page() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const hydrated = useQuizSessionHydrated();
  const { setSession, setResult } = useQuizSessionStore();
  const finishedResult = useQuizSessionStore((s) => s.getSession(SESSION_KEY)?.result as QuizResult | null | undefined);
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");

  const data = TYPEFINDER_DATA as unknown as TypeFinderData;
  const questions = data.questions ?? [];

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

  const stepChunks = useMemo(() => {
    const chunks: TypeFinderQuestion[][] = [];
    let current: TypeFinderQuestion[] = [];
    let currentType: TypeFinderQuestion["type"] | null = null;

    for (const q of questions) {
      if (currentType == null) {
        currentType = q.type;
        current = [q];
        continue;
      }

      if (q.type !== currentType) {
        // flush current group into fixed-size pages
        for (let i = 0; i < current.length; i += QUESTIONS_PER_STEP) {
          chunks.push(current.slice(i, i + QUESTIONS_PER_STEP));
        }
        currentType = q.type;
        current = [q];
        continue;
      }

      current.push(q);
    }

    if (current.length > 0) {
      for (let i = 0; i < current.length; i += QUESTIONS_PER_STEP) {
        chunks.push(current.slice(i, i + QUESTIONS_PER_STEP));
      }
    }

    return chunks;
  }, [questions]);

  const stepsCount = stepChunks.length || 1;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(phase === "quiz" && (initializing || submitting));

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestions, setBackendQuestions] = useState<
    { id: number; questionType: string; answers: { code: string }[] }[]
  >([]);

  const stepQuestions = stepChunks[Math.max(0, Math.min(step - 1, stepChunks.length - 1))] ?? [];
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  const optionsHeaderTypefinder = useMemo(() => {
    const q0 = stepQuestions[0];
    if (!q0) return undefined;
    return q0.type === "pair" ? optionsPair : optionsSingle;
  }, [stepQuestions, optionsPair, optionsSingle]);

  const optionsHeaderTypefinderResult = useMemo(() => {
    const lastChunk = stepChunks[stepChunks.length - 1];
    const q0 = lastChunk?.[0];
    if (!q0) return undefined;
    return q0.type === "pair" ? optionsPair : optionsSingle;
  }, [stepChunks, optionsPair, optionsSingle]);

  useEffect(() => {
    if (!hydrated) return;

    const st = useQuizSessionStore.getState();
    if (st.isCompleted(SESSION_KEY) && st.getSession(SESSION_KEY)?.result != null) {
      setPhase("result");
      setInitializing(false);
      return;
    }

    let cancelled = false;

    const initSession = async () => {
      setInitializing(true);
      const { body: tests } = await quizServices.listTests({ type: "mbti" });
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

      if (!cancelled && bqs.length > 0) {
        setSessionId(session.id);
        setSession(SESSION_KEY, session.id);
        setBackendQuestions(bqs);
      }
      if (!cancelled) setInitializing(false);
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [hydrated, setSession]);

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
      if (sessionId && backendQuestions.length > 0) {
        const count = Math.min(backendQuestions.length, questions.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = [];

        for (let idx = 0; idx < count; idx++) {
          const q = questions[idx];
          const bq = backendQuestions[idx];
          if (!q || !bq) continue;

          const userAnswer = answers[q.id] ?? 3;
          if (bq.questionType === "pair") {
            const answerIdx = userAnswer >= 4 ? 1 : 0;
            const code = bq.answers?.[answerIdx]?.code;
            if (!code) continue;
            answersPayload.push({ question_id: bq.id, answer_code: code });
          } else {
            answersPayload.push({ question_id: bq.id, scale_value: userAnswer });
          }
        }

        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body;
        }
      }

      const placeholder: QuizResult = {
        id: Date.now(),
        test_title: data.test?.title?.[locale] ?? data.test?.title?.en ?? "TypeFinder (16 personalities)",
        test_type: "typefinder-16",
        summary: t("result_fetch_failed"),
        created_at: new Date().toISOString(),
      };

      setResult(SESSION_KEY, backendResult ?? placeholder);
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
    const result = (finishedResult ?? null) as QuizResult | null;
    return (
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={stepsCount}
            totalSteps={stepsCount}
            stepLabel={t("step_x_of_y", { step: stepsCount, total: stepsCount })}
            optionsHeader={optionsHeaderTypefinderResult}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("tests_typefinder-16_name") as string}</Box>
          </Box>
          <TypeFinderResultPanel result={result} />
          <TestResultActions />
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
            totalSteps={stepsCount}
            stepLabel={t("step_x_of_y", { step, total: stepsCount })}
            optionsHeader={optionsHeaderTypefinder}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("tests_typefinder-16_name") as string}</Box>
            <Box sx={styles.pageHelper}>
              {stepQuestions[0]?.type === "pair"
                ? t("tests_typefinder-16_helper_pair")
                : t("tests_typefinder-16_helper_single")}
            </Box>
          </Box>

          <Divider sx={styles.dividerBeforeQuestions} />

          <Box sx={styles.questionsColumn}>
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

          <Divider sx={styles.dividerAfterQuestions} />

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

            {step < stepsCount ? (
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
                {submitting ? "..." : t("finish")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

