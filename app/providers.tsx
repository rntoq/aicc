"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import { muiTheme } from "@/ui/theme/muiTheme";
import { LocaleProvider, useLocale, type Locale } from "@/app/context/LocaleContext";
import type { User } from "@/lib/types";
import { useAuth } from "@/lib/hooks/useAuth";
import ru from "@/messages/ru.json";
import kk from "@/messages/kk.json";
import en from "@/messages/en.json";
import "react-toastify/dist/ReactToastify.css";

const messages: Record<string, Record<string, unknown>> = { ru, kk, en };

function IntlProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return (
    <NextIntlClientProvider
      key={locale}
      locale={locale}
      messages={messages[locale] ?? ru}
      timeZone="Asia/Almaty"
    >
      {children}
    </NextIntlClientProvider>
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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <LocaleProvider initialLocale={initialLocale}>
          <IntlProvider>
            <AuthBootstrap initialUser={initialUser}>
              {children}
            </AuthBootstrap>
            <ToastContainer position="top-right" />
          </IntlProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
