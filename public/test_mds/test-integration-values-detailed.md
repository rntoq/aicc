# 🔧 Техническая Интеграция: Career Values Quiz
## Тест Карьерных Ценностей и Мотиваций

---

# Тест 4: Career Values Quiz

## 📊 Общая Информация

**ID теста:** `career-values-quiz`  
**Версия:** 1.0  
**Вопросов:** 36 (3 вопроса на каждую из 12 ценностей)  
**Время:** 8 минут  
**Тип ответов:** Шкала важности 1-5  
**Результат:** Топ-5 карьерных ценностей  

---

## 🎯 Концепция Теста

### Что измеряет:

Career Values Quiz определяет, что для человека **важно в работе** - не ЧТО делать (это Holland Code), а **ЗАЧЕМ и ПРИ КАКИХ УСЛОВИЯХ**.

### 12 Карьерных Ценностей:

```javascript
const CAREER_VALUES = {
  "ACHIEVEMENT": {
    name: {
      ru: "Достижение",
      kk: "Жетістік",
      en: "Achievement"
    },
    description: {
      ru: "Желание добиваться успеха, видеть результаты своего труда",
      en: "Desire to achieve success and see results of your work"
    },
    keywords: ["успех", "результаты", "цели", "победа"],
    color: "#E74C3C"
  },
  
  "INDEPENDENCE": {
    name: {
      ru: "Независимость",
      kk: "Тәуелсіздік",
      en: "Independence"
    },
    description: {
      ru: "Автономия, свобода принятия решений, работа без контроля",
      en: "Autonomy, freedom to make decisions, work without supervision"
    },
    keywords: ["автономия", "свобода", "самостоятельность"],
    color: "#9B59B6"
  },
  
  "RECOGNITION": {
    name: {
      ru: "Признание",
      kk: "Тану",
      en: "Recognition"
    },
    description: {
      ru: "Уважение, статус, известность в своей области",
      en: "Respect, status, being known in your field"
    },
    keywords: ["статус", "уважение", "репутация", "известность"],
    color: "#F39C12"
  },
  
  "RELATIONSHIPS": {
    name: {
      ru: "Отношения",
      kk: "Қарым-қатынас",
      en: "Relationships"
    },
    description: {
      ru: "Работа с людьми, дружелюбный коллектив, социальные связи",
      en: "Working with people, friendly team, social connections"
    },
    keywords: ["команда", "друзья", "коллектив", "общение"],
    color: "#27AE60"
  },
  
  "SUPPORT": {
    name: {
      ru: "Помощь другим",
      kk: "Басқаларға көмек",
      en: "Support"
    },
    description: {
      ru: "Возможность помогать людям, делать мир лучше",
      en: "Opportunity to help people, make the world better"
    },
    keywords: ["помощь", "забота", "вклад", "служение"],
    color: "#1ABC9C"
  },
  
  "WORKING_CONDITIONS": {
    name: {
      ru: "Условия работы",
      kk: "Жұмыс жағдайлары",
      en: "Working Conditions"
    },
    description: {
      ru: "Комфортная среда, хороший баланс работы и жизни",
      en: "Comfortable environment, good work-life balance"
    },
    keywords: ["комфорт", "баланс", "график", "офис"],
    color: "#3498DB"
  },
  
  "CHALLENGE": {
    name: {
      ru: "Вызовы",
      kk: "Сынақтар",
      en: "Challenge"
    },
    description: {
      ru: "Сложные задачи, интеллектуальные вызовы, решение проблем",
      en: "Difficult tasks, intellectual challenges, problem-solving"
    },
    keywords: ["сложность", "вызов", "проблемы", "головоломки"],
    color: "#E67E22"
  },
  
  "CREATIVITY": {
    name: {
      ru: "Творчество",
      kk: "Шығармашылық",
      en: "Creativity"
    },
    description: {
      ru: "Возможность создавать новое, экспериментировать, инновации",
      en: "Opportunity to create new things, experiment, innovate"
    },
    keywords: ["креатив", "инновации", "новизна", "эксперименты"],
    color: "#9C27B0"
  },
  
  "KNOWLEDGE": {
    name: {
      ru: "Знания",
      kk: "Білім",
      en: "Knowledge"
    },
    description: {
      ru: "Постоянное обучение, развитие, получение экспертизы",
      en: "Continuous learning, development, gaining expertise"
    },
    keywords: ["обучение", "развитие", "экспертиза", "знания"],
    color: "#2196F3"
  },
  
  "SECURITY": {
    name: {
      ru: "Безопасность",
      kk: "Қауіпсіздік",
      en: "Security"
    },
    description: {
      ru: "Стабильность, надежность, предсказуемость работы",
      en: "Stability, reliability, predictability of work"
    },
    keywords: ["стабильность", "надежность", "гарантии"],
    color: "#607D8B"
  },
  
  "MEANING": {
    name: {
      ru: "Смысл",
      kk: "Мағына",
      en: "Meaning"
    },
    description: {
      ru: "Работа должна иметь цель и смысл, вклад в общество",
      en: "Work should have purpose and meaning, contribution to society"
    },
    keywords: ["цель", "смысл", "миссия", "вклад"],
    color: "#00BCD4"
  },
  
  "COLLABORATION": {
    name: {
      ru: "Сотрудничество",
      kk: "Ынтымақтастық",
      en: "Collaboration"
    },
    description: {
      ru: "Работа в команде, совместное достижение целей",
      en: "Teamwork, achieving goals together"
    },
    keywords: ["команда", "совместная работа", "партнерство"],
    color: "#4CAF50"
  }
};
```

