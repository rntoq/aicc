# 🔧 Техническая Интеграция Тестов
## Полная Спецификация: Вопросы, Скоринг, Анализ

---

# Тест 1: Holland Code (RIASEC) Assessment

## 📊 Общая Информация

**ID теста:** `holland-code-riasec`  
**Версия:** 1.0  
**Вопросов:** 48 (по 8 на каждый тип)  
**Время:** 15 минут  
**Тип ответов:** Шкала Ликерта 1-5  

---

## 📝 Структура Вопросов

### Формат вопроса:
```json
{
  "question_id": "holland_r_01",
  "text": {
    "ru": "Мне нравится работать руками и создавать вещи",
    "kk": "Маған қолыммен жұмыс істеп, заттар жасау ұнайды",
    "en": "I enjoy working with my hands and building things"
  },
  "category": "R",
  "weight": 1.0,
  "reverse_scored": false
}
```

### Шкала ответов:
```json
{
  "1": {"label": "Совершенно не согласен", "value": 1},
  "2": {"label": "Скорее не согласен", "value": 2},
  "3": {"label": "Нейтрально", "value": 3},
  "4": {"label": "Скорее согласен", "value": 4},
  "5": {"label": "Полностью согласен", "value": 5}
}
```

---

## 📋 Полный Список Вопросов (48)

### R - Realistic (Реалистичный) - 8 вопросов

```javascript
const realisticQuestions = [
  {
    id: "holland_r_01",
    text: "Мне нравится работать руками и создавать вещи",
    category: "R",
    weight: 1.0
  },
  {
    id: "holland_r_02",
    text: "Я предпочитаю практическую работу теоретической",
    category: "R",
    weight: 1.0
  },
  {
    id: "holland_r_03",
    text: "Мне интересно чинить и ремонтировать предметы",
    category: "R",
    weight: 1.0
  },
  {
    id: "holland_r_04",
    text: "Я бы хотел работать с инструментами и техникой",
    category: "R",
    weight: 1.0
  },
  {
    id: "holland_r_05",
    text: "Мне нравится работать на открытом воздухе",
    category: "R",
    weight: 0.8
  },
  {
    id: "holland_r_06",
    text: "Я люблю строить и конструировать",
    category: "R",
    weight: 1.0
  },
  {
    id: "holland_r_07",
    text: "Мне интересна работа с машинами и механизмами",
    category: "R",
    weight: 1.0
  },
  {
    id: "holland_r_08",
    text: "Я предпочитаю физическую работу умственной",
    category: "R",
    weight: 0.9
  }
];
```

### I - Investigative (Исследовательский) - 8 вопросов

```javascript
const investigativeQuestions = [
  {
    id: "holland_i_01",
    text: "Мне нравится решать сложные логические задачи",
    category: "I",
    weight: 1.0
  },
  {
    id: "holland_i_02",
    text: "Я люблю анализировать данные и находить закономерности",
    category: "I",
    weight: 1.0
  },
  {
    id: "holland_i_03",
    text: "Меня привлекают научные исследования",
    category: "I",
    weight: 1.0
  },
  {
    id: "holland_i_04",
    text: "Я предпочитаю работу, требующую глубокого мышления",
    category: "I",
    weight: 1.0
  },
  {
    id: "holland_i_05",
    text: "Мне интересно изучать, как устроены вещи",
    category: "I",
    weight: 1.0
  },
  {
    id: "holland_i_06",
    text: "Я люблю проводить эксперименты",
    category: "I",
    weight: 0.9
  },
  {
    id: "holland_i_07",
    text: "Мне нравится работать с абстрактными концепциями",
    category: "I",
    weight: 1.0
  },
  {
    id: "holland_i_08",
    text: "Я предпочитаю самостоятельно разбираться в проблемах",
    category: "I",
    weight: 0.8
  }
];
```

### A - Artistic (Артистичный) - 8 вопросов

