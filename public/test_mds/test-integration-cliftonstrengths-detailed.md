# 🔧 Техническая Интеграция: CliftonStrengths (Strengths Finder)
## Тест Сильных Сторон

---

# Тест 10: CliftonStrengths Assessment (Strengths Finder)

## 📊 Общая Информация

**ID теста:** `clifton-strengths`  
**Версия:** 1.0 (на основе Gallup CliftonStrengths)  
**Статус:** Премиум (1990 ₸) - самый дорогой тест  
**Вопросов:** 177  
**Время:** 35-45 минут  
**Тип ответов:** Парные утверждения (forced choice)  
**Модель:** 34 темы талантов (talent themes)  
**Результат:** Топ-5 Signature Strengths + полный рейтинг 34 тем  
**Научная база:** Gallup, 50+ лет исследований  

---

## 🎯 Концепция CliftonStrengths

### Что такое CliftonStrengths:

**CliftonStrengths** (ранее StrengthsFinder) - самый популярный в мире тест сильных сторон, разработанный Gallup на основе позитивной психологии.

### Философия:

```
"Focus on what you do best, not on fixing weaknesses"

Традиционный подход:
❌ Найти слабости → Исправить их → Стать средним во всем

Strengths-based подход:
✓ Найти таланты → Развить в сильные стороны → Стать отличным в чем-то

Результат: 
- Люди которые используют свои сильные стороны каждый день в 6 раз 
  более вовлечены в работу
- 3x более вероятно имеют отличное качество жизни
```

### 34 Темы Талантов (Talent Themes):

Разделены на 4 домена:

```javascript
const CLIFTON_DOMAINS = {
  "EXECUTING": {
    name: "Исполнение",
    description: "Themes that help you make things happen",
    themes_count: 9,
    color: "#9C27B0",
    characteristics: "Action-oriented, get things done, implement ideas"
  },
  
  "INFLUENCING": {
    name: "Влияние",
    description: "Themes that help you take charge, speak up, make sure others are heard",
    themes_count: 8,
    color: "#FF9800",
    characteristics: "Persuade, sell ideas, reach broader audience"
  },
  
  "RELATIONSHIP_BUILDING": {
    name: "Построение отношений",
    description: "Themes that help you build strong relationships that hold a team together",
    themes_count: 9,
    color: "#4CAF50",
    characteristics: "Connect people, create bonds, unite teams"
  },
  
  "STRATEGIC_THINKING": {
    name: "Стратегическое мышление",
    description: "Themes that help you absorb and analyze information to make better decisions",
    themes_count: 8,
    color: "#2196F3",
    characteristics: "Think, analyze, plan, strategize"
  }
};
```

---

## 📋 34 Темы Талантов (Полный Список)

### ДОМЕН 1: EXECUTING (Исполнение) - 9 тем