---

## 📝 Структура Вопросов

### Формат вопроса:

Для каждой ценности - 3 вопроса, измеряющих важность с разных сторон.

**Шкала ответов (1-5):**
- 1 = Совсем не важно
- 2 = Скорее не важно
- 3 = Нейтрально
- 4 = Довольно важно
- 5 = Очень важно

```javascript
{
  "question_id": "values_achievement_01",
  "value_category": "ACHIEVEMENT",
  "question_number": 1,
  "text": {
    "ru": "Насколько важно для вас достигать амбициозных целей в работе?",
    "kk": "Жұмыста асқан мақсаттарға жету сізге қаншалықты маңызды?",
    "en": "How important is it for you to achieve ambitious goals at work?"
  },
  "scale": {
    "1": {"label": "Совсем не важно", "value": 1},
    "2": {"label": "Скорее не важно", "value": 2},
    "3": {"label": "Нейтрально", "value": 3},
    "4": {"label": "Довольно важно", "value": 4},
    "5": {"label": "Очень важно", "value": 5}
  }
}
```

---

## 📋 Полный Список Вопросов (36)

### ACHIEVEMENT (Достижение) - 3 вопроса

```javascript
const achievementQuestions = [
  {
    id: "values_achievement_01",
    text: "Насколько важно для вас достигать амбициозных целей в работе?",
    category: "ACHIEVEMENT"
  },
  {
    id: "values_achievement_02",
    text: "Важно ли вам видеть конкретные результаты своего труда?",
    category: "ACHIEVEMENT"
  },
  {
    id: "values_achievement_03",
    text: "Насколько для вас значимо быть лучшим в том, что вы делаете?",
    category: "ACHIEVEMENT"
  }
];
```

### INDEPENDENCE (Независимость) - 3 вопроса

```javascript
const independenceQuestions = [
  {
    id: "values_independence_01",
    text: "Насколько важна для вас свобода принимать собственные решения?",
    category: "INDEPENDENCE"
  },
  {
    id: "values_independence_02",
    text: "Важно ли вам работать без постоянного контроля со стороны?",
    category: "INDEPENDENCE"
  },
  {
    id: "values_independence_03",
    text: "Насколько вы цените автономию в выборе методов работы?",
    category: "INDEPENDENCE"
  }
];
```

### RECOGNITION (Признание) - 3 вопроса

```javascript
const recognitionQuestions = [
  {
    id: "values_recognition_01",
    text: "Насколько важно для вас признание ваших достижений?",
    category: "RECOGNITION"
  },
  {
    id: "values_recognition_02",
    text: "Важен ли вам профессиональный статус и репутация?",
    category: "RECOGNITION"
  },
  {
    id: "values_recognition_03",
    text: "Насколько для вас значимо уважение коллег и начальства?",
    category: "RECOGNITION"
  }
];
```

### RELATIONSHIPS (Отношения) - 3 вопроса

```javascript
const relationshipsQuestions = [
  {
    id: "values_relationships_01",
    text: "Насколько важно для вас работать в дружелюбной команде?",
    category: "RELATIONSHIPS"
  },
  {
    id: "values_relationships_02",
    text: "Важны ли вам близкие отношения с коллегами?",
    category: "RELATIONSHIPS"
  },
  {
    id: "values_relationships_03",
    text: "Насколько вы цените социальные связи на работе?",
    category: "RELATIONSHIPS"
  }
];
```

### SUPPORT (Помощь другим) - 3 вопроса

