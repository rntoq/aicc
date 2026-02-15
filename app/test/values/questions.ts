export type CareerValueCategory =
  | "ACHIEVEMENT"
  | "INDEPENDENCE"
  | "RECOGNITION"
  | "RELATIONSHIPS"
  | "SUPPORT"
  | "WORKING_CONDITIONS"
  | "CHALLENGE"
  | "CREATIVITY"
  | "KNOWLEDGE"
  | "SECURITY"
  | "MEANING"
  | "COLLABORATION";

export interface CareerValueQuestion {
  id: string;
  category: CareerValueCategory;
  text: string;
  index: number; // 1-36
}

export const CAREER_VALUE_CATEGORIES: CareerValueCategory[] = [
  "ACHIEVEMENT",
  "INDEPENDENCE",
  "RECOGNITION",
  "RELATIONSHIPS",
  "SUPPORT",
  "WORKING_CONDITIONS",
  "CHALLENGE",
  "CREATIVITY",
  "KNOWLEDGE",
  "SECURITY",
  "MEANING",
  "COLLABORATION",
];

export const CAREER_VALUES_META: Record<
  CareerValueCategory,
  { name: string; color: string }
> = {
  ACHIEVEMENT: {
    name: "Достижение",
    color: "#E74C3C",
  },
  INDEPENDENCE: {
    name: "Независимость",
    color: "#9B59B6",
  },
  RECOGNITION: {
    name: "Признание",
    color: "#F39C12",
  },
  RELATIONSHIPS: {
    name: "Отношения",
    color: "#27AE60",
  },
  SUPPORT: {
    name: "Помощь другим",
    color: "#1ABC9C",
  },
  WORKING_CONDITIONS: {
    name: "Условия работы",
    color: "#3498DB",
  },
  CHALLENGE: {
    name: "Вызовы",
    color: "#E67E22",
  },
  CREATIVITY: {
    name: "Творчество",
    color: "#9C27B0",
  },
  KNOWLEDGE: {
    name: "Знания",
    color: "#2196F3",
  },
  SECURITY: {
    name: "Безопасность",
    color: "#607D8B",
  },
  MEANING: {
    name: "Смысл",
    color: "#00BCD4",
  },
  COLLABORATION: {
    name: "Сотрудничество",
    color: "#4CAF50",
  },
};

