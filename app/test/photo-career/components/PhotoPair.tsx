"use client";

import {
  Box,
  Card,
} from "@mui/material";
import Image from "next/image";
import type { PhotoQuestion } from "../questions";
import { BANNER_PLACEHOLDER_IMAGE } from "@/ui/styles/global";

export interface PhotoPairProps {
  question: PhotoQuestion;
  selected: "optionA" | "optionB" | null;
  onSelect: (option: "optionA" | "optionB") => void;
}

export const PhotoPair = ({ question, onSelect }: PhotoPairProps) => {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.pairContainer}>
        {/* Option A */}
        <Card
          sx={styles.imageCard}
          onClick={() => onSelect("optionA")}
        >
          <Image
            src={BANNER_PLACEHOLDER_IMAGE}
            alt={question.optionA.description}
            style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }}
            width={300}
            height={200}
          />
        </Card>

        {/* Option B */}
        <Card
          sx={styles.imageCard}
          onClick={() => onSelect("optionB")}
        >
          <Image
            src={BANNER_PLACEHOLDER_IMAGE}
            alt={question.optionB.description}
            style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }}
            width={300}
            height={200}
          />
        </Card>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: { xs: 1, md: 2 },
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
    maxWidth: { xs: "300px", md: "300px" },
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
    objectFit: "cover",
  },
};