```javascript
const supportQuestions = [
  {
    id: "values_support_01",
    text: "Насколько важно для вас помогать другим людям?",
    category: "SUPPORT"
  },
  {
    id: "values_support_02",
    text: "Важно ли вам делать мир лучше через свою работу?",
    category: "SUPPORT"
  },
  {
    id: "values_support_03",
    text: "Насколько значим для вас вклад в общество?",
    category: "SUPPORT"
  }
];
```

### WORKING_CONDITIONS (Условия работы) - 3 вопроса

```javascript
const workingConditionsQuestions = [
  {
    id: "values_conditions_01",
    text: "Насколько важен для вас комфорт рабочего места?",
    category: "WORKING_CONDITIONS"
  },
  {
    id: "values_conditions_02",
    text: "Важен ли вам баланс между работой и личной жизнью?",
    category: "WORKING_CONDITIONS"
  },
  {
    id: "values_conditions_03",
    text: "Насколько вы цените удобный график работы?",
    category: "WORKING_CONDITIONS"
  }
];
```

### CHALLENGE (Вызовы) - 3 вопроса

```javascript
const challengeQuestions = [
  {
    id: "values_challenge_01",
    text: "Насколько важны для вас сложные интеллектуальные задачи?",
    category: "CHALLENGE"
  },
  {
    id: "values_challenge_02",
    text: "Важно ли вам постоянно сталкиваться с новыми вызовами?",
    category: "CHALLENGE"
  },
  {
    id: "values_challenge_03",
    text: "Насколько вы цените возможность решать трудные проблемы?",
    category: "CHALLENGE"
  }
];
```

### CREATIVITY (Творчество) - 3 вопроса

```javascript
const creativityQuestions = [
  {
    id: "values_creativity_01",
    text: "Насколько важна для вас возможность создавать что-то новое?",
    category: "CREATIVITY"
  },
  {
    id: "values_creativity_02",
    text: "Важна ли вам свобода для экспериментов и инноваций?",
    category: "CREATIVITY"
  },
  {
    id: "values_creativity_03",
    text: "Насколько вы цените творческий подход к работе?",
    category: "CREATIVITY"
  }
];
```

### KNOWLEDGE (Знания) - 3 вопроса

```javascript
const knowledgeQuestions = [
  {
    id: "values_knowledge_01",
    text: "Насколько важно для вас постоянно учиться новому?",
    category: "KNOWLEDGE"
  },
  {
    id: "values_knowledge_02",
    text: "Важно ли вам становиться экспертом в своей области?",
    category: "KNOWLEDGE"
  },
  {
    id: "values_knowledge_03",
    text: "Насколько вы цените интеллектуальное развитие на работе?",
    category: "KNOWLEDGE"
  }
];
```

### SECURITY (Безопасность) - 3 вопроса

```javascript
const securityQuestions = [
  {
    id: "values_security_01",
    text: "Насколько важна для вас стабильность работы?",
    category: "SECURITY"
  },
  {
    id: "values_security_02",
    text: "Важна ли вам предсказуемость и надежность?",
    category: "SECURITY"
  },
  {
    id: "values_security_03",
    text: "Насколько вы цените гарантии занятости?",
    category: "SECURITY"
  }
];
```

### MEANING (Смысл) - 3 вопроса

```javascript
const meaningQuestions = [
  {
    id: "values_meaning_01",
    text: "Насколько важно, чтобы ваша работа имела глубокий смысл?",
    category: "MEANING"
  },
  {
    id: "values_meaning_02",
    text: "Важна ли вам миссия и цель вашей деятельности?",
    category: "MEANING"
  },
  {
    id: "values_meaning_03",
    text: "Насколько значимо для вас делать что-то важное для общества?",
    category: "MEANING"
  }
];
```

### COLLABORATION (Сотрудничество) - 3 вопроса

```javascript
const collaborationQuestions = [
  {
    id: "values_collaboration_01",
    text: "Насколько важна для вас командная работа?",
    category: "COLLABORATION"
  },
  {
    id: "values_collaboration_02",
    text: "Важно ли вам достигать целей вместе с другими?",
    category: "COLLABORATION"
  },
  {
    id: "values_collaboration_03",
    text: "Насколько вы цените сотрудничество и партнерство?",
    category: "COLLABORATION"
  }
];
```

---

## 🧮 Алгоритм Подсчета

### Шаг 1: Подсчет среднего балла по каждой ценности

