export type PhotoCategory = "BUILDING" | "THINKING" | "CREATING" | "HELPING" | "PERSUADING" | "ORGANIZING";

export interface PhotoOption {
  category: PhotoCategory;
  description: string;
  hollandCode: "R" | "I" | "A" | "S" | "E" | "C";
}

export interface PhotoQuestion {
  id: string;
  pairNumber: number;
  optionA: PhotoOption;
  optionB: PhotoOption;
}

export const PHOTO_CATEGORIES: Record<PhotoCategory, { code: "R" | "I" | "A" | "S" | "E" | "C"; name: string; color: string }> = {
  BUILDING: { code: "R", name: "Строительство", color: "#FF6B35" },
  THINKING: { code: "I", name: "Мышление", color: "#004E89" },
  CREATING: { code: "A", name: "Творчество", color: "#9B59B6" },
  HELPING: { code: "S", name: "Помощь", color: "#27AE60" },
  PERSUADING: { code: "E", name: "Убеждение", color: "#E74C3C" },
  ORGANIZING: { code: "C", name: "Организация", color: "#F39C12" },
};

export const PHOTO_QUESTIONS: PhotoQuestion[] = [
  { id: "photo_q01", pairNumber: 1, optionA: { category: "BUILDING", description: "Плотник работает с деревом и инструментами", hollandCode: "R" }, optionB: { category: "THINKING", description: "Ученый в лаборатории с микроскопом", hollandCode: "I" } },
  { id: "photo_q02", pairNumber: 2, optionA: { category: "CREATING", description: "Художник рисует на холсте", hollandCode: "A" }, optionB: { category: "HELPING", description: "Учитель объясняет материал ученикам", hollandCode: "S" } },
  { id: "photo_q03", pairNumber: 3, optionA: { category: "PERSUADING", description: "Бизнесмен презентует проект команде", hollandCode: "E" }, optionB: { category: "ORGANIZING", description: "Офис-менеджер организует документы", hollandCode: "C" } },
  { id: "photo_q04", pairNumber: 4, optionA: { category: "BUILDING", description: "Инженер работает с электроникой", hollandCode: "R" }, optionB: { category: "CREATING", description: "Дизайнер работает на графическом планшете", hollandCode: "A" } },
  { id: "photo_q05", pairNumber: 5, optionA: { category: "THINKING", description: "Программист пишет код", hollandCode: "I" }, optionB: { category: "HELPING", description: "Медсестра заботится о пациенте", hollandCode: "S" } },
  { id: "photo_q06", pairNumber: 6, optionA: { category: "PERSUADING", description: "Менеджер по продажам встречается с клиентом", hollandCode: "E" }, optionB: { category: "BUILDING", description: "Механик ремонтирует автомобиль", hollandCode: "R" } },
  { id: "photo_q07", pairNumber: 7, optionA: { category: "ORGANIZING", description: "Бухгалтер работает с отчетами", hollandCode: "C" }, optionB: { category: "THINKING", description: "Математик решает уравнения на доске", hollandCode: "I" } },
  { id: "photo_q08", pairNumber: 8, optionA: { category: "CREATING", description: "Фотограф на съемке", hollandCode: "A" }, optionB: { category: "PERSUADING", description: "Маркетолог планирует кампанию", hollandCode: "E" } },
  { id: "photo_q09", pairNumber: 9, optionA: { category: "HELPING", description: "Психолог консультирует клиента", hollandCode: "S" }, optionB: { category: "ORGANIZING", description: "Библиотекарь каталогизирует книги", hollandCode: "C" } },
  { id: "photo_q10", pairNumber: 10, optionA: { category: "BUILDING", description: "Архитектор работает с чертежами", hollandCode: "R" }, optionB: { category: "HELPING", description: "Социальный работник помогает семье", hollandCode: "S" } },
  { id: "photo_q11", pairNumber: 11, optionA: { category: "THINKING", description: "Аналитик данных изучает графики", hollandCode: "I" }, optionB: { category: "CREATING", description: "Музыкант играет на инструменте", hollandCode: "A" } },
  { id: "photo_q12", pairNumber: 12, optionA: { category: "PERSUADING", description: "Политик выступает перед аудиторией", hollandCode: "E" }, optionB: { category: "HELPING", description: "Тренер работает с клиентом в спортзале", hollandCode: "S" } },
  { id: "photo_q13", pairNumber: 13, optionA: { category: "ORGANIZING", description: "Менеджер проектов планирует задачи", hollandCode: "C" }, optionB: { category: "CREATING", description: "Скульптор создает произведение", hollandCode: "A" } },
  { id: "photo_q14", pairNumber: 14, optionA: { category: "BUILDING", description: "Садовник ухаживает за растениями", hollandCode: "R" }, optionB: { category: "PERSUADING", description: "HR менеджер проводит собеседование", hollandCode: "E" } },
  { id: "photo_q15", pairNumber: 15, optionA: { category: "THINKING", description: "Химик проводит эксперимент", hollandCode: "I" }, optionB: { category: "ORGANIZING", description: "Секретарь организует встречи", hollandCode: "C" } },
  { id: "photo_q16", pairNumber: 16, optionA: { category: "CREATING", description: "Видеоредактор монтирует фильм", hollandCode: "A" }, optionB: { category: "ORGANIZING", description: "Администратор управляет офисом", hollandCode: "C" } },
  { id: "photo_q17", pairNumber: 17, optionA: { category: "HELPING", description: "Врач осматривает пациента", hollandCode: "S" }, optionB: { category: "BUILDING", description: "Электрик устанавливает проводку", hollandCode: "R" } },
  { id: "photo_q18", pairNumber: 18, optionA: { category: "PERSUADING", description: "Предприниматель питчит инвесторам", hollandCode: "E" }, optionB: { category: "THINKING", description: "Исследователь анализирует результаты", hollandCode: "I" } },
  { id: "photo_q19", pairNumber: 19, optionA: { category: "BUILDING", description: "Сварщик работает с металлом", hollandCode: "R" }, optionB: { category: "ORGANIZING", description: "Логист планирует поставки", hollandCode: "C" } },
  { id: "photo_q20", pairNumber: 20, optionA: { category: "CREATING", description: "Писатель работает над книгой", hollandCode: "A" }, optionB: { category: "THINKING", description: "Экономист анализирует рынок", hollandCode: "I" } },
  { id: "photo_q21", pairNumber: 21, optionA: { category: "HELPING", description: "Воспитатель играет с детьми", hollandCode: "S" }, optionB: { category: "PERSUADING", description: "Агент по недвижимости показывает дом", hollandCode: "E" } },
  { id: "photo_q22", pairNumber: 22, optionA: { category: "ORGANIZING", description: "Архивариус систематизирует документы", hollandCode: "C" }, optionB: { category: "BUILDING", description: "Сантехник ремонтирует трубы", hollandCode: "R" } },
  { id: "photo_q23", pairNumber: 23, optionA: { category: "THINKING", description: "Биолог исследует образцы", hollandCode: "I" }, optionB: { category: "PERSUADING", description: "Рекламщик презентует концепцию", hollandCode: "E" } },
  { id: "photo_q24", pairNumber: 24, optionA: { category: "CREATING", description: "Модельер создает коллекцию", hollandCode: "A" }, optionB: { category: "HELPING", description: "Логопед работает с ребенком", hollandCode: "S" } },
  { id: "photo_q25", pairNumber: 25, optionA: { category: "BUILDING", description: "Повар готовит блюдо", hollandCode: "R" }, optionB: { category: "THINKING", description: "Статистик обрабатывает данные", hollandCode: "I" } },
  { id: "photo_q26", pairNumber: 26, optionA: { category: "PERSUADING", description: "Юрист защищает дело в суде", hollandCode: "E" }, optionB: { category: "ORGANIZING", description: "Координатор планирует мероприятие", hollandCode: "C" } },
  { id: "photo_q27", pairNumber: 27, optionA: { category: "HELPING", description: "Наставник консультирует стажера", hollandCode: "S" }, optionB: { category: "THINKING", description: "Археолог изучает находки", hollandCode: "I" } },
  { id: "photo_q28", pairNumber: 28, optionA: { category: "CREATING", description: "Аниматор рисует мультфильм", hollandCode: "A" }, optionB: { category: "BUILDING", description: "Столяр делает мебель", hollandCode: "R" } },
  { id: "photo_q29", pairNumber: 29, optionA: { category: "ORGANIZING", description: "Финансовый консультант составляет план", hollandCode: "C" }, optionB: { category: "HELPING", description: "Массажист работает с клиентом", hollandCode: "S" } },
  { id: "photo_q30", pairNumber: 30, optionA: { category: "PERSUADING", description: "Тренер по продажам обучает команду", hollandCode: "E" }, optionB: { category: "CREATING", description: "Ювелир создает украшения", hollandCode: "A" } },
];
