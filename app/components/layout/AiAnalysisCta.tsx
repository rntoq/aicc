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
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { analyseServices } from "@/lib/services/analyseServices";
import { LoadingScreen } from "@/app/components/tests/LoadingScreen";
import { useDelayedFlag } from "@/app/components/tests/useDelayedFlag";
import { ALL_TESTS, getRecommendedTests } from "@/utils/constants";
import { useQuizSessionStore, type QuizSessionEntry } from "@/lib/store/useQuizStore";
import { useAuth } from "@/lib/store/useAuthStore";
import { muiTheme } from "@/ui/theme/muiTheme";
 
 const EMPTY_SESSIONS: Partial<Record<string, QuizSessionEntry>> = {};
 const MAX_CUSTOM_SELECT = 4;
 
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
  const getErrorDetail = (error: unknown): string | null => {
    const maybeAxios = error as AxiosError<{ detail?: unknown }> | undefined;
    const detail = maybeAxios?.response?.data?.detail;
    return typeof detail === "string" && detail.trim() ? detail : null;
  };

  const t = useTranslations();
  const router = useRouter();
  const recommended = getRecommendedTests();
  const hydrated = useAuth((s) => s.hydrated);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const showAnalysisLoading = useDelayedFlag(generatingAnalysis, 450);
 
   const sessions = useSyncExternalStore(
     useQuizSessionStore.subscribe,
     () => useQuizSessionStore.getState().sessions,
     () => EMPTY_SESSIONS
   ) as Partial<Record<string, QuizSessionEntry>>;
 
   const testIdToSessionKey = (id: string): string => (id === "big-five" ? "bigfive" : id);
 
   const getCompletedSessionIds = (ids: string[]): number[] => {
     const out: number[] = [];
     for (const id of ids) {
       const key = testIdToSessionKey(id);
       const entry = sessions[key];
       if (entry?.completedAt != null && typeof entry.sessionId === "number" && entry.sessionId > 0) {
         out.push(entry.sessionId);
       }
     }
     return out;
   };
 
   const requiredRecommendedIds = recommended.filter((x) => x.required).map((x) => x.id);
   const allRequiredDone = requiredRecommendedIds.every((id) => sessions[testIdToSessionKey(id)]?.completedAt != null);
   const recommendedDoneSessionIds = getCompletedSessionIds(recommended.map((x) => x.id));
 
   const completedAll = Object.entries(sessions)
     .filter(([, e]) => e?.completedAt != null && typeof e.sessionId === "number" && e.sessionId > 0)
     .map(([key, e]) => ({
       key,
       sessionId: (e as QuizSessionEntry).sessionId,
       completedAt: (e as QuizSessionEntry).completedAt ?? 0,
     }));
   completedAll.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
   const canGenerateFromCustom = completedAll.length >= MAX_CUSTOM_SELECT;
 
   const completedCustomTests = completedAll
     .map((e) => {
       const testId = e.key === "bigfive" ? "big-five" : e.key;
       const test = ALL_TESTS.find((t0) => t0.id === testId);
       if (!test) return null;
       return {
         testId,
         sessionId: e.sessionId,
         completedAt: e.completedAt,
         name: (t(`tests_${testId}_name` as Parameters<typeof t>[0]) as string) || test.name,
       };
     })
     .filter((x): x is NonNullable<typeof x> => x != null);
 
   const [customSelectedIds, setCustomSelectedIds] = useState<string[]>([]);
 
   useEffect(() => {
     if (isRecommended) return;
     if (customSelectedIds.length > 0) return;
     if (completedCustomTests.length < MAX_CUSTOM_SELECT) return;
     setCustomSelectedIds(completedCustomTests.slice(0, MAX_CUSTOM_SELECT).map((x) => x.testId));
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isRecommended, completedCustomTests.length]);
 
   const customSelectedSessionIds = customSelectedIds
     .map((id) => completedCustomTests.find((x) => x.testId === id)?.sessionId)
     .filter((x): x is number => typeof x === "number" && x > 0);
 
   const toggleCustomSelect = (id: string) => {
    if (!customSelectedIds.includes(id) && customSelectedIds.length >= MAX_CUSTOM_SELECT) {
      toast.info(t("analysis_select_toast_max"));
      return;
    }
     setCustomSelectedIds((prev) => {
       if (prev.includes(id)) return prev.filter((x) => x !== id);
       if (prev.length >= MAX_CUSTOM_SELECT) {
         return prev;
       }
       return [...prev, id];
     });
   };
 
  const handleGenerateAnalysis = async (sessionIds: number[]) => {
    if (generatingAnalysis) return;
   if (!skipAuthCheck && !hydrated) return;
   if (!skipAuthCheck && !isAuthenticated) {
      toast.info(t("analysis_auth_required_body"));
      router.push("/login");
      return;
    }
    if (!sessionIds || sessionIds.length === 0) {
      toast.error(t("analysis_generate_error"));
      return;
    }
    setGeneratingAnalysis(true);
    const { body, error } = await analyseServices.createAiReport({ session_ids: sessionIds });
    if (error || !body?.report_id) {
      toast.error(getErrorDetail(error) ?? t("analysis_generate_error"));
      setGeneratingAnalysis(false);
      return;
    }
    toast.success(t("analysis_generate_success", { reportId: body.report_id }));
    setGeneratingAnalysis(false);
  };
 
  if (isRecommended) {
    if (!allRequiredDone || recommendedDoneSessionIds.length === 0) return null;

    return (
      <>
        <LoadingScreen open={showAnalysisLoading} text={t("analysis_generate_loading")} />
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
      <LoadingScreen open={showAnalysisLoading} text={t("analysis_generate_loading")} />
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
               if (customSelectedSessionIds.length !== MAX_CUSTOM_SELECT) {
                 toast.error(t("analysis_select_toast_need4"));
                 return;
               }
               void handleGenerateAnalysis(customSelectedSessionIds);
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

