import { createTheme } from "@mui/material/styles";

// CareerMap: палитра #7f7fd5, #86a8e7, #91eae4
const primary = "#7f7fd5";
const primaryLight = "#86a8e7";
const secondary = "#91eae4";
const background = "#F8FAFC";
const paper = "#FFFFFF";
const textPrimary = "#182453";
const textSecondary = "#64748B";
const titleKeywordGradient =
  "linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)";
  const lightGradient =
  "linear-gradient(45deg, #86a8e7 0%, #91eae4 100%)";
const surfaceShadow = "0 4px 12px rgba(15, 23, 42, 0.08)";
const surfaceHoverShadow = "0 8px 24px rgba(15, 23, 42, 0.1)";

export const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primary,
      light: primaryLight,
      dark: "#182453",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: secondary,
      light: "#b3f2ee",
      dark: "#6dd4ce",
      contrastText: "#5a5a5a",
    },
    background: {
      default: background,
      paper,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Bitter", "Inter", "Helvetica", "Arial", sans-serif',
      fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: textPrimary,
    },
    h2: {
      fontFamily: '"Bitter", "Inter", "Helvetica", "Arial", sans-serif',
      fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
      fontWeight: 700,
      lineHeight: 1.2,
      color: textPrimary,
    },
    h3: {
      fontFamily: '"Bitter", "Inter", "Helvetica", "Arial", sans-serif',
      fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
      fontWeight: 700,
      lineHeight: 1.2,
      color: textPrimary,
    },
    h4: {
      fontFamily: '"Bitter", "Inter", "Helvetica", "Arial", sans-serif',
      fontSize: "clamp(1rem, 2vw, 1.25rem)",
      fontWeight: 700,
      lineHeight: 1.2,
      color: textPrimary,
    },
    h5: {
      fontFamily: '"Bitter", "Inter", "Helvetica", "Arial", sans-serif',
      fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
      fontWeight: 700,
      lineHeight: 1.2,
      color: textPrimary,
    },  
    h6: {
      fontFamily: '"Bitter", "Inter", "Helvetica", "Arial", sans-serif',
      fontSize: "clamp(0.75rem, 1.25vw, 1rem)",
      fontWeight: 700,
      lineHeight: 1.2,
      color: textPrimary,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: textPrimary,
    },
    body2: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      color: textSecondary,
    },
    caption: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      color: textSecondary,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(15, 23, 42, 0.06)",
    "0 2px 6px rgba(15, 23, 42, 0.06)",
    "0 4px 12px rgba(15, 23, 42, 0.08)",
    "0 8px 24px rgba(15, 23, 42, 0.08)",
    "0 12px 32px rgba(15, 23, 42, 0.1)",
    "0 16px 40px rgba(15, 23, 42, 0.1)",
    "0 20px 48px rgba(15, 23, 42, 0.1)",
    "0 24px 56px rgba(15, 23, 42, 0.12)",
    "0 28px 64px rgba(15, 23, 42, 0.12)",
    "0 32px 72px rgba(15, 23, 42, 0.12)",
    "0 36px 80px rgba(15, 23, 42, 0.14)",
    "0 40px 88px rgba(15, 23, 42, 0.14)",
    "0 44px 96px rgba(15, 23, 42, 0.14)",
    "0 48px 104px rgba(15, 23, 42, 0.16)",
    "0 52px 112px rgba(15, 23, 42, 0.16)",
    "0 56px 120px rgba(15, 23, 42, 0.16)",
    "0 60px 128px rgba(15, 23, 42, 0.18)",
    "0 64px 136px rgba(15, 23, 42, 0.18)",
    "0 68px 144px rgba(15, 23, 42, 0.18)",
    "0 72px 152px rgba(15, 23, 42, 0.2)",
    "0 76px 160px rgba(15, 23, 42, 0.2)",
    "0 80px 168px rgba(15, 23, 42, 0.2)",
    "0 84px 176px rgba(15, 23, 42, 0.22)",
    "0 88px 184px rgba(15, 23, 42, 0.22)",
  ],
  // Общедоступные значения для лендинга (заголовки секций: ключевые слова — градиент, остальное — text.secondary).
  // Градиент для заливки ключевых слов в заголовках (background + backgroundClip: 'text').
  landing: {
    titleKeywordGradient,
    lightGradient,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "1rem",
        },
        containedPrimary: {
          boxShadow: "0 2px 8px rgba(127, 127, 213, 0.35)",
        },
        containedSecondary: {
          boxShadow: "0 2px 8px rgba(145, 234, 228, 0.35)",
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: surfaceShadow,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: surfaceShadow,
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: surfaceHoverShadow,
          },
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Theme {
    landing: {
      titleKeywordGradient: string;
      lightGradient: string;
    };
  }
  interface ThemeOptions {
    landing?: {
      titleKeywordGradient: string;
      lightGradient: string;
    };
  }
}
