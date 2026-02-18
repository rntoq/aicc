import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Box } from "@mui/material";
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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            <Box component="main" sx={{ pt: { xs: 7, sm: 8 } }}>
              {children}
            </Box>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
