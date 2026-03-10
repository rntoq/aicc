# Dimpom API — Все эндпоинты

**Base URL:** `https://dimplom-j8u3.onrender.com`  
**Swagger UI:** `/api/docs/`  
**ReDoc:** `/api/redoc/`

---

## Аутентификация

Все защищённые эндпоинты требуют заголовок:
```
Authorization: Bearer <access_token>
```

---

## 🔐 AUTH — `/api/v1/auth/`

### Регистрация
```
POST /api/v1/auth/register/
```
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "first_name": "Иван",
  "last_name": "Иванов",
  "date_of_birth": "2000-01-15",   // необязательно
  "age": 24,                        // необязательно
  "phone": "+77001234567",          // необязательно
  "city": "Алматы",                 // необязательно
  "role": "student"                 // необязательно: student | parent | institution
}
```
**Ответ:** `201` — `{ access, refresh, user: {...} }`

---

### Вход
```
POST /api/v1/auth/login/
```
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
**Ответ:** `200` — `{ access, refresh, user: {...} }`

---

### Обновить токен
```
POST /api/v1/auth/refresh/
```
```json
{
  "refresh": "<refresh_token>"
}
```
**Ответ:** `200` — `{ access }`

---

### Выход
```
POST /api/v1/auth/logout/
🔒 Bearer token
```
```json
{
  "refresh": "<refresh_token>"
}
```
**Ответ:** `200` — `{ detail: "Вы успешно вышли из системы." }`

---

### Мой профиль — получить
```
GET /api/v1/auth/me/
🔒 Bearer token
```
**Тело не нужно**  
**Ответ:** `200` — объект пользователя

---

### Мой профиль — обновить
```
PUT /api/v1/auth/me/
PATCH /api/v1/auth/me/
🔒 Bearer token
```
```json
{
  "first_name": "Иван",
  "last_name": "Иванов",
  "phone": "+77001234567",
  "city": "Астана",
  "date_of_birth": "2000-01-15",
  "age": 24
}
```
**Ответ:** `200` — обновлённый объект пользователя

---

### Сменить пароль
```
POST /api/v1/auth/change-password/
🔒 Bearer token
```
```json
{
  "old_password": "OldPass123",
  "new_password": "NewPass456",
  "new_password_confirm": "NewPass456"
}
```
**Ответ:** `200` — `{ detail: "Пароль успешно изменён." }`

---

## 🧪 QUIZZES — `/api/v1/quizzes/`

### Список тестов
```
GET /api/v1/quizzes/tests/
```
| Параметр    | Тип    | Описание |
|-------------|--------|----------|
| `type`      | string | Тип теста: `holland`, `disc`, `big_five`, `values`, `skills`, `eq`, `vark`, `motivation`, `strengths`, `photo` |
| `tier`      | string | `free`, `basic`, `pro` |
| `mandatory` | bool   | `true` / `false` |
| `free`      | bool   | `true` / `false` |

**Ответ:** `200` — массив тестов

---

### Детали теста (с вопросами)
```
GET /api/v1/quizzes/tests/<test_slug>/
```
**Ответ:** `200` — тест со всеми вопросами и вариантами ответов

---

### Категории тестов
```
GET /api/v1/quizzes/categories/
```
**Ответ:** `200` — список категорий с вложенными тестами

---

### Справочник типов тестов
```
GET /api/v1/quizzes/test-types/
```
**Ответ:** описание каждого типа (какое поле передавать, диапазон шкал, пример)  
**Используйте этот эндпоинт чтобы понять какие данные нужны при ответе!**

---

### Начать сессию
```
POST /api/v1/quizzes/sessions/start/
```
```json
{
  "test_slug": "holland-riasec"
}
```
**Ответ:** `201` — объект сессии с `id` (нужен для дальнейших запросов)

---

### Ответить на один вопрос
```
POST /api/v1/quizzes/sessions/answer/
```
Передайте `session_id` + `question_id` + **одно из** полей:

| Поле          | Когда использовать |
|---------------|--------------------|
| `scale_value` | Шкальные тесты: Holland, DiSC, Big Five, Values, Skills, EQ, Motivation, Strengths (значение 1–5) |
| `answer_id`   | VARK, pair, multiple — передать `Answer.id` из вопроса |
| `answer_code` | Photo Quiz (image_pair) — передать `Answer.code` (напр. `photo_01_a`) |

```json
// Пример для Holland / DiSC / Big Five / и т.д. (scale):
{
  "session_id": 42,
  "question_id": 1,
  "scale_value": 4
}

// Пример для VARK (single):
{
  "session_id": 42,
  "question_id": 207,
  "answer_id": 830
}