export const VALUES_QUESTIONS: CareerValueQuestion[] = [
  // ACHIEVEMENT
  {
    id: "values_achievement_01",
    category: "ACHIEVEMENT",
    text: "Насколько важно для вас достигать амбициозных целей в работе?",
    index: 1,
  },
  {
    id: "values_achievement_02",
    category: "ACHIEVEMENT",
    text: "Важно ли вам видеть конкретные результаты своего труда?",
    index: 2,
  },
  {
    id: "values_achievement_03",
    category: "ACHIEVEMENT",
    text: "Насколько для вас значимо быть лучшим в том, что вы делаете?",
    index: 3,
  },
  // INDEPENDENCE
  {
    id: "values_independence_01",
    category: "INDEPENDENCE",
    text: "Насколько важна для вас свобода принимать собственные решения?",
    index: 4,
  },
  {
    id: "values_independence_02",
    category: "INDEPENDENCE",
    text: "Важно ли вам работать без постоянного контроля со стороны?",
    index: 5,
  },
  {
    id: "values_independence_03",
    category: "INDEPENDENCE",
    text: "Насколько вы цените автономию в выборе методов работы?",
    index: 6,
  },
  // RECOGNITION
  {
    id: "values_recognition_01",
    category: "RECOGNITION",
    text: "Насколько важно для вас признание ваших достижений?",
    index: 7,
  },
  {
    id: "values_recognition_02",
    category: "RECOGNITION",
    text: "Важен ли вам профессиональный статус и репутация?",
    index: 8,
  },
  {
    id: "values_recognition_03",
    category: "RECOGNITION",
    text: "Насколько для вас значимо уважение коллег и начальства?",
    index: 9,
  },
  // RELATIONSHIPS
  {
    id: "values_relationships_01",
    category: "RELATIONSHIPS",
    text: "Насколько важно для вас работать в дружелюбной команде?",
    index: 10,
  },
  {
    id: "values_relationships_02",
    category: "RELATIONSHIPS",
    text: "Важны ли вам близкие отношения с коллегами?",
    index: 11,
  },
  {
    id: "values_relationships_03",
    category: "RELATIONSHIPS",
    text: "Насколько вы цените социальные связи на работе?",
    index: 12,
  },
  // SUPPORT
  {
    id: "values_support_01",
    category: "SUPPORT",
    text: "Насколько важно для вас помогать другим людям?",
    index: 13,
  },
  {
    id: "values_support_02",
    category: "SUPPORT",
    text: "Важно ли вам делать мир лучше через свою работу?",
    index: 14,
  },
  {
    id: "values_support_03",
    category: "SUPPORT",
    text: "Насколько значим для вас вклад в общество?",
    index: 15,
  },
  // WORKING_CONDITIONS
  {
    id: "values_conditions_01",
    category: "WORKING_CONDITIONS",
    text: "Насколько важен для вас комфорт рабочего места?",
    index: 16,
  },
  {
    id: "values_conditions_02",
    category: "WORKING_CONDITIONS",
    text: "Важен ли вам баланс между работой и личной жизнью?",
    index: 17,
  },
  {
    id: "values_conditions_03",
    category: "WORKING_CONDITIONS",
    text: "Насколько вы цените удобный график работы?",
    index: 18,
  },
  // CHALLENGE
  {
    id: "values_challenge_01",
    category: "CHALLENGE",
    text: "Насколько важны для вас сложные интеллектуальные задачи?",
    index: 19,
  },
  {
    id: "values_challenge_02",
    category: "CHALLENGE",
    text: "Важно ли вам постоянно сталкиваться с новыми вызовами?",
    index: 20,
  },
  {
    id: "values_challenge_03",
    category: "CHALLENGE",
    text: "Насколько вы цените возможность решать трудные проблемы?",
    index: 21,
  },
  // CREATIVITY
  {
    id: "values_creativity_01",
    category: "CREATIVITY",
    text: "Насколько важна для вас возможность создавать что-то новое?",
    index: 22,
  },
  {
    id: "values_creativity_02",
    category: "CREATIVITY",
    text: "Важна ли вам свобода для экспериментов и инноваций?",
    index: 23,
  },
  {
    id: "values_creativity_03",
    category: "CREATIVITY",
    text: "Насколько вы цените творческий подход к работе?",
    index: 24,
  },
  // KNOWLEDGE
  {
    id: "values_knowledge_01",
    category: "KNOWLEDGE",
    text: "Насколько важно для вас постоянно учиться новому?",
    index: 25,
  },
  {
    id: "values_knowledge_02",
    category: "KNOWLEDGE",
    text: "Важно ли вам становиться экспертом в своей области?",
    index: 26,
  },
  {
    id: "values_knowledge_03",
    category: "KNOWLEDGE",
    text: "Насколько вы цените интеллектуальное развитие на работе?",
    index: 27,
  },
  // SECURITY
  {
    id: "values_security_01",
    category: "SECURITY",
    text: "Насколько важна для вас стабильность работы?",
    index: 28,
  },
  {
    id: "values_security_02",
    category: "SECURITY",
    text: "Важна ли вам предсказуемость и надежность?",
    index: 29,
  },
  {
    id: "values_security_03",
    category: "SECURITY",
    text: "Насколько вы цените гарантии занятости?",
    index: 30,
  },
  // MEANING
  {
    id: "values_meaning_01",
    category: "MEANING",
    text: "Насколько важно, чтобы ваша работа имела глубокий смысл?",
    index: 31,
  },
  {
    id: "values_meaning_02",
    category: "MEANING",
    text: "Важна ли вам миссия и цель вашей деятельности?",
    index: 32,
  },
  {
    id: "values_meaning_03",
    category: "MEANING",
    text: "Насколько значимо для вас делать что-то важное для общества?",
    index: 33,
  },
  // COLLABORATION
  {
    id: "values_collaboration_01",
    category: "COLLABORATION",
    text: "Насколько важна для вас командная работа?",
    index: 34,
  },
  {
    id: "values_collaboration_02",
    category: "COLLABORATION",
    text: "Важно ли вам достигать целей вместе с другими?",
    index: 35,
  },
  {
    id: "values_collaboration_03",
    category: "COLLABORATION",
    text: "Насколько вы цените сотрудничество и партнерство?",
    index: 36,
  },
];

