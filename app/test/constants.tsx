import type { ReactNode } from "react";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";

export interface TestItem {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  /** For recommended set: true = обязательный, false = опциональный */
  required?: boolean;
}

/** Recommended set: 3 required + 2 optional (order matters) */
export const RECOMMENDED_TEST_IDS = [
  "holland",
  "big-five",
  "career-values",
  "skills",
  "photo-career",
];

export const ALL_TESTS: TestItem[] = [
  {
    id: "holland",
    name: "Holland",
    description: "Тест по типам профессиональной среды (реалистичный, исследовательский, артистичный и др.). Помогает определить подходящие направления карьеры.",
    icon: <PsychologyOutlinedIcon />,
    required: true,
  },
  {
    id: "big-five",
    name: "Big Five",
    description: "Оценка личности по пяти факторам: открытость, добросовестность, экстраверсия, доброжелательность, нейротизм.",
    icon: <PersonOutlinedIcon />,
    required: true,
  },
  {
    id: "career-values",
    name: "Career Values",
    description: "Определение карьерных ценностей: что для вас важно в работе — развитие, стабильность, творчество и др.",
    icon: <FavoriteBorderOutlinedIcon />,
    required: true,
  },
  {
    id: "skills",
    name: "Навыки",
    description: "Оценка сильных сторон и навыков для подбора профессий, где они наиболее востребованы.",
    icon: <BuildOutlinedIcon />,
    required: false,
  },
  {
    id: "photo-career",
    name: "Photo Career Quiz",
    description: "Быстрый визуальный тест по выбору изображений для уточнения карьерных предпочтений.",
    icon: <PhotoCameraOutlinedIcon />,
    required: false,
  },
  {
    id: "learning-style",
    name: "Стиль обучения",
    description: "Как вы лучше усваиваете информацию — визуально, на практике, в группе и т.д.",
    icon: <SchoolOutlinedIcon />,
  },
  {
    id: "work-environment",
    name: "Рабочая среда",
    description: "Предпочтения по месту и формату работы: офис, удалённо, команда, самостоятельность.",
    icon: <WorkOutlineOutlinedIcon />,
  },
  {
    id: "motivation",
    name: "Мотивация",
    description: "Что вас мотивирует в работе — достижения, признание, баланс жизни и работы.",
    icon: <EmojiObjectsOutlinedIcon />,
  },
  {
    id: "career-preferences",
    name: "Карьерные предпочтения",
    description: "Дополнительные предпочтения по сфере, уровню ответственности и типу задач.",
    icon: <AssignmentOutlinedIcon />,
  },
];

export const getTestById = (id: string): TestItem | undefined =>
  ALL_TESTS.find((t) => t.id === id);

export const getRecommendedTests = (): TestItem[] =>
  RECOMMENDED_TEST_IDS.map((id) => getTestById(id)).filter(
    (t): t is TestItem => t != null
  );
