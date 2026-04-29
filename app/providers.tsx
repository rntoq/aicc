"use client";

import { useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { NextIntlClientProvider, createTranslator } from "next-intl";
import { ToastContainer, toast } from "react-toastify";
import { muiTheme } from "@/ui/theme/muiTheme";
import { LocaleProvider, useLocale, type Locale } from "@/app/context/LocaleContext";
import type { User } from "@/lib/types";
import { useAuth } from "@/lib/store/useAuthStore";
import ru from "@/messages/ru.json";
import kk from "@/messages/kk.json";
import en from "@/messages/en.json";
import "react-toastify/dist/ReactToastify.css";

const messages: Record<string, Record<string, unknown>> = { ru, kk, en };

function IntlProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const msgs = messages[locale] ?? ru;
  return (
    <NextIntlClientProvider locale={locale} messages={msgs} timeZone="Asia/Almaty">
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * TanStack Query must wrap routes that use useQuery, but must sit *above*
 * NextIntlClientProvider — otherwise this hook’s useTranslations() ran without
 * intl context and broke all child useTranslations() (e.g. /client dashboard).
 * createTranslator + LocaleContext does not require NextIntlClientProvider.
 */
function QueryProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const t = useMemo(
    () =>
      createTranslator({
        locale,
        messages: messages[locale] ?? ru,
      }) as (key: string) => string,
    [locale]
  );

  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          // Do not toast for GET/queries to avoid noisy UX.
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          toast.error(t("error_action"));
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  }, [t]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function AuthBootstrap({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const { bootstrap, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) {
      bootstrap(initialUser);
    }
  }, [bootstrap, hydrated, initialUser]);

  return <>{children}</>;
}

export const Providers = ({
  children,
  initialLocale,
  initialUser,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialUser: User | null;
}) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <LocaleProvider initialLocale={initialLocale}>
        <QueryProvider>
          <IntlProvider>
            <AuthBootstrap initialUser={initialUser}>
              {children}
            </AuthBootstrap>
            <ToastContainer position="top-right" />
          </IntlProvider>
        </QueryProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};
