export interface HollandQuestion {
  id: string;
  text: string;
  category: "R" | "I" | "A" | "S" | "E" | "C";
  weight: number;
}

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  // R - Realistic (8 вопросов)
  { id: "holland_r_01", text: "Мне нравится работать руками и создавать вещи", category: "R", weight: 1.0 },
  { id: "holland_r_02", text: "Я предпочитаю практическую работу теоретической", category: "R", weight: 1.0 },
  { id: "holland_r_03", text: "Мне интересно чинить и ремонтировать предметы", category: "R", weight: 1.0 },
  { id: "holland_r_04", text: "Я бы хотел работать с инструментами и техникой", category: "R", weight: 1.0 },
  { id: "holland_r_05", text: "Мне нравится работать на открытом воздухе", category: "R", weight: 0.8 },
  { id: "holland_r_06", text: "Я люблю строить и конструировать", category: "R", weight: 1.0 },
  { id: "holland_r_07", text: "Мне интересна работа с машинами и механизмами", category: "R", weight: 1.0 },
  { id: "holland_r_08", text: "Я предпочитаю физическую работу умственной", category: "R", weight: 0.9 },
  
  // I - Investigative (8 вопросов)
  { id: "holland_i_01", text: "Мне нравится решать сложные логические задачи", category: "I", weight: 1.0 },
  { id: "holland_i_02", text: "Я люблю анализировать данные и находить закономерности", category: "I", weight: 1.0 },
  { id: "holland_i_03", text: "Меня привлекают научные исследования", category: "I", weight: 1.0 },
  { id: "holland_i_04", text: "Я предпочитаю работу, требующую глубокого мышления", category: "I", weight: 1.0 },
  { id: "holland_i_05", text: "Мне интересно изучать, как устроены вещи", category: "I", weight: 1.0 },
  { id: "holland_i_06", text: "Я люблю проводить эксперименты", category: "I", weight: 0.9 },
  { id: "holland_i_07", text: "Мне нравится работать с абстрактными концепциями", category: "I", weight: 1.0 },
  { id: "holland_i_08", text: "Я предпочитаю самостоятельно разбираться в проблемах", category: "I", weight: 0.8 },
  
  // A - Artistic (8 вопросов)
  { id: "holland_a_01", text: "Мне нравится выражать себя через творчество", category: "A", weight: 1.0 },
  { id: "holland_a_02", text: "Я люблю работать над креативными проектами", category: "A", weight: 1.0 },
  { id: "holland_a_03", text: "Мне интересно заниматься искусством или дизайном", category: "A", weight: 1.0 },
  { id: "holland_a_04", text: "Я ценю красоту и эстетику", category: "A", weight: 0.9 },
  { id: "holland_a_05", text: "Мне нравится создавать что-то уникальное", category: "A", weight: 1.0 },
  { id: "holland_a_06", text: "Я предпочитаю неструктурированную творческую работу", category: "A", weight: 1.0 },
  { id: "holland_a_07", text: "Мне интересно писать, рисовать или сочинять музыку", category: "A", weight: 1.0 },
  { id: "holland_a_08", text: "Я люблю экспериментировать с новыми идеями", category: "A", weight: 0.9 },
  
  // S - Social (8 вопросов)
  { id: "holland_s_01", text: "Мне нравится помогать другим людям", category: "S", weight: 1.0 },
  { id: "holland_s_02", text: "Я люблю работать в команде", category: "S", weight: 1.0 },
  { id: "holland_s_03", text: "Мне интересно обучать и наставлять других", category: "S", weight: 1.0 },
  { id: "holland_s_04", text: "Я легко нахожу общий язык с людьми", category: "S", weight: 0.9 },
  { id: "holland_s_05", text: "Мне важно делать мир лучше", category: "S", weight: 1.0 },
  { id: "holland_s_06", text: "Я предпочитаю работу с людьми работе с вещами", category: "S", weight: 1.0 },
  { id: "holland_s_07", text: "Мне нравится заботиться о других", category: "S", weight: 0.9 },
  { id: "holland_s_08", text: "Я ценю возможность поддерживать людей", category: "S", weight: 1.0 },
  
  // E - Enterprising (8 вопросов)
  { id: "holland_e_01", text: "Мне нравится быть лидером и принимать решения", category: "E", weight: 1.0 },
  { id: "holland_e_02", text: "Я люблю убеждать и влиять на других", category: "E", weight: 1.0 },
  { id: "holland_e_03", text: "Меня привлекает бизнес и предпринимательство", category: "E", weight: 1.0 },
  { id: "holland_e_04", text: "Мне интересно продавать идеи или продукты", category: "E", weight: 1.0 },
  { id: "holland_e_05", text: "Я готов рисковать ради достижения целей", category: "E", weight: 0.9 },
  { id: "holland_e_06", text: "Мне нравится конкурировать и побеждать", category: "E", weight: 0.8 },
  { id: "holland_e_07", text: "Я предпочитаю руководить, а не подчиняться", category: "E", weight: 1.0 },
  { id: "holland_e_08", text: "Мне интересны власть и влияние", category: "E", weight: 0.9 },
  
  // C - Conventional (8 вопросов)
  { id: "holland_c_01", text: "Мне нравится организовывать и систематизировать", category: "C", weight: 1.0 },
  { id: "holland_c_02", text: "Я предпочитаю четкие инструкции и правила", category: "C", weight: 1.0 },
  { id: "holland_c_03", text: "Мне интересна работа с данными и цифрами", category: "C", weight: 1.0 },
  { id: "holland_c_04", text: "Я люблю порядок и структуру", category: "C", weight: 1.0 },
  { id: "holland_c_05", text: "Мне нравится точная и детальная работа", category: "C", weight: 1.0 },
  { id: "holland_c_06", text: "Я предпочитаю проверенные методы новым экспериментам", category: "C", weight: 0.9 },
  { id: "holland_c_07", text: "Мне интересно вести записи и документацию", category: "C", weight: 0.8 },
  { id: "holland_c_08", text: "Я ценю стабильность и предсказуемость", category: "C", weight: 0.9 },
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