```python
def calculate_values_scores(answers):
    """
    Подсчитать средний балл для каждой из 12 ценностей
    
    Args:
        answers: dict {question_id: answer_value (1-5)}
    
    Returns:
        dict {value_category: average_score}
    """
    
    # Группировать ответы по категориям
    values_answers = {
        "ACHIEVEMENT": [],
        "INDEPENDENCE": [],
        "RECOGNITION": [],
        "RELATIONSHIPS": [],
        "SUPPORT": [],
        "WORKING_CONDITIONS": [],
        "CHALLENGE": [],
        "CREATIVITY": [],
        "KNOWLEDGE": [],
        "SECURITY": [],
        "MEANING": [],
        "COLLABORATION": []
    }
    
    questions_db = get_values_questions()
    
    for question_id, answer_value in answers.items():
        question = questions_db[question_id]
        category = question['value_category']
        values_answers[category].append(answer_value)
    
    # Подсчитать среднее для каждой категории
    average_scores = {}
    for category, scores_list in values_answers.items():
        if scores_list:
            average_scores[category] = round(sum(scores_list) / len(scores_list), 2)
        else:
            average_scores[category] = 0
    
    return average_scores

# Пример:
# Пользователь ответил на все 36 вопросов
# 
# ACHIEVEMENT: вопросы получили [5, 5, 4] → среднее = 4.67
# INDEPENDENCE: [4, 5, 4] → среднее = 4.33
# RECOGNITION: [2, 3, 2] → среднее = 2.33
# ... и т.д.
# 
# Результат:
# {
#     "ACHIEVEMENT": 4.67,
#     "INDEPENDENCE": 4.33,
#     "KNOWLEDGE": 4.0,
#     "CHALLENGE": 3.67,
#     "CREATIVITY": 3.33,
#     "WORKING_CONDITIONS": 3.0,
#     "RELATIONSHIPS": 2.67,
#     "RECOGNITION": 2.33,
#     "COLLABORATION": 2.33,
#     "SUPPORT": 2.0,
#     "MEANING": 2.0,
#     "SECURITY": 1.67
# }
```

### Шаг 2: Ранжирование ценностей

```python
def rank_values(average_scores):
    """
    Ранжировать ценности от наиболее важных к наименее важным
    """
    
    # Сортировать по баллам (от большего к меньшему)
    ranked = sorted(
        average_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    # Добавить ранги
    ranked_with_position = []
    for position, (value_category, score) in enumerate(ranked, start=1):
        ranked_with_position.append({
            "rank": position,
            "value": value_category,
            "score": score,
            "importance_level": determine_importance_level(score)
        })
    
    return ranked_with_position

def determine_importance_level(score):
    """Определить уровень важности"""
    if score >= 4.5:
        return "critically_important"
    elif score >= 3.5:
        return "very_important"
    elif score >= 2.5:
        return "moderately_important"
    elif score >= 1.5:
        return "somewhat_important"
    else:
        return "not_important"

# Пример результата:
# [
#     {"rank": 1, "value": "ACHIEVEMENT", "score": 4.67, "level": "critically_important"},
#     {"rank": 2, "value": "INDEPENDENCE", "score": 4.33, "level": "very_important"},
#     {"rank": 3, "value": "KNOWLEDGE", "score": 4.0, "level": "very_important"},
#     {"rank": 4, "value": "CHALLENGE", "score": 3.67, "level": "very_important"},
#     {"rank": 5, "value": "CREATIVITY", "score": 3.33, "level": "moderately_important"},
#     ...
# ]
```

### Шаг 3: Определение топ-5 ценностей

```python
def get_top_values(ranked_values, count=5):
    """
    Получить топ-N ценностей
    """
    return ranked_values[:count]

# Результат:
# Топ-5: Achievement, Independence, Knowledge, Challenge, Creativity
```

---

## 📊 Результаты и Интерпретация

### Полная Структура Результата (JSON):

