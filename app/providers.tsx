"use client";

import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import { muiTheme } from "@/ui/theme/muiTheme";
import { GlobalStyles } from "@/ui/styles/global";
import { LocaleProvider, useLocale } from "@/app/context/LocaleContext";
import ru from "@/messages/ru.json";
import kk from "@/messages/kk.json";
import "react-toastify/dist/ReactToastify.css";

const messages: Record<string, Record<string, unknown>> = { ru, kk };

function IntlProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return (
    <NextIntlClientProvider
      key={locale}
      locale={locale}
      messages={messages[locale] ?? ru}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
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
        <LocaleProvider>
          <IntlProvider>
            <GlobalStyles />
            {children}
            <ToastContainer position="top-right" />
          </IntlProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
