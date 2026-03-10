# Holland Code (RIASEC) Test - Technical Documentation

## 1. Test Overview

**Test Name:** Holland Code (RIASEC) Test  
**Test Code:** `holland-code-riasec`  
**Test ID:** `test_001`  
**Purpose:** Assessment of career interests and vocational preferences  
**Measures:** Six basic interest areas (RIASEC model)  
**Questions:** 48 activity statements  
**Duration:** 5-10 minutes  
**Response Type:** 5-point Likert scale (1=Dislike to 5=Enjoy)  
**Weight in Analysis:** 30% (highest weight - foundational assessment)

---

## 2. Test Description

The Holland Code (RIASEC) Test is an interactive version of the IIP RIASEC Markers, a scientifically validated career assessment tool based on John L. Holland's theory of personality and vocational choice.

**Theory Background:**

The Holland Occupational Themes theory, developed by John L. Holland starting in the 1950s, focuses on career and vocational choice. It groups people based on their suitability for six different categories of occupations. The theory has come to dominate the field of career counseling and is incorporated into most popular career assessments.

**RIASEC Markers:**

The RIASEC Markers from the Interest Item Pool were developed by Liao, Armstrong and Rounds (2008) for use in psychological research as a public domain alternative to commercially marketed assessments.

**What it measures:**

- Work activities you would enjoy
- Environments where you'd thrive
- Career fields aligned with your interests
- Your "career DNA" through six personality types

---

## 3. Test Format

**Structure:**
- 48 activity statements
- 8 statements per RIASEC dimension
- Randomized presentation order
- 5-point enjoyment scale for each activity

**Rating Scale:**
```
1 = Dislike
2 = Slightly dislike
3 = Neither like nor dislike
4 = Slightly enjoy
5 = Enjoy
```

**RIASEC Dimensions:**
- R (Realistic) - 8 questions
- I (Investigative) - 8 questions
- A (Artistic) - 8 questions
- S (Social) - 8 questions
- E (Enterprising) - 8 questions
- C (Conventional) - 8 questions

**Question Distribution:**
- Each dimension equally weighted
- All questions weighted as 1
- Total possible points per dimension: 40 (8 questions × 5 max)
- Total test points distributed: 240 (48 questions × 5 max)

---

## 4. How the Test Works

**Step-by-Step Flow:**

1. **Introduction Screen**
   - Display theory background
   - Show test instructions
   - Explain 5-point scale
   - Start button

2. **Question Loop (48 iterations)**
   - Display activity statement
   - Show 5-point scale with labels
   - User selects rating (1-5)
   - Answer recorded
   - Progress indicator updates
   - Next question loads

3. **Completion**
   - Calculate raw scores for each dimension
   - Normalize to 0-32 scale
   - Generate Holland Code (top 3 letters)
   - Show results page

**Navigation:**
- Can go back to previous questions
- Can change answers before submission
- Progress bar shows completion
- Optional: Save and resume later

---

## 5. Question Structure

```json
{
  "id": "holland_r_01",
  "question_number": 1,
  "text": {
    "ru": "Работать с инструментами и техникой",
    "kk": "Құралдармен және техникамен жұмысістеу",
    "en": "Work with tools and machinery"
  },
  "category": "R",
  "weight": 1,
  "scale": {
    "min": 1,
    "max": 5,
    "labels": {
      "1": {
        "ru": "Не нравится",
        "kk": "Ұнамайды",
        "en": "Dislike"
      },
      "2": {
        "ru": "Немного не нравится",
        "kk": "Біраз ұнамайды",
        "en": "Slightly dislike"
      },
      "3": {
        "ru": "Нейтрально",
        "kk": "Бейтарап",
        "en": "Neither like nor dislike"
      },
      "4": {
        "ru": "Немного нравится",
        "kk": "Біраз ұнайды",
        "en": "Slightly enjoy"
      },
      "5": {
        "ru": "Нравится",
        "kk": "Ұнайды",
        "en": "Enjoy"
      }
    }
  }
}
```

