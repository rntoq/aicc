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
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import DISC_DATA from "./disk_questions.json";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { OptionsHeader } from "../components/OptionsHeader";
import { OptionQuestionCard } from "../components/OptionQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import { Header } from "@/app/components/layout/Header";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizSession,
  QuizTest,
  QuizResult,
  StartQuizSessionVariables,
} from "@/lib/types";

type DiscLetter = "D" | "I" | "S" | "C";

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

/** DISC dimension for each pair position — verified against backend answer scales */
const PAIR_DISC_MAP: Record<string, { left: DiscLetter; right: DiscLetter }> = {
  disc_q01: { left: "I", right: "C" }, // Открытый / Скептичный
  disc_q02: { left: "I", right: "C" }, // Жизнерадостный / Методичный
  disc_q03: { left: "S", right: "D" }, // Сдержанный / Динамичный
  disc_q04: { left: "S", right: "D" }, // Скромный / Смелый
  disc_q05: { left: "S", right: "D" }, // Щедрый / Строгий  (was I/C)
  disc_q06: { left: "I", right: "C" }, // Живой / Систематичный
  disc_q07: { left: "S", right: "D" }, // Послушный / Прямолинейный
  disc_q08: { left: "S", right: "D" }, // Скромный / Бросающий вызов
  disc_q09: { left: "S", right: "D" }, // Помогающий / Решительный
  disc_q10: { left: "I", right: "C" }, // Воодушевлённый / Точный
  disc_q11: { left: "C", right: "D" }, // Уступчивый / Предприимчивый (was S/D)
  disc_q12: { left: "S", right: "D" }, // Мягкий / Прямой
  disc_q13: { left: "S", right: "D" }, // Уступчивый / Твёрдый
  disc_q14: { left: "I", right: "C" }, // Игривый / Аналитичный
  disc_q15: { left: "S", right: "I" }, // Тактичный / Выразительный
  disc_q16: { left: "S", right: "D" }, // Уравновешенный / Жёсткий
  disc_q17: { left: "S", right: "C" }, // Принимающий / Фактичный
  disc_q18: { left: "I", right: "C" }, // Оптимистичный / Перфекционист
  disc_q19: { left: "S", right: "I" }, // Тихий / Харизматичный
  disc_q20: { left: "S", right: "D" }, // Услужливый / Напористый
  disc_q21: { left: "S", right: "C" }, // Доверчивый / Вопрошающий (was I/C)
  disc_q22: { left: "I", right: "C" }, // Лёгкий на подъём / Точный
  disc_q23: { left: "C", right: "D" }, // Осторожный / Авантюрный
  disc_q24: { left: "S", right: "D" }, // Восприимчивый / Решительный
};

