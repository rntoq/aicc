# 🔧 Техническая Интеграция: Big Five Personality Test (OCEAN)
## Научно Обоснованный Тест Личности

---

# Тест 5: Big Five (OCEAN) Assessment

## 📊 Общая Информация

**ID теста:** `big-five-ocean`  
**Версия:** 1.0 (IPIP-NEO)  
**Вопросов:** 44 (44-item mini-IPIP)  
**Время:** 15 минут  
**Тип ответов:** Шкала согласия 1-5  
**Модель:** 5 черт личности (OCEAN)  
**Научная основа:** Goldberg's Big Five Factor Markers  

---

## 🎯 Концепция Big Five (OCEAN)

### Что измеряет:

Big Five - это самая научно обоснованная модель личности, измеряющая **5 основных черт характера**, которые стабильны во времени и предсказывают поведение.

### Аббревиатура OCEAN:

```
O - Openness to Experience (Открытость опыту)
C - Conscientiousness (Добросовестность)
E - Extraversion (Экстраверсия)
A - Agreeableness (Доброжелательность)
N - Neuroticism (Нейротизм / Эмоциональная нестабильность)
```

### 5 Черт Личности:

```javascript
const BIG_FIVE_TRAITS = {
  "OPENNESS": {
    code: "O",
    name: {
      ru: "Открытость опыту",
      kk: "Тәжірибеге ашықтық",
      en: "Openness to Experience"
    },
    description: {
      ru: "Любопытство, креативность, открытость новым идеям и опыту",
      en: "Curiosity, creativity, openness to new ideas and experiences"
    },
    facets: [
      "Imagination (Воображение)",
      "Artistic Interests (Художественные интересы)",
      "Emotionality (Эмоциональность)",
      "Adventurousness (Авантюризм)",
      "Intellect (Интеллект)",
      "Liberalism (Либерализм)"
    ],
    high_score_means: "Креативный, любопытный, открытый новому",
    low_score_means: "Практичный, традиционный, предпочитает рутину",
    color: "#9C27B0"
  },
  
  "CONSCIENTIOUSNESS": {
    code: "C",
    name: {
      ru: "Добросовестность",
      kk: "Адалдық",
      en: "Conscientiousness"
    },
    description: {
      ru: "Организованность, ответственность, целеустремленность",
      en: "Organization, responsibility, goal-directedness"
    },
    facets: [
      "Self-Efficacy (Самоэффективность)",
      "Orderliness (Упорядоченность)",
      "Dutifulness (Чувство долга)",
      "Achievement-Striving (Стремление к достижениям)",
      "Self-Discipline (Самодисциплина)",
      "Cautiousness (Осторожность)"
    ],
    high_score_means: "Организованный, надежный, целеустремленный",
    low_score_means: "Спонтанный, гибкий, расслабленный",
    color: "#2196F3"
  },
  
  "EXTRAVERSION": {
    code: "E",
    name: {
      ru: "Экстраверсия",
      kk: "Экстраверсия",
      en: "Extraversion"
    },
    description: {
      ru: "Общительность, энергичность, позитивные эмоции",
      en: "Sociability, energy, positive emotions"
    },
    facets: [
      "Friendliness (Дружелюбие)",
      "Gregariousness (Общительность)",
      "Assertiveness (Напористость)",
      "Activity Level (Уровень активности)",
      "Excitement-Seeking (Поиск впечатлений)",
      "Cheerfulness (Жизнерадостность)"
    ],
    high_score_means: "Общительный, энергичный, разговорчивый",
    low_score_means: "Сдержанный, независимый, тихий (Интроверт)",
    color: "#FF9800"
  },
  
  "AGREEABLENESS": {
    code: "A",
    name: {
      ru: "Доброжелательность",
      kk: "Мейірімділік",
      en: "Agreeableness"
    },
    description: {
      ru: "Сотрудничество, эмпатия, доверие к людям",
      en: "Cooperation, empathy, trust in people"
    },
    facets: [
      "Trust (Доверие)",
      "Morality (Честность)",
      "Altruism (Альтруизм)",
      "Cooperation (Сотрудничество)",
      "Modesty (Скромность)",
      "Sympathy (Сочувствие)"
    ],
    high_score_means: "Сострадательный, кооперативный, доверчивый",
    low_score_means: "Конкурентный, скептичный, прямолинейный",
    color: "#4CAF50"
  },
  
  "NEUROTICISM": {
    code: "N",
    name: {
      ru: "Нейротизм",
      kk: "Нейротизм",
      en: "Neuroticism"
    },
    alternative_name: {
      ru: "Эмоциональная стабильность (обратная шкала)",
      en: "Emotional Stability (reversed)"
    },
    description: {
      ru: "Склонность к негативным эмоциям и стрессу",
      en: "Tendency to experience negative emotions and stress"
    },
    facets: [
      "Anxiety (Тревожность)",
      "Anger (Гневливость)",
      "Depression (Депрессивность)",
      "Self-Consciousness (Самосознание)",
      "Immoderation (Неумеренность)",
      "Vulnerability (Уязвимость)"
    ],
    high_score_means: "Эмоционально реактивный, склонен к стрессу",
    low_score_means: "Спокойный, стабильный, устойчивый к стрессу",
    color: "#F44336",
    note: "Низкий Neuroticism = Высокая эмоциональная стабильность (это хорошо)"
  }
};
```

