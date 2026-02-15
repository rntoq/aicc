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
import { useDiscStore } from "@/lib/store/discStore";
import { DISC_QUESTIONS, DiscType } from "../questions";
import {
  calculateDiscResult,
  type DiscResult,
} from "../utils/scoring";

const DISC_COLORS: Record<DiscType, string> = {
  D: "#E74C3C",
  I: "#F39C12",
  S: "#27AE60",
  C: "#3498DB",
};

export default function DiscResultPage() {
  const router = useRouter();
  const { answers, reset } = useDiscStore();
  const [result, setResult] = useState<DiscResult | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      router.push("/test/disc");
      return;
    }
    const r = calculateDiscResult(answers, DISC_QUESTIONS);
    setResult(r);
  }, [answers, router]);

  if (!result) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography>Загрузка результатов...</Typography>
      </Box>
    );
  }

  const { normalizedScores, profile } = result;
  const order: DiscType[] = ["D", "I", "S", "C"];

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 }, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 700, mb: 1 }}>
            Ваш DiSC профиль
          </Typography>
          <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: 500 }}>
            Доминирующий тип: {profile.dominant}
            {profile.secondary ? `, вторичный: ${profile.secondary}` : ""}
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mb: 4 }}>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 2, fontSize: "1.125rem", fontWeight: 600 }}>
              Баллы по типам
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {order.map((type) => (
                <Box key={type}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography fontWeight={600}>{type}</Typography>
                    <Typography color="text.secondary">
                      {normalizedScores[type].toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={normalizedScores[type]}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        bgcolor: DISC_COLORS[type],
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
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
              router.push("/test/disc");
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