**Field Definitions:**
- `id`: Unique question identifier (e.g., "holland_r_01")
- `question_number`: Display order
- `text`: Activity statement in 3 languages
- `category`: RIASEC dimension (R, I, A, S, E, C)
- `weight`: Point value (always 1)
- `scale`: Rating scale configuration

---

## 6. Questions

### R - Realistic (8 questions)

1. **holland_r_01**: Работать с инструментами и техникой / Work with tools and machinery
2. **holland_r_02**: Ремонтировать устройства или оборудование / Repair devices or equipment
3. **holland_r_03**: Собирать или создавать что-то своими руками / Build or create things with your hands
4. **holland_r_04**: Работать на производстве или заводе / Work in a factory or production
5. **holland_r_05**: Работать с машинами или механизмами / Work with machines or mechanisms
6. **holland_r_06**: Работать на открытом воздухе / Work outdoors
7. **holland_r_07**: Управлять техникой или оборудованием / Operate equipment or machinery
8. **holland_r_08**: Делать физическую работу / Do physical work

### I - Investigative (8 questions)

1. **holland_i_01**: Анализировать данные и искать закономерности / Analyze data and find patterns
2. **holland_i_02**: Изучать, как устроен мир / Study how the world works
3. **holland_i_03**: Решать сложные задачи / Solve complex problems
4. **holland_i_04**: Проводить эксперименты / Conduct experiments
5. **holland_i_05**: Работать в лаборатории / Work in a laboratory
6. **holland_i_06**: Изучать науку или технологии / Study science or technology
7. **holland_i_07**: Искать причины и объяснения / Find causes and explanations
8. **holland_i_08**: Работать с цифрами и логикой / Work with numbers and logic

### A - Artistic (8 questions)

1. **holland_a_01**: Рисовать или создавать дизайн / Draw or create designs
2. **holland_a_02**: Выражать себя через творчество / Express yourself creatively
3. **holland_a_03**: Придумывать новые идеи / Come up with new ideas
4. **holland_a_04**: Писать тексты, истории или сценарии / Write texts, stories, or scripts
5. **holland_a_05**: Заниматься музыкой или пением / Engage in music or singing
6. **holland_a_06**: Создавать визуальный контент (видео, фото) / Create visual content (video, photo)
7. **holland_a_07**: Работать без строгих правил / Work without strict rules
8. **holland_a_08**: Создавать что-то уникальное / Create something unique

### S - Social (8 questions)

1. **holland_s_01**: Помогать людям решать проблемы / Help people solve problems
2. **holland_s_02**: Обучать других / Teach others
3. **holland_s_03**: Работать с людьми каждый день / Work with people daily
4. **holland_s_04**: Поддерживать и мотивировать людей / Support and motivate people
5. **holland_s_05**: Объяснять сложные вещи простым языком / Explain complex things simply
6. **holland_s_06**: Работать в команде / Work in a team
7. **holland_s_07**: Заботиться о людях / Care for people
8. **holland_s_08**: Консультировать и давать советы / Advise and consult people

### E - Enterprising (8 questions)

1. **holland_e_01**: Руководить людьми / Lead people
2. **holland_e_02**: Убеждать и вести переговоры / Persuade and negotiate
3. **holland_e_03**: Запускать собственные проекты или бизнес / Start your own projects or business
4. **holland_e_04**: Достигать целей и результатов / Achieve goals and results
5. **holland_e_05**: Принимать решения / Make decisions
6. **holland_e_06**: Организовывать людей и процессы / Organize people and processes
7. **holland_e_07**: Работать с продажами или бизнесом / Work in sales or business
8. **holland_e_08**: Брать на себя ответственность / Take responsibility

### C - Conventional (8 questions)

1. **holland_c_01**: Работать с цифрами и таблицами / Work with numbers and tables
2. **holland_c_02**: Следовать четким инструкциям / Follow clear instructions
3. **holland_c_03**: Поддерживать порядок в документах / Maintain organized documents
4. **holland_c_04**: Работать с отчетами и данными / Work with reports and data
5. **holland_c_05**: Выполнять задачи по плану / Follow a plan
6. **holland_c_06**: Работать с базами данных / Work with databases
7. **holland_c_07**: Внимательно проверять информацию / Check information carefully
8. **holland_c_08**: Работать с документами и отчетностью / Work with documents and reports

