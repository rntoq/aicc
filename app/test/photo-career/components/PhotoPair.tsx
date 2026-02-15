"use client";

import {
  Box,
  Card,
} from "@mui/material";
import type { PhotoQuestion } from "../questions";

// Temporary placeholder from public/
const PHOTO_PLACEHOLDER_SRC = "/f797a19f26ef87fa77d5ac53a495d1f1.png.webp";

export interface PhotoPairProps {
  question: PhotoQuestion;
  selected: "optionA" | "optionB" | null;
  onSelect: (option: "optionA" | "optionB") => void;
}

export function PhotoPair({ question, onSelect }: PhotoPairProps) {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.pairContainer}>
        {/* Option A */}
        <Card
          sx={styles.imageCard}
          onClick={() => onSelect("optionA")}
        >
          <Box
            component="img"
            src={PHOTO_PLACEHOLDER_SRC}
            alt={question.optionA.description}
            sx={styles.image}
          />
        </Card>

        {/* Option B */}
        <Card
          sx={styles.imageCard}
          onClick={() => onSelect("optionB")}
        >
          <Box
            component="img"
            src={PHOTO_PLACEHOLDER_SRC}
            alt={question.optionB.description}
            sx={styles.image}
          />
        </Card>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: { xs: "60vh", md: "70vh" },
    py: { xs: 4, md: 6 },
  },
  pairContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: { xs: 3, md: 6 },
    flexDirection: { xs: "column", md: "row" },
    width: "100%",
    maxWidth: { xs: "100%", md: "1400px" },
  },
  imageCard: {
    flex: { xs: "none", md: 1 },
    width: { xs: "90%", md: "45%" },
    maxWidth: { xs: "500px", md: "600px" },
    borderRadius: 3,
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "4px solid transparent",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
    },
  },
  image: {
    display: "block",
    width: "100%",
    height: "auto",
  },
};