---

## 📝 Структура Вопросов (44 вопроса, по ~9 на черту)

### Формат вопроса:

```javascript
{
  "question_id": "ocean_o_01",
  "trait": "OPENNESS",
  "question_number": 1,
  "statement": {
    "ru": "У меня богатое воображение",
    "kk": "Менің қиялым бай",
    "en": "I have a vivid imagination"
  },
  "reverse_scored": false,
  "scale": {
    "1": {"label": "Совершенно не согласен", "value": 1},
    "2": {"label": "Скорее не согласен", "value": 2},
    "3": {"label": "Нейтрально", "value": 3},
    "4": {"label": "Скорее согласен", "value": 4},
    "5": {"label": "Полностью согласен", "value": 5}
  }
}
```

**Важно:** Некоторые вопросы обратно закодированы (`reverse_scored: true`)

---

## 📋 Полный Список 44 Вопросов

### OPENNESS (Открытость) - 9 вопросов

```javascript
const opennessQuestions = [
  {
    id: "ocean_o_01",
    text: "У меня богатое воображение",
    trait: "OPENNESS",
    reverse: false
  },
  {
    id: "ocean_o_02",
    text: "Меня интересуют абстрактные идеи",
    trait: "OPENNESS",
    reverse: false
  },
  {
    id: "ocean_o_03",
    text: "Мне нравится играть с теориями и идеями",
    trait: "OPENNESS",
    reverse: false
  },
  {
    id: "ocean_o_04",
    text: "Я быстро понимаю новые вещи",
    trait: "OPENNESS",
    reverse: false
  },
  {
    id: "ocean_o_05",
    text: "Я люблю размышлять о вещах",
    trait: "OPENNESS",
    reverse: false
  },
  {
    id: "ocean_o_06",
    text: "Мне трудно понимать абстрактные идеи",
    trait: "OPENNESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_o_07",
    text: "У меня нет хорошего воображения",
    trait: "OPENNESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_o_08",
    text: "Я не интересуюсь абстрактными вещами",
    trait: "OPENNESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_o_09",
    text: "Я избегаю философских дискуссий",
    trait: "OPENNESS",
    reverse: true  // ОБРАТНЫЙ
  }
];
```

### CONSCIENTIOUSNESS (Добросовестность) - 9 вопросов

```javascript
const conscientiousnessQuestions = [
  {
    id: "ocean_c_01",
    text: "Я всегда готовлюсь заранее",
    trait: "CONSCIENTIOUSNESS",
    reverse: false
  },
  {
    id: "ocean_c_02",
    text: "Я обращаю внимание на детали",
    trait: "CONSCIENTIOUSNESS",
    reverse: false
  },
  {
    id: "ocean_c_03",
    text: "Я довожу дела до конца",
    trait: "CONSCIENTIOUSNESS",
    reverse: false
  },
  {
    id: "ocean_c_04",
    text: "Я люблю порядок",
    trait: "CONSCIENTIOUSNESS",
    reverse: false
  },
  {
    id: "ocean_c_05",
    text: "Я следую расписанию",
    trait: "CONSCIENTIOUSNESS",
    reverse: false
  },
  {
    id: "ocean_c_06",
    text: "Я часто забываю вернуть вещи на место",
    trait: "CONSCIENTIOUSNESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_c_07",
    text: "Я оставляю свои вещи разбросанными",
    trait: "CONSCIENTIOUSNESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_c_08",
    text: "Я избегаю своих обязанностей",
    trait: "CONSCIENTIOUSNESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_c_09",
    text: "Я откладываю дела на потом",
    trait: "CONSCIENTIOUSNESS",
    reverse: true  // ОБРАТНЫЙ
  }
];
```

