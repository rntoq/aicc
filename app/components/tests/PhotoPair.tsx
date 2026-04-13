"use client";

import type { CSSProperties } from "react";
import { Box, Card } from "@mui/material";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/utils/constants";

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

function PhotoChoice({
  src,
  alt,
  selected,
  onClick,
}: {
  src: string;
  alt: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      sx={[styles.imageCard, selected && styles.imageCardSelected]}
      onClick={onClick}
    >
      <Box sx={styles.imageWrapper}>
        <Image src={src} alt={alt} style={imgStyle} width={300} height={200} />
        {selected ? <Box sx={styles.overlay} /> : null}
      </Box>
    </Card>
  );
}

const imgStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  objectFit: "cover",
};

export const PhotoPair = ({ question, selected, onSelect }: PhotoPairProps) => {
  const srcA = question.optionA.imageSrc || BANNER_PLACEHOLDER_IMAGE;
  const srcB = question.optionB.imageSrc || BANNER_PLACEHOLDER_IMAGE;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.pairContainer}>
        <PhotoChoice
          src={srcA}
          alt={question.optionA.description}
          selected={selected === "optionA"}
          onClick={() => onSelect("optionA")}
        />
        <PhotoChoice
          src={srcB}
          alt={question.optionB.description}
          selected={selected === "optionB"}
          onClick={() => onSelect("optionB")}
        />
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
    width: "100%",
    maxWidth: { xs: "100%", md: "1400px" },
    "@media (max-width: 600px)": {
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      flexDirection: "column",
      p: 2,
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
  imageCardSelected: {
    borderColor: "primary.main",
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
