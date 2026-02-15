# 🔧 Техническая Интеграция: DiSC Assessment
## Тест Личности и Стиля Работы

---

# Тест 3: DiSC Assessment

## 📊 Общая Информация

**ID теста:** `disc-assessment`  
**Версия:** 1.0  
**Вопросов:** 24  
**Время:** 12 минут  
**Тип ответов:** Выбор утверждений (Most like me / Least like me)  
**Модель:** 4 типа личности (D, I, S, C)  

---

## 🎯 Концепция DiSC

### Что измеряет DiSC:

DiSC - это модель поведения, которая описывает, КАК человек действует в рабочей среде и общается с другими.

**4 основных типа:**

```
        Быстрый темп
             ↑
    D        |        I
 (Задачи) ←--+--→ (Люди)
    C        |        S
             ↓
       Медленный темп
```

### Краткое описание типов:

- **D (Dominance)** - Доминирование: Решительный, прямой, ориентирован на результат
- **I (Influence)** - Влияние: Энтузиазм, общительность, оптимизм
- **S (Steadiness)** - Стабильность: Терпение, надежность, командная работа
- **C (Conscientiousness)** - Добросовестность: Точность, анализ, качество

---

## 📝 Формат Вопросов DiSC

### Тип 1: "Выберите наиболее и наименее подходящее"

Каждый вопрос содержит 4 утверждения. Нужно выбрать:
- **MOST** - какое утверждение больше всего описывает вас
- **LEAST** - какое меньше всего описывает вас

```javascript
{
  "question_id": "disc_q01",
  "question_number": 1,
  "instructions": {
    "ru": "Выберите утверждение, которое БОЛЬШЕ ВСЕГО описывает вас на работе, и то, которое МЕНЬШЕ ВСЕГО описывает вас.",
    "kk": "Жұмыста сізді ЕҢ КӨБІРЕК сипаттайтын және ЕҢ АЗЫРАҚ сипаттайтын тұжырымды таңдаңыз.",
    "en": "Select the statement that MOST describes you at work and the one that LEAST describes you."
  },
  "statements": [
    {
      "id": "disc_q01_a",
      "text": {
        "ru": "Я люблю брать на себя ответственность",
        "kk": "Мен жауапкершілікті өз мойныма алуды ұнатамын",
        "en": "I like to take charge"
      },
      "disc_type": "D",
      "weight": 1.0
    },
    {
      "id": "disc_q01_b",
      "text": {
        "ru": "Я предпочитаю работать в команде",
        "kk": "Мен командада жұмыс істеуді ұнатамын",
        "en": "I prefer to work in a team"
      },
      "disc_type": "S",
      "weight": 1.0
    },
    {
      "id": "disc_q01_c",
      "text": {
        "ru": "Я энтузиаст и вдохновляю других",
        "kk": "Мен энтузиастпын және басқаларды шабыттандырамын",
        "en": "I am enthusiastic and inspire others"
      },
      "disc_type": "I",
      "weight": 1.0
    },
    {
      "id": "disc_q01_d",
      "text": {
        "ru": "Я всегда проверяю детали и точность",
        "kk": "Мен әрқашан егжей-тегжейлер мен дәлдікті тексеремін",
        "en": "I always check details and accuracy"
      },
      "disc_type": "C",
      "weight": 1.0
    }
  ]
}
```

---

## 📋 Полный Список 24 Вопросов

### Вопрос 1: Общий стиль работы

```javascript
{
  question_id: "disc_q01",
  statements: [
    {id: "a", text: "Я люблю брать на себя ответственность", type: "D"},
    {id: "b", text: "Я предпочитаю работать в команде", type: "S"},
    {id: "c", text: "Я энтузиаст и вдохновляю других", type: "I"},
    {id: "d", text: "Я всегда проверяю детали и точность", type: "C"}
  ]
}
```

### Вопрос 2: Принятие решений

```javascript
{
  question_id: "disc_q02",
  statements: [
    {id: "a", text: "Я принимаю решения быстро и решительно", type: "D"},
    {id: "b", text: "Я собираю всю информацию перед решением", type: "C"},
    {id: "c", text: "Я советуюсь с командой перед выбором", type: "S"},
    {id: "d", text: "Я полагаюсь на интуицию и опыт", type: "I"}
  ]
}
```

