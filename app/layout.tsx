import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Box } from "@mui/material";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { Providers } from "./providers";
import { isValidLocale } from "@/lib/locale";
import { initLogin } from "@/lib/initLogin";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CareerMap — Найди профессию, которая подходит именно тебе",
  description:
    "Пройди научно-обоснованные тесты и получи персональный карьерный анализ с помощью AI. Профориентация для школьников и студентов в Казахстане.",
};

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
            <Box component="main">
              {children}
            </Box>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
