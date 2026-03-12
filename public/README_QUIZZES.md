## 🧪 Dimpom Quizzes API — подробное руководство

Base URL: `https://dimplom-j8u3.onrender.com/api/v1/quizzes/`

Этот README описывает только блок `quizzes`: какие есть эндпоинты, как правильно работать с сессиями и какие `slug` тестов использовать.

---

### 1. Какие вообще есть тесты и slug

Тесты живут в модели `Test` и отдаются через:

- **Список тестов**  
  `GET /api/v1/quizzes/tests/`

- **Категории с тестами**  
  `GET /api/v1/quizzes/categories/`

Оба ответа содержат поле `slug` — его и нужно использовать в остальных эндпоинтах.

Примеры типов тестов (category.test_type):

- `holland` — Holland Code (RIASEC)
- `disc` — DiSC Assessment
- `big_five` — Big Five (OCEAN)
- `values` — Career Values
- `skills` — Skills Self-Assessment
- `eq` — Emotional Intelligence (EQ)
- `vark` — Learning Style (VARK)
- `motivation` — Work Motivation
- `strengths` — Strengths Finder Lite
- `photo` — Photo Career Quiz
- `career_aptitude` — комбинированный Career Aptitude Test (из JSON `career-aptitude-test.json`)

**Важно:** конкретные slug (например `holland-riasec`, `disc-classic`, `career-aptitude-test`) нужно брать не “из головы”, а из:

- `GET /api/v1/quizzes/tests/` — поле `slug`
- или `GET /api/v1/quizzes/categories/` — поле `tests[i].slug`

Фронтенд никогда не должен хардкодить slug — только подставлять то, что вернул бекенд.

Пример ответа `GET /quizzes/tests/` (упрощённо):

```json
[
  {
    "id": 1,
    "title": "Holland Code (RIASEC)",
    "slug": "holland-riasec",
    "category_type": "holland",
    "tier": "free",
    "total_questions": 48
  },
  {
    "id": 2,
    "title": "DiSC Assessment",
    "slug": "disc-classic",
    "category_type": "disc",
    "tier": "free",
    "total_questions": 24
  }
]
```

---

### 2. Основные эндпоинты `/quizzes/`

#### 2.1. Справочники

- `GET /tests/` — список активных тестов
  - query-параметры:
    - `type=holland|disc|big_five|values|skills|eq|vark|motivation|strengths|photo|career_aptitude`
    - `tier=free|basic|pro`
    - `mandatory=true|false`
    - `free=true|false`

- `GET /tests/<test_slug>/` — детали конкретного теста с вопросами
  - возвращает:
    - `id, title, slug, description`
    - `category_type` (test_type), `tier`, `is_free`, `total_questions`
    - `questions`: массив вопросов

- `GET /categories/` — категории тестов с вложенными тестами

- `GET /test-types/` — “шпаргалка” по типам тестов: какое поле отправлять (`scale_value`, `answer_id`, `answer_code`)

#### 2.2. Работа с сессиями

1. **Начать сессию**  
   `POST /sessions/start/`

   ```json
   {
     "test_slug": "holland-riasec"
   }
   ```

   Ответ `201`:

   ```json
   {
     "id": 42,
     "test_title": "Holland Code (RIASEC)",
     "test_slug": "holland-riasec",
     "test_type": "holland",
     "is_completed": false,
     "current_question": 0,
     "progress": 0,
     "created_at": "2026-03-02T10:00:00Z",
     "completed_at": null,
     "result": null
   }
   ```

2. **Отправить ответы (bulk — рекомендуется)**  
   `POST /sessions/bulk-answer/`

   - для шкальных тестов (`question_type = "scale"`):

   ```json
   {
     "session_id": 42,
     "answers": [
       { "question_id": 1, "scale_value": 4 },
       { "question_id": 2, "scale_value": 2 },
       { "question_id": 3, "scale_value": 5 }
     ]
   }
   ```

   - для VARK (`question_type = "single"` — по `answer_id`):

   ```json
   {
     "session_id": 42,
     "answers": [
       { "question_id": 207, "answer_id": 830 }
     ]
   }
   ```

   - для Photo Quiz (`question_type = "image_pair"` — по `answer_code`):

   ```json
   {
     "session_id": 42,
     "answers": [
       { "question_id": 49, "answer_code": "photo_01_a" }
     ]
   }
   ```

