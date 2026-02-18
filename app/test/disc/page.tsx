"use client";

import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDiscStore } from "@/lib/store/discStore";
import { DISC_QUESTIONS } from "./questions";
import { calculateDiscResult } from "./utils/scoring";
import { useTestsStore } from "@/lib/store/testsStore";

const PAIR_STEPS = [
  DISC_QUESTIONS.slice(0, 8),
  DISC_QUESTIONS.slice(8, 16),
  DISC_QUESTIONS.slice(16, 24),
];

const SINGLE_WORD_ITEMS = [
  "Agreeable",
  "Daring",
  "Sociable",
  "Dominant",
  "Patient",
  "Soft‑Spoken",
  "Detail‑Oriented",
  "Competitive",
];

const SCENARIO_ITEMS = [
  {
    id: "group_role",
    question: "В группе я…",
    options: [
      { id: "speak_up", label: "Чаще высказываюсь и беру слово" },
      { id: "stay_quiet", label: "Скорее молчу и слушаю других" },
    ],
  },
  {
    id: "team_focus",
    question: "В командном проекте я больше всего забочусь о…",
    options: [
      { id: "accuracy", label: "Точности и эффективности выполнения задач" },
      { id: "people", label: "Том, чтобы людям было комфортно и они были вовлечены" },
    ],
  },
  {
    id: "decision_style",
    question: "Мне комфортнее…",
    options: [
      { id: "take_command", label: "Брать на себя решение" },
      { id: "let_others", label: "Давать другим принимать финальное решение" },
    ],
  },
  {
    id: "feedback_focus",
    question: "Когда даю обратную связь, я больше фокусируюсь на…",
    options: [
      { id: "motivation", label: "Мотивации и признании человека" },
      { id: "accuracy", label: "Точной и фактической оценке результата" },
    ],
  },
  {
    id: "work_pref",
    question: "Меня больше привлекает…",
    options: [
      { id: "solo", label: "Работа, которую можно делать самостоятельно" },
      { id: "with_people", label: "Работа с большим количеством взаимодействия с людьми" },
    ],
  },
  {
    id: "plan_reaction",
    question: "Когда кто‑то предлагает план, я скорее…",
    options: [
      { id: "analyze_flaws", label: "Анализирую и указываю на слабые места плана" },
      { id: "think_help", label: "Думаю, чем могу помочь, чтобы план реализовался" },
    ],
  },
];

const SURVEY_QUESTIONS = [
  {
    id: "team_size",
    label: "Сколькими людьми вы управляете или руководите на работе (прямые и косвенные отчёты)?",
  },
  { id: "decision_power", label: "Насколько у вас много полномочий в принятии решений на работе?" },
  { id: "age", label: "Ваш возраст" },
  { id: "gender", label: "Ваш гендер" },
];

