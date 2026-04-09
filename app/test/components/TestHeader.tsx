"use client";

import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/navigation";
import { LanguageDropdown } from "@/app/components/layout/LanguageDropdown";
import { ProgressBar } from "@/app/test/components/ProgressBar";
import { OptionsHeader } from "@/app/test/components/OptionsHeader";
import { StepsHeader } from "@/app/test/components/StepsHeader";

export type TestHeaderProps = {
  /** For step-based flows: current step (1-based) */
  step?: number;
  /** For step-based flows: total steps */
  totalSteps?: number;
  /** Optional label shown for step-based progress (already localized) */
  stepLabel?: string;
  /** For question-based flows: answered count */
  answered?: number;
  /** For question-based flows: total questions */
  totalQuestions?: number;
  /** Optional helper title above scale/options, already localized */
  helperTitle?: string;
  /** Optional scale labels row */
  optionsHeader?: string[];
  /** Back target (defaults to /test) */
  backHref?: string;
};

export function TestHeader({
  step,
  totalSteps,
  stepLabel,
  answered,
  totalQuestions,
  helperTitle,
  optionsHeader,
  backHref = "/test",
}: TestHeaderProps) {
  const router = useRouter();

  const canShowQuestionsProgress =
    typeof answered === "number" && typeof totalQuestions === "number" && totalQuestions > 0;
  const canShowStepsProgress = typeof step === "number" && typeof totalSteps === "number" && totalSteps > 0;

  const safeAnswered = canShowQuestionsProgress ? Math.min(Math.max(answered, 0), totalQuestions) : 0;
  const progressPct = canShowQuestionsProgress ? Math.round((safeAnswered / totalQuestions) * 100) : 0;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          border: "none",
          py: { xs: 0.75, md: 1 },
        }}
      >
        <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                px: { xs: 1, md: 1.5 },
                py: { xs: 0.75, md: 1 },
                minHeight: "unset",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
                <Button
                  variant="text"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => router.push(backHref)}
                  sx={{ borderRadius: 2, px: 1, py: 0.5, minHeight: 32, whiteSpace: "nowrap" }}
                >
                  К тестам
                </Button>
                <LanguageDropdown />
              </Box>

              {canShowQuestionsProgress ? (
                <Box >
                  <ProgressBar progress={progressPct} current={safeAnswered} total={totalQuestions} />
                </Box>
              ) : canShowStepsProgress ? (
                <Box >
                  <StepsHeader step={step} total={totalSteps} stepLabel={stepLabel} />
                </Box>
              ) : null}

              {helperTitle ? (
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: canShowQuestionsProgress || canShowStepsProgress ? 0 : 1,
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  {helperTitle}
                </Typography>
              ) : null}

              {optionsHeader && optionsHeader.length > 0 ? (
                <Box sx={{ mt: 0.25 }}>
                  <OptionsHeader options={optionsHeader} />
                </Box>
              ) : null}
            </Toolbar>
          </Box>
        </Container>
      </AppBar>

      {/* Spacer so content starts below the fixed AppBar */}
      <Toolbar sx={{ py: { xs: 0.75, md: 1 } }} />

      {/* Local spacing below header block */}
      <Box sx={{ mb: { xs: 7, md: 5 } }} />
    </>
  );
}