---

## 7. Categories / Dimensions

### R - Realistic (Doers)

**Theme:** Hands-on, practical, mechanical work  
**Question Count:** 8  
**Characteristics:**
- Prefer working with tools, machines, objects
- Enjoy physical and outdoor work
- Like concrete, tangible results
- Value practical problem-solving
- Often skilled in mechanical or athletic areas

**Work Environments:**
- Workshops, factories, outdoors
- Construction sites
- Laboratories (applied science)
- Athletic facilities

**Sample Careers:**
- Engineer
- Mechanic
- Electrician
- Carpenter
- Pilot
- Farmer
- Athletic Trainer
- Surveyor

**Values:**
- Practicality
- Independence
- Physical activity
- Tangible results

---

### I - Investigative (Thinkers)

**Theme:** Analytical, scientific, intellectual work  
**Question Count:** 8  
**Characteristics:**
- Prefer thinking and analyzing
- Enjoy research and problem-solving
- Like working with ideas and data
- Value knowledge and learning
- Often skilled in math or science

**Work Environments:**
- Research labs
- Universities
- Medical facilities
- Technology companies

**Sample Careers:**
- Scientist
- Researcher
- Doctor
- Mathematician
- Computer Programmer
- Pharmacist
- Psychologist
- Analyst

**Values:**
- Knowledge
- Intellectual challenge
- Independence
- Achievement

---

### A - Artistic (Creators)

**Theme:** Creative, expressive, imaginative work  
**Question Count:** 8  
**Characteristics:**
- Prefer creative expression
- Enjoy arts, music, writing
- Like unstructured environments
- Value originality and aesthetics
- Often skilled in artistic areas

**Work Environments:**
- Studios
- Theaters
- Design firms
- Media companies

**Sample Careers:**
- Graphic Designer
- Writer
- Musician
- Actor
- Photographer
- Interior Designer
- Fashion Designer
- Video Editor

**Values:**
- Creativity
- Self-expression
- Beauty
- Freedom

---

### S - Social (Helpers)

**Theme:** People-oriented, helping, teaching work  
**Question Count:** 8  
**Characteristics:**
- Prefer working with people
- Enjoy helping and teaching
- Like collaborative environments
- Value relationships and service
- Often skilled in communication

**Work Environments:**
- Schools
- Hospitals
- Community centers
- Counseling offices

**Sample Careers:**
- Teacher
- Nurse
- Counselor
- Social Worker
- Therapist
- Coach
- Human Resources
- Librarian

**Values:**
- Service to others
- Relationships
- Teamwork
- Personal growth

---

### E - Enterprising (Persuaders)

**Theme:** Leadership, business, persuasive work  
**Question Count:** 8  
**Characteristics:**
- Prefer leading and influencing
- Enjoy business and entrepreneurship
- Like competitive environments
- Value achievement and power
- Often skilled in persuasion

**Work Environments:**
- Corporate offices
- Sales floors
- Courtrooms
- Executive suites

**Sample Careers:**
- Manager
- CEO
- Lawyer
- Sales Representative
- Real Estate Agent
- Marketing Manager
- Politician
- Entrepreneur

**Values:**
- Achievement
- Power
- Competition
- Leadership

---

### C - Conventional (Organizers)

**Theme:** Organized, detail-oriented, systematic work  
**Question Count:** 8  
**Characteristics:**
- Prefer structure and order
- Enjoy working with data and details
- Like clear procedures
- Value accuracy and efficiency
- Often skilled in organization

**Work Environments:**
- Offices
- Banks
- Accounting firms
- Administrative centers

**Sample Careers:**
- Accountant
- Administrative Assistant
- Banker
- Paralegal
- Office Manager
- Data Analyst
- Actuary
- Auditor

**Values:**
- Order
- Accuracy
- Efficiency
- Security

---

## 8. Scoring System

### Raw Score Calculation

