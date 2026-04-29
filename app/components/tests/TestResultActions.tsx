"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export type TestResultActionsProps = {
  onRetake?: () => void;
  onClose?: () => void;
};

export function TestResultActions({ onRetake, onClose }: TestResultActionsProps) {
  const t = useTranslations();
  const router = useRouter();
  const handleClose = onClose ?? (() => router.back());

  return (
    <Box sx={styles.root}>
      <Button
        variant="outlined"
        color="primary"
        onClick={onRetake}
        disabled={!onRetake}
        sx={styles.button}
      >
        {t("test_retake")}
      </Button>
      <Button variant="contained" color="primary" onClick={handleClose} sx={styles.button}>
        {t("close")}
      </Button>
    </Box>
  );
}

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
    mt: 4,
    mb: 6,
  },
  button: {
    borderRadius: 2,
    px: 3,
    minWidth: 160,
  },
};