3. **Завершить тест и посчитать результат**  
   `POST /sessions/finish/`

   ```json
   {
     "session_id": 42
   }
   ```

   Ответ `200` (`TestResultSerializer`):

   ```json
   {
     "id": 1,
     "test_title": "Holland Code (RIASEC)",
     "test_slug": "holland-riasec",
     "test_type": "holland",
     "scores": { "R": 18, "I": 22, "A": 15, "S": 12, "E": 20, "C": 10 },
     "primary_type": "RIA — Реалист-Исследователь-Художник",
     "secondary_type": "SE — Социальный-Предприимчивый",
     "summary": "Краткое текстовое описание профиля",
     "detailed_report": "Подробный отчёт",
     "created_at": "2026-03-02T10:00:00Z"
   }
   ```

4. **Альтернатива: по одному ответу**  
   `POST /sessions/answer/`

   Тело запроса совпадает с `BulkSubmitSerializer.answers[i]`, но без массива:

   - шкальные (Holland/DiSC/Big Five/Values/Skills/EQ/Motivation/Strengths)

     ```json
     {
       "session_id": 42,
       "question_id": 1,
       "scale_value": 4
     }
     ```

   - VARK:

     ```json
     {
       "session_id": 42,
       "question_id": 207,
       "answer_id": 830
     }
     ```

   - Photo Quiz:

     ```json
     {
       "session_id": 42,
       "question_id": 49,
       "answer_code": "photo_01_a"
     }
     ```

---

### 3. Как фронтенду правильно использовать `slug`

1. **Получить список тестов**

   ```http
   GET /api/v1/quizzes/tests/?free=true
   ```

   - показать список пользователю (название, описание, иконка, `category_type`)
   - для каждого элемента сохранить:
     - `slug`
     - `category_type` (чтобы знать, какие поля отправлять при ответах)

2. **Начать тест**

   - при нажатии на карточку теста:

   ```http
   POST /api/v1/quizzes/sessions/start/
   {
     "test_slug": "<slug из /tests/>"
   }
   ```

3. **Подгрузить вопросы**

   ```http
   GET /api/v1/quizzes/tests/<slug>/
   ```

   - по каждому вопросу смотреть:
     - `question_type` — `"scale" | "image_pair" | "single" | "multiple" | "pair" | "ranking"`
     - `answers[i].id` и `answers[i].code`
     - `scale_info` — подсказки для фронта

4. **Отправить ответы и завершить**

   - использовать `session_id` из `/sessions/start/`
   - поле ответа зависит от `question_type` и `test_types`:
     - для всех `question_type="scale"` → `scale_value` (1–5)
     - для `question_type="single"|"multiple"|"pair"` → `answer_id`
     - для `question_type="image_pair"` → `answer_code`

---

### 4. Быстрые примеры по популярным тестам

#### 4.1. Holland (RIASEC)

1) Найти slug Holland:

```http
GET /api/v1/quizzes/tests/?type=holland
// → берём tests[0].slug, например "holland-riasec"
```

2) Начать сессию:

```http
POST /api/v1/quizzes/sessions/start/
{
  "test_slug": "holland-riasec"
}
```

3) Получить вопросы:

```http
GET /api/v1/quizzes/tests/holland-riasec/
```

4) Bulk-ответ:

```http
POST /api/v1/quizzes/sessions/bulk-answer/
{
  "session_id": 42,
  "answers": [
    { "question_id": 1, "scale_value": 4 },
    { "question_id": 2, "scale_value": 2 }
  ]
}
```

5) Завершить:

```http
POST /api/v1/quizzes/sessions/finish/
{
  "session_id": 42
}
```

#### 4.2. VARK

- `type = vark`, `question_type = "single"`, поле — `answer_id`.

#### 4.3. Photo Career Quiz

- `type = photo`, `question_type = "image_pair"`, поле — `answer_code` (например `photo_01_a`).

#### 4.4. Career Aptitude Test

- в категориях будет тест с типом `career_aptitude`, slug брать из `/tests/` (например `"career-aptitude-test"`).
- логику ответов — как в `test-types` и документации к этому конкретному тесту.

---

### 5. Резюме

- **Slug теста никогда не хардкодим** — всегда берём из `/tests/` или `/categories/`.
- Для ответа смотрим:
  - `test_type` (`holland`, `disc`, `vark`, `photo`, `career_aptitude`, …)
  - `question_type` (`scale`, `single`, `image_pair`, …)
  - `GET /test-types/` — какое поле (`scale_value`, `answer_id`, `answer_code`) ждать от фронта.
- Базовый паттерн всегда один: `tests → start session → bulk-answer → finish → TestResult`.