```javascript
const executingThemes = [
  {
    id: "achiever",
    number: 1,
    name: {
      ru: "Достигатор",
      en: "Achiever"
    },
    domain: "EXECUTING",
    description: {
      ru: "Постоянная потребность в достижениях, много работает, получает удовлетворение от продуктивности",
      en: "Constant need for achievement, works hard, gets satisfaction from being productive"
    },
    key_characteristics: [
      "Hard worker",
      "High stamina",
      "Always on the go",
      "Productive",
      "Results-driven"
    ],
    at_best: "Энергия и драйв для выполнения задач",
    potential_blind_spot: "Может выгореть, трудно сказать 'нет'",
    famous_examples: ["Elon Musk", "Jeff Bezos"],
    careers: ["Entrepreneur", "Sales", "Project Manager", "Consultant"]
  },
  
  {
    id: "arranger",
    number: 2,
    name: {
      ru: "Организатор",
      en: "Arranger"
    },
    domain: "EXECUTING",
    description: {
      ru: "Любит организовывать, координировать, находить лучшую конфигурацию ресурсов",
      en: "Enjoys organizing, coordinating, finding the best configuration of resources"
    },
    key_characteristics: [
      "Flexible",
      "Coordinator",
      "Juggles many things",
      "Resourceful",
      "Multi-tasker"
    ],
    at_best: "Оптимизирует процессы и ресурсы",
    potential_blind_spot: "Может менять планы слишком часто",
    careers: ["Operations Manager", "Event Planner", "Chief of Staff"]
  },
  
  {
    id: "belief",
    number: 3,
    name: {
      ru: "Вера/Убеждения",
      en: "Belief"
    },
    domain: "EXECUTING",
    description: {
      ru: "Глубокие ценности и убеждения определяют действия, ориентирован на смысл",
      en: "Core values and beliefs define actions, meaning-oriented"
    },
    key_characteristics: [
      "Values-driven",
      "Principled",
      "Mission-oriented",
      "Committed",
      "Purposeful"
    ],
    at_best: "Приносит миссию и цель в работу",
    potential_blind_spot: "Может быть негибким в ценностях",
    careers: ["Nonprofit Leader", "Teacher", "Minister", "Social Worker"]
  },
  
  {
    id: "consistency",
    number: 4,
    name: {
      ru: "Последовательность",
      en: "Consistency"
    },
    domain: "EXECUTING",
    description: {
      ru: "Ценит справедливость, баланс и стабильные правила для всех",
      en: "Values fairness, balance, and stable rules for everyone"
    },
    key_characteristics: [
      "Fair",
      "Balanced",
      "Rule-oriented",
      "Consistent",
      "Equitable"
    ],
    at_best: "Создает справедливую среду",
    potential_blind_spot: "Может быть слишком жестким с правилами",
    careers: ["HR Manager", "Compliance Officer", "Judge"]
  },
  
  {
    id: "deliberative",
    number: 5,
    name: {
      ru: "Осмотрительность",
      en: "Deliberative"
    },
    domain: "EXECUTING",
    description: {
      ru: "Осторожен в принятии решений, предвидит риски, думает перед действием",
      en: "Careful in decisions, anticipates risks, thinks before acting"
    },
    key_characteristics: [
      "Careful",
      "Risk-aware",
      "Private",
      "Thoughtful",
      "Vigilant"
    ],
    at_best: "Предотвращает ошибки и риски",
    potential_blind_spot: "Может быть слишком медленным в решениях",
    careers: ["Risk Analyst", "Quality Assurance", "Legal Counsel"]
  },
  
  {
    id: "discipline",
    number: 6,
    name: {
      ru: "Дисциплина",
      en: "Discipline"
    },
    domain: "EXECUTING",
    description: {
      ru: "Любит структуру, порядок, рутины, планирование и предсказуемость",
      en: "Enjoys structure, order, routines, planning and predictability"
    },
    key_characteristics: [
      "Organized",
      "Structured",
      "Timely",
      "Precise",
      "Routine-oriented"
    ],
    at_best: "Создает порядок и системы",
    potential_blind_spot: "Может быть негибким к изменениям",
    careers: ["Project Manager", "Accountant", "Operations"]
  },
  
  {
    id: "focus",
    number: 7,
    name: {
      ru: "Фокус",
      en: "Focus"
    },
    domain: "EXECUTING",
    description: {
      ru: "Ставит цели и идет к ним не отвлекаясь, приоритизирует",
      en: "Sets goals and pursues them without distraction, prioritizes"
    },
    key_characteristics: [
      "Goal-oriented",
      "Prioritizes",
      "On track",
      "Directed",
      "Efficient"
    ],
    at_best: "Держит всех на цели",
    potential_blind_spot: "Может игнорировать важные отклонения",
    careers: ["CEO", "Athlete", "Surgeon"]
  },
  
  {
    id: "responsibility",
    number: 8,
    name: {
      ru: "Ответственность",
      en: "Responsibility"
    },
    domain: "EXECUTING",
    description: {
      ru: "Берет ownership, выполняет обещания, надежен",
      en: "Takes ownership, keeps commitments, dependable"
    },
    key_characteristics: [
      "Accountable",
      "Dependable",
      "Committed",
      "Trustworthy",
      "Conscientious"
    ],
    at_best: "Можно положиться",
    potential_blind_spot: "Берет слишком много на себя",
    careers: ["Manager", "Doctor", "Engineer"]
  },
  
  {
    id: "restorative",
    number: 9,
    name: {
      ru: "Восстановление",
      en: "Restorative"
    },
    domain: "EXECUTING",
    description: {
      ru: "Любит решать проблемы, чинить что сломано, находить решения",
      en: "Enjoys solving problems, fixing what's broken, finding solutions"
    },
    key_characteristics: [
      "Problem-solver",
      "Fixer",
      "Troubleshooter",
      "Analytical",
      "Solution-oriented"
    ],
    at_best: "Решает сложные проблемы",
    potential_blind_spot: "Фокусируется на негативе",
    careers: ["IT Support", "Consultant", "Mechanic", "Therapist"]
  }
];
```