### EXTRAVERSION (Экстраверсия) - 9 вопросов

```javascript
const extraversionQuestions = [
  {
    id: "ocean_e_01",
    text: "Я душа компании",
    trait: "EXTRAVERSION",
    reverse: false
  },
  {
    id: "ocean_e_02",
    text: "Я легко завожу разговор с незнакомцами",
    trait: "EXTRAVERSION",
    reverse: false
  },
  {
    id: "ocean_e_03",
    text: "Мне комфортно быть в центре внимания",
    trait: "EXTRAVERSION",
    reverse: false
  },
  {
    id: "ocean_e_04",
    text: "Я люблю большие вечеринки",
    trait: "EXTRAVERSION",
    reverse: false
  },
  {
    id: "ocean_e_05",
    text: "Я полон энергии",
    trait: "EXTRAVERSION",
    reverse: false
  },
  {
    id: "ocean_e_06",
    text: "Я предпочитаю оставаться в тени",
    trait: "EXTRAVERSION",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_e_07",
    text: "Мне не нравится привлекать к себе внимание",
    trait: "EXTRAVERSION",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_e_08",
    text: "Я тихий в присутствии незнакомцев",
    trait: "EXTRAVERSION",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_e_09",
    text: "Мне нечего сказать",
    trait: "EXTRAVERSION",
    reverse: true  // ОБРАТНЫЙ
  }
];
```

### AGREEABLENESS (Доброжелательность) - 9 вопросов

```javascript
const agreeablenessQuestions = [
  {
    id: "ocean_a_01",
    text: "Я интересуюсь другими людьми",
    trait: "AGREEABLENESS",
    reverse: false
  },
  {
    id: "ocean_a_02",
    text: "Я сочувствую чувствам других",
    trait: "AGREEABLENESS",
    reverse: false
  },
  {
    id: "ocean_a_03",
    text: "Я стараюсь утешить других",
    trait: "AGREEABLENESS",
    reverse: false
  },
  {
    id: "ocean_a_04",
    text: "Я забочусь о других",
    trait: "AGREEABLENESS",
    reverse: false
  },
  {
    id: "ocean_a_05",
    text: "Я мягкосердечен",
    trait: "AGREEABLENESS",
    reverse: false
  },
  {
    id: "ocean_a_06",
    text: "Я не интересуюсь проблемами других",
    trait: "AGREEABLENESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_a_07",
    text: "Мне все равно, что чувствуют другие",
    trait: "AGREEABLENESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_a_08",
    text: "Я могу быть грубым с людьми",
    trait: "AGREEABLENESS",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_a_09",
    text: "Я оскорбляю людей",
    trait: "AGREEABLENESS",
    reverse: true  // ОБРАТНЫЙ
  }
];
```

### NEUROTICISM (Нейротизм) - 8 вопросов

```javascript
const neuroticismQuestions = [
  {
    id: "ocean_n_01",
    text: "Я часто чувствую грусть",
    trait: "NEUROTICISM",
    reverse: false
  },
  {
    id: "ocean_n_02",
    text: "Я легко выхожу из себя",
    trait: "NEUROTICISM",
    reverse: false
  },
  {
    id: "ocean_n_03",
    text: "Я испытываю перепады настроения",
    trait: "NEUROTICISM",
    reverse: false
  },
  {
    id: "ocean_n_04",
    text: "Я легко впадаю в стресс",
    trait: "NEUROTICISM",
    reverse: false
  },
  {
    id: "ocean_n_05",
    text: "Я много беспокоюсь о вещах",
    trait: "NEUROTICISM",
    reverse: false
  },
  {
    id: "ocean_n_06",
    text: "Я редко чувствую грусть",
    trait: "NEUROTICISM",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_n_07",
    text: "Я спокоен в стрессовых ситуациях",
    trait: "NEUROTICISM",
    reverse: true  // ОБРАТНЫЙ
  },
  {
    id: "ocean_n_08",
    text: "Я эмоционально стабилен",
    trait: "NEUROTICISM",
    reverse: true  // ОБРАТНЫЙ
  }
];
```

---

## 🧮 Алгоритм Подсчета

