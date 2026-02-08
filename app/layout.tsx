import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { Providers } from "./providers";
import { Header } from "@/app/components/layout";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "КарьераПро — Найди профессию, которая подходит именно тебе",
  description:
    "Пройди научно-обоснованные тесты и получи персональный карьерный анализ с помощью AI. Профориентация для школьников и студентов в Казахстане.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
