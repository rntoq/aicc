"use client";

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useTranslations } from "next-intl";
import { LoadingScreen } from "@/app/components/tests/LoadingScreen";
import { muiTheme } from "@/ui/theme/muiTheme";
import { MAX_CUSTOM_SELECT, useAiAnalysisCtaState } from "@/lib/hooks/useAiAnalysisCtaState";
 
 export type AiAnalysisCtaProps = {
   isRecommended: boolean;
  /** Disable auth prompt/redirect checks when page is already protected */
  skipAuthCheck?: boolean;
   /**
    * Optional description text key for custom mode (defaults to selection helper).
    * Recommended mode always uses `test_why_conclusion`.
    */
   customDescriptionKey?: Parameters<ReturnType<typeof useTranslations>>[0];
 };
 
export function AiAnalysisCta({ isRecommended, customDescriptionKey, skipAuthCheck = false }: AiAnalysisCtaProps) {
  const t = useTranslations();
  const {
    generatingAnalysis,
    showAnalysisLoading,
    allRequiredDone,
    recommendedDoneSessionIds,
    canGenerateFromCustom,
    completedCustomTests,
    customSelectedIds,
    customSelectedSessionIds,
    toggleCustomSelect,
    handleGenerateAnalysis,
    handleGenerateCustom,
    loadingText,
  } = useAiAnalysisCtaState({
    isRecommended,
    skipAuthCheck,
    i18n: {
      selectToastMax: t("analysis_select_toast_max"),
      authRequiredBody: t("analysis_auth_required_body"),
      generateError: t("analysis_generate_error"),
      generateSuccess: ({ reportId }) => t("analysis_generate_success", { reportId }),
      selectToastNeed4: t("analysis_select_toast_need4"),
      generateLoading: t("analysis_generate_loading"),
    },
  });
 
  if (isRecommended) {
    if (!allRequiredDone || recommendedDoneSessionIds.length === 0) return null;

    return (
      <>
        <LoadingScreen open={showAnalysisLoading} text={loadingText} />
        <Paper elevation={0} sx={styles.analysisCta}>
           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
             <Box sx={styles.analysisIcon}>
               <AutoAwesomeRoundedIcon />
             </Box>
             <Box sx={{ flex: 1, minWidth: 220 }}>
               <Typography variant="h6" sx={styles.analysisTitle}>
                 {t("analysis_generate_btn_ready")}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 {t("test_why_conclusion")}
               </Typography>
             </Box>
             <Button
               variant="contained"
               size="large"
               disabled={generatingAnalysis}
               onClick={() => void handleGenerateAnalysis(recommendedDoneSessionIds)}
               startIcon={<AutoAwesomeRoundedIcon />}
               sx={styles.analysisButton}
             >
               {t("analysis_generate_btn")}
             </Button>
           </Box>
        </Paper>
      </>
    );
  }

  if (!canGenerateFromCustom) return null;

  return (
    <>
      <LoadingScreen open={showAnalysisLoading} text={loadingText} />
      <Paper elevation={0} sx={styles.analysisCta}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
           <Box sx={styles.analysisIcon}>
             <AutoAwesomeRoundedIcon />
           </Box>
           <Box sx={{ flex: 1, minWidth: 220 }}>
             <Typography variant="h6" sx={styles.analysisTitle}>
               {t("analysis_generate_btn_ready")}
             </Typography>
             <Typography variant="body2" color="text.secondary">
               {(customDescriptionKey ? t(customDescriptionKey) : t("analysis_select_helper"))} ·{" "}
               {t("analysis_select_count", { count: customSelectedIds.length })}
             </Typography>
           </Box>
           <Button
             variant="contained"
             size="large"
             disabled={generatingAnalysis || customSelectedSessionIds.length !== MAX_CUSTOM_SELECT}
             onClick={() => {
               void handleGenerateCustom();
             }}
             startIcon={<AutoAwesomeRoundedIcon />}
             sx={styles.analysisButton}
           >
             {t("analysis_generate_btn")}
           </Button>
         </Box>
 
         <Box sx={{ mt: 2 }}>
           <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.75 }}>
             {t("analysis_select_title")}
           </Typography>
           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
             {completedCustomTests.map((ct) => {
               const selected = customSelectedIds.includes(ct.testId);
               return (
                 <Chip
                   key={ct.testId}
                   label={ct.name}
                   clickable
                   onClick={() => toggleCustomSelect(ct.testId)}
                   variant={selected ? "filled" : "outlined"}
                   color={selected ? "secondary" : "default"}
                   sx={{
                     borderRadius: 999,
                     fontWeight: 700,
                   }}
                 />
               );
             })}
           </Box>
        </Box>
      </Paper>
    </>
  );
}

const styles = {
   analysisCta: {
     mb: 3,
     p: { xs: 2, md: 2.5 },
     borderRadius: 3,
     border: "1px solid rgba(99,102,241,0.18)",
     background: "linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(145,234,228,0.14) 100%)",
   },
   analysisIcon: {
     width: 44,
     height: 44,
     borderRadius: 2,
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     bgcolor: "rgba(99,102,241,0.14)",
     color: "primary.main",
     flexShrink: 0,
   },
   analysisTitle: {
     fontWeight: 900,
     mb: 0.25,
   },
   analysisButton: {
     borderRadius: 999,
     px: 3,
     py: 1.1,
     background: muiTheme.landing.lightGradient,
     boxShadow: "0 12px 30px rgba(99,102,241,0.22)",
   },
} as const;

