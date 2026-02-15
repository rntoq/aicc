export type BigFiveTrait =
  | "OPENNESS"
  | "CONSCIENTIOUSNESS"
  | "EXTRAVERSION"
  | "AGREEABLENESS"
  | "NEUROTICISM";

export interface BigFiveTraitMeta {
  code: "O" | "C" | "E" | "A" | "N";
  name: string;
  description: string;
  highMeans: string;
  lowMeans: string;
  color: string;
  note?: string;
}

export interface BigFiveQuestion {
  id: string;
  trait: BigFiveTrait;
  statement: string;
  index: number; // 1-44
  reverse: boolean;
}

export const BIG_FIVE_TRAITS: Record<BigFiveTrait, BigFiveTraitMeta> = {
  OPENNESS: {
    code: "O",
    name: "Открытость опыту",
    description: "Любопытство, креативность, открытость новым идеям и опыту",
    highMeans: "Креативный, любопытный, открытый новому",
    lowMeans: "Практичный, традиционный, предпочитает рутину",
    color: "#9C27B0",
  },
  CONSCIENTIOUSNESS: {
    code: "C",
    name: "Добросовестность",
    description: "Организованность, ответственность, целеустремленность",
    highMeans: "Организованный, надежный, целеустремленный",
    lowMeans: "Спонтанный, гибкий, расслабленный",
    color: "#2196F3",
  },
  EXTRAVERSION: {
    code: "E",
    name: "Экстраверсия",
    description: "Общительность, энергичность, позитивные эмоции",
    highMeans: "Общительный, энергичный, разговорчивый",
    lowMeans: "Сдержанный, независимый, тихий (Интроверт)",
    color: "#FF9800",
  },
  AGREEABLENESS: {
    code: "A",
    name: "Доброжелательность",
    description: "Сотрудничество, эмпатия, доверие к людям",
    highMeans: "Сострадательный, кооперативный, доверчивый",
    lowMeans: "Конкурентный, скептичный, прямолинейный",
    color: "#4CAF50",
  },
  NEUROTICISM: {
    code: "N",
    name: "Нейротизм",
    description: "Склонность к негативным эмоциям и стрессу",
    highMeans: "Эмоционально реактивный, склонен к стрессу",
    lowMeans: "Спокойный, стабильный, устойчивый к стрессу",
    color: "#F44336",
    note: "Низкий Neuroticism = высокая эмоциональная стабильность (это хорошо)",
  },
};

