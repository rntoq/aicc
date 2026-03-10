"use client";

import { Box, Card } from "@mui/material";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/constants";

export interface PhotoOption {
  id: string;
  imageSrc: string;
  description: string;
}

export interface PhotoQuestion {
  id: string;
  optionA: PhotoOption;
  optionB: PhotoOption;
}

export interface PhotoPairProps {
  question: PhotoQuestion;
  selected: "optionA" | "optionB" | null;
  onSelect: (option: "optionA" | "optionB") => void;
}

export const PhotoPair = ({ question, selected, onSelect }: PhotoPairProps) => {
  const srcA = question.optionA.imageSrc || BANNER_PLACEHOLDER_IMAGE;
  const srcB = question.optionB.imageSrc || BANNER_PLACEHOLDER_IMAGE;
  const isSelectedA = selected === "optionA";
  const isSelectedB = selected === "optionB";

  return (
    <Box sx={styles.container}>
      <Box sx={styles.pairContainer}>
        <Card
          sx={{
            ...styles.imageCard,
            borderColor: isSelectedA ? "primary.main" : "transparent",
          }}
          onClick={() => onSelect("optionA")}
        >
          <Box sx={styles.imageWrapper}>
            <Image
              src={srcA}
              alt={question.optionA.description}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
              width={300}
              height={200}
            />
            {isSelectedA && <Box sx={styles.overlay} />}
          </Box>
        </Card>

        <Card
          sx={{
            ...styles.imageCard,
            borderColor: isSelectedB ? "primary.main" : "transparent",
          }}
          onClick={() => onSelect("optionB")}
        >
          <Box sx={styles.imageWrapper}>
            <Image
              src={srcB}
              alt={question.optionB.description}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
              width={300}
              height={200}
            />
            {isSelectedB && <Box sx={styles.overlay} />}
          </Box>
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
    flexDirection: "row",
    width: "100%",
    maxWidth: { xs: "100%", md: "1400px" },
    "@media (max-width: 600px)": {
      backgroundColor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      flexDirection: "column",
      padding: 2,
    },
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
  imageWrapper: {
    position: "relative" as const,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute" as const,
    inset: 0,
    bgcolor: "rgba(0,0,0,0.70)",
  },
};