```javascript
const artisticQuestions = [
  {
    id: "holland_a_01",
    text: "Мне нравится выражать себя через творчество",
    category: "A",
    weight: 1.0
  },
  {
    id: "holland_a_02",
    text: "Я люблю работать над креативными проектами",
    category: "A",
    weight: 1.0
  },
  {
    id: "holland_a_03",
    text: "Мне интересно заниматься искусством или дизайном",
    category: "A",
    weight: 1.0
  },
  {
    id: "holland_a_04",
    text: "Я ценю красоту и эстетику",
    category: "A",
    weight: 0.9
  },
  {
    id: "holland_a_05",
    text: "Мне нравится создавать что-то уникальное",
    category: "A",
    weight: 1.0
  },
  {
    id: "holland_a_06",
    text: "Я предпочитаю неструктурированную творческую работу",
    category: "A",
    weight: 1.0
  },
  {
    id: "holland_a_07",
    text: "Мне интересно писать, рисовать или сочинять музыку",
    category: "A",
    weight: 1.0
  },
  {
    id: "holland_a_08",
    text: "Я люблю экспериментировать с новыми идеями",
    category: "A",
    weight: 0.9
  }
];
```

### S - Social (Социальный) - 8 вопросов

```javascript
const socialQuestions = [
  {
    id: "holland_s_01",
    text: "Мне нравится помогать другим людям",
    category: "S",
    weight: 1.0
  },
  {
    id: "holland_s_02",
    text: "Я люблю работать в команде",
    category: "S",
    weight: 1.0
  },
  {
    id: "holland_s_03",
    text: "Мне интересно обучать и наставлять других",
    category: "S",
    weight: 1.0
  },
  {
    id: "holland_s_04",
    text: "Я легко нахожу общий язык с людьми",
    category: "S",
    weight: 0.9
  },
  {
    id: "holland_s_05",
    text: "Мне важно делать мир лучше",
    category: "S",
    weight: 1.0
  },
  {
    id: "holland_s_06",
    text: "Я предпочитаю работу с людьми работе с вещами",
    category: "S",
    weight: 1.0
  },
  {
    id: "holland_s_07",
    text: "Мне нравится заботиться о других",
    category: "S",
    weight: 0.9
  },
  {
    id: "holland_s_08",
    text: "Я ценю возможность поддерживать людей",
    category: "S",
    weight: 1.0
  }
];
```

### E - Enterprising (Предпринимательский) - 8 вопросов

```javascript
const enterprisingQuestions = [
  {
    id: "holland_e_01",
    text: "Мне нравится быть лидером и принимать решения",
    category: "E",
    weight: 1.0
  },
  {
    id: "holland_e_02",
    text: "Я люблю убеждать и влиять на других",
    category: "E",
    weight: 1.0
  },
  {
    id: "holland_e_03",
    text: "Меня привлекает бизнес и предпринимательство",
    category: "E",
    weight: 1.0
  },
  {
    id: "holland_e_04",
    text: "Мне интересно продавать идеи или продукты",
    category: "E",
    weight: 1.0
  },
  {
    id: "holland_e_05",
    text: "Я готов рисковать ради достижения целей",
    category: "E",
    weight: 0.9
  },
  {
    id: "holland_e_06",
    text: "Мне нравится конкурировать и побеждать",
    category: "E",
    weight: 0.8
  },
  {
    id: "holland_e_07",
    text: "Я предпочитаю руководить, а не подчиняться",
    category: "E",
    weight: 1.0
  },
  {
    id: "holland_e_08",
    text: "Мне интересны власть и влияние",
    category: "E",
    weight: 0.9
  }
];
```

### C - Conventional (Конвенциональный) - 8 вопросов

```javascript
const conventionalQuestions = [
  {
    id: "holland_c_01",
    text: "Мне нравится организовывать и систематизировать",
    category: "C",
    weight: 1.0
  },
  {
    id: "holland_c_02",
    text: "Я предпочитаю четкие инструкции и правила",
    category: "C",
    weight: 1.0
  },
  {
    id: "holland_c_03",
    text: "Мне интересна работа с данными и цифрами",
    category: "C",
    weight: 1.0
  },
  {
    id: "holland_c_04",
    text: "Я люблю порядок и структуру",
    category: "C",
    weight: 1.0
  },
  {
    id: "holland_c_05",
    text: "Мне нравится точная и детальная работа",
    category: "C",
    weight: 1.0
  },
  {
    id: "holland_c_06",
    text: "Я предпочитаю проверенные методы новым экспериментам",
    category: "C",
    weight: 0.9
  },
  {
    id: "holland_c_07",
    text: "Мне интересно вести записи и документацию",
    category: "C",
    weight: 0.8
  },
  {
    id: "holland_c_08",
    text: "Я ценю стабильность и предсказуемость",
    category: "C",
    weight: 0.9
  }
];
```

---

## 🧮 Алгоритм Подсчета (Scoring)