### Вопрос 3: Коммуникация

```javascript
{
  question_id: "disc_q03",
  statements: [
    {id: "a", text: "Я говорю прямо и по делу", type: "D"},
    {id: "b", text: "Я эмоционален и экспрессивен в общении", type: "I"},
    {id: "c", text: "Я терпелив и внимателен к собеседнику", type: "S"},
    {id: "d", text: "Я использую факты и данные", type: "C"}
  ]
}
```

### Вопрос 4: Конфликты

```javascript
{
  question_id: "disc_q04",
  statements: [
    {id: "a", text: "Я сразу решаю конфликты напрямую", type: "D"},
    {id: "b", text: "Я пытаюсь разрядить обстановку юмором", type: "I"},
    {id: "c", text: "Я избегаю конфронтации и ищу компромисс", type: "S"},
    {id: "d", text: "Я анализирую ситуацию логически", type: "C"}
  ]
}
```

### Вопрос 5: Темп работы

```javascript
{
  question_id: "disc_q05",
  statements: [
    {id: "a", text: "Я работаю быстро и хочу немедленных результатов", type: "D"},
    {id: "b", text: "Я работаю в своем темпе, стабильно и методично", type: "S"},
    {id: "c", text: "Мой темп зависит от энергии команды", type: "I"},
    {id: "d", text: "Я работаю тщательно, не спеша", type: "C"}
  ]
}
```

### Вопрос 6: Мотивация

```javascript
{
  question_id: "disc_q06",
  statements: [
    {id: "a", text: "Меня мотивируют вызовы и достижения", type: "D"},
    {id: "b", text: "Меня мотивирует признание и внимание", type: "I"},
    {id: "c", text: "Меня мотивирует стабильность и гармония", type: "S"},
    {id: "d", text: "Меня мотивирует качество и точность", type: "C"}
  ]
}
```

### Вопрос 7: Риски

```javascript
{
  question_id: "disc_q07",
  statements: [
    {id: "a", text: "Я готов рисковать ради больших целей", type: "D"},
    {id: "b", text: "Я рискую, если это выглядит весело", type: "I"},
    {id: "c", text: "Я предпочитаю избегать рисков", type: "S"},
    {id: "d", text: "Я рискую только после тщательного анализа", type: "C"}
  ]
}
```

### Вопрос 8: Структура

```javascript
{
  question_id: "disc_q08",
  statements: [
    {id: "a", text: "Я не люблю правила, если они мешают результату", type: "D"},
    {id: "b", text: "Я гибкий и адаптируюсь к ситуации", type: "I"},
    {id: "c", text: "Я следую установленным процедурам", type: "S"},
    {id: "d", text: "Я создаю и соблюдаю системы и стандарты", type: "C"}
  ]
}
```

### Вопрос 9: Работа в команде

```javascript
{
  question_id: "disc_q09",
  statements: [
    {id: "a", text: "Я предпочитаю руководить командой", type: "D"},
    {id: "b", text: "Я вдохновляю команду и поддерживаю дух", type: "I"},
    {id: "c", text: "Я поддерживаю и помогаю членам команды", type: "S"},
    {id: "d", text: "Я обеспечиваю качество работы команды", type: "C"}
  ]
}
```

### Вопрос 10: Стресс

```javascript
{
  question_id: "disc_q10",
  statements: [
    {id: "a", text: "Под стрессом я становлюсь более агрессивным", type: "D"},
    {id: "b", text: "Под стрессом я становлюсь беспокойным и разговорчивым", type: "I"},
    {id: "c", text: "Под стрессом я замыкаюсь в себе", type: "S"},
    {id: "d", text: "Под стрессом я становлюсь критичным", type: "C"}
  ]
}
```

### Вопрос 11: Критика

```javascript
{
  question_id: "disc_q11",
  statements: [
    {id: "a", text: "Я принимаю критику, если она по делу", type: "D"},
    {id: "b", text: "Критика ранит меня, но я не показываю", type: "I"},
    {id: "c", text: "Я принимаю критику близко к сердцу", type: "S"},
    {id: "d", text: "Я анализирую критику объективно", type: "C"}
  ]
}
```

