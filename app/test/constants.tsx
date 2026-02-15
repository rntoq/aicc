import type { ReactNode } from "react";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

export interface TestItem {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  /** For recommended set: true = обязательный, false = опциональный */
  required?: boolean;
  /** Статус: free, paid, premium */
  status?: "free" | "paid" | "premium";
  /** Цена в тенге (если платный) */
  price?: number;
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
  "career-values",
  "big-five",
];

export const ALL_TESTS: TestItem[] = [
  {
    id: "holland",
    name: "Holland Code (RIASEC)",
    description: "Тест по типам профессиональной среды (реалистичный, исследовательский, артистичный и др.). Определяет профессиональные интересы и навыки, помогая найти подходящую карьеру.",
    icon: <PsychologyOutlinedIcon />,
    required: true,
    status: "free",
    duration: 15,
    questions: 48,
  },
  {
    id: "photo-career",
    name: "Photo Career Quiz",
    description: "Быстрый визуальный тест для тех, кто лучше воспринимает информацию через изображения. Отлично подходит для людей с ограниченным английским.",
    icon: <PhotoCameraOutlinedIcon />,
    required: true,
    status: "free",
    duration: 10,
    questions: 24,
  },
  {
    id: "disc",
    name: "DiSC Assessment",
    description: "Популярный тест, используемый работодателями для оценки стиля работы и коммуникации. Определяет, как человек взаимодействует с другими и справляется с задачами.",
    icon: <PersonOutlineOutlinedIcon />,
    required: true,
    status: "free",
    duration: 12,
    questions: 28,
  },
  {
    id: "career-values",
    name: "Career Values Quiz",
    description: "Определяет, что важно для человека в работе: деньги, признание, помощь другим, творчество и т.д. Помогает понять внутреннюю мотивацию.",
    icon: <FavoriteBorderOutlinedIcon />,
    required: false,
    status: "free",
    duration: 8,
    questions: 15,
  },
  {
    id: "big-five",
    name: "Big Five Personality (OCEAN)",
    description: "Научно обоснованный тест личности, измеряющий 5 ключевых черт характера: открытость, добросовестность, экстраверсия, доброжелательность, нейротизм.",
    icon: <PersonOutlinedIcon />,
    required: false,
    status: "free",
    duration: 15,
    questions: 44,
  },
  {
    id: "skills",
    name: "Skills Self-Assessment",
    description: "Комплексная оценка текущих навыков пользователя: от технических (программирование, дизайн) до мягких (коммуникация, лидерство). Показывает сильные стороны и пробелы.",
    icon: <BuildOutlinedIcon />,
    status: "paid",
    price: 990,
    duration: 20,
    questions: 30,
  },
  {
    id: "eq",
    name: "Emotional Intelligence (EQ)",
    description: "Оценка эмоционального интеллекта - способности понимать свои и чужие эмоции, управлять ими. Критически важен для лидерства, командной работы и карьерного успеха.",
    icon: <EmojiEmotionsOutlinedIcon />,
    status: "paid",
    price: 990,
    duration: 15,
    questions: 25,
  },
  {
    id: "learning-style",
    name: "Learning Style (VARK)",
    description: "Определяет предпочитаемый стиль восприятия информации: визуальный, аудиальный, чтение/письмо, кинестетический. Помогает выбрать наиболее подходящие методы обучения.",
    icon: <SchoolOutlinedIcon />,
    status: "free",
    duration: 10,
    questions: 16,
  },
  {
    id: "motivation",
    name: "Work Motivation Scale",
    description: "Глубокий анализ внутренней и внешней мотивации. Что заставляет человека работать: деньги, признание, интерес, миссия? Помогает найти работу, которая будет мотивировать долгосрочно.",
    icon: <TrendingUpOutlinedIcon />,
    status: "paid",
    price: 990,
    duration: 12,
    questions: 20,
  },
  {
    id: "strengths",
    name: "Strengths Finder Lite",
    description: "Один из самых популярных тестов сильных сторон в мире. Определяет топ-5 талантов из 34 возможных. Используется Fortune 500 компаниями.",
    icon: <StarBorderOutlinedIcon />,
    status: "premium",
    price: 1490,
    duration: 30,
    questions: 50,
  },
];

export const getTestById = (id: string): TestItem | undefined =>
  ALL_TESTS.find((t) => t.id === id);

export const getRecommendedTests = (): TestItem[] =>
  RECOMMENDED_TEST_IDS.map((id) => getTestById(id)).filter(
    (t): t is TestItem => t != null
  );
