"use client";

import { Box, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type StrengthsResultPanelProps = {
  result: QuizResult | null;
  loading?: boolean;
};

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export default function StrengthsResultPanel({ result, loading = false }: StrengthsResultPanelProps) {
  const t = useTranslations();

  if (loading) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!result) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Typography variant="body2" color="text.secondary">
          Strengths
        </Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const testTitle = typeof r["test_title"] === "string" ? r["test_title"] : "Personal Strengths";
  const topRaw = r["top_5_strengths"] ?? r["top5_strengths"];
  const top: Array<Record<string, unknown>> = Array.isArray(topRaw) ? topRaw : [];
  const summary =
    typeof r["summary"] === "string"
      ? r["summary"]
      : typeof r["detailed_report"] === "string"
        ? r["detailed_report"]
        : null;

  return (
    <Paper elevation={0} sx={paperSx}>
      <Typography component="span" variant="h6" sx={{ fontWeight: 900, display: "block", mb: 1 }}>
        {testTitle}
      </Typography>
      {r["primary_type"] ? (
        <Box sx={{ mb: 2 }}>
          <Chip label={String(r["primary_type"])} size="small" color="primary" sx={{ fontWeight: 900 }} />
        </Box>
      ) : null}

      {top.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {top.map((item, idx) => {
            const rankRaw = item["rank"];
            const rank = typeof rankRaw === "number" ? rankRaw : idx + 1;
            const nameRaw = item["name"] ?? item["strength_name"] ?? item["strength"] ?? "";
            const name = typeof nameRaw === "string" ? nameRaw : "";
            const scoreRaw = item["score"] ?? item["percentage"];
            const score =
              typeof scoreRaw === "number" || typeof scoreRaw === "string" ? scoreRaw : null;
            return (
              <Box key={`${rank}-${name}-${idx}`}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    #{rank} {name}
                  </Typography>
                  {score != null ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                      {typeof score === "number" ? `${Math.round(score)}%` : String(score)}
                    </Typography>
                  ) : null}
                </Box>
                {typeof item["description"] === "string" ? (
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                    {item["description"]}
                  </Typography>
                ) : null}
              </Box>
            );
          })}
        </Box>
      ) : summary ? (
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
          {summary}
        </Typography>
      ) : (
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
            {t("common_resultRaw")}
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              bgcolor: "grey.100",
              borderRadius: 2,
              p: 2,
            }}
          >
            {JSON.stringify(r, null, 2)}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