Each answer contributes its rating value (1-5) to the respective category:

```python
def calculate_raw_scores(answers, questions):
    """
    Sum all ratings for each RIASEC category
    """
    scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}
    
    for answer in answers:
        question = get_question(answer['question_id'], questions)
        category = question['category']
        rating = answer['rating']  # 1-5
        
        scores[category] += rating
    
    return scores
```

**Raw Score Range:**
- Minimum per category: 8 (all questions rated 1)
- Maximum per category: 40 (all questions rated 5)
- Total points distributed: 48-240 (sum of all ratings)

**Example Raw Scores:**
```json
{
  "R": 25,  // 8 questions, average rating ~3.1
  "I": 35,  // 8 questions, average rating ~4.4
  "A": 20,  // 8 questions, average rating 2.5
  "S": 18,  // 8 questions, average rating 2.25
  "E": 30,  // 8 questions, average rating 3.75
  "C": 32   // 8 questions, average rating 4.0
}
```

### Normalization to 0-32 Scale

To match the original IIP RIASEC format, scores are normalized:

```python
def normalize_to_32_scale(raw_scores):
    """
    Convert raw scores (8-40) to 0-32 scale
    Formula: (raw_score - 8) / 32 * 32 = raw_score - 8
    """
    normalized = {}
    for category, raw_score in raw_scores.items():
        normalized[category] = raw_score - 8
    
    return normalized
```

**Normalized Range:** 0-32 for each category

**Example Normalized Scores:**
```json
{
  "R": 17,  // 25 - 8 = 17
  "I": 27,  // 35 - 8 = 27
  "A": 12,  // 20 - 8 = 12
  "S": 10,  // 18 - 8 = 10
  "E": 22,  // 30 - 8 = 22
  "C": 24   // 32 - 8 = 24
}
```

### Holland Code Generation

The Holland Code consists of the top 3 highest-scoring dimensions:

```python
def generate_holland_code(scores):
    """
    Generate 3-letter Holland Code from top 3 scores
    """
    sorted_scores = sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    # Take top 3
    top_3 = [code for code, score in sorted_scores[:3]]
    
    return ''.join(top_3)
```

**Example:**
```
Scores: I=27, C=24, E=22, R=17, A=12, S=10
Holland Code: ICE
```

---

## 9. Result Calculation Logic

### Complete Calculation Flow

```python
def process_holland_test_results(answers, questions):
    """
    Complete scoring pipeline
    """
    
    # Step 1: Calculate raw scores (8-40 range)
    raw_scores = calculate_raw_scores(answers, questions)
    
    # Step 2: Normalize to 0-32 scale
    normalized_scores = normalize_to_32_scale(raw_scores)
    
    # Step 3: Generate Holland Code (top 3)
    holland_code = generate_holland_code(normalized_scores)
    
    # Step 4: Determine primary type
    primary_type = holland_code[0]
    
    # Step 5: Calculate percentiles (optional)
    percentiles = calculate_percentiles(normalized_scores)
    
    # Step 6: Build result object
    result = {
        "test_id": "holland-code-riasec",
        "raw_scores": raw_scores,
        "normalized_scores": normalized_scores,
        "holland_code": holland_code,
        "primary_type": primary_type,
        "percentiles": percentiles,
        "interpretation": generate_interpretation(holland_code, normalized_scores)
    }
    
    return result
```

### Score Distribution Analysis

The test tracks score distribution across all users:

```python
def calculate_percentiles(user_scores, population_data):
    """
    Calculate what percentage of people scored lower
    """
    percentiles = {}
    
    for category in ["R", "I", "A", "S", "E", "C"]:
        user_score = user_scores[category]
        all_scores = population_data[category]
        
        lower_count = sum(1 for s in all_scores if s < user_score)
        percentile = (lower_count / len(all_scores)) * 100
        
        percentiles[category] = round(percentile)
    
    return percentiles
```

---

## 10. Possible Results

There are **720 possible Holland Codes** (6 × 5 × 4 = 120 unique 3-letter combinations × 6 possible primary types).

However, certain patterns are more common:

### Common Holland Code Patterns

**Realistic Dominant:**
- **RIE** - Technical Engineer
- **RIC** - Mechanical Engineer
- **RCE** - Construction Manager
- **RAI** - Industrial Designer

**Investigative Dominant:**
- **IAS** - Researcher/Professor
- **IRC** - Computer Scientist
- **IAE** - Research Manager
- **ISA** - Medical Doctor

**Artistic Dominant:**
- **ASE** - Creative Director
- **AIE** - Designer/Innovator
- **ASI** - Writer/Journalist
- **AES** - Performer/Entertainer

**Social Dominant:**
- **SAE** - Teacher/Trainer
- **SEA** - Manager/Coach
- **SIA** - Counselor/Therapist
- **SAI** - Educational Researcher

**Enterprising Dominant:**
- **EAS** - Marketing Manager
- **ESA** - Sales Manager
- **ECS** - Business Manager
- **ECI** - Financial Manager

**Conventional Dominant:**
- **CSE** - Office Manager
- **CIE** - Data Analyst
- **CER** - Operations Manager
- **CRI** - Quality Control Manager

---

## 11. Result Structure

### Complete Result Object

```json
{
  "test_id": "holland-code-riasec",
  "user_id": "user_uuid",
  "completed_at": "2024-01-15T14:30:00Z",
  "duration_seconds": 420,
  
  "raw_scores": {
    "R": 25,
    "I": 35,
    "A": 20,
    "S": 18,
    "E": 30,
    "C": 32
  },
  
  "normalized_scores": {
    "R": 17,
    "I": 27,
    "A": 12,
    "S": 10,
    "E": 22,
    "C": 24
  },
  
  "holland_code": "ICE",
  "primary_type": "I",
  
  "percentiles": {
    "R": 45,
    "I": 85,
    "A": 30,
    "S": 25,
    "E": 65,
    "C": 70
  },
  
  "interpretation": {
    "primary_type": {
      "code": "I",
      "name": "Investigative",
      "label": "Thinker",
      "description": "You are primarily Investigative, which means you enjoy analytical and intellectual work. You like to observe, learn, investigate, analyze, and solve problems. You prefer working with ideas and thinking rather than physical activity or leading people.",
      "characteristics": [
        "Analytical and logical",
        "Enjoy research and problem-solving",
        "Prefer working independently",
        "Value knowledge and learning"
      ],
      "work_environments": [
        "Research laboratories",
        "Universities and research institutions",
        "Technology companies",
        "Medical facilities"
      ],
      "sample_careers": [
        "Scientist",
        "Researcher",
        "Doctor",
        "Computer Programmer",
        "Analyst"
      ]
    },
    
    "holland_code_interpretation": {
      "code": "ICE",
      "title": "Analytical Business Professional",
      "description": "Your Holland Code ICE suggests you combine analytical thinking (I) with organizational skills (C) and business acumen (E). This is a powerful combination for roles that require data-driven decision making and strategic planning.",
      "career_matches": [
        "Data Scientist",
        "Business Analyst",
        "Financial Analyst",
        "Operations Research Analyst",
        "Management Consultant"
      ],
      "work_style": "You excel in roles that combine analytical rigor with practical business applications. You enjoy solving complex problems using data and logic, while also considering organizational efficiency and business outcomes."
    },
    
    "all_scores_summary": [
      {
        "type": "I",
        "score": 27,
        "percentile": 85,
        "level": "very_high",
        "interpretation": "Very high interest in analytical and research-oriented work"
      },
      {
        "type": "C",
        "score": 24,
        "percentile": 70,
        "level": "high",
        "interpretation": "High interest in organized, detail-oriented work"
      },
      {
        "type": "E",
        "score": 22,
        "percentile": 65,
        "level": "moderate_high",
        "interpretation": "Moderate-to-high interest in leadership and business"
      },
      {
        "type": "R",
        "score": 17,
        "percentile": 45,
        "level": "moderate",
        "interpretation": "Moderate interest in hands-on, practical work"
      },
      {
        "type": "A",
        "score": 12,
        "percentile": 30,
        "level": "low_moderate",
        "interpretation": "Low-to-moderate interest in creative work"
      },
      {
        "type": "S",
        "score": 10,
        "percentile": 25,
        "level": "low",
        "interpretation": "Low interest in people-oriented, helping work"
      }
    ]
  }
}
```