export const BIG_FIVE_QUESTIONS: BigFiveQuestion[] = [
  // OPENNESS (9)
  { id: "ocean_o_01", statement: "У меня богатое воображение", trait: "OPENNESS", index: 1, reverse: false },
  { id: "ocean_o_02", statement: "Меня интересуют абстрактные идеи", trait: "OPENNESS", index: 2, reverse: false },
  { id: "ocean_o_03", statement: "Мне нравится играть с теориями и идеями", trait: "OPENNESS", index: 3, reverse: false },
  { id: "ocean_o_04", statement: "Я быстро понимаю новые вещи", trait: "OPENNESS", index: 4, reverse: false },
  { id: "ocean_o_05", statement: "Я люблю размышлять о вещах", trait: "OPENNESS", index: 5, reverse: false },
  { id: "ocean_o_06", statement: "Мне трудно понимать абстрактные идеи", trait: "OPENNESS", index: 6, reverse: true },
  { id: "ocean_o_07", statement: "У меня нет хорошего воображения", trait: "OPENNESS", index: 7, reverse: true },
  { id: "ocean_o_08", statement: "Я не интересуюсь абстрактными вещами", trait: "OPENNESS", index: 8, reverse: true },
  { id: "ocean_o_09", statement: "Я избегаю философских дискуссий", trait: "OPENNESS", index: 9, reverse: true },

  // CONSCIENTIOUSNESS (9)
  { id: "ocean_c_01", statement: "Я всегда готовлюсь заранее", trait: "CONSCIENTIOUSNESS", index: 10, reverse: false },
  { id: "ocean_c_02", statement: "Я обращаю внимание на детали", trait: "CONSCIENTIOUSNESS", index: 11, reverse: false },
  { id: "ocean_c_03", statement: "Я довожу дела до конца", trait: "CONSCIENTIOUSNESS", index: 12, reverse: false },
  { id: "ocean_c_04", statement: "Я люблю порядок", trait: "CONSCIENTIOUSNESS", index: 13, reverse: false },
  { id: "ocean_c_05", statement: "Я следую расписанию", trait: "CONSCIENTIOUSNESS", index: 14, reverse: false },
  { id: "ocean_c_06", statement: "Я часто забываю вернуть вещи на место", trait: "CONSCIENTIOUSNESS", index: 15, reverse: true },
  { id: "ocean_c_07", statement: "Я оставляю свои вещи разбросанными", trait: "CONSCIENTIOUSNESS", index: 16, reverse: true },
  { id: "ocean_c_08", statement: "Я избегаю своих обязанностей", trait: "CONSCIENTIOUSNESS", index: 17, reverse: true },
  { id: "ocean_c_09", statement: "Я откладываю дела на потом", trait: "CONSCIENTIOUSNESS", index: 18, reverse: true },

  // EXTRAVERSION (9)
  { id: "ocean_e_01", statement: "Я душа компании", trait: "EXTRAVERSION", index: 19, reverse: false },
  { id: "ocean_e_02", statement: "Я легко завожу разговор с незнакомцами", trait: "EXTRAVERSION", index: 20, reverse: false },
  { id: "ocean_e_03", statement: "Мне комфортно быть в центре внимания", trait: "EXTRAVERSION", index: 21, reverse: false },
  { id: "ocean_e_04", statement: "Я люблю большие вечеринки", trait: "EXTRAVERSION", index: 22, reverse: false },
  { id: "ocean_e_05", statement: "Я полон энергии", trait: "EXTRAVERSION", index: 23, reverse: false },
  { id: "ocean_e_06", statement: "Я предпочитаю оставаться в тени", trait: "EXTRAVERSION", index: 24, reverse: true },
  { id: "ocean_e_07", statement: "Мне не нравится привлекать к себе внимание", trait: "EXTRAVERSION", index: 25, reverse: true },
  { id: "ocean_e_08", statement: "Я тихий в присутствии незнакомцев", trait: "EXTRAVERSION", index: 26, reverse: true },
  { id: "ocean_e_09", statement: "Мне нечего сказать", trait: "EXTRAVERSION", index: 27, reverse: true },

  // AGREEABLENESS (9)
  { id: "ocean_a_01", statement: "Я интересуюсь другими людьми", trait: "AGREEABLENESS", index: 28, reverse: false },
  { id: "ocean_a_02", statement: "Я сочувствую чувствам других", trait: "AGREEABLENESS", index: 29, reverse: false },
  { id: "ocean_a_03", statement: "Я стараюсь утешить других", trait: "AGREEABLENESS", index: 30, reverse: false },
  { id: "ocean_a_04", statement: "Я забочусь о других", trait: "AGREEABLENESS", index: 31, reverse: false },
  { id: "ocean_a_05", statement: "Я мягкосердечен", trait: "AGREEABLENESS", index: 32, reverse: false },
  { id: "ocean_a_06", statement: "Я не интересуюсь проблемами других", trait: "AGREEABLENESS", index: 33, reverse: true },
  { id: "ocean_a_07", statement: "Мне все равно, что чувствуют другие", trait: "AGREEABLENESS", index: 34, reverse: true },
  { id: "ocean_a_08", statement: "Я могу быть грубым с людьми", trait: "AGREEABLENESS", index: 35, reverse: true },
  { id: "ocean_a_09", statement: "Я оскорбляю людей", trait: "AGREEABLENESS", index: 36, reverse: true },

  // NEUROTICISM (8)
  { id: "ocean_n_01", statement: "Я часто чувствую грусть", trait: "NEUROTICISM", index: 37, reverse: false },
  { id: "ocean_n_02", statement: "Я легко выхожу из себя", trait: "NEUROTICISM", index: 38, reverse: false },
  { id: "ocean_n_03", statement: "Я испытываю перепады настроения", trait: "NEUROTICISM", index: 39, reverse: false },
  { id: "ocean_n_04", statement: "Я легко впадаю в стресс", trait: "NEUROTICISM", index: 40, reverse: false },
  { id: "ocean_n_05", statement: "Я много беспокоюсь о вещах", trait: "NEUROTICISM", index: 41, reverse: false },
  { id: "ocean_n_06", statement: "Я редко чувствую грусть", trait: "NEUROTICISM", index: 42, reverse: true },
  { id: "ocean_n_07", statement: "Я спокоен в стрессовых ситуациях", trait: "NEUROTICISM", index: 43, reverse: true },
  { id: "ocean_n_08", statement: "Я эмоционально стабилен", trait: "NEUROTICISM", index: 44, reverse: true },
];