### ДОМЕН 2: INFLUENCING (Влияние) - 8 тем

```javascript
const influencingThemes = [
  {
    id: "activator",
    number: 10,
    name: {
      ru: "Активатор",
      en: "Activator"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Превращает мысли в действия, нетерпелив, 'давайте начнем!'",
      en: "Turns thoughts into action, impatient, 'let's start!'"
    },
    key_characteristics: [
      "Action-oriented",
      "Catalyst",
      "Impatient",
      "Make it happen",
      "Initiator"
    ],
    at_best: "Запускает проекты",
    potential_blind_spot: "Действует до планирования",
    careers: ["Entrepreneur", "Sales", "Startup Founder"]
  },
  
  {
    id: "command",
    number: 11,
    name: {
      ru: "Командование",
      en: "Command"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Берет контроль, прямой, не боится конфликтов, лидер",
      en: "Takes charge, direct, not afraid of conflict, leader"
    },
    key_characteristics: [
      "Take charge",
      "Decisive",
      "Direct",
      "Confrontational",
      "Presence"
    ],
    at_best: "Лидер в кризисах",
    potential_blind_spot: "Может быть слишком доминирующим",
    careers: ["CEO", "Military Officer", "Crisis Manager"]
  },
  
  {
    id: "communication",
    number: 12,
    name: {
      ru: "Коммуникация",
      en: "Communication"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Легко выражает мысли, любит объяснять, хороший оратор",
      en: "Easily expresses thoughts, enjoys explaining, good speaker"
    },
    key_characteristics: [
      "Storyteller",
      "Presenter",
      "Expressive",
      "Articulate",
      "Engaging"
    ],
    at_best: "Вдохновляет через слова",
    potential_blind_spot: "Может говорить слишком много",
    careers: ["Teacher", "Presenter", "Journalist", "Marketing"]
  },
  
  {
    id: "competition",
    number: 13,
    name: {
      ru: "Конкуренция",
      en: "Competition"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Измеряет успех по сравнению с другими, любит побеждать",
      en: "Measures success against others, loves to win"
    },
    key_characteristics: [
      "Competitive",
      "Winner",
      "Compares",
      "Performance-driven",
      "First place"
    ],
    at_best: "Драйв к победе",
    potential_blind_spot: "Все превращает в соревнование",
    careers: ["Athlete", "Sales", "Trader", "Lawyer"]
  },
  
  {
    id: "maximizer",
    number: 14,
    name: {
      ru: "Максимизатор",
      en: "Maximizer"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Фокусируется на сильных сторонах, стремится к excellence",
      en: "Focuses on strengths, strives for excellence"
    },
    key_characteristics: [
      "Excellence",
      "Strengths-focused",
      "Quality",
      "Optimize",
      "Best possible"
    ],
    at_best: "Развивает таланты",
    potential_blind_spot: "Игнорирует слабости",
    careers: ["Coach", "Talent Developer", "Consultant"]
  },
  
  {
    id: "self_assurance",
    number: 15,
    name: {
      ru: "Уверенность в себе",
      en: "Self-Assurance"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Уверен в своих способностях и суждениях, внутренний компас",
      en: "Confident in abilities and judgments, inner compass"
    },
    key_characteristics: [
      "Confident",
      "Self-assured",
      "Independent",
      "Risk-taker",
      "Certain"
    ],
    at_best: "Уверенность в неопределенности",
    potential_blind_spot: "Может не слушать других",
    careers: ["Entrepreneur", "Executive", "Solo Professional"]
  },
  
  {
    id: "significance",
    number: 16,
    name: {
      ru: "Значимость",
      en: "Significance"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Хочет быть важным, recognized, оставить след",
      en: "Wants to be important, recognized, make a mark"
    },
    key_characteristics: [
      "Recognition-seeking",
      "Independent",
      "Stand out",
      "Make an impact",
      "Reputation"
    ],
    at_best: "Стремление к величию",
    potential_blind_spot: "Зависимость от признания",
    careers: ["Public Figure", "Politician", "Performer"]
  },
  
  {
    id: "woo",
    number: 17,
    name: {
      ru: "Обаяние (WOO)",
      en: "Woo (Winning Others Over)"
    },
    domain: "INFLUENCING",
    description: {
      ru: "Легко знакомится, любит встречать новых людей, социальный",
      en: "Easily connects, loves meeting new people, social"
    },
    key_characteristics: [
      "Social",
      "Networker",
      "Charming",
      "Connector",
      "People person"
    ],
    at_best: "Расширяет сеть контактов",
    potential_blind_spot: "Поверхностные отношения",
    careers: ["Sales", "PR", "Networking Professional", "Politician"]
  }
];
```