### Шаг 1: Подсчет сырых баллов

```python
def calculate_raw_scores(answers):
    """
    Подсчет сырых баллов по каждой категории
    
    Args:
        answers: dict {question_id: answer_value}
    
    Returns:
        dict {category: raw_score}
    """
    scores = {
        'R': 0, 'I': 0, 'A': 0, 
        'S': 0, 'E': 0, 'C': 0
    }
    
    questions_db = get_all_questions()  # Получить все вопросы из БД
    
    for question_id, answer_value in answers.items():
        question = questions_db[question_id]
        category = question['category']
        weight = question['weight']
        
        # Применить вес
        weighted_score = answer_value * weight
        scores[category] += weighted_score
    
    return scores

# Пример:
# Пользователь ответил на все R вопросы по 5 баллов
# R_score = (5*1.0 + 5*1.0 + 5*1.0 + 5*1.0 + 5*0.8 + 5*1.0 + 5*1.0 + 5*0.9)
# R_score = 38.5 (максимум ~40)
```

### Шаг 2: Нормализация (0-100)

```python
def normalize_scores(raw_scores):
    """
    Нормализация баллов в диапазон 0-100
    """
    max_possible_per_category = 40  # 8 вопросов * 5 баллов
    
    normalized = {}
    for category, raw_score in raw_scores.items():
        normalized[category] = round((raw_score / max_possible_per_category) * 100, 2)
    
    return normalized

# Пример:
# raw_scores = {'R': 38.5, 'I': 32, 'A': 28, 'S': 20, 'E': 15, 'C': 25}
# normalized = {'R': 96.25, 'I': 80.0, 'A': 70.0, 'S': 50.0, 'E': 37.5, 'C': 62.5}
```

### Шаг 3: Определение Holland Code

```python
def determine_holland_code(normalized_scores):
    """
    Определить 3-буквенный Holland Code
    """
    # Сортировать по баллам (от большего к меньшему)
    sorted_categories = sorted(
        normalized_scores.items(), 
        key=lambda x: x[1], 
        reverse=True
    )
    
    # Взять топ-3
    top_3 = [cat for cat, score in sorted_categories[:3]]
    holland_code = ''.join(top_3)
    
    return {
        'code': holland_code,
        'primary': top_3[0],
        'secondary': top_3[1],
        'tertiary': top_3[2],
        'primary_score': sorted_categories[0][1],
        'secondary_score': sorted_categories[1][1],
        'tertiary_score': sorted_categories[2][1]
    }

# Пример:
# normalized_scores = {'R': 96.25, 'I': 80.0, 'A': 70.0, ...}
# result = {
#     'code': 'RIA',
#     'primary': 'R',
#     'secondary': 'I',
#     'tertiary': 'A',
#     'primary_score': 96.25,
#     'secondary_score': 80.0,
#     'tertiary_score': 70.0
# }
```

---

## 📊 Результаты и Интерпретация

### Структура результата (JSON)

