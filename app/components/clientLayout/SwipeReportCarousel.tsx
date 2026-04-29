"use client";

import { Box } from "@mui/material";
import { Children, useMemo, useState } from "react";
import type { ReactNode, UIEvent } from "react";

export const SwipeReportCarousel = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsCount = useMemo(() => Children.count(children), [children]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!el.clientWidth) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== activeIndex) setActiveIndex(next);
  };

  return (
    <Box sx={styles.root}>
      <Box sx={styles.track} onScroll={handleScroll}>
        {children}
      </Box>
      {itemsCount > 1 && (
        <Box sx={styles.dotsRow}>
          {Array.from({ length: itemsCount }).map((_, idx) => (
            <Box key={idx} sx={styles.dot(activeIndex === idx)} />
          ))}
        </Box>
      )}
    </Box>
  );
};

const styles = {
  root: {
    flex: 1,
    minHeight: { xs: 220, md: 0 },
    display: "flex",
    flexDirection: "column" as const,
  },
  track: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    gap: 0,
    overflowX: "auto",
    overflowY: "hidden",
    scrollSnapType: "x mandatory",
    pb: 1,
    "& > *": { scrollSnapAlign: "start", flexShrink: 0 },
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
    "&::-webkit-scrollbar": { display: "none" },
  },
  dotsRow: {
    mt: 0.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 0.7,
  },
  dot: (active: boolean) => ({
    width: active ? 18 : 7,
    height: 7,
    borderRadius: 999,
    transition: "all 180ms ease",
    bgcolor: active ? "primary.main" : "rgba(148,163,184,0.5)",
  }),
};