### Шаг 1: Обработка обратных вопросов

```python
def process_answer(question, answer_value):
    """
    Обработать ответ с учетом обратной кодировки
    
    Args:
        question: объект вопроса
        answer_value: значение ответа (1-5)
    
    Returns:
        processed_value: обработанное значение
    """
    
    if question['reverse_scored']:
        # Обратить шкалу: 1→5, 2→4, 3→3, 4→2, 5→1
        return 6 - answer_value
    else:
        return answer_value

# Пример:
# Вопрос: "У меня нет хорошего воображения" (reverse=True)
# Ответ: 1 (совершенно не согласен)
# 
# Обработанное значение: 6 - 1 = 5
# (т.е. несогласие с "нет воображения" = высокая Openness)
```

### Шаг 2: Подсчет сырых баллов по чертам

```python
def calculate_ocean_scores(answers):
    """
    Подсчитать баллы по каждой из 5 черт
    
    Args:
        answers: dict {question_id: answer_value}
    
    Returns:
        dict {trait: raw_score}
    """
    
    trait_scores = {
        "OPENNESS": [],
        "CONSCIENTIOUSNESS": [],
        "EXTRAVERSION": [],
        "AGREEABLENESS": [],
        "NEUROTICISM": []
    }
    
    questions_db = get_ocean_questions()
    
    for question_id, answer_value in answers.items():
        question = questions_db[question_id]
        trait = question['trait']
        
        # Обработать обратные вопросы
        processed_value = process_answer(question, answer_value)
        
        # Добавить к соответствующей черте
        trait_scores[trait].append(processed_value)
    
    # Подсчитать среднее для каждой черты
    average_scores = {}
    for trait, scores_list in trait_scores.items():
        if scores_list:
            average_scores[trait] = sum(scores_list) / len(scores_list)
        else:
            average_scores[trait] = 0
    
    return average_scores

# Пример:
# answers = {
#     "ocean_o_01": 5,  # У меня богатое воображение - согласен
#     "ocean_o_02": 4,  # Интересуюсь абстракциями - скорее согласен
#     "ocean_o_06": 2,  # Трудно понимать абстракции (reverse) - не согласен → 6-2=4
#     ...
# }
# 
# Результат:
# {
#     "OPENNESS": 4.33,  # Среднее из 9 вопросов
#     "CONSCIENTIOUSNESS": 3.78,
#     "EXTRAVERSION": 2.56,
#     "AGREEABLENESS": 4.11,
#     "NEUROTICISM": 2.25
# }
```

### Шаг 3: Нормализация в 0-100

```python
def normalize_ocean_scores(raw_scores):
    """
    Нормализовать баллы в диапазон 0-100
    """
    
    normalized = {}
    for trait, raw_score in raw_scores.items():
        # raw_score диапазон: 1-5
        # Конвертировать в 0-100
        normalized[trait] = round((raw_score - 1) / 4 * 100, 2)
    
    return normalized

# Пример:
# raw_scores = {
#     "OPENNESS": 4.33,
#     "CONSCIENTIOUSNESS": 3.78,
#     "EXTRAVERSION": 2.56,
#     "AGREEABLENESS": 4.11,
#     "NEUROTICISM": 2.25
# }
# 
# normalized = {
#     "OPENNESS": 83.25,      # (4.33 - 1) / 4 * 100
#     "CONSCIENTIOUSNESS": 69.5,
#     "EXTRAVERSION": 39.0,   # Низкая экстраверсия = интроверт
#     "AGREEABLENESS": 77.75,
#     "NEUROTICISM": 31.25    # Низкий нейротизм = стабильный
# }
```

### Шаг 4: Расчет процентилей

```python
def calculate_percentiles(user_scores, population_data):
    """
    Рассчитать процентили относительно популяции
    
    Процентиль показывает: какой процент людей получил ниже балл
    """
    
    percentiles = {}
    
    for trait in ["OPENNESS", "CONSCIENTIOUSNESS", "EXTRAVERSION", 
                  "AGREEABLENESS", "NEUROTICISM"]:
        user_score = user_scores[trait]
        all_scores = population_data[trait]
        
        below_count = sum(1 for score in all_scores if score < user_score)
        total_count = len(all_scores)
        
        percentile = (below_count / total_count) * 100
        percentiles[trait] = round(percentile)
    
    return percentiles

# Пример:
# Если OPENNESS = 83.25, и только 15% людей имеют выше
# → percentile = 85 (топ 15%)
```