---

## 12. What the User Gets

### Results Page Layout

**Section I: Your Holland Code**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Your Holland Code: ICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Type: Investigative (Thinker)

You are primarily Investigative, which means you enjoy 
analytical and intellectual work. You like to observe, 
learn, investigate, analyze, and solve problems.

Your complete code ICE suggests you combine:
• I - Analytical thinking
• C - Organizational skills  
• E - Business acumen

This combination is ideal for careers in:
- Data Science
- Business Analysis
- Financial Analysis
- Research & Development
- Management Consulting
```

**Section II: Your RIASEC Scores**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Detailed Score Breakdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Realistic (R) - Doers
Score: 17/32  [▓▓▓▓▓░░░░░] 53%
Percentile: 45th
Interest Level: MODERATE

Investigative (I) - Thinkers  ⭐ PRIMARY
Score: 27/32  [▓▓▓▓▓▓▓▓░░] 84%
Percentile: 85th
Interest Level: VERY HIGH

Artistic (A) - Creators
Score: 12/32  [▓▓▓░░░░░░░] 38%
Percentile: 30th
Interest Level: LOW-MODERATE

Social (S) - Helpers
Score: 10/32  [▓▓▓░░░░░░░] 31%
Percentile: 25th
Interest Level: LOW

Enterprising (E) - Persuaders
Score: 22/32  [▓▓▓▓▓▓░░░░] 69%
Percentile: 65th
Interest Level: MODERATE-HIGH

Conventional (C) - Organizers
Score: 24/32  [▓▓▓▓▓▓▓░░░] 75%
Percentile: 70th
Interest Level: HIGH
```

**Section III: Career Recommendations**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Top Career Matches for ICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Best Fit Careers:

1. Data Scientist
   Match: 95%
   Why: Combines analytical skills with business applications

2. Business Analyst  
   Match: 92%
   Why: Uses data analysis to solve business problems

3. Financial Analyst
   Match: 90%
   Why: Analytical work in structured business environment

4. Operations Research Analyst
   Match: 88%
   Why: Mathematical modeling for business optimization

5. Management Consultant
   Match: 85%
   Why: Problem-solving with business impact

📚 Educational Paths:
- Computer Science
- Data Analytics
- Business Administration
- Economics
- Statistics
```

### Visual Components

**1. RIASEC Hexagon**
```
        I (27)
       /      \
    R(17)    A(12)
      |        |
    C(24)----E(22)
       \      /
        S(10)