```json
{
  "test_id": "holland-code-riasec",
  "user_id": "uuid-here",
  "completed_at": "2024-01-15T10:30:00Z",
  "duration_seconds": 847,
  
  "raw_scores": {
    "R": 38.5,
    "I": 32.0,
    "A": 28.0,
    "S": 20.0,
    "E": 15.0,
    "C": 25.0
  },
  
  "normalized_scores": {
    "R": 96.25,
    "I": 80.0,
    "A": 70.0,
    "S": 50.0,
    "E": 37.5,
    "C": 62.5
  },
  
  "holland_code": {
    "code": "RIA",
    "primary": "R",
    "secondary": "I",
    "tertiary": "A",
    "primary_score": 96.25,
    "secondary_score": 80.0,
    "tertiary_score": 70.0
  },
  
  "interpretation": {
    "primary_type": {
      "code": "R",
      "name": "Realistic (Реалистичный)",
      "description": "Вы предпочитаете практическую работу с конкретными результатами. Вам нравится работать руками, с инструментами и техникой.",
      "strengths": [
        "Практические навыки",
        "Техническая компетентность",
        "Умение работать с инструментами",
        "Физическая координация"
      ],
      "work_preferences": [
        "Конкретные задачи",
        "Видимые результаты",
        "Работа с вещами",
        "Практическое применение"
      ],
      "suitable_environments": [
        "Мастерские",
        "Лаборатории",
        "На открытом воздухе",
        "Производство"
      ]
    },
    
    "career_suggestions": [
      {
        "title": "Software Engineer",
        "match_percentage": 92,
        "reason": "Сочетает техническую работу (R), аналитическое мышление (I) и творческое решение проблем (A)"
      },
      {
        "title": "Mechanical Engineer",
        "match_percentage": 90,
        "reason": "Идеально для RIA: работа с техникой, исследования и дизайн"
      },
      {
        "title": "Architect",
        "match_percentage": 88,
        "reason": "Практическое строительство + анализ + творчество"
      },
      {
        "title": "Industrial Designer",
        "match_percentage": 85,
        "reason": "Техническая работа с сильным творческим компонентом"
      },
      {
        "title": "Civil Engineer",
        "match_percentage": 83,
        "reason": "Практическое строительство с аналитическим подходом"
      }
    ],
    
    "avoid_careers": [
      {
        "title": "Social Worker",
        "reason": "Требует высокого S (Social), у вас низкий: 50%"
      },
      {
        "title": "Sales Manager",
        "reason": "Требует высокого E (Enterprising), у вас: 37.5%"
      }
    ],
    
    "development_suggestions": [
      "Развивайте технические навыки через практические проекты",
      "Изучайте программирование или инженерное дело",
      "Участвуйте в хакатонах или maker-проектах",
      "Рассмотрите курсы по CAD/3D моделированию"
    ]
  },
  
  "percentiles": {
    "R": 95,
    "I": 78,
    "A": 65,
    "S": 45,
    "E": 30,
    "C": 58
  },
  
  "consistency_score": 0.85,
  
  "next_steps": [
    "Explore RIA careers in detail",
    "Take Photo Career Quiz to confirm visual preferences",
    "Review university programs for Engineering/CS"
  ]
}
```

---

## 🎯 Детальная Интерпретация Каждого Типа

### R - Realistic (Реалистичный)

```python
R_INTERPRETATION = {
    "name": {
        "ru": "Реалистичный",
        "kk": "Шынайы",
        "en": "Realistic"
    },
    
    "description": {
        "short": "Практик, работающий руками и с техникой",
        "long": """
        Реалистичный тип предпочитает конкретную, практическую работу.
        Вы любите видеть ощутимые результаты своего труда. Вам комфортно
        работать с инструментами, машинами и техникой. Вы цените физическую
        активность и практическое применение знаний.
        """
    },
    
    "characteristics": [
        "Практичный и реалистичный",
        "Любит работать руками",
        "Предпочитает действие словам",
        "Технически одарен",
        "Физически координирован",
        "Прямолинейный и честный",
        "Независимый",
        "Настойчивый"
    ],
    
    "strengths": [
        "Механические навыки",
        "Техническая компетентность",
        "Физическая сила и выносливость",
        "Пространственное мышление",
        "Умение работать с инструментами",
        "Практическое решение проблем"
    ],
    
    "work_values": [
        "Конкретные результаты",
        "Практическое применение",
        "Работа с вещами (не людьми)",
        "Физическая активность",
        "Четкие задачи"
    ],
    
    "ideal_environment": [
        "Мастерская или лаборатория",
        "На открытом воздухе",
        "Производство",
        "Строительная площадка",
        "Ферма или природа"
    ],
    
    "career_fields": [
        {
            "field": "Инженерия",
            "careers": [
                "Mechanical Engineer",
                "Civil Engineer",
                "Electrical Engineer",
                "Aerospace Engineer"
            ]
        },
        {
            "field": "IT и Технологии",
            "careers": [
                "Software Engineer",
                "Network Administrator",
                "IT Support Specialist",
                "Systems Analyst"
            ]
        },
        {
            "field": "Строительство",
            "careers": [
                "Architect",
                "Construction Manager",
                "Carpenter",
                "Electrician"
            ]
        },
        {
            "field": "Транспорт",
            "careers": [
                "Pilot",
                "Mechanic",
                "Automotive Engineer"
            ]
        },
        {
            "field": "Сельское хозяйство",
            "careers": [
                "Agricultural Engineer",
                "Farmer",
                "Veterinarian"
            ]
        }
    ],
    
    "famous_people_example": [
        "Илон Маск (SpaceX, Tesla)",
        "Стив Возняк (Apple co-founder)",
        "Генри Форд (Ford Motor Company)"
    ],
    
    "learning_style": "Практическое обучение через действие",
    
    "potential_challenges": [
        "Может не хватать терпения для длительных обсуждений",
        "Предпочитает действовать, а не планировать",
        "Может быть нетерпелив с абстрактными концепциями"
    ]
}
```