### Вопрос 12: Изменения

```javascript
{
  question_id: "disc_q12",
  statements: [
    {id: "a", text: "Я инициирую изменения для улучшения", type: "D"},
    {id: "b", text: "Я принимаю изменения с энтузиазмом", type: "I"},
    {id: "c", text: "Мне нужно время, чтобы адаптироваться к изменениям", type: "S"},
    {id: "d", text: "Я принимаю изменения, если они обоснованы", type: "C"}
  ]
}
```

### Вопрос 13: Внимание к деталям

```javascript
{
  question_id: "disc_q13",
  statements: [
    {id: "a", text: "Я фокусируюсь на общей картине, не на деталях", type: "D"},
    {id: "b", text: "Детали меня утомляют", type: "I"},
    {id: "c", text: "Я внимателен к деталям, если это важно для команды", type: "S"},
    {id: "d", text: "Я перфекционист в деталях", type: "C"}
  ]
}
```

### Вопрос 14: Планирование

```javascript
{
  question_id: "disc_q14",
  statements: [
    {id: "a", text: "Я планирую только основные шаги", type: "D"},
    {id: "b", text: "Я редко планирую заранее", type: "I"},
    {id: "c", text: "Я планирую методично и последовательно", type: "S"},
    {id: "d", text: "Я составляю детальные планы", type: "C"}
  ]
}
```

### Вопрос 15: Эмоции

```javascript
{
  question_id: "disc_q15",
  statements: [
    {id: "a", text: "Я контролирую эмоции и остаюсь сдержанным", type: "D"},
    {id: "b", text: "Я эмоционален и показываю свои чувства", type: "I"},
    {id: "c", text: "Я спокоен и уравновешен", type: "S"},
    {id: "d", text: "Я редко показываю эмоции", type: "C"}
  ]
}
```

### Вопрос 16: Новые люди

```javascript
{
  question_id: "disc_q16",
  statements: [
    {id: "a", text: "Я уверенно подхожу к новым людям", type: "D"},
    {id: "b", text: "Я легко знакомлюсь и становлюсь друзьями", type: "I"},
    {id: "c", text: "Мне нужно время, чтобы открыться", type: "S"},
    {id: "d", text: "Я наблюдаю сначала, потом общаюсь", type: "C"}
  ]
}
```

### Вопрос 17: Ошибки

```javascript
{
  question_id: "disc_q17",
  statements: [
    {id: "a", text: "Я признаю ошибки и быстро двигаюсь дальше", type: "D"},
    {id: "b", text: "Я извиняюсь за ошибки и исправляю", type: "I"},
    {id: "c", text: "Ошибки меня расстраивают", type: "S"},
    {id: "d", text: "Я анализирую причины ошибок", type: "C"}
  ]
}
```

### Вопрос 18: Рабочая среда

```javascript
{
  question_id: "disc_q18",
  statements: [
    {id: "a", text: "Я предпочитаю быстрый темп и вызовы", type: "D"},
    {id: "b", text: "Я люблю творческую и социальную атмосферу", type: "I"},
    {id: "c", text: "Я ценю спокойную и стабильную среду", type: "S"},
    {id: "d", text: "Я предпочитаю организованное пространство", type: "C"}
  ]
}
```

### Вопрос 19: Цели

```javascript
{
  question_id: "disc_q19",
  statements: [
    {id: "a", text: "Я ставлю амбициозные цели", type: "D"},
    {id: "b", text: "Мои цели вдохновляют меня и других", type: "I"},
    {id: "c", text: "Я ставлю реалистичные цели", type: "S"},
    {id: "d", text: "Мои цели конкретны и измеримы", type: "C"}
  ]
}
```

### Вопрос 20: Обратная связь

```javascript
{
  question_id: "disc_q20",
  statements: [
    {id: "a", text: "Я даю прямую и честную обратную связь", type: "D"},
    {id: "b", text: "Я хвалю и поощряю позитивно", type: "I"},
    {id: "c", text: "Я даю обратную связь мягко и тактично", type: "S"},
    {id: "d", text: "Я даю конструктивную критику с примерами", type: "C"}
  ]
}
```

### Вопрос 21: Приоритеты