```

**2. Score Distribution Graph**
Shows where user's scores fall relative to population:
- Histogram showing distribution of all test-takers
- User's scores marked with arrows
- Percentile indicators

**3. Holland Code Badge**
```
┌──────────────┐
│ Your Code    │
│    I C E     │
│   Thinker    │
└──────────────┘
```

---

## Database Schema

### holland_questions

```sql
CREATE TABLE holland_questions (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(20) UNIQUE NOT NULL,  -- 'holland_r_01'
    question_number INTEGER NOT NULL,
    
    text_ru TEXT NOT NULL,
    text_kk TEXT NOT NULL,
    text_en TEXT NOT NULL,
    
    category CHAR(1) NOT NULL,  -- R, I, A, S, E, C
    weight INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### holland_results

```sql
CREATE TABLE holland_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    test_session_id UUID,
    
    raw_scores JSONB NOT NULL,        -- {"R": 25, "I": 35, ...}
    normalized_scores JSONB NOT NULL,  -- {"R": 17, "I": 27, ...}
    percentiles JSONB,
    
    holland_code CHAR(3) NOT NULL,     -- 'ICE'
    primary_type CHAR(1) NOT NULL,     -- 'I'
    
    completed_at TIMESTAMP DEFAULT NOW(),
    duration_seconds INTEGER
);
```

### holland_answers

```sql
CREATE TABLE holland_answers (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES holland_results(id),
    question_id VARCHAR(20),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    answered_at TIMESTAMP DEFAULT NOW()
);
```

### holland_population_data

```sql
CREATE TABLE holland_population_data (
    id SERIAL PRIMARY KEY,
    category CHAR(1) NOT NULL,
    score INTEGER CHECK (score BETWEEN 0 AND 32),
    count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### GET /api/tests/holland-code/questions

Returns all 48 questions

**Query Parameters:**
- `language` (optional): ru, kk, en (default: ru)
- `randomize` (optional): true/false (default: true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "holland_r_01",
      "question_number": 1,
      "text": "Работать с инструментами и техникой",
      "category": "R",
      "scale": {
        "min": 1,
        "max": 5,
        "labels": {
          "1": "Не нравится",
          "2": "Немного не нравится",
          "3": "Нейтрально",
          "4": "Немного нравится",
          "5": "Нравится"
        }
      }
    }
  ]
}
```

### POST /api/tests/holland-code/submit

Submit test answers and get results

**Request:**
```json
{
  "user_id": "uuid",
  "answers": [
    {"question_id": "holland_r_01", "rating": 3},
    {"question_id": "holland_i_01", "rating": 5},
    ...
  ],
  "duration_seconds": 420
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "holland_code": "ICE",
    "primary_type": "I",
    "scores": {
      "R": 17,
      "I": 27,
      "A": 12,
      "S": 10,
      "E": 22,
      "C": 24
    },
    "percentiles": {...},
    "interpretation": {...}
  }
}
```

### GET /api/users/{user_id}/tests/holland-code/result

Get user's saved result

### GET /api/tests/holland-code/distribution

Get population score distribution for graphs

**Response:**
```json
{
  "R": [
    {"score": 0, "count": 12},
    {"score": 1, "count": 45},
    ...
    {"score": 32, "count": 8}
  ],
  "I": [...],
  ...
}
```

---

## Notes for Implementation

**Question Presentation:**
- Randomize question order to prevent order bias
- Group by category optional (better UX)
- Show progress indicator
- Allow previous/next navigation

**Rating Scale UI:**
- Radio buttons or slider
- Clear labels for each point
- Visual feedback on selection
- Keyboard support (1-5 keys)

**Score Calculation:**
- Validate all 48 questions answered
- Handle missing data gracefully
- Real-time score preview (optional)
- Store both raw and normalized scores

**Population Data:**
- Update distribution data after each submission
- Cache distribution graphs
- Recalculate percentiles periodically
- Handle edge cases (new test, small sample)

**Accessibility:**
- Screen reader labels for scale
- Keyboard navigation
- High contrast mode
- Clear instructions

**Analytics:**
- Track completion rate
- Monitor question difficulty
- Identify confusing questions
- A/B test question wording

**Performance:**
- Lazy load questions
- Batch database inserts
- Cache population data
- Optimize percentile calculations

---

## Scientific Background

**Theory:**
- Developed by John L. Holland (1950s-1990s)
- Based on personality-environment fit theory
- Validated across cultures and decades
- Most widely used career assessment framework

**Reliability:**
- Test-retest reliability: r = 0.80-0.90
- Internal consistency: α = 0.85-0.92

**Validity:**
- Predictive validity for career satisfaction
- Correlation with job performance
- Cross-cultural validation

**Research:**
- 1000+ published studies
- Used in career counseling worldwide
- Integrated into O*NET database
- Public domain version (IIP RIASEC)

---

## Testing Checklist

- [ ] All 48 questions load correctly
- [ ] Scale labels display properly
- [ ] Question randomization works
- [ ] Previous/Next navigation functional
- [ ] Progress tracking accurate
- [ ] Score calculation correct (raw + normalized)
- [ ] Holland Code generation accurate
- [ ] Percentile calculation works
- [ ] Distribution graph displays
- [ ] All result interpretations generate
- [ ] Mobile responsive
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] Multi-language support
- [ ] Save/resume functionality
- [ ] Analytics tracking