### I - Investigative (Исследовательский)

```python
I_INTERPRETATION = {
    "name": {
        "ru": "Исследовательский",
        "kk": "Зерттеушілік",
        "en": "Investigative"
    },
    
    "description": {
        "short": "Аналитик, решающий сложные проблемы",
        "long": """
        Исследовательский тип любит анализировать, исследовать и решать
        сложные проблемы. Вы предпочитаете работу, требующую глубокого
        мышления и интеллектуального вызова. Вам интересно понимать,
        как устроен мир, находить закономерности и открывать новое.
        """
    },
    
    "characteristics": [
        "Аналитический ум",
        "Любознательный",
        "Логичный и рациональный",
        "Независимый мыслитель",
        "Точный и методичный",
        "Интеллектуально уверенный",
        "Предпочитает теорию практике",
        "Склонен к исследованиям"
    ],
    
    "strengths": [
        "Аналитическое мышление",
        "Решение сложных проблем",
        "Научное мышление",
        "Критическое мышление",
        "Работа с данными",
        "Математические способности"
    ],
    
    "work_values": [
        "Интеллектуальные вызовы",
        "Автономия в работе",
        "Возможность исследовать",
        "Логика и рациональность",
        "Глубокое понимание"
    ],
    
    "ideal_environment": [
        "Исследовательская лаборатория",
        "Университет или академия",
        "R&D отдел",
        "Библиотека",
        "Тихое место для концентрации"
    ],
    
    "career_fields": [
        {
            "field": "Наука",
            "careers": [
                "Research Scientist",
                "Biologist",
                "Chemist",
                "Physicist",
                "Astronomer"
            ]
        },
        {
            "field": "Медицина",
            "careers": [
                "Doctor",
                "Medical Researcher",
                "Pharmacist",
                "Pathologist"
            ]
        },
        {
            "field": "IT и Данные",
            "careers": [
                "Data Scientist",
                "AI Researcher",
                "Systems Analyst",
                "Cybersecurity Analyst"
            ]
        },
        {
            "field": "Математика",
            "careers": [
                "Mathematician",
                "Statistician",
                "Actuary",
                "Economist"
            ]
        }
    ],
    
    "famous_people_example": [
        "Альберт Эйнштейн",
        "Мария Кюри",
        "Стивен Хокинг"
    ],
    
    "learning_style": "Самостоятельное исследование и анализ",
    
    "potential_challenges": [
        "Может быть слишком теоретичным",
        "Предпочитает одиночную работу",
        "Может игнорировать практические аспекты"
    ]
}
```

### A - Artistic (Артистичный)

```python
A_INTERPRETATION = {
    "name": {
        "ru": "Артистичный",
        "kk": "Шығармашылық",
        "en": "Artistic"
    },
    
    "description": {
        "short": "Творец, выражающий себя через искусство",
        "long": """
        Артистичный тип ценит красоту, оригинальность и самовыражение.
        Вы любите создавать что-то новое и уникальное. Вам важна
        свобода творчества и возможность выражать свои идеи. Вы
        предпочитаете неструктурированную работу, где есть место
        для креативности и инноваций.
        """
    },
    
    "characteristics": [
        "Креативный и оригинальный",
        "Независимый",
        "Экспрессивный",
        "Идеалистичный",
        "Интуитивный",
        "Нонконформист",
        "Эмоциональный",
        "Открытый новому опыту"
    ],
    
    "strengths": [
        "Творческое мышление",
        "Художественные способности",
        "Оригинальность идей",
        "Визуальное восприятие",
        "Эстетический вкус",
        "Инновационность"
    ],
    
    "work_values": [
        "Свобода самовыражения",
        "Творческая автономия",
        "Эстетическая ценность",
        "Оригинальность",
        "Гибкость"
    ],
    
    "ideal_environment": [
        "Творческая студия",
        "Свободное пространство",
        "Вдохновляющая обстановка",
        "Без жестких правил",
        "Креативная атмосфера"
    ],
    
    "career_fields": [
        {
            "field": "Дизайн",
            "careers": [
                "Graphic Designer",
                "UI/UX Designer",
                "Interior Designer",
                "Fashion Designer",
                "Industrial Designer"
            ]
        },
        {
            "field": "Искусство",
            "careers": [
                "Artist",
                "Illustrator",
                "Photographer",
                "Animator"
            ]
        },
        {
            "field": "Медиа",
            "careers": [
                "Video Editor",
                "Content Creator",
                "Film Director",
                "Creative Director"
            ]
        },
        {
            "field": "Писательство",
            "careers": [
                "Writer",
                "Journalist",
                "Copywriter",
                "Screenwriter"
            ]
        },
        {
            "field": "Музыка",
            "careers": [
                "Musician",
                "Composer",
                "Sound Designer",
                "Music Producer"
            ]
        }
    ],
    
    "famous_people_example": [
        "Леонардо да Винчи",
        "Пабло Пикассо",
        "Стив Джобс (дизайн)"
    ],
    
    "learning_style": "Визуальное и экспериментальное обучение",
    
    "potential_challenges": [
        "Может не любить рутину",
        "Предпочитает креатив структуре",
        "Может быть непрактичным"
    ]
}
```

