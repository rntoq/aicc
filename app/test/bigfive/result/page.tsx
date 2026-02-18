"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBigFiveStore } from "@/lib/store/bigFiveStore";
import { BIG_FIVE_QUESTIONS, BIG_FIVE_TRAITS, type BigFiveTrait } from "../questions";
import { calculateBigFiveResult, type BigFiveResult } from "../utils/scoring";

const BigFiveResultPage = () => {
  const router = useRouter();
  const { hydrated, hydrate, answers, reset } = useBigFiveStore();
  const [result, setResult] = useState<BigFiveResult | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (Object.keys(answers).length === 0) {
      router.push("/test/bigfive");
      return;
    }
    const r = calculateBigFiveResult(answers, BIG_FIVE_QUESTIONS);
    setResult(r);
  }, [answers, hydrated, router]);

  if (!hydrated || !result) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography>Загрузка результатов...</Typography>
      </Box>
    );
  }

  const traitsOrder: BigFiveTrait[] = [
    "OPENNESS",
    "CONSCIENTIOUSNESS",
    "EXTRAVERSION",
    "AGREEABLENESS",
    "NEUROTICISM",
  ];

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 700, mb: 1 }}>
            Ваш профиль Big Five (OCEAN)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Пять базовых черт личности в диапазоне от 0 до 100.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mb: 4 }}>
          <CardContent>
            <Typography
              variant="h3"
              sx={{ mb: 2, fontSize: "1.125rem", fontWeight: 600 }}
            >
              Баллы по чертам OCEAN
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {traitsOrder.map((trait) => {
                const meta = BIG_FIVE_TRAITS[trait];
                const score = result.normalized[trait];
                return (
                  <Box key={trait}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography fontWeight={600}>
                        {meta.code} — {meta.name}
                      </Typography>
                      <Typography color="text.secondary">
                        {score.toFixed(1)} / 100
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          bgcolor: meta.color,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      Высокий уровень: {meta.highMeans}. Низкий уровень: {meta.lowMeans}.
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/test")}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Вернуться к тестам
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              reset();
              router.push("/test/bigfive");
            }}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Пройти ещё раз
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BigFiveResultPage;

