import type { ReactNode } from "react";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

export interface TestItem {
  id: string;
  name: string;
  icon: ReactNode;
  /** For recommended set: true = обязательный, false = опциональный */
  required?: boolean;
  /** Длительность в минутах */
  duration?: number;
  /** Количество вопросов (для карточки) */
  questions?: number;
  /** Ключ категории для карточки (tests_${id}_category) */
  categoryKey?: string;
}

/** Recommended set: 3 required + 2 optional (order matters) */
export const RECOMMENDED_TEST_IDS = [
  "holland",
  "photo-career",
  "disc",
  "career-aptitude",
  "big-five",
];

export const ALL_TESTS: TestItem[] = [
  {
    id: "holland",
    name: "Holland Code (RIASEC)",
    icon: <PsychologyOutlinedIcon />,
    required: true,
    duration: 8,
    questions: 48,
  },
  {
    id: "photo-career",
    name: "Photo Career Quiz",
    icon: <PhotoCameraOutlinedIcon />,
    required: true,
    duration: 7,
    questions: 30,
  },
  {
    id: "disc",
    name: "DiSC Assessment",
    icon: <PersonOutlineOutlinedIcon />,
    required: true,
    duration: 5,
    questions: 38,
  },
  {
    id: "career-aptitude",
    name: "Career Aptitude Test",
    icon: <FavoriteBorderOutlinedIcon />,
    required: false,
    duration: 12,
    questions: 94,
  },
  {
    id: "big-five",
    name: "Big Five Personality (OCEAN)",
    icon: <PersonOutlinedIcon />,
    required: false,
    duration: 10,
    questions: 74,
  },
  {
    id: "eq",
    name: "Emotional Intelligence (EQ)",
    icon: <EmojiEmotionsOutlinedIcon />,
    duration: 8,
    questions: 55,
  },
  {
    id: "enneagram",
    name: "Enneagram Personality Test",
    icon: <StarBorderOutlinedIcon />,
    duration: 10,
    questions: undefined,
  },
  {
    id: "typefinder-16",
    name: "16 Types (TypeFinder)",
    icon: <PersonOutlineOutlinedIcon />,
    duration: 12,
    questions: undefined,
  },
  {
    id: "strengths",
    name: "Personal Strengths Test",
    icon: <StarBorderOutlinedIcon />,
    duration: 10,
    questions: undefined,
  },
];

export const getTestById = (id: string): TestItem | undefined =>
  ALL_TESTS.find((t) => t.id === id);

export const getRecommendedTests = (): TestItem[] =>
  RECOMMENDED_TEST_IDS.map((id) => getTestById(id)).filter(
    (t): t is TestItem => t != null
  );