### ДОМЕН 3: RELATIONSHIP BUILDING (Построение отношений) - 9 тем

```javascript
const relationshipThemes = [
  {
    id: "adaptability",
    number: 18,
    name: {
      ru: "Адаптивность",
      en: "Adaptability"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Живет настоящим, гибкий, легко меняет курс",
      en: "Lives in the moment, flexible, easily changes course"
    },
    key_characteristics: [
      "Flexible",
      "Go with flow",
      "Present-focused",
      "Responsive",
      "Now"
    ],
    at_best: "Адаптируется к изменениям",
    potential_blind_spot: "Может не планировать заранее",
    careers: ["Emergency Responder", "Customer Service", "Consultant"]
  },
  
  {
    id: "connectedness",
    number: 19,
    name: {
      ru: "Связность",
      en: "Connectedness"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Видит связи между всеми вещами, верит что все происходит не случайно",
      en: "Sees connections between all things, believes nothing happens by chance"
    },
    key_characteristics: [
      "Interconnected",
      "Faith-oriented",
      "Bridge-builder",
      "Whole picture",
      "Spiritual"
    ],
    at_best: "Создает общее видение",
    potential_blind_spot: "Может быть слишком философским",
    careers: ["Counselor", "Minister", "Social Worker"]
  },
  
  {
    id: "developer",
    number: 20,
    name: {
      ru: "Развитие других",
      en: "Developer"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Видит потенциал в других, любит помогать людям расти",
      en: "Sees potential in others, loves helping people grow"
    },
    key_characteristics: [
      "Growth-focused",
      "Patient",
      "Encouraging",
      "Sees potential",
      "Mentor"
    ],
    at_best: "Развивает таланты других",
    potential_blind_spot: "Может быть слишком терпеливым",
    careers: ["Teacher", "Coach", "Manager", "HR"]
  },
  
  {
    id: "empathy",
    number: 21,
    name: {
      ru: "Эмпатия",
      en: "Empathy"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Чувствует эмоции других, может поставить себя на их место",
      en: "Senses others' emotions, can put themselves in others' shoes"
    },
    key_characteristics: [
      "Sensitive",
      "Caring",
      "Intuitive",
      "Understands feelings",
      "Compassionate"
    ],
    at_best: "Понимает людей глубоко",
    potential_blind_spot: "Может брать слишком много чужих эмоций",
    careers: ["Therapist", "UX Researcher", "HR", "Counselor"]
  },
  
  {
    id: "harmony",
    number: 22,
    name: {
      ru: "Гармония",
      en: "Harmony"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Ищет согласие, не любит конфликты, хочет мира",
      en: "Seeks consensus, dislikes conflict, wants peace"
    },
    key_characteristics: [
      "Consensus-builder",
      "Conflict-avoider",
      "Practical",
      "Agreement-seeker",
      "Harmonious"
    ],
    at_best: "Создает спокойную среду",
    potential_blind_spot: "Избегает нужных конфликтов",
    careers: ["Mediator", "Diplomat", "HR"]
  },
  
  {
    id: "includer",
    number: 23,
    name: {
      ru: "Включение",
      en: "Includer"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Включает всех, не любит когда кто-то остается в стороне",
      en: "Includes everyone, dislikes when someone is left out"
    },
    key_characteristics: [
      "Inclusive",
      "Welcoming",
      "Accepting",
      "Expands circle",
      "No one left out"
    ],
    at_best: "Создает inclusive среду",
    potential_blind_spot: "Может размывать стандарты",
    careers: ["Diversity Officer", "Community Manager", "Teacher"]
  },
  
  {
    id: "individualization",
    number: 24,
    name: {
      ru: "Индивидуализация",
      en: "Individualization"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Видит уникальность каждого человека, интересуется различиями",
      en: "Sees uniqueness of each person, interested in differences"
    },
    key_characteristics: [
      "Personalized",
      "Observant",
      "Intuitive about people",
      "Sees differences",
      "Customizer"
    ],
    at_best: "Использует уникальные таланты",
    potential_blind_spot: "Может не видеть общие паттерны",
    careers: ["Coach", "Talent Manager", "Customization Specialist"]
  },
  
  {
    id: "positivity",
    number: 25,
    name: {
      ru: "Позитивность",
      en: "Positivity"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Энтузиазм, оптимизм, заряжает других энергией",
      en: "Enthusiasm, optimism, energizes others"
    },
    key_characteristics: [
      "Enthusiastic",
      "Upbeat",
      "Praise-giver",
      "Optimistic",
      "Fun"
    ],
    at_best: "Поднимает настроение команды",
    potential_blind_spot: "Может игнорировать реальные проблемы",
    careers: ["Motivational Speaker", "Events", "Marketing", "Teacher"]
  },
  
  {
    id: "relator",
    number: 26,
    name: {
      ru: "Близкие отношения",
      en: "Relator"
    },
    domain: "RELATIONSHIP_BUILDING",
    description: {
      ru: "Строит глубокие отношения с немногими, ценит близость",
      en: "Builds deep relationships with few, values closeness"
    },
    key_characteristics: [
      "Deep relationships",
      "Genuine",
      "Trusting",
      "Close friends",
      "Authentic"
    ],
    at_best: "Создает глубокое доверие",
    potential_blind_spot: "Может быть слишком избирательным",
    careers: ["Therapist", "Account Manager", "Executive Assistant"]
  }
];
```