```javascript
{
  question_id: "disc_q21",
  statements: [
    {id: "a", text: "Мой приоритет - результат", type: "D"},
    {id: "b", text: "Мой приоритет - люди и отношения", type: "I"},
    {id: "c", text: "Мой приоритет - стабильность и безопасность", type: "S"},
    {id: "d", text: "Мой приоритет - качество и точность", type: "C"}
  ]
}
```

### Вопрос 22: Автономия

```javascript
{
  question_id: "disc_q22",
  statements: [
    {id: "a", text: "Я предпочитаю полную автономию", type: "D"},
    {id: "b", text: "Мне нужна поддержка команды", type: "I"},
    {id: "c", text: "Я люблю работать в партнерстве", type: "S"},
    {id: "d", text: "Я независим, но следую стандартам", type: "C"}
  ]
}
```

### Вопрос 23: Дедлайны

```javascript
{
  question_id: "disc_q23",
  statements: [
    {id: "a", text: "Я работаю лучше под давлением дедлайнов", type: "D"},
    {id: "b", text: "Дедлайны меня стимулируют", type: "I"},
    {id: "c", text: "Я предпочитаю иметь запас времени", type: "S"},
    {id: "d", text: "Я планирую заранее, чтобы избежать спешки", type: "C"}
  ]
}
```

### Вопрос 24: Лидерство

```javascript
{
  question_id: "disc_q24",
  statements: [
    {id: "a", text: "Я лидер, который направляет и решает", type: "D"},
    {id: "b", text: "Я лидер, который вдохновляет и мотивирует", type: "I"},
    {id: "c", text: "Я лидер, который поддерживает и развивает", type: "S"},
    {id: "d", text: "Я лидер, который устанавливает стандарты", type: "C"}
  ]
}
```

---

## 🧮 Алгоритм Подсчета DiSC

### Шаг 1: Подсчет баллов

```python
def calculate_disc_scores(answers):
    """
    Подсчитать баллы DiSC на основе ответов
    
    Args:
        answers: dict {
            question_id: {
                "most": statement_id,
                "least": statement_id
            }
        }
    
    Returns:
        dict {D: score, I: score, S: score, C: score}
    """
    
    scores = {"D": 0, "I": 0, "S": 0, "C": 0}
    
    questions_db = get_disc_questions()
    
    for question_id, answer in answers.items():
        question = questions_db[question_id]
        
        # Найти выбранные утверждения
        most_statement = next(
            s for s in question['statements'] 
            if s['id'] == answer['most']
        )
        least_statement = next(
            s for s in question['statements'] 
            if s['id'] == answer['least']
        )
        
        # MOST добавляет +1 балл
        scores[most_statement['disc_type']] += 1
        
        # LEAST вычитает -1 балл
        scores[least_statement['disc_type']] -= 1
    
    return scores

# Пример:
# 24 вопроса, в каждом выбрал MOST и LEAST
# 
# Возможные баллы: от -24 до +24 для каждого типа
# (если все MOST выбрал D, и все LEAST выбрал другие типы = +24 для D)
```

### Шаг 2: Нормализация (0-100)

```python
def normalize_disc_scores(raw_scores):
    """
    Нормализовать DiSC баллы в диапазон 0-100
    """
    # Минимум = -24, Максимум = +24
    # Диапазон = 48
    
    normalized = {}
    for disc_type, raw_score in raw_scores.items():
        # Сдвинуть диапазон с [-24, 24] в [0, 48]
        shifted = raw_score + 24
        
        # Конвертировать в 0-100
        normalized[disc_type] = round((shifted / 48) * 100, 2)
    
    return normalized

# Пример:
# raw_scores = {"D": 12, "I": -4, "S": -2, "C": -6}
# 
# D: (12 + 24) / 48 * 100 = 75.0
# I: (-4 + 24) / 48 * 100 = 41.67
# S: (-2 + 24) / 48 * 100 = 45.83
# C: (-6 + 24) / 48 * 100 = 37.5
```

### Шаг 3: Определение доминирующего типа