---

## 📊 Результаты и Интерпретация

### Полная Структура Результата (JSON):

```json
{
  "test_id": "big-five-ocean",
  "user_id": "uuid-here",
  "completed_at": "2024-01-15T11:30:00Z",
  "duration_seconds": 843,
  
  "raw_answers": {
    "ocean_o_01": 5,
    "ocean_o_02": 4,
    "...": "..."
  },
  
  "raw_scores": {
    "OPENNESS": 4.33,
    "CONSCIENTIOUSNESS": 3.78,
    "EXTRAVERSION": 2.56,
    "AGREEABLENESS": 4.11,
    "NEUROTICISM": 2.25
  },
  
  "normalized_scores": {
    "OPENNESS": 83.25,
    "CONSCIENTIOUSNESS": 69.5,
    "EXTRAVERSION": 39.0,
    "AGREEABLENESS": 77.75,
    "NEUROTICISM": 31.25
  },
  
  "percentiles": {
    "OPENNESS": 85,
    "CONSCIENTIOUSNESS": 68,
    "EXTRAVERSION": 35,
    "AGREEABLENESS": 75,
    "NEUROTICISM": 30
  },
  
  "interpretation": {
    "personality_profile": {
      "type": "Creative Realist",
      "subtitle": "Открытый, организованный интроверт с эмоциональной стабильностью",
      "summary": """
      Ваш профиль OCEAN показывает уникальную комбинацию:
      
      - **Очень высокая Openness** (83%) - Вы креативны и открыты новому
      - **Высокая Conscientiousness** (70%) - Организованы и надежны
      - **Низкая Extraversion** (39%) - Интроверт, предпочитаете одиночество
      - **Высокая Agreeableness** (78%) - Доброжелательны и кооперативны
      - **Низкий Neuroticism** (31%) - Эмоционально стабильны
      
      Это редкая и ценная комбинация: креативный ум с дисциплиной,
      интровертная натура с эмпатией, и все это с эмоциональной стабильностью.
      """
    },
    
    "traits_detailed": [
      {
        "trait": "OPENNESS",
        "score": 83.25,
        "percentile": 85,
        "level": "very_high",
        
        "description": {
          "short": "Очень высокая открытость опыту",
          "detailed": """
          Вы в топ 15% по открытости. Это означает, что вы:
          
          - Очень креативны и имеете богатое воображение
          - Любите новые идеи и опыт
          - Интересуетесь абстрактными концепциями
          - Цените искусство и красоту
          - Открыты к переменам
          - Любопытны и интеллектуально активны
          """
        },
        
        "strengths": [
          "Креативное решение проблем",
          "Быстрое обучение новому",
          "Видите нестандартные решения",
          "Адаптируетесь к изменениям",
          "Ценность в инновациях"
        ],
        
        "challenges": [
          "Можете быть слишком абстрактным",
          "Скучаете при рутине",
          "Может не хватать практичности",
          "Иногда витаете в облаках"
        ],
        
        "in_work": {
          "ideal_roles": [
            "Creative профессии (дизайн, искусство)",
            "Исследования и R&D",
            "Инновационные проекты",
            "Стратегия и концепции",
            "Обучение и развитие"
          ],
          "avoid": [
            "Строгие рутинные задачи",
            "Работа без креативности",
            "Жесткие процедуры без гибкости"
          ]
        },
        
        "career_fit": [
          {
            "title": "UX/UI Designer",
            "match": 95,
            "why": "Креативность + новые тренды + эстетика"
          },
          {
            "title": "Product Manager",
            "match": 92,
            "why": "Инновации + видение будущего"
          },
          {
            "title": "Researcher",
            "match": 90,
            "why": "Интеллектуальное любопытство"
          },
          {
            "title": "Entrepreneur",
            "match": 88,
            "why": "Новые идеи и эксперименты"
          }
        ],
        
        "combines_with": {
          "high_conscientiousness": """
          Редкая комбинация! Обычно высокая O идет с низкой C.
          Вы креативны НО дисциплинированы = можете довести идеи до конца.
          Это суперсила для Product Manager или Entrepreneur.
          """,
          "low_extraversion": """
          Креативный интроверт - классический профиль писателя, дизайнера,
          программиста. Вы генерируете идеи в одиночестве.
          """
        }
      },
      
      {
        "trait": "CONSCIENTIOUSNESS",
        "score": 69.5,
        "percentile": 68,
        "level": "moderately_high",
        
        "description": {
          "short": "Выше среднего организованность",
          "detailed": """
          Вы более организованы чем 68% людей. Вы:
          
          - Достаточно организованы и методичны
          - Доводите дела до конца (обычно)
          - Планируете наперед
          - Надежны в обязательствах
          - Имеете самодисциплину
          
          Не экстремально высоко (не перфекционист), но достаточно
          для эффективной работы.
          """
        },
        
        "strengths": [
          "Надежность",
          "Планирование",
          "Достижение целей",
          "Самодисциплина",
          "Внимание к важным деталям"
        ],
        
        "challenges": [
          "Иногда можете прокрастинировать",
          "Не всегда перфекционист (это ОК)",
          "Баланс между структурой и гибкостью"
        ],
        
        "in_work": {
          "ideal_roles": [
            "Проектная работа с дедлайнами",
            "Роли с автономией (не нужен жесткий контроль)",
            "Задачи требующие надежности",
            "Работа с ответственностью"
          ],
          "avoid": [
            "Хаотичные среды без структуры",
            "Роли требующие экстремальной точности 24/7"
          ]
        },
        
        "career_fit": [
          {
            "title": "Project Manager",
            "match": 88,
            "why": "Организация + достижение целей"
          },
          {
            "title": "Product Manager",
            "match": 85,
            "why": "Баланс структуры и креатива"
          }
        ],
        
        "note": """
        Ваш уровень C (70%) идеален для креативных профессий.
        Достаточно высокий чтобы доводить проекты до конца,
        но не настолько высокий чтобы убить креативность.
        """
      },
      
      {
        "trait": "EXTRAVERSION",
        "score": 39.0,
        "percentile": 35,
        "level": "low",
        
        "description": {
          "short": "Интроверт",
          "detailed": """
          Вы интроверт (35 процентиль). Это означает:
          
          - Предпочитаете меньшие группы или одиночество
          - Не любите быть в центре внимания
          - Энергия восстанавливается в одиночестве
          - Предпочитаете глубокие беседы поверхностным
          - Тихий и задумчивый
          - Избирательны в социальных контактах
          
          Важно: Интроверсия ≠ застенчивость. Это про источник энергии.
          """
        },
        
        "strengths": [
          "Глубокая концентрация",
          "Независимая работа",
          "Вдумчивый анализ",
          "Слушание и наблюдение",
          "Письменная коммуникация"
        ],
        
        "challenges": [
          "Нетворкинг дается тяжелее",
          "Большие встречи утомляют",
          "Может не хватать видимости на работе",
          "Нужно время на восстановление после общения"
        ],
        
        "in_work": {
          "ideal_roles": [
            "Удаленная работа",
            "Роли с независимой работой",
            "Письменная коммуникация > устная",
            "Маленькие команды",
            "Глубокая работа (Deep Work)"
          ],
          "avoid": [
            "Продажи с холодными звонками",
            "Event management",
            "Роли требующие постоянного нетворкинга",
            "Open office без уединенных мест"
          ]
        },
        
        "career_fit": [
          {
            "title": "Software Developer",
            "match": 95,
            "why": "Независимая работа, глубокая концентрация"
          },
          {
            "title": "Writer / Content Creator",
            "match": 92,
            "why": "Одиночная креативная работа"
          },
          {
            "title": "Data Scientist",
            "match": 90,
            "why": "Анализ данных в одиночестве"
          },
          {
            "title": "Researcher",
            "match": 88,
            "why": "Независимые исследования"
          },
          {
            "title": "UX Designer",
            "match": 85,
            "why": "Креативная работа, небольшие встречи"
          }
        ],
        
        "note": """
        Ваша комбинация O+C+низкая E = идеальна для:
        - Software Engineering
        - UX Design
        - Research
        - Writing
        
        Все это роли где интроверсия - преимущество, не недостаток.
        """
      },
      
      {
        "trait": "AGREEABLENESS",
        "score": 77.75,
        "percentile": 75,
        "level": "high",
        
        "description": {
          "short": "Высокая доброжелательность",
          "detailed": """
          Вы более доброжелательны чем 75% людей. Вы:
          
          - Эмпатичны и сострадательны
          - Кооперативны в работе
          - Доверяете людям
          - Помогаете другим
          - Избегаете конфликтов
          - Скромны и не хвастливы
          """
        },
        
        "strengths": [
          "Командная работа",
          "Эмпатия",
          "Конфликт-резолюция",
          "Поддержка коллег",
          "Создание доверия"
        ],
        
        "challenges": [
          "Трудно говорить 'нет'",
          "Можете быть слишком доверчивым",
          "Избегаете нужных конфронтаций",
          "Можете жертвовать своими интересами"
        ],
        
        "in_work": {
          "ideal_roles": [
            "Командные проекты",
            "Роли требующие эмпатии",
            "Клиентская работа",
            "Коллаборация",
            "Поддерживающие роли"
          ],
          "avoid": [
            "Жесткие переговоры",
            "Highly competitive sales",
            "Роли требующие конфронтации"
          ]
        },
        
        "career_fit": [
          {
            "title": "UX Researcher",
            "match": 90,
            "why": "Эмпатия к пользователям критична"
          },
          {
            "title": "Product Manager",
            "match": 85,
            "why": "Работа с разными командами"
          },
          {
            "title": "HR / People Ops",
            "match": 88,
            "why": "Забота о людях"
          }
        ],
        
        "combines_with": {
          "low_extraversion": """
          Интроверт + высокая A = "тихий помощник"
          Вы заботитесь о людях, но в небольших дозах.
          Идеально для 1-на-1 работы, консультирования, менторства.
          """
        },
        
        "development": [
          "Учитесь говорить 'нет' когда нужно",
          "Практикуйте assertiveness (напористость)",
          "Не бойтесь конструктивных конфликтов"
        ]
      },
      
      {
        "trait": "NEUROTICISM",
        "score": 31.25,
        "percentile": 30,
        "level": "low",
        
        "description": {
          "short": "Низкий нейротизм = Высокая эмоциональная стабильность",
          "detailed": """
          Вы более эмоционально стабильны чем 70% людей (30 процентиль по N).
          
          Это означает:
          - Спокойны в стрессовых ситуациях
          - Редко тревожитесь
          - Эмоционально устойчивы
          - Быстро восстанавливаетесь после неудач
          - Не склонны к драматизации
          
          Низкий N - это ХОРОШО. Это показатель mental health и resilience.
          """
        },
        
        "strengths": [
          "Стресс-устойчивость",
          "Эмоциональная стабильность",
          "Спокойствие под давлением",
          "Рациональность в кризисах",
          "Быстрое восстановление"
        ],
        
        "challenges": [
          "Можете недооценивать риски",
          "Иногда может казаться бесчувственным",
          "Может не хватать 'fire in the belly'"
        ],
        
        "in_work": {
          "ideal_roles": [
            "High-pressure среды",
            "Кризис-менеджмент",
            "Роли с дедлайнами",
            "Непредсказуемые ситуации",
            "Лидерство в стрессе"
          ],
          "strength_in": [
            "Сохранение холодной головы",
            "Принятие решений под давлением",
            "Поддержка команды в кризисе"
          ]
        },
        
        "career_fit": [
          {
            "title": "Surgeon / Doctor",
            "match": 95,
            "why": "Спокойствие в критических ситуациях"
          },
          {
            "title": "Pilot",
            "match": 93,
            "why": "Эмоциональная стабильность критична"
          },
          {
            "title": "Crisis Manager",
            "match": 90,
            "why": "Хладнокровие в хаосе"
          },
          {
            "title": "Entrepreneur",
            "match": 85,
            "why": "Устойчивость к неопределенности"
          }
        ],
        
        "note": """
        Ваш низкий Neuroticism - огромное преимущество.
        Комбинация с высокой O и C означает:
        - Креативный ум (O)
        - Дисциплина (C)
        - Стабильность (низкий N)
        
        = Идеальный профиль для Product Manager, Entrepreneur, Leader
        """
      }
    ],
    
    "personality_type_classification": {
      "mbti_correlation": {
        "note": "Big Five научнее чем MBTI, но для интереса:",
        "likely_type": "INTJ или INFJ",
        "reasoning": """
        - Низкая E = Introvert (I)
        - Высокая O = Intuitive (N)
        - Умеренная C + низкий N = Judging (J)
        - Высокая A склоняет к F, но высокая O к T = 50/50
        
        Вероятно INTJ (Architect) или INFJ (Advocate)
        """
      },
      
      "enneagram_correlation": {
        "likely_type": "Type 5 (Investigator) или Type 4 (Individualist)",
        "reasoning": """
        Высокая O + низкая E + эмоциональная стабильность
        = классический профиль Type 5 (думающий интроверт)
        """
      }
    },
    
    "career_recommendations": {
      "best_overall_fits": [
        {
          "title": "Product Manager (Tech)",
          "overall_match": 93,
          "ocean_alignment": {
            "O": "✓ Высокая - инновации и креатив",
            "C": "✓ Средне-высокая - организация без перфекционизма",
            "E": "✓ Низкая - независимая работа, маленькие встречи",
            "A": "✓ Высокая - работа с командами",
            "N": "✓ Низкий - стресс-устойчивость в дедлайнах"
          }
        },
        {
          "title": "UX Designer / Researcher",
          "overall_match": 91,
          "ocean_alignment": {
            "O": "✓ Креативность и эстетика",
            "C": "✓ Структура в дизайн-процессе",
            "E": "✓ Интровертная работа",
            "A": "✓ Эмпатия к пользователям",
            "N": "✓ Стабильность"
          }
        },
        {
          "title": "Software Developer / Engineer",
          "overall_match": 88,
          "ocean_alignment": {
            "O": "✓ Креативное решение проблем",
            "C": "✓ Структурированный код",
            "E": "✓ Независимая работа",
            "A": "~ Командная работа (но не критична)",
            "N": "✓ Спокойствие в багах и дедлайнах"
          }
        },
        {
          "title": "Data Scientist",
          "overall_match": 85,
          "ocean_alignment": {
            "O": "✓ Креативные подходы к данным",
            "C": "✓ Методичный анализ",
            "E": "✓ Одиночная работа",
            "A": "~ Коллаборация с бизнесом",
            "N": "✓ Стабильность"
          }
        }
      ],
      
      "avoid_careers": [
        {
          "title": "Sales (cold calling)",
          "why": "Низкая E - постоянное общение утомит"
        },
        {
          "title": "Event Manager",
          "why": "Низкая E - много людей, хаос"
        },
        {
          "title": "Assembly Line Worker",
          "why": "Высокая O - умрете от рутины"
        }
      ]
    },
    
    "comparison_with_other_tests": {
      "holland_code": "RIA",
      "disc_type": "DC",
      "values_top_3": ["Achievement", "Independence", "Knowledge"],
      
      "consistency_analysis": """
      Все тесты показывают согласованный профиль:
      
      Holland RIA:
      - R (Realistic) + высокая C = структурированность
      - I (Investigative) + высокая O = любопытство и анализ
      - A (Artistic) + высокая O = креативность
      
      DiSC DC:
      - D (Dominance) + низкий N = стресс-устойчивость
      - C (Conscientiousness) = прямое совпадение с Big Five C
      
      Values:
      - Achievement + умеренная C = достигаете целей
      - Independence + низкая E = предпочитаете автономию
      - Knowledge + высокая O = постоянное обучение
      
      ВЫВОД: Все 4 теста указывают на Product Manager, UX Designer,
      или Software Engineer как идеальные карьеры.
      """
    }
  }
}
```