### ДОМЕН 4: STRATEGIC THINKING (Стратегическое мышление) - 8 тем

```javascript
const strategicThemes = [
  {
    id: "analytical",
    number: 27,
    name: {
      ru: "Аналитик",
      en: "Analytical"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Ищет причины и следствия, думает о факторах, доказательствах",
      en: "Searches for reasons and causes, thinks about factors, evidence"
    },
    key_characteristics: [
      "Logical",
      "Data-driven",
      "Proof-seeking",
      "Objective",
      "Critical thinker"
    ],
    at_best: "Находит паттерны в данных",
    potential_blind_spot: "Может быть слишком скептичным",
    careers: ["Data Scientist", "Researcher", "Analyst", "Engineer"]
  },
  
  {
    id: "context",
    number: 28,
    name: {
      ru: "Контекст",
      en: "Context"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Смотрит в прошлое чтобы понять настоящее, учится на истории",
      en: "Looks to the past to understand present, learns from history"
    },
    key_characteristics: [
      "Historical perspective",
      "Learns from past",
      "Background-seeker",
      "Roots",
      "Foundation"
    ],
    at_best: "Использует уроки прошлого",
    potential_blind_spot: "Может застрять в прошлом",
    careers: ["Historian", "Archivist", "Strategic Planner"]
  },
  
  {
    id: "futuristic",
    number: 29,
    name: {
      ru: "Футуризм",
      en: "Futuristic"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Вдохновлен будущим, видит что может быть, мечтатель",
      en: "Inspired by the future, sees what could be, dreamer"
    },
    key_characteristics: [
      "Visionary",
      "Future-focused",
      "Dreamer",
      "Possibilities",
      "Tomorrow"
    ],
    at_best: "Создает inspiring vision",
    potential_blind_spot: "Может игнорировать настоящее",
    careers: ["Innovator", "Strategic Planner", "Futurist"]
  },
  
  {
    id: "ideation",
    number: 30,
    name: {
      ru: "Генерация идей",
      en: "Ideation"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Генерирует идеи, видит связи, креативен",
      en: "Generates ideas, sees connections, creative"
    },
    key_characteristics: [
      "Creative",
      "Idea generator",
      "Innovative",
      "Sees connections",
      "Novelty"
    },
    at_best: "Новые перспективы и идеи",
    potential_blind_spot: "Может не доводить до конца",
    careers: ["Designer", "R&D", "Innovation Consultant", "Entrepreneur"]
  },
  
  {
    id: "input",
    number: 31,
    name: {
      ru: "Сбор информации",
      en: "Input"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Любопытен, собирает информацию, коллекционер знаний",
      en: "Curious, collects information, knowledge collector"
    },
    key_characteristics: [
      "Curious",
      "Collector",
      "Resourceful",
      "Inquisitive",
      "Archive"
    ],
    at_best: "Огромная база знаний",
    potential_blind_spot: "Может накапливать слишком много",
    careers: ["Librarian", "Researcher", "Curator", "Journalist"]
  },
  
  {
    id: "intellection",
    number: 32,
    name: {
      ru: "Размышление",
      en: "Intellection"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Любит думать, размышлять, интеллектуальные дискуссии",
      en: "Loves to think, ponder, intellectual discussions"
    },
    key_characteristics: [
      "Introspective",
      "Thinker",
      "Reflective",
      "Philosophical",
      "Deep thought"
    ],
    at_best: "Глубокий анализ",
    potential_blind_spot: "Может быть слишком в голове",
    careers: ["Philosopher", "Writer", "Researcher", "Strategist"]
  },
  
  {
    id: "learner",
    number: 33,
    name: {
      ru: "Ученик",
      en: "Learner"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Любит учиться, процесс обучения energizing, от новичка к компетентному",
      en: "Loves to learn, learning process is energizing, novice to competent"
    },
    key_characteristics: [
      "Learning-focused",
      "Growth mindset",
      "Curious",
      "Student",
      "Process-oriented"
    },
    at_best: "Постоянное развитие",
    potential_blind_spot: "Может не применять знания",
    careers: ["Teacher", "Researcher", "Student Affairs", "Trainer"]
  },
  
  {
    id: "strategic",
    number: 34,
    name: {
      ru: "Стратегия",
      en: "Strategic"
    },
    domain: "STRATEGIC_THINKING",
    description: {
      ru: "Видит альтернативные пути, думает 'а что если', сценарии",
      en: "Sees alternative pathways, thinks 'what if', scenarios"
    },
    key_characteristics: [
      "Pattern recognition",
      "Scenario planning",
      "Alternative paths",
      "Big picture",
      "Anticipate"
    },
    at_best: "Находит лучший путь",
    potential_blind_spot: "Может overthink",
    careers: ["Strategy Consultant", "CEO", "Chess Player", "Military"]
  }
];
```