```json
{
  "test_id": "career-values-quiz",
  "user_id": "uuid-here",
  "completed_at": "2024-01-15T11:15:00Z",
  "duration_seconds": 452,
  
  "raw_answers": {
    "values_achievement_01": 5,
    "values_achievement_02": 5,
    "values_achievement_03": 4,
    "...": "..."
  },
  
  "average_scores": {
    "ACHIEVEMENT": 4.67,
    "INDEPENDENCE": 4.33,
    "KNOWLEDGE": 4.0,
    "CHALLENGE": 3.67,
    "CREATIVITY": 3.33,
    "WORKING_CONDITIONS": 3.0,
    "RELATIONSHIPS": 2.67,
    "RECOGNITION": 2.33,
    "COLLABORATION": 2.33,
    "SUPPORT": 2.0,
    "MEANING": 2.0,
    "SECURITY": 1.67
  },
  
  "ranked_values": [
    {
      "rank": 1,
      "value": "ACHIEVEMENT",
      "score": 4.67,
      "importance_level": "critically_important"
    },
    {
      "rank": 2,
      "value": "INDEPENDENCE",
      "score": 4.33,
      "importance_level": "very_important"
    },
    {
      "rank": 3,
      "value": "KNOWLEDGE",
      "score": 4.0,
      "importance_level": "very_important"
    },
    {
      "rank": 4,
      "value": "CHALLENGE",
      "score": 3.67,
      "importance_level": "very_important"
    },
    {
      "rank": 5,
      "value": "CREATIVITY",
      "score": 3.33,
      "importance_level": "moderately_important"
    }
  ],
  
  "top_5_values": ["ACHIEVEMENT", "INDEPENDENCE", "KNOWLEDGE", "CHALLENGE", "CREATIVITY"],
  
  "interpretation": {
    "profile_summary": {
      "title": "Независимый Достигатор",
      "description": "Вы ориентированы на достижения, цените независимость и постоянное развитие. Вас мотивируют сложные задачи и возможность создавать что-то новое.",
      
      "core_motivation": """
      Ваши топ-5 ценностей показывают четкий профиль:
      
      Вы стремитесь к **успеху и достижениям** (#1), но при этом важна
      **свобода** в выборе методов (#2). Вы хотите постоянно **учиться** (#3),
      решать **сложные задачи** (#4) и применять **творческий подход** (#5).
      
      Это профиль человека, который:
      - Ставит амбициозные цели
      - Предпочитает работать автономно
      - Постоянно развивается
      - Любит интеллектуальные вызовы
      - Ценит креативность в работе
      """
    },
    
    "top_values_detailed": [
      {
        "rank": 1,
        "value": "ACHIEVEMENT",
        "name": "Достижение",
        "score": 4.67,
        "level": "critically_important",
        
        "what_it_means": """
        Достижения - это ваш главный драйвер. Вы хотите видеть конкретные
        результаты своей работы и добиваться успеха. Вас мотивируют цели,
        метрики и победы.
        """,
        
        "in_work_you_need": [
          "Четкие измеримые цели",
          "Возможность отслеживать прогресс",
          "Признание достижений",
          "Вызовы и конкуренция",
          "Видимые результаты труда"
        ],
        
        "ideal_work_environments": [
          "Стартапы с амбициозными целями",
          "Компании с культурой high performance",
          "Проектная работа с четкими дедлайнами",
          "Продажи или бизнес-развитие",
          "Предпринимательство"
        ],
        
        "careers_that_satisfy": [
          {
            "title": "Entrepreneur / Startup Founder",
            "match": 98,
            "why": "Максимальная ответственность за результат"
          },
          {
            "title": "Sales Manager",
            "match": 95,
            "why": "Четкие метрики, прямая связь усилия → результат"
          },
          {
            "title": "Product Manager",
            "match": 92,
            "why": "Владение продуктом от идеи до успеха"
          },
          {
            "title": "Investment Banker",
            "match": 90,
            "why": "Высокие цели, измеримые достижения"
          }
        ],
        
        "potential_pitfalls": [
          "Можете переработать в погоне за целями",
          "Риск выгорания от постоянного давления",
          "Может не хватать удовлетворения процессом",
          "Сложно в ролях без четких метрик"
        ],
        
        "combines_well_with": {
          "INDEPENDENCE": "Свобода достигать целей своим путем - идеально!",
          "CHALLENGE": "Амбициозные цели требуют сложных задач - отличная пара",
          "RECOGNITION": "Достижения + признание = дополнительная мотивация"
        }
      },
      
      {
        "rank": 2,
        "value": "INDEPENDENCE",
        "name": "Независимость",
        "score": 4.33,
        "level": "very_important",
        
        "what_it_means": """
        Автономия критически важна для вас. Вы хотите принимать собственные
        решения и работать без микроменеджмента. Контроль и свобода - ваши
        ключевые потребности.
        """,
        
        "in_work_you_need": [
          "Минимум контроля со стороны",
          "Свобода выбора методов работы",
          "Доверие руководства",
          "Гибкий график",
          "Возможность работать удаленно"
        ],
        
        "ideal_work_environments": [
          "Фриланс",
          "Стартапы с плоской иерархией",
          "Исследовательские позиции",
          "Консалтинг",
          "Собственный бизнес"
        ],
        
        "careers_that_satisfy": [
          {
            "title": "Freelance Consultant",
            "match": 98,
            "why": "Полная автономия в выборе проектов и методов"
          },
          {
            "title": "Software Engineer (Remote)",
            "match": 95,
            "why": "Независимая работа, минимум контроля"
          },
          {
            "title": "Researcher / Scientist",
            "match": 92,
            "why": "Свобода в выборе направления исследований"
          }
        ],
        
        "avoid": [
          "Корпорации с жесткой иерархией",
          "Микроменеджмент",
          "Позиции с постоянным контролем",
          "Строгий офисный график 9-18"
        ],
        
        "combines_well_with": {
          "ACHIEVEMENT": "Свобода достигать целей по-своему",
          "CREATIVITY": "Автономия для экспериментов",
          "KNOWLEDGE": "Свобода выбирать направление обучения"
        }
      },
      
      {
        "rank": 3,
        "value": "KNOWLEDGE",
        "name": "Знания",
        "score": 4.0,
        "level": "very_important",
        
        "what_it_means": """
        Постоянное обучение и развитие - необходимость для вас. Вы не можете
        долго делать одно и то же. Вам нужна работа, которая держит ваш мозг
        в тонусе и дает новые знания.
        """,
        
        "in_work_you_need": [
          "Возможность учиться новому",
          "Доступ к тренингам и курсам",
          "Ротация задач",
          "Работа с экспертами",
          "Сложные задачи, требующие изучения"
        ],
        
        "ideal_work_environments": [
          "Tech компании с learning culture",
          "Университеты и исследовательские центры",
          "Консалтинг (постоянно новые проекты)",
          "Быстрорастущие стартапы",
          "Компании с бюджетом на обучение"
        ],
        
        "careers_that_satisfy": [
          {
            "title": "Data Scientist",
            "match": 95,
            "why": "Постоянное изучение новых методов и технологий"
          },
          {
            "title": "Management Consultant",
            "match": 93,
            "why": "Каждый проект - новая индустрия для изучения"
          },
          {
            "title": "Software Developer",
            "match": 92,
            "why": "Технологии постоянно обновляются"
          },
          {
            "title": "Researcher",
            "match": 90,
            "why": "Исследования = постоянное познание"
          }
        ]
      },
      
      {
        "rank": 4,
        "value": "CHALLENGE",
        "name": "Вызовы",
        "score": 3.67,
        "level": "very_important",
        
        "what_it_means": """
        Вы любите сложные задачи. Рутина вас убивает. Вам нужны проблемы,
        которые заставляют думать и применять все свои навыки.
        """,
        
        "in_work_you_need": [
          "Сложные интеллектуальные задачи",
          "Нестандартные проблемы",
          "Новые вызовы регулярно",
          "Возможность проявить смекалку",
          "Задачи на грани возможностей"
        ],
        
        "ideal_work_environments": [
          "Стартапы (постоянные проблемы)",
          "R&D отделы",
          "Кризис-менеджмент",
          "Strategy consulting",
          "Инновационные проекты"
        ],
        
        "careers_that_satisfy": [
          {
            "title": "Strategy Consultant",
            "match": 95,
            "why": "Решение сложнейших бизнес-задач"
          },
          {
            "title": "Algorithm Engineer",
            "match": 93,
            "why": "Сложные технические задачи"
          },
          {
            "title": "Startup Founder",
            "match": 92,
            "why": "Новые вызовы каждый день"
          }
        ]
      },
      
      {
        "rank": 5,
        "value": "CREATIVITY",
        "name": "Творчество",
        "score": 3.33,
        "level": "moderately_important",
        
        "what_it_means": """
        Вы цените возможность создавать новое и экспериментировать. Хотя это
        не ваша главная ценность (ранг 5), креативность все равно важна для
        удовлетворенности работой.
        """,
        
        "in_work_you_need": [
          "Свобода для экспериментов",
          "Возможность предлагать идеи",
          "Инновационные проекты",
          "Творческий подход к задачам",
          "Не только исполнение, но и создание"
        ],
        
        "ideal_work_environments": [
          "Innovation labs",
          "Product companies",
          "Creative agencies",
          "Стартапы",
          "R&D"
        ]
      }
    ],
    
    "bottom_values_analysis": {
      "least_important": [
        {
          "rank": 12,
          "value": "SECURITY",
          "score": 1.67,
          "meaning": """
          Безопасность и стабильность - наименее важны для вас. Вы готовы
          рисковать ради возможностей роста и достижений. Это согласуется
          с вашим высоким ACHIEVEMENT и INDEPENDENCE.
          
          Это означает:
          - Вы можете работать в стартапах (нестабильно, но интересно)
          - Готовы менять работу ради роста
          - Не боитесь неопределенности
          - Предпочитаете opportunity стабильности
          """
        },
        {
          "rank": 11,
          "value": "MEANING",
          "score": 2.0,
          "meaning": """
          Глубокий смысл работы не критичен для вас. Вас больше мотивируют
          достижения, вызовы и развитие, чем миссия. Это нормально - не все
          должны "спасать мир".
          """
        },
        {
          "rank": 10,
          "value": "SUPPORT",
          "score": 2.0,
          "meaning": """
          Помощь другим - не ваш главный драйвер. Вы больше ориентированы
          на личные достижения, чем на служение. Это совершенно нормально.
          """
        }
      ]
    },
    
    "value_profile_type": {
      "type": "Achiever-Learner",
      "description": "Независимый перформер, стремящийся к постоянному росту",
      "percentage_of_population": 12
    },
    
    "career_recommendations": {
      "best_fit_careers": [
        {
          "title": "Entrepreneur / Startup Founder",
          "overall_match": 96,
          "values_match": {
            "ACHIEVEMENT": "✓ Полный контроль над результатом",
            "INDEPENDENCE": "✓ Максимальная автономия",
            "KNOWLEDGE": "✓ Постоянное обучение на ходу",
            "CHALLENGE": "✓ Новые проблемы ежедневно",
            "CREATIVITY": "✓ Создание с нуля"
          },
          "why_perfect": "Все ваши топ-5 ценностей полностью удовлетворены"
        },
        {
          "title": "Product Manager (Tech)",
          "overall_match": 93,
          "values_match": {
            "ACHIEVEMENT": "✓ Владение продуктом и метриками",
            "INDEPENDENCE": "✓ Автономия в решениях",
            "KNOWLEDGE": "✓ Tech + business + UX",
            "CHALLENGE": "✓ Сложные задачи",
            "CREATIVITY": "✓ Product vision"
          }
        },
        {
          "title": "Strategy Consultant",
          "overall_match": 91,
          "values_match": {
            "ACHIEVEMENT": "✓ Проектные результаты",
            "INDEPENDENCE": "✓ Контроль над методами",
            "KNOWLEDGE": "✓ Новая индустрия каждый проект",
            "CHALLENGE": "✓ Сложнейшие бизнес-задачи",
            "CREATIVITY": "✓ Нестандартные решения"
          }
        },
        {
          "title": "Data Scientist",
          "overall_match": 88,
          "values_match": {
            "ACHIEVEMENT": "✓ Модели с измеримыми результатами",
            "INDEPENDENCE": "✓ Свобода в методах",
            "KNOWLEDGE": "✓ Постоянное изучение алгоритмов",
            "CHALLENGE": "✓ Сложные аналитические задачи",
            "CREATIVITY": "~ Некоторая креативность в подходах"
          }
        }
      ],
      
      "careers_to_avoid": [
        {
          "title": "Government Clerk",
          "why": "Низкое ACHIEVEMENT (рутина), низкая INDEPENDENCE (бюрократия), низкое CHALLENGE"
        },
        {
          "title": "Assembly Line Worker",
          "why": "Нет ни одной из ваших топ-5 ценностей"
        },
        {
          "title": "Traditional Corporate Role",
          "why": "Ограниченная INDEPENDENCE, может не хватать CHALLENGE"
        }
      ]
    },
    
    "work_environment_preferences": {
      "ideal": [
        "Стартапы и быстрорастущие компании",
        "Tech компании с культурой инноваций",
        "Консалтинг (разнообразие проектов)",
        "Предпринимательство",
        "Research & Development"
      ],
      "avoid": [
        "Строгие корпорации с иерархией",
        "Государственный сектор",
        "Рутинные производства",
        "Микроменеджмент",
        "Роли без измеримых результатов"
      ]
    },
    
    "potential_conflicts": {
      "achievement_vs_balance": """
      Ваш высокий ACHIEVEMENT (4.67) и низкий WORKING_CONDITIONS (3.0) означают,
      что вы можете пожертвовать балансом работы и жизни ради целей. 
      
      Внимание: Следите за выгоранием!
      """,
      
      "independence_vs_collaboration": """
      Высокая INDEPENDENCE (4.33) и низкая COLLABORATION (2.33) показывают
      предпочтение одиночной работы. Это нормально, но:
      
      - В командах вы можете конфликтовать
      - Выбирайте роли с автономией
      - Фриланс или небольшие команды - ваше
      """
    }
  },
  
  "comparison_with_holland_disc": {
    "holland_code": "RIA",
    "disc_type": "D",
    "values_alignment": {
      "consistent": true,
      "analysis": """
      Ваш профиль ценностей отлично согласуется с Holland RIA и DiSC D:
      
      - RIA (Realistic-Investigative-Artistic) + ACHIEVEMENT/CHALLENGE/CREATIVITY ✓
      - DiSC D (Dominance) + ACHIEVEMENT/INDEPENDENCE ✓
      - Низкий S в DiSC + низкий SUPPORT/COLLABORATION в Values ✓
      
      Все три теста показывают: вы независимый достигатор.
      """
    }
  },
  
  "actionable_next_steps": [
    "Ищите роли с четкими метриками успеха (ACHIEVEMENT)",
    "Приоритизируйте автономию при выборе работодателя (INDEPENDENCE)",
    "Убедитесь в бюджете на обучение/развитие (KNOWLEDGE)",
    "Проверьте, есть ли сложные задачи в роли (CHALLENGE)",
    "Рассмотрите стартапы или консалтинг как идеальную среду",
    "Будьте готовы к нестабильности (низкий SECURITY - это ОК для вас)"
  ]
}
```

