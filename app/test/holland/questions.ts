export interface HollandQuestion {
  id: string;
  text: string;
  category: "R" | "I" | "A" | "S" | "E" | "C";
  weight: number;
}

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  // R - Realistic (8 вопросов, R1–R8 из IIP RIASEC)
  {
    id: "holland_r_01",
    text: "Проверять качество деталей перед отправкой",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_02",
    text: "Класть кирпич или плитку",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_03",
    text: "Работать на морской нефтяной платформе",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_04",
    text: "Собирать электронные детали",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_05",
    text: "Управлять шлифовальным станком на заводе",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_06",
    text: "Чинить сломанный смеситель или кран",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_07",
    text: "Собирать изделия на производстве",
    category: "R",
    weight: 1.0,
  },
  {
    id: "holland_r_08",
    text: "Укладывать напольное покрытие в домах",
    category: "R",
    weight: 1.0,
  },

  // I - Investigative (8 вопросов, I1–I8)
  {
    id: "holland_i_01",
    text: "Изучать строение человеческого тела",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_02",
    text: "Изучать поведение животных",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_03",
    text: "Проводить исследования растений или животных",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_04",
    text: "Разрабатывать новое медицинское лечение или процедуру",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_05",
    text: "Проводить биологические исследования",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_06",
    text: "Изучать китов и других морских животных",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_07",
    text: "Работать в биологической лаборатории",
    category: "I",
    weight: 1.0,
  },
  {
    id: "holland_i_08",
    text: "Составлять карту дна океана",
    category: "I",
    weight: 1.0,
  },

  // A - Artistic (8 вопросов, A1–A8)
  {
    id: "holland_a_01",
    text: "Руководить музыкальным хором",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_02",
    text: "Режиссировать театральную постановку",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_03",
    text: "Разрабатывать иллюстрации и оформление для журналов",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_04",
    text: "Писать песни",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_05",
    text: "Писать книги или пьесы",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_06",
    text: "Играть на музыкальном инструменте",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_07",
    text: "Выполнять трюки для фильма или телешоу",
    category: "A",
    weight: 1.0,
  },
  {
    id: "holland_a_08",
    text: "Делать сценографию и декорации для спектаклей",
    category: "A",
    weight: 1.0,
  },

  // S - Social (8 вопросов, S1–S8)
  {
    id: "holland_s_01",
    text: "Помогать людям с выбором профессии",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_02",
    text: "Заниматься волонтёрской работой в некоммерческой организации",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_03",
    text: "Помогать людям с зависимостью от алкоголя или наркотиков",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_04",
    text: "Обучать человека программе физических упражнений",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_05",
    text: "Помогать людям с семейными проблемами",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_06",
    text: "Руководить детьми в лагере",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_07",
    text: "Учить детей читать",
    category: "S",
    weight: 1.0,
  },
  {
    id: "holland_s_08",
    text: "Помогать пожилым людям в их повседневных делах",
    category: "S",
    weight: 1.0,
  },

  // E - Enterprising (8 вопросов, E1–E8)
  {
    id: "holland_e_01",
    text: "Продавать франшизы ресторана частным предпринимателям",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_02",
    text: "Продавать товары в отделе крупного магазина",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_03",
    text: "Управлять работой отеля",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_04",
    text: "Владеть и управлять салоном красоты или барбершопом",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_05",
    text: "Руководить отделом в большой компании",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_06",
    text: "Управлять магазином одежды",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_07",
    text: "Продавать дома и квартиры",
    category: "E",
    weight: 1.0,
  },
  {
    id: "holland_e_08",
    text: "Владеть магазином игрушек",
    category: "E",
    weight: 1.0,
  },

  // C - Conventional (8 вопросов, C1–C8)
  {
    id: "holland_c_01",
    text: "Начислять и выдавать ежемесячную зарплату сотрудникам",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_02",
    text: "Проводить инвентаризацию с помощью портативного компьютера",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_03",
    text: "Использовать программу для выставления счетов клиентам",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_04",
    text: "Вести кадровые записи сотрудников",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_05",
    text: "Подсчитывать и фиксировать статистические и другие числовые данные",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_06",
    text: "Работать на калькуляторе",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_07",
    text: "Обслуживать банковские операции клиентов",
    category: "C",
    weight: 1.0,
  },
  {
    id: "holland_c_08",
    text: "Вести учёт отправки и получения товаров",
    category: "C",
    weight: 1.0,
  },
];

export const CATEGORY_NAMES: Record<"R" | "I" | "A" | "S" | "E" | "C", string> = {
  R: "Реалистичный",
  I: "Исследовательский",
  A: "Артистичный",
  S: "Социальный",
  E: "Предприимчивый",
  C: "Конвенциональный",
};

export const CATEGORY_DESCRIPTIONS: Record<"R" | "I" | "A" | "S" | "E" | "C", string> = {
  R: "Практик, работающий руками и с техникой",
  I: "Аналитик, решающий сложные проблемы",
  A: "Творец, выражающий себя через искусство",
  S: "Помощник, работающий с людьми",
  E: "Лидер, управляющий и влияющий",
  C: "Организатор, систематизирующий и упорядочивающий",
};