```python
def determine_disc_profile(normalized_scores):
    """
    Определить DiSC профиль пользователя
    """
    # Найти доминирующий тип
    dominant = max(normalized_scores, key=normalized_scores.get)
    dominant_score = normalized_scores[dominant]
    
    # Найти вторичный тип
    sorted_types = sorted(
        normalized_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    secondary = sorted_types[1][0] if len(sorted_types) > 1 else None
    secondary_score = sorted_types[1][1] if len(sorted_types) > 1 else 0
    
    # Определить стиль (комбинацию)
    style = determine_disc_style(dominant, secondary, normalized_scores)
    
    return {
        "dominant": dominant,
        "dominant_score": dominant_score,
        "secondary": secondary,
        "secondary_score": secondary_score,
        "style": style,
        "all_scores": normalized_scores
    }

# Пример:
# normalized = {"D": 75.0, "I": 41.67, "S": 45.83, "C": 37.5}
# 
# dominant = "D"
# secondary = "S"
# style = "DC" (если C тоже высокий) или просто "D"
```

---

## 📊 12 Стилей DiSC

### Определение стиля:

```python
def determine_disc_style(dominant, secondary, scores):
    """
    Определить один из 12 стилей DiSC
    """
    
    # Пороговые значения
    HIGH = 60  # Высокий балл
    MODERATE = 40  # Умеренный балл
    
    dom_score = scores[dominant]
    
    # Проверить, есть ли сильный вторичный тип
    other_high_scores = [
        (type, score) for type, score in scores.items()
        if type != dominant and score >= HIGH
    ]
    
    if not other_high_scores:
        # Чистый тип (D, I, S, C)
        return dominant
    
    # Есть вторичный высокий тип
    secondary_type, secondary_score = other_high_scores[0]
    
    # Определить комбинацию
    combo = ''.join(sorted([dominant, secondary_type]))
    
    STYLE_MAP = {
        "DI": "Di",  # Вдохновитель
        "DC": "DC",  # Генератор результатов
        "DI": "ID",  # Мотиватор
        "IS": "IS",  # Советник
        "SI": "SI",  # Помощник
        "SC": "SC",  # Планировщик
        "CD": "CD",  # Скептик
        "CS": "CS",  # Стабилизатор
    }
    
    return STYLE_MAP.get(combo, dominant)
```

### 12 Стилей DiSC:

```python
DISC_STYLES = {
    # Чистые типы (4)
    "D": {
        "name": {
            "ru": "Доминирующий",
            "en": "Dominance"
        },
        "subtitle": "Challenger",
        "description": "Прямой, решительный, ориентированный на результат",
        "strengths": [
            "Быстрое принятие решений",
            "Решение проблем",
            "Достижение целей",
            "Принятие вызовов"
        ],
        "challenges": [
            "Может быть слишком прямолинейным",
            "Нетерпелив к деталям",
            "Может доминировать в разговорах"
        ],
        "careers": [
            "CEO",
            "Entrepreneur",
            "Sales Manager",
            "Lawyer",
            "Surgeon"
        ]
    },
    
    "I": {
        "name": {
            "ru": "Влиятельный",
            "en": "Influence"
        },
        "subtitle": "Enthusiast",
        "description": "Общительный, оптимистичный, вдохновляющий",
        "strengths": [
            "Мотивация других",
            "Построение отношений",
            "Энтузиазм",
            "Креативность в общении"
        ],
        "challenges": [
            "Может быть неорганизованным",
            "Избегает конфликтов",
            "Импульсивен"
        ],
        "careers": [
            "Marketing Manager",
            "PR Specialist",
            "Sales Representative",
            "Event Coordinator",
            "Teacher"
        ]
    },
    
    "S": {
        "name": {
            "ru": "Стабильный",
            "en": "Steadiness"
        },
        "subtitle": "Supporter",
        "description": "Терпеливый, надежный, командный игрок",
        "strengths": [
            "Командная работа",
            "Терпение",
            "Надежность",
            "Поддержка других"
        ],
        "challenges": [
            "Сопротивляется изменениям",
            "Избегает конфронтации",
            "Медленно принимает решения"
        ],
        "careers": [
            "HR Specialist",
            "Nurse",
            "Social Worker",
            "Customer Service",
            "Teacher"
        ]
    },
    
    "C": {
        "name": {
            "ru": "Добросовестный",
            "en": "Conscientiousness"
        },
        "subtitle": "Analyst",
        "description": "Точный, аналитичный, ориентированный на качество",
        "strengths": [
            "Внимание к деталям",
            "Аналитическое мышление",
            "Высокие стандарты",
            "Систематический подход"
        ],
        "challenges": [
            "Перфекционизм",
            "Избегает рисков",
            "Критичен к себе и другим"
        ],
        "careers": [
            "Accountant",
            "Engineer",
            "Quality Control",
            "Data Analyst",
            "Researcher"
        ]
    },
    
    # Комбинированные стили (8)
    "Di": {
        "name": {
            "ru": "Вдохновитель",
            "en": "Inspirational"
        },
        "description": "Доминирование + Влияние: Харизматичный лидер",
        "strengths": [
            "Вдохновляет на действие",
            "Харизматичен",
            "Быстрые решения с энтузиазмом"
        ],
        "careers": [
            "Entrepreneur",
            "Motivational Speaker",
            "Creative Director"
        ]
    },
    
    "DC": {
        "name": {
            "ru": "Генератор результатов",
            "en": "Results-Oriented"
        },
        "description": "Доминирование + Добросовестность: Сфокусированный на качестве результате",
        "strengths": [
            "Высокие стандарты",
            "Достижение сложных целей",
            "Организованность в действиях"
        ],
        "careers": [
            "Project Manager",
            "Operations Manager",
            "Engineer"
        ]
    },
    
    "ID": {
        "name": {
            "ru": "Мотиватор",
            "en": "Motivator"
        },
        "description": "Влияние + Доминирование: Энергичный лидер",
        "strengths": [
            "Мотивация команды",
            "Энергия и драйв",
            "Харизматичное лидерство"
        ],
        "careers": [
            "Sales Leader",
            "Team Coach",
            "Marketing Director"
        ]
    },
    
    "IS": {
        "name": {
            "ru": "Советник",
            "en": "Counselor"
        },
        "description": "Влияние + Стабильность: Поддерживающий коммуникатор",
        "strengths": [
            "Эмпатия",
            "Построение доверия",
            "Поддержка команды"
        ],
        "careers": [
            "Counselor",
            "HR Manager",
            "Teacher"
        ]
    },
    
    "SI": {
        "name": {
            "ru": "Помощник",
            "en": "Helper"
        },
        "description": "Стабильность + Влияние: Дружелюбный помощник",
        "strengths": [
            "Поддержка других",
            "Позитивная атмосфера",
            "Терпение в общении"
        ],
        "careers": [
            "Customer Service",
            "Nurse",
            "Social Worker"
        ]
    },
    
    "SC": {
        "name": {
            "ru": "Планировщик",
            "en": "Planner"
        },
        "description": "Стабильность + Добросовестность: Методичный исполнитель",
        "strengths": [
            "Надежность",
            "Тщательность",
            "Последовательность"
        ],
        "careers": [
            "Administrator",
            "Librarian",
            "Accountant"
        ]
    },
    
    "CD": {
        "name": {
            "ru": "Скептик",
            "en": "Skeptic"
        },
        "description": "Добросовестность + Доминирование: Критичный решатель",
        "strengths": [
            "Критическое мышление",
            "Высокие стандарты",
            "Решительность в качестве"
        ],
        "careers": [
            "Quality Assurance",
            "Auditor",
            "Consultant"
        ]
    },
    
    "CS": {
        "name": {
            "ru": "Стабилизатор",
            "en": "Stabilizer"
        },
        "description": "Добросовестность + Стабильность: Надежный аналитик",
        "strengths": [
            "Точность и надежность",
            "Стабильное качество",
            "Методичность"
        ],
        "careers": [
            "Data Analyst",
            "Researcher",
            "Technical Writer"
        ]
    }
}
```

---

## 📊 Результаты и Интерпретация

### Полная Структура Результата (JSON):