---

## 🔗 Конвертация в O*NET Work Values

```python
def convert_to_onet_values(career_values):
    """
    Конвертировать Career Values в O*NET Work Values
    для использования с O*NET базой профессий
    """
    
    MAPPING = {
        "ACHIEVEMENT": ["Achievement", "Recognition"],
        "INDEPENDENCE": ["Independence"],
        "RECOGNITION": ["Recognition", "Achievement"],
        "RELATIONSHIPS": ["Relationships"],
        "SUPPORT": ["Support"],
        "WORKING_CONDITIONS": ["Working Conditions"],
        "CHALLENGE": ["Achievement"],
        "CREATIVITY": ["Independence"],
        "KNOWLEDGE": ["Achievement"],
        "SECURITY": ["Working Conditions"],
        "MEANING": ["Support"],
        "COLLABORATION": ["Relationships"]
    }
    
    onet_values = {}
    for value, score in career_values.items():
        onet_categories = MAPPING.get(value, [])
        for onet_cat in onet_categories:
            if onet_cat not in onet_values:
                onet_values[onet_cat] = []
            onet_values[onet_cat].append(score)
    
    # Усреднить если несколько значений
    for onet_cat in onet_values:
        onet_values[onet_cat] = round(
            sum(onet_values[onet_cat]) / len(onet_values[onet_cat]), 
            2
        )
    
    return onet_values

# Пример:
# career_values = {
#     "ACHIEVEMENT": 4.67,
#     "INDEPENDENCE": 4.33,
#     ...
# }
# 
# onet_values = {
#     "Achievement": 4.34,  # Среднее из ACHIEVEMENT, RECOGNITION, CHALLENGE, KNOWLEDGE
#     "Independence": 3.83,  # Среднее из INDEPENDENCE, CREATIVITY
#     "Relationships": 2.50,  # Среднее из RELATIONSHIPS, COLLABORATION
#     "Support": 2.0,
#     "Working Conditions": 2.34  # Среднее из WORKING_CONDITIONS, SECURITY
# }
```