[Аналогично для S, E, C типов...]

---

## 🔄 Комбинации Holland Codes

### Интерпретация 3-буквенных кодов

```python
HOLLAND_CODE_COMBINATIONS = {
    "RIA": {
        "name": "Техно-Креатор",
        "description": "Сочетание технических навыков, аналитического мышления и творчества",
        "ideal_careers": [
            "Software Engineer",
            "Game Developer",
            "Industrial Designer",
            "Architect",
            "Robotics Engineer"
        ],
        "strengths": "Может создавать инновационные технические решения",
        "example": "Инженер, который проектирует красивые и функциональные продукты"
    },
    
    "RIC": {
        "name": "Системный Техник",
        "description": "Технические навыки + анализ + организация",
        "ideal_careers": [
            "Network Engineer",
            "Systems Administrator",
            "Quality Assurance Engineer",
            "Technical Project Manager"
        ],
        "strengths": "Отлично управляет техническими системами",
        "example": "IT-администратор, поддерживающий корпоративную инфраструктуру"
    },
    
    "RIS": {
        "name": "Практичный Помощник",
        "description": "Техника + исследования + помощь людям",
        "ideal_careers": [
            "Physical Therapist",
            "Occupational Therapist",
            "Athletic Trainer",
            "Dental Hygienist"
        ],
        "strengths": "Помогает людям через практические/технические навыки",
        "example": "Физиотерапевт, использующий технику для лечения"
    },
    
    "IAS": {
        "name": "Креативный Исследователь",
        "description": "Анализ + творчество + работа с людьми",
        "ideal_careers": [
            "UX Researcher",
            "Psychologist",
            "Art Therapist",
            "Educational Researcher"
        ],
        "strengths": "Исследует человеческое поведение креативными методами",
        "example": "UX исследователь, изучающий поведение пользователей"
    },
    
    "IAC": {
        "name": "Аналитический Креатор",
        "description": "Исследования + искусство + систематизация",
        "ideal_careers": [
            "Data Visualization Specialist",
            "Scientific Illustrator",
            "Technical Writer",
            "Information Architect"
        ],
        "strengths": "Визуализирует сложные данные",
        "example": "Специалист по Data Viz, создающий инфографику"
    },
    
    "SAE": {
        "name": "Социальный Лидер",
        "description": "Помощь людям + творчество + лидерство",
        "ideal_careers": [
            "HR Manager",
            "Training and Development Manager",
            "School Principal",
            "Non-profit Director"
        ],
        "strengths": "Вдохновляет и развивает людей",
        "example": "HR директор, создающий культуру компании"
    },
    
    "SEC": {
        "name": "Организованный Помощник",
        "description": "Социальная работа + предпринимательство + организация",
        "ideal_careers": [
            "Social Services Manager",
            "Healthcare Administrator",
            "Event Coordinator",
            "Office Manager"
        ],
        "strengths": "Организует помощь людям",
        "example": "Менеджер социальных программ"
    },
    
    "EAS": {
        "name": "Харизматичный Креатор",
        "description": "Лидерство + творчество + социальные навыки",
        "ideal_careers": [
            "Marketing Manager",
            "Creative Director",
            "Brand Manager",
            "Public Relations Manager"
        ],
        "strengths": "Продает идеи и вдохновляет",
        "example": "Креативный директор рекламного агентства"
    },
    
    "ECS": {
        "name": "Организованный Лидер",
        "description": "Предпринимательство + организация + социальные навыки",
        "ideal_careers": [
            "Business Manager",
            "Operations Manager",
            "Sales Manager",
            "Real Estate Agent"
        ],
        "strengths": "Управляет бизнес-процессами",
        "example": "Менеджер по продажам крупной компании"
    },
    
    "CAI": {
        "name": "Организованный Аналитик",
        "description": "Систематизация + творчество + исследования",
        "ideal_careers": [
            "Financial Analyst",
            "Research Librarian",
            "Database Administrator",
            "Quality Control Analyst"
        ],
        "strengths": "Анализирует и систематизирует информацию",
        "example": "Финансовый аналитик, создающий отчеты"
    }
    
    # ... всего 120 возможных комбинаций (6*5*4)
    # Здесь показаны основные 10
}
```