```json
{
  "test_id": "disc-assessment",
  "user_id": "uuid-here",
  "completed_at": "2024-01-15T11:00:00Z",
  "duration_seconds": 687,
  
  "raw_answers": {
    "disc_q01": {"most": "disc_q01_a", "least": "disc_q01_d"},
    "disc_q02": {"most": "disc_q02_a", "least": "disc_q02_c"},
    "...": "..."
  },
  
  "raw_scores": {
    "D": 12,
    "I": -4,
    "S": -2,
    "C": -6
  },
  
  "normalized_scores": {
    "D": 75.0,
    "I": 41.67,
    "S": 45.83,
    "C": 37.5
  },
  
  "disc_profile": {
    "dominant": "D",
    "dominant_score": 75.0,
    "secondary": "S",
    "secondary_score": 45.83,
    "style": "D",
    "confidence_level": "high"
  },
  
  "interpretation": {
    "primary_type": {
      "type": "D",
      "name": "Доминирующий (Dominance)",
      "subtitle": "Challenger",
      "description": "Вы прямолинейный, решительный человек, ориентированный на результат. Вы любите вызовы и быстро принимаете решения.",
      
      "detailed_analysis": """
      Ваш высокий балл D (75%) показывает, что вы:
      
      - Предпочитаете брать контроль и ответственность
      - Работаете в быстром темпе
      - Фокусируетесь на достижении целей
      - Говорите прямо и по делу
      - Не боитесь конфликтов
      - Принимаете решения быстро
      
      Вы процветаете в среде с:
      - Четкими целями и дедлайнами
      - Возможностью принимать решения
      - Вызовами и проблемами для решения
      - Автономией в работе
      """,
      
      "strengths": [
        "Быстрое принятие решений",
        "Фокус на результате",
        "Решение проблем",
        "Инициативность",
        "Прямая коммуникация",
        "Уверенность в себе"
      ],
      
      "potential_challenges": [
        "Может быть слишком прямолинейным",
        "Нетерпелив к деталям",
        "Может доминировать в обсуждениях",
        "Недооценивает важность отношений",
        "Сопротивляется контролю со стороны"
      ],
      
      "work_style": {
        "pace": "Быстрый темп",
        "priority": "Результаты и достижения",
        "decision_making": "Быстрый и решительный",
        "communication": "Прямой и конкретный",
        "conflict_approach": "Прямая конфронтация",
        "preferred_environment": "Динамичная, конкурентная"
      },
      
      "ideal_careers": [
        {
          "title": "CEO / General Manager",
          "match": 95,
          "reason": "Требует решительности, лидерства и ориентации на результат"
        },
        {
          "title": "Entrepreneur",
          "match": 93,
          "reason": "Автономия, риски и быстрые решения"
        },
        {
          "title": "Sales Manager",
          "match": 90,
          "reason": "Целеориентированность и убедительность"
        },
        {
          "title": "Project Manager",
          "match": 88,
          "reason": "Контроль проектов и достижение целей"
        },
        {
          "title": "Lawyer",
          "match": 85,
          "reason": "Аргументация и решительность"
        }
      ],
      
      "careers_to_avoid": [
        {
          "title": "Data Entry Clerk",
          "reason": "Рутинная детальная работа без автономии"
        },
        {
          "title": "Librarian",
          "reason": "Медленный темп, много деталей"
        }
      ]
    },
    
    "secondary_influence": {
      "type": "S",
      "score": 45.83,
      "impact": """
      Ваш умеренный балл S (46%) добавляет вашему D профилю:
      
      - Немного больше терпения с командой
      - Способность поддерживать других (когда нужно)
      - Некоторую лояльность и стабильность
      
      Это хорошо! Чистый D без S может быть слишком агрессивным.
      Ваша комбинация D+S делает вас:
      - Решительным лидером, который заботится о команде
      - Ориентированным на результат, но не за счет людей
      """
    },
    
    "low_scores_analysis": {
      "C": {
        "score": 37.5,
        "meaning": """
        Низкий C (38%) означает, что вы:
        - Не любите зацикливаться на деталях
        - Предпочитаете общую картину
        - Можете пропускать мелкие ошибки
        - Не перфекционист
        
        Совет: Работайте с людьми типа C, которые дополнят ваши навыки.
        """
      },
      "I": {
        "score": 41.67,
        "meaning": """
        Умеренно-низкий I (42%) означает:
        - Вы не самый экспрессивный в общении
        - Предпочитаете факты эмоциям
        - Не слишком зависите от социального одобрения
        
        Это нормально для D типа. Вы фокусируетесь на задачах, не на популярности.
        """
      }
    },
    
    "communication_guide": {
      "when_communicating_with_others": {
        "D_type": "Будьте краткими, прямыми, фокусируйтесь на результатах",
        "I_type": "Добавьте энтузиазма, признайте их вклад, будьте дружелюбнее",
        "S_type": "Притормозите, будьте терпеливее, дайте им время",
        "C_type": "Предоставьте детали и данные, будьте точны"
      },
      
      "tips_for_you": [
        "Притормозите иногда - не все работают в вашем темпе",
        "Слушайте больше, говорите меньше",
        "Признавайте вклад других, не только результаты",
        "Обращайте внимание на детали (или делегируйте C типу)",
        "Смягчайте прямую коммуникацию с S типами"
      ]
    },
    
    "development_recommendations": [
      {
        "area": "Терпение",
        "why": "Ваш быстрый темп может давить на других",
        "how": "Практикуйте активное слушание, давайте другим время"
      },
      {
        "area": "Внимание к деталям",
        "why": "Низкий C может приводить к ошибкам",
        "how": "Используйте чек-листы, работайте с C типами"
      },
      {
        "area": "Эмпатия",
        "why": "Фокус на задачах может игнорировать чувства людей",
        "how": "Спрашивайте 'Как ты себя чувствуешь?' не только 'Что сделано?'"
      }
    ]
  },
  
  "team_dynamics": {
    "your_role_in_team": "Лидер и драйвер результатов",
    "you_work_best_with": [
      "C типы - дополняют вашими детали и качество",
      "I типы - добавляют энергию и креатив",
      "S типы - обеспечивают стабильность и поддержку"
    ],
    "potential_conflicts_with": [
      "Другие D типы - борьба за контроль",
      "S типы - разный темп работы"
    ]
  },
  
  "stress_response": {
    "under_stress_you": [
      "Становитесь более агрессивным и контролирующим",
      "Можете быть грубым или нетерпеливым",
      "Игнорируете чувства других",
      "Принимаете поспешные решения"
    ],
    "stress_management": [
      "Физическая активность (бокс, бег)",
      "Четко структурируйте приоритеты",
      "Делегируйте детали другим",
      "Не пытайтесь контролировать все"
    ]
  },
  
  "comparison_with_population": {
    "percentiles": {
      "D": 85,
      "I": 40,
      "S": 48,
      "C": 35
    },
    "interpretation": "Вы в топ 15% по D (очень высокий), средний по I и S, низкий по C"
  }
}
```