---

## 🔬 Научная Валидность

```python
SCIENTIFIC_BACKGROUND = {
  "reliability": {
    "test_retest": 0.75,  # Корреляция при повторном тестировании
    "internal_consistency": 0.82,  # Cronbach's alpha
    "note": "Высокая надежность - результаты стабильны во времени"
  },
  
  "validity": {
    "predictive": """
    Big Five предсказывает:
    - Job performance (r=0.20-0.30 для C)
    - Leadership effectiveness (r=0.30 для E)
    - Creativity (r=0.30 для O)
    - Team cohesion (r=0.25 для A)
    - Mental health (r=-0.40 для N)
    """,
    "cross_cultural": "Воспроизводится в 50+ странах",
    "biological": "Имеет генетическую основу (h²=0.40-0.60)"
  },
  
  "research_base": {
    "studies": "10,000+ научных публикаций",
    "samples": "Миллионы участников по всему миру",
    "timeline": "60+ лет исследований"
  }
}
```

---

**Big Five (OCEAN) готов!** 🧠

Хотите продолжить с остальными тестами (6-10)?

Или сделать паузу и:
- Создать AI промпты для комбинированного анализа всех 5 тестов?
- Визуализации для сводного отчета?
- API endpoints для всех тестов?

Что предпочитаете?