---

## 📈 Процентили (Percentiles)

```python
def calculate_percentiles(user_scores, population_data):
    """
    Рассчитать процентили пользователя относительно популяции
    
    Args:
        user_scores: dict с normalized scores пользователя
        population_data: статистика по всем пользователям платформы
    
    Returns:
        dict с процентилями (0-100)
    """
    percentiles = {}
    
    for category in ['R', 'I', 'A', 'S', 'E', 'C']:
        user_score = user_scores[category]
        
        # Получить все scores других пользователей
        all_scores = population_data[category]
        
        # Посчитать, сколько процентов людей score ниже
        below_count = sum(1 for score in all_scores if score < user_score)
        total_count = len(all_scores)
        
        percentile = (below_count / total_count) * 100
        percentiles[category] = round(percentile)
    
    return percentiles

# Пример:
# Если у юзера R = 96.25, и только 5% людей имеют выше
# → percentile = 95 (топ 5%)
```

---

## 🎓 Рекомендации ВУЗов Казахстана

```python
def recommend_universities_kz(holland_code, region):
    """
    Рекомендовать ВУЗы Казахстана на основе Holland Code
    """
    
    universities_db = {
        "RIA": [  # Для технических+креативных
            {
                "name": "КБТУ (Казахстанско-Британский Технический Университет)",
                "programs": [
                    {
                        "name": "Computer Science",
                        "match": 95,
                        "duration": 4,
                        "cost_per_year": 2500000,
                        "grants": True,
                        "ent_min": 115,
                        "subjects": ["Математика", "Информатика"]
                    },
                    {
                        "name": "Software Engineering",
                        "match": 93,
                        "duration": 4,
                        "cost_per_year": 2500000,
                        "grants": True,
                        "ent_min": 115
                    }
                ],
                "city": "Алматы",
                "rating": 4.8,
                "website": "https://kbtu.edu.kz"
            },
            {
                "name": "Назарбаев Университет",
                "programs": [
                    {
                        "name": "Robotics and Mechatronics",
                        "match": 96,
                        "duration": 4,
                        "cost_per_year": 0,  # Грант
                        "grants": True,
                        "ent_min": 130
                    }
                ],
                "city": "Астана",
                "rating": 5.0,
                "website": "https://nu.edu.kz"
            },
            {
                "name": "КазНУ им. аль-Фараби",
                "programs": [
                    {
                        "name": "Информационные системы",
                        "match": 88,
                        "duration": 4,
                        "cost_per_year": 1800000,
                        "grants": True,
                        "ent_min": 105
                    }
                ],
                "city": "Алматы",
                "rating": 4.5
            }
        ],
        
        "SAE": [  # Для социальных+лидеров
            {
                "name": "КАЗГЮУ",
                "programs": [
                    {
                        "name": "HR Management",
                        "match": 90,
                        "duration": 4,
                        "cost_per_year": 2200000
                    },
                    {
                        "name": "Business Administration",
                        "match": 88
                    }
                ],
                "city": "Астана"
            }
        ]
        
        # ... для всех 120 комбинаций
    }
    
    recommendations = universities_db.get(holland_code, [])
    
    # Фильтровать по региону если указан
    if region:
        recommendations = [
            uni for uni in recommendations 
            if uni['city'] == region or region == 'any'
        ]
    
    return recommendations
```

---

Это только **Тест 1** из 10! 

Продолжить с остальными тестами?
- Тест 2: Photo Career Quiz
- Тест 3: DiSC Assessment
- Тест 4: Career Values
- И т.д.

Или хотите что-то уточнить по Holland Code?