// Пример для Photo Quiz (image_pair):
{
  "session_id": 42,
  "question_id": 49,
  "answer_code": "photo_01_a"
}
```
**Ответ:** `200` — `{ status, answered, total, progress }`

---

### Отправить все ответы сразу (рекомендуется)
```
POST /api/v1/quizzes/sessions/bulk-answer/
```
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
**Ответ:** `200` — `{ status, saved, errors, total_questions, answered }`

---

### Завершить тест и получить результат
```
POST /api/v1/quizzes/sessions/finish/
```
```json
{
  "session_id": 42
}
```
**Ответ:** `200`
```json
{
  "id": 1,
  "test_title": "Holland Code (RIASEC)",
  "test_type": "holland",
  "scores": { "R": 18, "I": 22, "A": 15, "S": 12, "E": 20, "C": 10 },
  "primary_type": "RIA — Реалист-Исследователь-Художник",
  "secondary_type": "...",
  "summary": "...",
  "detailed_report": "...",
  "created_at": "2026-03-02T10:00:00Z"
}
```

---

### Мои сессии
```
GET /api/v1/quizzes/sessions/
🔒 Bearer token
```
| Параметр    | Тип    | Описание |
|-------------|--------|----------|
| `completed` | bool   | `true` — только завершённые |
| `type`      | string | Тип теста |

---

### Детали сессии по ID
```
GET /api/v1/quizzes/sessions/<session_id>/
```

---

### Мои результаты
```
GET /api/v1/quizzes/my-results/
🔒 Bearer token
```
**Ответ:** `{ total_tests_available, total_tests_completed, mandatory_completed, mandatory_total, can_get_recommendations, results: [...] }`

---

### Быстрый тест из JSON (без БД)
```
GET /api/v1/quizzes/quick/<test_type>/
POST /api/v1/quizzes/quick/<test_type>/submit/
GET /api/v1/quizzes/quick/<test_type>/result/
```
`test_type` — `holland`, `disc`, `big_five` и т.д.

---

## 💼 CAREERS — `/api/v1/careers/`

### Список профессий / карьер
```
GET /api/v1/careers/
```
| Параметр     | Тип    | Описание |
|--------------|--------|----------|
| `category`   | string | slug категории |
| `demand`     | string | `high`, `medium`, `low` |
| `education`  | string | уровень образования |
| `search`     | string | поиск по названию |
| `holland`    | string | фильтр по Холланд-коду (напр. `R`) |
| `limit`      | int    | макс. 200, по умолч. 50 |

---

### Детали профессии
```
GET /api/v1/careers/<career_slug>/
```

---

### Категории карьер
```
GET /api/v1/careers/categories/
```

---

### Мои рекомендации
```
GET /api/v1/careers/recommendations/
🔒 Bearer token
```

---

### Сгенерировать рекомендации
```
POST /api/v1/careers/recommendations/generate/
🔒 Bearer token
```
**Тело не нужно**  
Бекенд сам смотрит результаты тестов и строит рекомендации.

---

### Список профессий (постраничный)
```
GET /api/v1/careers/professions/
```
| Параметр   | Тип    | Описание |
|------------|--------|----------|
| `industry` | int/str | ID или код индустрии |
| `search`   | string | поиск |
| `demand`   | string | `high`, `medium`, `low` |
| `limit`    | int    | до 100, по умолч. 20 |
| `page`     | int    | номер страницы |

**Ответ:** `{ count, total_pages, current_page, limit, results: [...] }`

---

### Детали профессии по ID
```
GET /api/v1/careers/professions/<id>/
```

---

### Список индустрий
```
GET /api/v1/careers/industries/
```

---

### Детали индустрии
```
GET /api/v1/careers/industries/<id>/
```

---

## 🏫 INSTITUTIONS — `/api/v1/institutions/`

### Список учреждений
```
GET /api/v1/institutions/
```
| Параметр    | Тип    | Описание |
|-------------|--------|----------|
| `city`      | string | фильтр по городу |
| `type`      | string | тип: `university`, `college`, ... |
| `grants`    | bool   | наличие грантов: `true`/`false` |
| `dormitory` | bool   | наличие общежития |
| `search`    | string | поиск по названию |

---

### Детали учреждения
```
GET /api/v1/institutions/<institution_slug>/
```

---

### Программы учреждения
```
GET /api/v1/institutions/<institution_slug>/programs/
```
| Параметр | Тип    | Описание |
|----------|--------|----------|
| `level`  | string | уровень: `bachelor`, `master`, ... |
| `grant`  | bool   | `true`/`false` |

---

### Детали программы
```
GET /api/v1/institutions/programs/<program_slug>/
```

---

## 💳 PAYMENTS — `/api/v1/payments/`

### Тарифные планы
```
GET /api/v1/payments/plans/
```

---

### Моя подписка
```
GET /api/v1/payments/subscription/
🔒 Bearer token
```

---

### Оформить подписку
```
POST /api/v1/payments/subscribe/
🔒 Bearer token
```
```json
{
  "plan_type": "basic",   // basic | pro
  "period": "monthly"     // monthly | yearly
}
```
**Ответ:** `201` — `{ subscription: {...}, payment: {...} }`

---

### Отменить подписку
```
POST /api/v1/payments/cancel/
🔒 Bearer token
```
**Тело не нужно**  
**Ответ:** `200` — `{ detail: "Подписка отменена." }`

---

### История платежей
```
GET /api/v1/payments/history/
🔒 Bearer token
```

---

## 📊 ANALYSIS — `/api/v1/analysis/`

### Карьерный профиль
```
GET /api/v1/analysis/profile/
🔒 Bearer token
```
**Ответ:** Holland-код, сильные стороны, интересы, ценности

---

### Обновить профиль по результатам тестов
```
POST /api/v1/analysis/profile/refresh/
🔒 Bearer token
```
**Тело не нужно**  
**Ответ:** обновлённый профиль

---

### Список AI-отчётов
```
GET /api/v1/analysis/reports/
🔒 Bearer token
```

---

### Детали отчёта
```
GET /api/v1/analysis/reports/<report_id>/
🔒 Bearer token
```

---

### Сгенерировать AI-анализ (Gemini)
```
POST /api/v1/analysis/ai-report/
🔒 Bearer token
```
**Тело не нужно** — бекенд сам читает все результаты тестов  

**Ответ:** `201`
```json
{
  "report_id": 5,
  "created_at": "2026-03-02T12:00:00Z",
  "overall_summary": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "test_insights": ["..."],
  "career_suggestions": [
    { "name": "Data Scientist", "fit_score": 92, "reason": "..." }
  ],
  "university_suggestions": [
    { "name": "КазНУ", "reason": "..." }
  ],
  "development_plan": "..."
}
```

---

### Скачать PDF отчёта
```
GET /api/v1/analysis/ai-report/<report_id>/download/
🔒 Bearer token
```
**Ответ:** файл `application/pdf`

---

### Дашборд пользователя
```
GET /api/v1/analysis/dashboard/
🔒 Bearer token
```
**Ответ:**
```json
{
  "user": { "id", "full_name", "email", "role" },
  "subscription": { "plan_type", "plan_name", "end_date", "is_active" },
  "plan_limits": { "can_see_detailed_results", ... },
  "stats": {
    "tests_completed": 5,
    "tests_available": 10,
    "mandatory_completed": 3,
    "mandatory_total": 3,
    "can_get_recommendations": true,
    "holland_primary_code": "RIA",
    "disc_primary_style": "D"
  },
  "recent_results": [...],
  "top_recommendations": [...]
}
```

---

## 🔑 Порядок работы (флоу)

```
1. POST /auth/register/  → получить access + refresh
2. POST /auth/login/     → или войти в существующий аккаунт
3. GET  /quizzes/tests/  → список тестов (фильтр: mandatory=true)
4. GET  /quizzes/test-types/ → понять формат ответов для каждого типа
5. GET  /quizzes/tests/<slug>/ → загрузить вопросы теста
6. POST /quizzes/sessions/start/ { test_slug } → создать сессию
7. POST /quizzes/sessions/bulk-answer/ → отправить все ответы
8. POST /quizzes/sessions/finish/ { session_id } → получить результат
9. Повторить 5-8 для других тестов
10. POST /careers/recommendations/generate/ → получить рекомендации профессий
11. POST /analysis/profile/refresh/ → обновить карьерный профиль
12. POST /analysis/ai-report/ → AI-анализ от Gemini
13. GET  /analysis/dashboard/ → полный дашборд
```

---

## Типы тестов и поля ответа

| Тест | `test_type` | Поле ответа | Значение |
|------|-------------|-------------|---------|
| Holland RIASEC | `holland` | `scale_value` | 1–5 |
| Photo Career Quiz | `photo` | `answer_code` | `photo_01_a` ... `photo_30_b` |
| DiSC | `disc` | `scale_value` | 1–5 |
| Career Values | `values` | `scale_value` | 1–5 |
| Big Five (OCEAN) | `big_five` | `scale_value` | 1–5 |
| Skills Assessment | `skills` | `scale_value` | 1–5 |
| Emotional Intelligence | `eq` | `scale_value` | 1–5 |
| VARK | `vark` | `answer_id` | PK ответа |
| Work Motivation | `motivation` | `scale_value` | 1–5 |
| Strengths Finder | `strengths` | `scale_value` | 1–5 |
