"use client";

import { Box, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type TypeFinderResultPanelProps = {
  result: QuizResult | null;
  loading?: boolean;
};

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export default function TypeFinderResultPanel({ result, loading = false }: TypeFinderResultPanelProps) {
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
          TypeFinder (16 personalities)
        </Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const title = typeof r["test_title"] === "string" ? r["test_title"] : "TypeFinder (16 personalities)";
  const primary = r["primary_type"] != null ? String(r["primary_type"]) : "";

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {primary ? <Chip label={primary} color="primary" size="small" sx={{ fontWeight: 800 }} /> : null}
      </Box>
      {typeof r["summary"] === "string" && r["summary"] ? (
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", mb: 2 }}>
          {r["summary"]}
        </Typography>
      ) : null}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
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
          maxHeight: 360,
          overflow: "auto",
        }}
      >
        {JSON.stringify(r, null, 2)}
      </Box>
    </Paper>
  );
}