const cardStyle = {
  p: 2,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

const DiscPage = () => {
  const router = useRouter();
  const { answers, setAnswer, startTest, getProgress } = useDiscStore();
  const { setCompleted } = useTestsStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pairValues, setPairValues] = useState<Record<string, number>>({});
  const [singleValues, setSingleValues] = useState<Record<string, number>>({});
  const [scenarioValues, setScenarioValues] = useState<Record<string, string>>({});
  const [surveyValues, setSurveyValues] = useState<Record<string, string>>({});

  useEffect(() => {
    startTest();
  }, [startTest]);

  const handlePairChange = (questionId: string, value: number) => {
    const question = DISC_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    setPairValues((prev) => ({ ...prev, [questionId]: value }));

    const [left, right] = question.statements;
    const most = value <= 2 ? left.id : value >= 4 ? right.id : left.id;
    const least = value <= 2 ? right.id : value >= 4 ? left.id : left.id;

    setAnswer(questionId, most, least);
  };

  const canGoNext = () => {
    if (step <= 2) return PAIR_STEPS[step].every((q) => pairValues[q.id] != null);
    if (step === 3) return SINGLE_WORD_ITEMS.every((id) => singleValues[id] != null);
    if (step === 4) return SCENARIO_ITEMS.every((q) => scenarioValues[q.id]);
    return true;
  };

  const handleNext = () => {
    if (!canGoNext() || submitting) return;
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const allAnsweredPairs = Object.values(answers).filter((a) => a.most && a.least).length === DISC_QUESTIONS.length;
    if (!allAnsweredPairs) return;

    setSubmitting(true);
    const result = calculateDiscResult(answers, DISC_QUESTIONS);
    setCompleted("disc-assessment");
    router.push(`/test/disc/result?type=${result.profile.dominant}`);
  };

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Шаг {step + 1} из 6
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 0.75 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 999,
                  bgcolor: i <= step ? "primary.main" : "grey.300",
                  opacity: i <= step ? 1 : 0.6,
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Прогресс базового DISC: {getProgress(DISC_QUESTIONS.length)}%
          </Typography>
        </Box>

        {step <= 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              В каждой паре отметьте, какое слово лучше описывает вас.
            </Typography>
            {PAIR_STEPS[step].map((q) => (
              <Box
                key={q.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                  alignItems: "center",
                  gap: { xs: 1.5, md: 2 },
                  p: 2,
                }}
              >
                <Typography sx={{ fontWeight: 500, textAlign: { xs: "center", md: "right" } }}>
                  {q.statements[0].text}
                </Typography>
                <RadioGroup
                  row
                  sx={{ justifyContent: "center", gap: { xs: 0.5, md: 1 } }}
                  value={pairValues[q.id]?.toString() ?? ""}
                  onChange={(e) => handlePairChange(q.id, Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((v) => (
                    <FormControlLabel
                      key={v}
                      value={v.toString()}
                      control={<Radio size="small" />}
                      label=""
                      sx={{ m: 0 }}
                    />
                  ))}
                </RadioGroup>
                <Typography sx={{ fontWeight: 500, textAlign: { xs: "center", md: "left" } }}>
                  {q.statements[1].text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Оцените, насколько каждое слово похоже на вас.
            </Typography>
            {SINGLE_WORD_ITEMS.map((word) => (
              <Box
                key={word}
              >
                <Typography sx={{fontWeight: 600, fontSize: "1rem", textAlign: "center" }}>{word}</Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    p: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: "1rem", textAlign: "right" }}>Не про меня</Typography>
                  <RadioGroup
                    row
                    sx={{ justifyContent: "center", gap: { xs: 0.5, md: 1 } }}
                    value={singleValues[word]?.toString() ?? ""}
                    onChange={(e) => setSingleValues((prev) => ({ ...prev, [word]: Number(e.target.value) }))}
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <FormControlLabel
                        key={v}
                        value={v.toString()}
                        control={<Radio size="small" />}
                        label=""
                        sx={{ m: 0, flex: 1, justifyContent: "center" }}
                      />
                    ))}
                  </RadioGroup>
                  <Typography sx={{ fontWeight: 600, fontSize: "1rem", textAlign: "left" }}>Про меня</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {step === 4 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {SCENARIO_ITEMS.map((q) => (
              <Box key={q.id} sx={cardStyle}>
                <Typography sx={{ mb: 1, fontWeight: 500 }}>{q.question}</Typography>
                <RadioGroup
                  value={scenarioValues[q.id] ?? ""}
                  onChange={(e) => setScenarioValues((prev) => ({ ...prev, [q.id]: e.target.value }))}
                >
                  {q.options.map((opt) => (
                    <FormControlLabel
                      key={opt.id}
                      value={opt.id}
                      control={<Radio size="small" />}
                      label={opt.label}
                    />
                  ))}
                </RadioGroup>
              </Box>
            ))}
          </Box>
        )}

        {step === 5 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="subtitle1">
              Дополнительный опрос (опционально). Ответы не влияют на результат теста.
            </Typography>
            {SURVEY_QUESTIONS.map((q) => (
              <TextField
                key={q.id}
                select
                fullWidth
                label={q.label}
                value={surveyValues[q.id] ?? ""}
                onChange={(e) => setSurveyValues((prev) => ({ ...prev, [q.id]: e.target.value }))}
              >
                <MenuItem value="">Нет ответа</MenuItem>
                <MenuItem value="low">Низко</MenuItem>
                <MenuItem value="medium">Средне</MenuItem>
                <MenuItem value="high">Высоко</MenuItem>
              </TextField>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => setStep((prev) => prev - 1)}
            disabled={step === 0}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            endIcon={step === 5 ? null : <ArrowForwardOutlinedIcon />}
            onClick={handleNext}
            disabled={!canGoNext() || submitting}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {step === 5 ? "Завершить" : "Далее"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DiscPage;

