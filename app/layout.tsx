import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Box } from "@mui/material";
import "./globals.css";
import { Providers } from "./providers";
import { StyledComponentsRegistry } from "./StyledComponentsRegistry";
import { isValidLocale } from "@/utils/locale";
import { apiServer } from "@/lib/api/apiServer";
import type { RefreshResponse, User } from "@/lib/types";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CareerMap — Найди профессию, которая подходит именно тебе",
  description:
    "Пройди научно-обоснованные тесты и получи персональный карьерный анализ с помощью AI. Профориентация для школьников и студентов в Казахстане.",
  icons: {
    icon: "/icons/logo.ico",
    shortcut: "/icons/logo.ico",
  },
};

async function initLogin(): Promise<{ initialUser: User | null }> {
  const { body, error } = await apiServer.get<User>("/api/v1/auth/me/");

  if (!error && body) {
    return { initialUser: body };
  }

  // Access token expired or missing — try a silent refresh server-side
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh")?.value;
  if (!refreshToken) return { initialUser: null };

  try {
    const { body: refreshBody, error: refreshError } = await apiServer.post<RefreshResponse, { refresh: string }>(
      "/api/v1/auth/refresh/",
      { refresh: refreshToken }
    );
    if (refreshError || !refreshBody?.access) return { initialUser: null };

    const newAccess = refreshBody.access;
    const { body: meBody, error: meError } = await apiServer.get<User>("/api/v1/auth/me/", {
      headers: { Authorization: `Bearer ${newAccess}` },
    });
    if (meError || !meBody) return { initialUser: null };

    return { initialUser: meBody };
  } catch {
    return { initialUser: null };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("kariera-pro-locale")?.value;
  const initialLocale = (localeCookie && isValidLocale(localeCookie)) ? localeCookie : "ru";
  const { initialUser } = await initLogin();

  return (
    <html lang={initialLocale} className={inter.variable} translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers initialLocale={initialLocale} initialUser={initialUser}>
            <Box component="main">{children}</Box>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