---

## 📝 Структура Вопросов (177 вопросов)

### Формат вопроса (Paired Statements):

```javascript
{
  "question_id": "cs_q001",
  "question_number": 1,
  "format": "paired_statements",
  "time_limit_seconds": 20,  // ВАЖНО! Ограничение времени
  
  "statement_pair": {
    "left": {
      "id": "a",
      "text": {
        "ru": "Я читаю инструкции внимательно",
        "en": "I read instructions carefully"
      },
      "themes_measured": ["Discipline", "Deliberative"]
    },
    "right": {
      "id": "b",
      "text": {
        "ru": "Я доверяю своей интуиции",
        "en": "I trust my instincts"
      },
      "themes_measured": ["Self-Assurance", "Activator"]
    }
  },
  
  "response_scale": {
    "strongly_left": -3,
    "moderately_left": -2,
    "slightly_left": -1,
    "neutral": 0,
    "slightly_right": 1,
    "moderately_right": 2,
    "strongly_right": 3
  }
}
```

**Критические особенности:**

1. **Forced Choice** - нельзя выбрать "оба одинаково"
2. **Время ограничено** - 20 секунд на вопрос (интуитивный ответ)
3. **Парные утверждения** - всегда выбор между двумя

---

## 🧮 Алгоритм Подсчета (Упрощенная версия)