---

## 🎨 Визуализация DiSC

### 1. DiSC Круг (Circle Graph):

```javascript
const discCircleVisualization = {
  type: "scatter",
  data: {
    datasets: [{
      label: "Ваш профиль",
      data: [{
        x: calculateX(D_score, I_score, S_score, C_score),
        y: calculateY(D_score, I_score, S_score, C_score)
      }],
      backgroundColor: '#FF6B35',
      borderColor: '#FF6B35',
      pointRadius: 10
    }]
  },
  options: {
    // DiSC круг с 4 квадрантами
  }
};

function calculateX(D, I, S, C) {
  // D (задачи, левая) vs I (люди, правая)
  return (I - D);
}

function calculateY(D, I, S, C) {
  // D+I (быстрый темп, верх) vs S+C (медленный темп, низ)
  return (D + I) - (S + C);
}
```

### 2. Столбчатая диаграмма (Bar Chart):

```javascript
const discBarChart = {
  labels: ['Dominance (D)', 'Influence (I)', 'Steadiness (S)', 'Conscientiousness (C)'],
  datasets: [{
    label: 'Ваши баллы',
    data: [75.0, 41.67, 45.83, 37.5],
    backgroundColor: ['#E74C3C', '#F39C12', '#27AE60', '#3498DB']
  }]
};
```

### 3. Радарная диаграмма:

```javascript
const discRadarChart = {
  labels: ['D', 'I', 'S', 'C'],
  datasets: [{
    label: 'Ваш профиль',
    data: [75.0, 41.67, 45.83, 37.5],
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderColor: '#E74C3C'
  }]
};
```

---

Продолжить с **Тестом 4: Career Values Quiz**?