---

## 🎨 Визуализация

### 1. Столбчатая диаграмма всех 12 ценностей:

```javascript
const valuesBarChart = {
  labels: [
    'Achievement', 'Independence', 'Knowledge', 'Challenge', 
    'Creativity', 'Working Conditions', 'Relationships', 
    'Recognition', 'Collaboration', 'Support', 'Meaning', 'Security'
  ],
  datasets: [{
    label: 'Важность (1-5)',
    data: [4.67, 4.33, 4.0, 3.67, 3.33, 3.0, 2.67, 2.33, 2.33, 2.0, 2.0, 1.67],
    backgroundColor: [
      '#E74C3C', '#9B59B6', '#2196F3', '#E67E22',
      '#9C27B0', '#3498DB', '#27AE60', '#F39C12',
      '#4CAF50', '#1ABC9C', '#00BCD4', '#607D8B'
    ]
  }]
};
```

### 2. Топ-5 ценностей (большие карточки):

```jsx
<div className="top-values-grid">
  {topValues.map((value, index) => (
    <ValueCard
      key={value.name}
      rank={index + 1}
      name={value.name}
      score={value.score}
      color={CAREER_VALUES[value.category].color}
      icon={CAREER_VALUES[value.category].icon}
    />
  ))}
</div>
```

### 3. Радарная диаграмма (все 12):

```javascript
const valuesRadarChart = {
  labels: ['Achievement', 'Independence', 'Knowledge', ...],
  datasets: [{
    label: 'Ваши ценности',
    data: [4.67, 4.33, 4.0, ...],
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderColor: '#E74C3C'
  }]
};
```

---

**Career Values Quiz готов!** 🎯

Продолжаем с **Тестом 5: Big Five (OCEAN)**?