/** DISC dimension for each single-word item */
const SINGLE_DISC_MAP: Record<string, DiscLetter> = {
  agreeable: "S",
  daring: "D",
  sociable: "I",
  dominant: "D",
  patient: "S",
  soft_spoken: "S",
  detail_oriented: "C",
  competitive: "D",
};

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
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(initializing || submitting);
  const [pairValues, setPairValues] = useState<Record<string, number>>({});
  const [singleValues, setSingleValues] = useState<Record<string, number>>({});
  const [scenarioValues, setScenarioValues] = useState<Record<string, number>>({});

  const [sessionId, setSessionId] = useState<number | null>(null);
  // Store full question objects to access answer codes for binary pair submission
  const [backendQuestions, setBackendQuestions] = useState<
    { id: number; answers: { code: string }[] }[]
  >([]);

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

      const questions = (testDetail.questions ?? []).map((q) => ({
        id: q.id,
        answers: (q.answers ?? []).map((a) => ({ code: a.code })),
      }));

      if (!cancelled && questions.length > 0) {
        setSessionId(session.id);
        setSession("disc", session.id);
        setBackendQuestions(questions);
      }
      if (!cancelled) setInitializing(false);
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [setSession]);

  const handlePairChange = (questionId: string, value: number) => {
    setPairValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const canGoNext = () => {
    if (step <= 2)
      return PAIR_STEPS[step].every((q) => pairValues[q.id] != null);
    if (step === 3) return SINGLE_WORD_ITEMS.every((id) => singleValues[id] != null);
    if (step === 4) return SCENARIO_ITEMS.every((q) => scenarioValues[q.id] != null);
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

    const buildLocalDiscResult = (): QuizResult => {
      const rawScores: Record<DiscLetter, number> = { D: 0, I: 0, S: 0, C: 0 };

      const scenarioOptionDiscTypes: Record<string, DiscLetter[]> = {
        speak_up: ["D", "I"],
        stay_quiet: ["S", "C"],
        accuracy: ["C"],
        people: ["S"],
        take_command: ["D"],
        let_others: ["S"],
        motivation: ["I"],
        performance: ["C"],
        solo: ["C"],
        with_people: ["I"],
        analyze_flaws: ["C"],
        think_help: ["S"],
      };

      for (const q of PAIRS) {
        const rating = pairValues[q.id];
        if (rating == null) continue;
        const mapping = PAIR_DISC_MAP[q.id];
        if (!mapping) continue;
        if (rating <= 2) {
          rawScores[mapping.left] += 3 - rating; // 1→2, 2→1
        } else if (rating >= 4) {
          rawScores[mapping.right] += rating - 3; // 4→1, 5→2
        }
      }

      for (const w of SINGLE_WORDS) {
        const rating = singleValues[w.id];
        if (rating == null) continue;
        const disc = SINGLE_DISC_MAP[w.id];
        if (disc) rawScores[disc] += rating - 1; // 1..5 → 0..4
      }

      for (const s of SCENARIO_ITEMS) {
        const selected = scenarioValues[s.id];
        if (selected == null) continue;
        const option = s.options[selected - 1];
        if (!option) continue;
        const discTypes = scenarioOptionDiscTypes[option.id] ?? [];
        const pointsPerType = discTypes.length > 0 ? 2 / discTypes.length : 0;
        for (const discType of discTypes) {
          rawScores[discType] += pointsPerType;
        }
      }

      const total = Object.values(rawScores).reduce((a, b) => a + b, 0);

      const percentages: Record<DiscLetter, number> = { D: 0, I: 0, S: 0, C: 0 };
      const letters: DiscLetter[] = ["D", "I", "S", "C"];
      for (const k of letters) {
        const raw = rawScores[k];
        if (total <= 0) percentages[k] = 0;
        else percentages[k] = Math.round(((raw / total) * 1000)) / 10; // 1 decimal
      }

      const primary = letters
        .slice()
        .sort((a, b) => rawScores[b] - rawScores[a])[0] as DiscLetter;

      const codeTypes = letters
        .slice()
        .sort((a, b) => percentages[b] - percentages[a])
        .filter((k) => percentages[k] >= 20);

      const disc_code = codeTypes.join("");

      const primarySummary =
        primary === "D"
          ? t("disc_summary_D")
          : primary === "I"
            ? t("disc_summary_I")
            : primary === "S"
              ? t("disc_summary_S")
              : t("disc_summary_C");

      return {
        id: Date.now(),
        test_title: t("disc_title") as string,
        test_type: "disc",
        scores: { ...percentages },
        primary_type: primary,
        disc_code,
        disc_primary: primary,
        summary: primarySummary,
        created_at: new Date().toISOString(),
      } as QuizResult;
    };

    const finish = async () => {
      let backendResult: QuizResult | null = null;

      if (sessionId && backendQuestions.length > 0) {
        // Backend only has pair questions (24) — submit answer_code for each
        // Scale ≤3 → left answer (index 0), ≥4 → right answer (index 1)
        const count = Math.min(backendQuestions.length, PAIRS.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = PAIRS
          .slice(0, count)
          .flatMap((q, i) => {
            const bq = backendQuestions[i];
            if (!bq) return [];
            const pairVal = pairValues[q.id] ?? 3;
            const answerIdx = pairVal >= 4 ? 1 : 0;
            const code = bq.answers[answerIdx]?.code;
            if (!code) return [];
            return [{ question_id: bq.id, answer_code: code }];
          });

        if (answersPayload.length > 0) {
          const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
          if (!bulkRes.error) {
            const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
            backendResult = finishRes.body;
          }
        }
      }

      const resultToSave = backendResult ?? buildLocalDiscResult();
      setResult("disc", resultToSave);
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      router.push(`/test`);
      setSubmitting(false);
    };

    void finish();
  };

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
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
                {t("step_x_of_y", { step: step + 1, total: 5 })}
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
                {t("pairs_title")}
              </Typography>
              {PAIR_STEPS[step].map((q) => (
                <Box key={q.id} sx={styles.pairRow}>
                  <Typography sx={styles.pairLabelLeft}>
                    {q.left.text[locale as keyof typeof q.left.text] ?? q.left.text.ru}
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
                    {q.right.text[locale as keyof typeof q.right.text] ?? q.right.text.ru}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {step === 3 && (
            <Box sx={styles.section}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t("single_title")}
              </Typography>
              <OptionsHeader
                options={[
                  t("disc_single_scale_1"),
                  t("disc_single_scale_2"),
                  t("disc_single_scale_3"),
                  t("disc_single_scale_4"),
                  t("disc_single_scale_5"),
                ]}
              />
              {SINGLE_WORDS.map((w) => (
                <LikertWordQuestionCard
                  key={w.id}
                  title={w.text}
                  value={singleValues[w.id] ?? null}
                  onChange={(val) => setSingleValues((prev) => ({ ...prev, [w.id]: val }))}
                />
              ))}
            </Box>
          )}

          {step === 4 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {SCENARIO_ITEMS.map((q, index) => {
                const loc = locale as keyof typeof q.question;
                const questionText = q.question[loc] ?? q.question.ru;
                const optionLabels = q.options.map(
                  (opt) => opt.label[loc] ?? opt.label.ru
                );
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

