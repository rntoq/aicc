"use client";

import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageDropdown } from "@/app/components/layout/LanguageDropdown";
import { ProgressBar } from "@/app/components/tests/ProgressBar";
import { OptionsHeader } from "@/app/components/tests/OptionsHeader";
import { StepsHeader } from "@/app/components/tests/StepsHeader";
import type { LikertWordScaleOptions } from "@/app/components/tests/RadioQuestionCard";

export type TestHeaderProps = {
  step?: number;
  totalSteps?: number;
  stepLabel?: string;
  answered?: number;
  totalQuestions?: number;
  optionsHeader?: LikertWordScaleOptions;
};

export function TestHeader({
  step,
  totalSteps,
  stepLabel,
  answered,
  totalQuestions,
  optionsHeader,
}: TestHeaderProps) {
  const t = useTranslations();
  const router = useRouter();

  const canShowQuestionsProgress =
    typeof answered === "number" && typeof totalQuestions === "number" && totalQuestions > 0;
  const canShowStepsProgress = typeof step === "number" && typeof totalSteps === "number" && totalSteps > 0;

  const safeAnswered = canShowQuestionsProgress ? Math.min(Math.max(answered, 0), totalQuestions) : 0;
  const progressPct = canShowQuestionsProgress ? Math.round((safeAnswered / totalQuestions) * 100) : 0;

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={styles.appBar}>
        <Container maxWidth="md" sx={styles.containerCenter}>
          <Box sx={styles.panel}>
            <Toolbar disableGutters sx={styles.toolbar}>
              <Box sx={styles.topRow}>
                <Button
                  variant="text"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => router.back()}
                  sx={styles.backButton}
                >
                  {t("backToTests")}
                </Button>
                <LanguageDropdown />
              </Box>

              {canShowQuestionsProgress ? (
                <Box>
                  <ProgressBar progress={progressPct} current={safeAnswered} total={totalQuestions} />
                </Box>
              ) : canShowStepsProgress ? (
                <Box>
                  <StepsHeader step={step} total={totalSteps} stepLabel={stepLabel} />
                </Box>
              ) : null}

              {optionsHeader && optionsHeader.length > 0 ? (
                <Box sx={styles.optionsWrap}>
                  <OptionsHeader options={optionsHeader} />
                </Box>
              ) : null}
            </Toolbar>
          </Box>
        </Container>
      </AppBar>

      <Toolbar sx={styles.spacerToolbar} />
      <Box sx={styles.belowSpacer} />
    </>
  );
}

const styles = {
  appBar: {
    bgcolor: "transparent",
    boxShadow: "none",
    border: "none",
    py: { xs: 0.75, md: 1 },
  },
  containerCenter: {
    display: "flex",
    justifyContent: "center",
  },
  panel: {
    width: "100%",
    maxWidth: 900,
    borderRadius: 1,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    overflow: "hidden",
  },
  toolbar: {
    flexDirection: "column",
    alignItems: "stretch",
    px: { xs: 1, md: 1.5 },
    py: { xs: 0.75, md: 1 },
    minHeight: "unset",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 0.5,
  },
  backButton: {
    borderRadius: 2,
    px: 1,
    py: 0.5,
    minHeight: 32,
    whiteSpace: "nowrap",
  },
  optionsWrap: { mt: 0.25 },
  spacerToolbar: { py: { xs: 4, md: 7 } },
  belowSpacer: { mb: { xs: 7, md: 5 } },
};
