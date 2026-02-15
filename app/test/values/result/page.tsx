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
import { useValuesStore } from "@/lib/store/valuesStore";
import {
  VALUES_QUESTIONS,
  CAREER_VALUE_CATEGORIES,
  CAREER_VALUES_META,
  type CareerValueCategory,
} from "../questions";
import {
  calculateValuesResult,
  type ValuesResult,
} from "../utils/scoring";

export default function ValuesResultPage() {
  const router = useRouter();
  const { answers, reset } = useValuesStore();
  const [result, setResult] = useState<ValuesResult | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      router.push("/test/values");
      return;
    }
    const r = calculateValuesResult(answers, VALUES_QUESTIONS);
    setResult(r);
  }, [answers, router]);

  if (!result) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography>Загрузка результатов...</Typography>
      </Box>
    );
  }

  const { averageScores, ranked, top5 } = result;

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 700, mb: 1 }}>
            Ваши карьерные ценности
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Топ-5 самых важных для вас ценностей в работе.
          </Typography>
        </Box>

        {/* Top 5 cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          {top5.map((item) => {
            const meta = CAREER_VALUES_META[item.category];
            return (
              <Card
                key={item.category}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderTop: `4px solid ${meta.color}`,
                }}
              >
                <CardContent>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: 1 }}
                  >
                    Топ-{item.rank}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: "1.2rem", fontWeight: 700, mb: 0.5 }}
                  >
                    {meta.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Средний балл: {item.score.toFixed(2)} / 5
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(item.score / 5) * 100}
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
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* All values bar list */}
        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mb: 4 }}>
          <CardContent>
            <Typography
              variant="h3"
              sx={{ mb: 2, fontSize: "1.125rem", fontWeight: 600 }}
            >
              Полный профиль ценностей
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {CAREER_VALUE_CATEGORIES.map((cat: CareerValueCategory) => {
                const meta = CAREER_VALUES_META[cat];
                const score = averageScores[cat];
                return (
                  <Box key={cat}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography fontWeight={600}>{meta.name}</Typography>
                      <Typography color="text.secondary">
                        {score.toFixed(2)} / 5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(score / 5) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 999,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          bgcolor: meta.color,
                        },
                      }}
                    />
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
              router.push("/test/values");
            }}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Пройти ещё раз
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

