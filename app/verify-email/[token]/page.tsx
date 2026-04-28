"use client";

import { useEffect, useMemo, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Header } from "@/app/components/layout/Header";
import { authServices } from "@/lib/services/authServices";

type VerifyStatus = "loading" | "success" | "error";

const VerifyEmailConfirmPage = () => {
  const t = useTranslations();
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        if (!isMounted) return;
        setStatus("error");
        setErrorText(t("verify_email_confirm_empty_token"));
        return;
      }

      const { body, error } = await authServices.confirmEmailVerify({ token });

      if (!isMounted) return;
      if (error) {
        const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
        setStatus("error");
        setErrorText(typeof detail === "string" ? detail : t("verify_email_confirm_error"));
        return;
      }

      const apiDetail = (body as { detail?: unknown } | null)?.detail;
      if (typeof apiDetail === "string" && apiDetail.length > 0) {
        setErrorText(apiDetail);
      }
      setStatus("success");
    };

    void run();
    return () => {
      isMounted = false;
    };
  }, [t, token]);

  const ui = useMemo(() => {
    if (status === "success") {
      return {
        icon: <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />,
        title: t("verify_email_confirm_success_title"),
        message: errorText || t("verify_email_confirm_success"),
      };
    }
    if (status === "error") {
      return {
        icon: <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />,
        title: t("verify_email_confirm_error_title"),
        message: errorText || t("verify_email_confirm_error"),
      };
    }
    return {
      icon: <MarkEmailReadOutlinedIcon color="primary" sx={{ fontSize: 64 }} />,
      title: t("verify_email_confirm_loading_title"),
      message: t("verify_email_confirm_loading"),
    };
  }, [errorText, status, t]);

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              {ui.icon}
              <Typography variant="h5" sx={styles.title}>
                {ui.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {ui.message}
              </Typography>
              {status === "loading" && <CircularProgress size={28} sx={{ mt: 1 }} />}
              <Box sx={styles.actionsRow}>
                <Button component={Link} href="/login" variant="contained">
                  {t("login")}
                </Button>
                {status === "error" && (
                  <Button component={Link} href="/verify-email" variant="text">
                    {t("verify_email_request_submit")}
                  </Button>
                )}
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default VerifyEmailConfirmPage;

const styles = {
  root: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    py: { xs: 4, md: 6 },
  },
  paper: {
    maxWidth: 520,
    width: "100%",
    mx: "auto",
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
  },
  title: { fontWeight: 700 },
  actionsRow: {
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    gap: 1,
    flexWrap: "wrap" as const,
  },
};