**Примечание:** Оригинальный алгоритм Gallup - проприетарный. Это упрощенная версия.

### Шаг 1: Подсчет сырых баллов по темам

```python
def calculate_theme_scores(answers):
    """
    Подсчитать сырые баллы для каждой из 34 тем
    
    Args:
        answers: dict {question_id: response_value (-3 to +3)}
    
    Returns:
        dict {theme: raw_score}
    """
    
    theme_scores = {theme: 0 for theme in ALL_34_THEMES}
    
    questions_db = get_clifton_questions()
    
    for question_id, response in answers.items():
        question = questions_db[question_id]
        
        # Левое утверждение
        if response < 0:
            intensity = abs(response)  # 1, 2, or 3
            for theme in question['statement_pair']['left']['themes_measured']:
                theme_scores[theme] += intensity
        
        # Правое утверждение
        elif response > 0:
            intensity = response  # 1, 2, or 3
            for theme in question['statement_pair']['right']['themes_measured']:
                theme_scores[theme] += intensity
    
    return theme_scores

# Пример результата:
# {
#     "achiever": 45,
#     "activator": 38,
#     "analytical": 52,
#     "learner": 48,
#     "strategic": 41,
#     ...
#     "harmony": 18,
#     "consistency": 15
# }
```

### Шаг 2: Ранжирование тем

```python
def rank_themes(theme_scores):
    """
    Ранжировать все 34 темы от наиболее выраженной к наименее
    """
    
    ranked = sorted(
        theme_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    ranked_themes = []
    for position, (theme, score) in enumerate(ranked, start=1):
        ranked_themes.append({
            "rank": position,
            "theme": theme,
            "raw_score": score,
            "tier": determine_tier(position)
        })
    
    return ranked_themes

def determine_tier(rank):
    """Определить уровень темы"""
    if rank <= 5:
        return "signature"  # Топ-5 signature strengths
    elif rank <= 10:
        return "supporting"
    elif rank <= 20:
        return "moderate"
    elif rank <= 29:
        return "lesser"
    else:
        return "blind_spot"  # Bottom 5

# Пример:
# [
#     {"rank": 1, "theme": "analytical", "score": 52, "tier": "signature"},
#     {"rank": 2, "theme": "learner", "score": 48, "tier": "signature"},
#     {"rank": 3, "theme": "achiever", "score": 45, "tier": "signature"},
#     {"rank": 4, "theme": "strategic", "score": 41, "tier": "signature"},
#     {"rank": 5, "theme": "ideation", "score": 40, "tier": "signature"},
#     ...
#     {"rank": 34, "theme": "consistency", "score": 15, "tier": "blind_spot"}
# ]
```

### Шаг 3: Определение доминирующего домена

