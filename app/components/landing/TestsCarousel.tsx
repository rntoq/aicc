"use client";

import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const TEST_KEYS = [
  "tests_item1",
  "tests_item2",
  "tests_item3",
  "tests_item4",
  "tests_item5",
  "tests_item6",
  "tests_item7",
  "tests_item8",
];

const DUPES = 3;
const AUTO_INTERVAL_MS = 2800;
const ITEM_WIDTH = 200;
const GAP = 16;

export function TestsCarousel() {
  const t = useTranslations();
  const TESTS = TEST_KEYS.map((k) => t(k));
  const SET_WIDTH = TESTS.length * (ITEM_WIDTH + GAP) - GAP;
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setOffset((prev) => {
        const step = ITEM_WIDTH + GAP;
        const next = prev + step;
        if (next >= SET_WIDTH) {
          setNoTransition(true);
          return 0;
        }
        return next;
      });
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused]);

  useEffect(() => {
    if (!noTransition) return;
    const id = requestAnimationFrame(() => {
      setNoTransition(false);
    });
    return () => cancelAnimationFrame(id);
  }, [noTransition]);

  return (
    <Box
      component="section"
      id="tests-carousel"
      sx={styles.section}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h2"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          {t("tests_title")}
        </Typography>
        <Typography variant="body2" textAlign="center" sx={styles.subtitle}>
          {t("tests_subtitle")}
        </Typography>

        <Box
          sx={styles.wrap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Box sx={styles.trackWrap}>
            <Box
              ref={trackRef}
              sx={[styles.track, noTransition && styles.trackNoTransition]}
              style={{
                transform: `translateX(-${offset}px)`,
              }}
            >
              {Array.from({ length: DUPES }).map((_, dupe) =>
                TESTS.map((name, i) => (
                  <Box
                    key={`${dupe}-${i}`}
                    sx={styles.item}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {name}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const styles = {
  section: {
    py: { xs: 6, md: 8 },
    bgcolor: "background.default",
  },
  subtitle: {
    mb: 4,
    maxWidth: 480,
    mx: "auto",
    color: "text.secondary",
  },
  wrap: {
    overflow: "hidden",
    mx: -2,
  },
  trackWrap: {
    overflow: "hidden",
  },
  track: {
    display: "flex",
    gap: GAP,
    width: "max-content",
    transition: "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
    willChange: "transform",
  },
  trackNoTransition: {
    transition: "none",
  },
  item: {
    flexShrink: 0,
    width: ITEM_WIDTH,
    minHeight: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2,
    borderRadius: 2,
    bgcolor: "background.paper",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
    border: "1px solid",
    borderColor: "divider",
    cursor: "default",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(127, 127, 213, 0.12)",
      borderColor: "primary.main",
    },
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
  },
};
