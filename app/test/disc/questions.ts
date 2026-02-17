export type DiscType = "D" | "I" | "S" | "C";

export interface DiscStatement {
  id: string;
  text: string;
  type: DiscType;
}

export interface DiscQuestion {
  id: string;
  number: number;
  statements: DiscStatement[];
}

export const DISC_QUESTIONS: DiscQuestion[] = [
  // Пары прилагательных из новой версии DISC (Truity‑стиль).
  {
    id: "disc_q01",
    number: 1,
    statements: [
      { id: "left", text: "Открытый", type: "I" }, // Open
      { id: "right", text: "Скептичный", type: "C" }, // Skeptical
    ],
  },
  {
    id: "disc_q02",
    number: 2,
    statements: [
      { id: "left", text: "Жизнерадостный", type: "I" }, // Cheerful
      { id: "right", text: "Методичный", type: "C" }, // Methodical
    ],
  },
  {
    id: "disc_q03",
    number: 3,
    statements: [
      { id: "left", text: "Сдержанный", type: "C" }, // Reserved
      { id: "right", text: "Динамичный", type: "D" }, // Dynamic
    ],
  },
  {
    id: "disc_q04",
    number: 4,
    statements: [
      { id: "left", text: "Скромный", type: "S" }, // Humble
      { id: "right", text: "Смелый", type: "D" }, // Bold
    ],
  },
  {
    id: "disc_q05",
    number: 5,
    statements: [
      { id: "left", text: "Щедрый", type: "I" }, // Generous
      { id: "right", text: "Строгий", type: "C" }, // Strict
    ],
  },
  {
    id: "disc_q06",
    number: 6,
    statements: [
      { id: "left", text: "Живой, энергичный", type: "I" }, // Lively
      { id: "right", text: "Системный", type: "C" }, // Systematic
    ],
  },
  {
    id: "disc_q07",
    number: 7,
    statements: [
      { id: "left", text: "Послушный", type: "S" }, // Obedient
      { id: "right", text: "Прямой, открыто высказывающийся", type: "D" }, // Outspoken
    ],
  },
  {
    id: "disc_q08",
    number: 8,
    statements: [
      { id: "left", text: "Скромный", type: "S" }, // Modest
      { id: "right", text: "Бросающий вызов", type: "D" }, // Challenging
    ],
  },
  {
    id: "disc_q09",
    number: 9,
    statements: [
      { id: "left", text: "Помогающий", type: "S" }, // Helpful
      { id: "right", text: "Решительный", type: "D" }, // Resolute
    ],
  },
  {
    id: "disc_q10",
    number: 10,
    statements: [
      { id: "left", text: "Воодушевлённый", type: "I" }, // Enthusiastic
      { id: "right", text: "Точный", type: "C" }, // Accurate
    ],
  },
  {
    id: "disc_q11",
    number: 11,
    statements: [
      { id: "left", text: "Уступчивый, послушный", type: "S" }, // Compliant
      { id: "right", text: "Предприимчивый", type: "D" }, // Enterprising
    ],
  },
  {
    id: "disc_q12",
    number: 12,
    statements: [
      { id: "left", text: "Мягкий", type: "S" }, // Gentle
      { id: "right", text: "Прямой, директивный", type: "D" }, // Direct
    ],
  },
  {
    id: "disc_q13",
    number: 13,
    statements: [
      { id: "left", text: "Уступчивый, идущий навстречу", type: "S" }, // Accommodating
      { id: "right", text: "Твёрдый", type: "D" }, // Firm
    ],
  },
  {
    id: "disc_q14",
    number: 14,
    statements: [
      { id: "left", text: "Игривый", type: "I" }, // Playful
      { id: "right", text: "Аналитичный", type: "C" }, // Analytical
    ],
  },
  {
    id: "disc_q15",
    number: 15,
    statements: [
      { id: "left", text: "Тактичный", type: "S" }, // Tactful
      { id: "right", text: "Выразительный, экспрессивный", type: "I" }, // Expressive
    ],
  },
  {
    id: "disc_q16",
    number: 16,
    statements: [
      { id: "left", text: "Ровный, спокойный", type: "S" }, // Even-tempered
      { id: "right", text: "Жёсткий", type: "D" }, // Tough
    ],
  },
  {
    id: "disc_q17",
    number: 17,
    statements: [
      { id: "left", text: "Принимающий, принимающий людей", type: "S" }, // Accepting
      { id: "right", text: "Фактичный, сухой", type: "C" }, // Matter-of-Fact
    ],
  },
  {
    id: "disc_q18",
    number: 18,
    statements: [
      { id: "left", text: "Оптимистичный", type: "I" }, // Optimistic
      { id: "right", text: "Перфекционистичный", type: "C" }, // Perfectionistic
    ],
  },
  {
    id: "disc_q19",
    number: 19,
    statements: [
      { id: "left", text: "Тихий", type: "C" }, // Quiet
      { id: "right", text: "Харизматичный", type: "I" }, // Charismatic
    ],
  },
  {
    id: "disc_q20",
    number: 20,
    statements: [
      { id: "left", text: "Услужливый, готовый помочь", type: "S" }, // Oblig­ing
      { id: "right", text: "Напористый", type: "D" }, // Assertive
    ],
  },
  {
    id: "disc_q21",
    number: 21,
    statements: [
      { id: "left", text: "Доверяющий", type: "S" }, // Trusting
      { id: "right", text: "Сомневающийся, задающий вопросы", type: "C" }, // Questioning
    ],
  },
  {
    id: "disc_q22",
    number: 22,
    statements: [
      { id: "left", text: "Лёгкий, беззаботный", type: "I" }, // Light‑Hearted
      { id: "right", text: "Точный, педантичный", type: "C" }, // Precise
    ],
  },
  {
    id: "disc_q23",
    number: 23,
    statements: [
      { id: "left", text: "Осторожный", type: "C" }, // Cautious
      { id: "right", text: "Авантюрный", type: "D" }, // Adventurous
    ],
  },
  {
    id: "disc_q24",
    number: 24,
    statements: [
      { id: "left", text: "Восприимчивый, открытый к идеям", type: "S" }, // Receptive
      { id: "right", text: "Решительный", type: "D" }, // Decisive
    ],
  },
];