```python
def determine_dominant_domain(top_5_themes):
    """
    Определить какой домен наиболее представлен в топ-5
    """
    
    domain_count = {
        "EXECUTING": 0,
        "INFLUENCING": 0,
        "RELATIONSHIP_BUILDING": 0,
        "STRATEGIC_THINKING": 0
    }
    
    for theme_data in top_5_themes:
        theme = theme_data['theme']
        domain = THEME_TO_DOMAIN[theme]
        domain_count[domain] += 1
    
    dominant_domain = max(domain_count, key=domain_count.get)
    
    return {
        "dominant_domain": dominant_domain,
        "distribution": domain_count
    }

# Пример:
# Top 5: Analytical, Learner, Achiever, Strategic, Ideation
# 
# Distribution:
# STRATEGIC_THINKING: 3 (Analytical, Learner, Strategic, Ideation)
# EXECUTING: 1 (Achiever)
# 
# Dominant: STRATEGIC_THINKING
```

---

## 📊 Полная Структура Результата (JSON)

```json
{
  "test_id": "clifton-strengths",
  "user_id": "uuid-here",
  "completed_at": "2024-01-15T15:00:00Z",
  "duration_seconds": 2156,
  
  "raw_answers": {
    "cs_q001": -2,
    "cs_q002": 3,
    "cs_q003": 1,
    "...": "..."
  },
  
  "theme_raw_scores": {
    "analytical": 52,
    "learner": 48,
    "achiever": 45,
    "strategic": 41,
    "ideation": 40,
    "...": "...",
    "consistency": 15,
    "woo": 12
  },
  
  "ranked_themes": [
    {"rank": 1, "theme": "analytical", "score": 52, "tier": "signature"},
    {"rank": 2, "theme": "learner", "score": 48, "tier": "signature"},
    {"rank": 3, "theme": "achiever", "score": 45, "tier": "signature"},
    {"rank": 4, "theme": "strategic", "score": 41, "tier": "signature"},
    {"rank": 5, "theme": "ideation", "score": 40, "tier": "signature"},
    "... 29 more themes ...",
    {"rank": 34, "theme": "woo", "score": 12, "tier": "blind_spot"}
  ],
  
  "top_5_signature_strengths": [
    "analytical",
    "learner",
    "achiever",
    "strategic",
    "ideation"
  ],
  
  "domain_analysis": {
    "dominant_domain": "STRATEGIC_THINKING",
    "distribution": {
      "STRATEGIC_THINKING": 4,
      "EXECUTING": 1,
      "INFLUENCING": 0,
      "RELATIONSHIP_BUILDING": 0
    }
  },
  
  "interpretation": {
    "profile_title": "Strategic Learner",
    "subtitle": "Думающий достигатор с аналитическим подходом",
    
    "overall_summary": """
    Ваши топ-5 Signature Strengths:
    1. Analytical - Аналитик
    2. Learner - Ученик
    3. Achiever - Достигатор
    4. Strategic - Стратег
    5. Ideation - Генератор идей
    
    Вы - STRATEGIC THINKER (4 из 5 тем из этого домена).
    
    Это означает:
    - Вы думаете и анализируете прежде чем действовать
    - Постоянно учитесь и растете
    - Генерируете идеи и видите паттерны
    - Достигаете целей через умные стратегии
    
    Редкая и ценная комбинация!
    """
  }
}
```

---

**ВАЖНО:** Из-за ограничения контекста, я создал концептуальную спецификацию CliftonStrengths. 

Полная реализация 177 вопросов потребует:
- Отдельный файл с questions database
- Proprietary алгоритм Gallup (мы используем упрощенную версию)
- Лицензирование от Gallup (оригинальный тест защищен)

**Рекомендация:** Создать упрощенную "Strengths Assessment" версию с:
- 60-80 вопросов (вместо 177)
- 15-20 тем (вместо 34)
- Собственный алгоритм

Или купить лицензию у Gallup для оригинального теста.

---

**CliftonStrengths концепция готова!** 

Продолжаем с AI-анализом для всех 10 тестов?