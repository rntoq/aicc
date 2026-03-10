# Photo Career Quiz - Technical Documentation

## 1. Test Overview

**Test Name:** Photo Career Quiz  
**Test Code:** `photo-career-quiz`  
**Test ID:** `test_002`  
**Purpose:** Visual assessment of career preferences through image selection  
**Measures:** Career interest areas using visual stimuli  
**Questions:** 30 image pairs  
**Duration:** 5-7 minutes  
**Response Type:** Binary choice (A or B)  
**Weight in Analysis:** 15%

---

## 2. Test Description

The Photo Career Quiz is a visual-based career assessment tool. Instead of reading text descriptions, users choose between pairs of images depicting different work activities, environments, or professions.

This test uses visual cognition to identify career preferences. It's particularly effective for:
- Users who prefer visual learning
- Quick career exploration
- Engaging younger audiences
- Non-verbal assessment of work preferences

Each image pair contrasts two different career areas, forcing the user to reveal their natural preferences through visual attraction rather than self-reported text responses.

---

## 3. Test Format

**Structure:**
- 30 questions (image pairs)
- Each question shows 2 images side by side
- User selects the image that appeals more to them
- No neutral option - forced binary choice

**Categories Measured:**
- Building (Physical/Hands-on work)
- Thinking (Analysis/Research)
- Creating (Artistic/Design)
- Helping (People-oriented)
- Persuading (Leadership/Business)
- Organizing (Data/Systems)

**Image Distribution:**
- Each category appears 10 times across 30 questions
- Images balanced across all possible category pairs

---

## 4. How the Test Works

**Step-by-Step Flow:**

1. **Introduction Screen**
   - User sees test description
   - Instruction: "Choose the image that appeals more to you"
   - Start button

2. **Question Loop (30 iterations)**
   - Display image pair side by side
   - User clicks left (Option A) or right (Option B)
   - Answer recorded automatically
   - Next question loads immediately
   - Progress bar shows completion (e.g., "5/30")

3. **Completion**
   - All 30 answers collected
   - Calculate scores for each category
   - Generate result profile
   - Show results page

**Navigation:**
- Linear progression (no back button during test)
- Can pause/resume if needed
- Clear visual feedback on selection

---

## 5. Question Structure

```json
{
  "id": "photo_q_01",
  "question_number": 1,
  "type": "photo_pair",
  "optionA": {
    "id": "R_Carpenter",
    "imageSrc": "https://d31u95r9ywbjex.cloudfront.net/sites/default/files/images/visualtests/R_Carpenter.jpg",
    "description": "Carpenter at work",
    "category": "Building"
  },
  "optionB": {
    "id": "S_DentalTech",
    "imageSrc": "https://d31u95r9ywbjex.cloudfront.net/sites/default/files/images/visualtests/S_DentalTech.jpg",
    "description": "Dental technician with patient",
    "category": "Helping"
  }
}
```

**Field Definitions:**
- `id`: Unique question identifier
- `question_number`: Display order (1-30)
- `type`: Always "photo_pair"
- `optionA/optionB`: Two image choices
  - `id`: Image identifier
  - `imageSrc`: CDN URL to image
  - `description`: Alt text / accessibility description
  - `category`: Building, Thinking, Creating, Helping, Persuading, or Organizing

---

## 6. Questions

### Question 1
- **Option A:** Carpenter (Building)
- **Option B:** Dental Technician (Helping)

### Question 2
- **Option A:** Organic Chemistry (Thinking)
- **Option B:** Public Speaking (Persuading)

### Question 3
- **Option A:** Fashion Designer (Creating)
- **Option B:** Court Reporter (Organizing)

### Question 4
- **Option A:** Daredevil/Stunt Work (Building)
- **Option B:** Calculator/Numbers (Organizing)

### Question 5
- **Option A:** Professor (Thinking)
- **Option B:** Elderly Caregiver (Helping)

### Question 6
- **Option A:** Graphic Designer (Creating)
- **Option B:** Businessperson (Persuading)

### Question 7
- **Option A:** Firefighter (Building)
- **Option B:** Broker (Persuading)

### Question 8
- **Option A:** Scientist with Test Tubes (Thinking)
- **Option B:** Number Columns (Organizing)

### Question 9
- **Option A:** Musician (Creating)
- **Option B:** Male Nurse (Helping)

### Question 10
- **Option A:** Forester (Building)
- **Option B:** Researcher (Thinking)

### Question 11
- **Option A:** Sketching (Creating)
- **Option B:** Car Repair (Building)

### Question 12
- **Option A:** Writer (Creating)
- **Option B:** Scientist in Lab (Thinking)

### Question 13
- **Option A:** Elementary Teacher (Helping)
- **Option B:** Lawyer (Persuading)

### Question 14
- **Option A:** Systems Administrator (Organizing)
- **Option B:** Family Counselor (Helping)

### Question 15
- **Option A:** Business Meeting (Persuading)
- **Option B:** Accountant (Organizing)

### Question 16
- **Option A:** Athlete (Building)
- **Option B:** Childhood Educator (Helping)

### Question 17
- **Option A:** Archaeologist (Thinking)
- **Option B:** Attorney (Persuading)

### Question 18
- **Option A:** Dancer (Creating)
- **Option B:** Claims Adjuster (Organizing)

### Question 19
- **Option A:** Cook (Building)
- **Option B:** Filing (Organizing)

### Question 20
- **Option A:** Engineer (Thinking)
- **Option B:** Male Teacher (Helping)

### Question 21
- **Option A:** Designer (Creating)
- **Option B:** Conference (Persuading)

### Question 22
- **Option A:** Cowboy (Building)
- **Option B:** CEO (Persuading)

### Question 23
- **Option A:** Pharmacist (Thinking)
- **Option B:** Forms (Organizing)

### Question 24
- **Option A:** Landscape Architect (Creating)
- **Option B:** Goat Feeding (Helping)

### Question 25
- **Option A:** HVAC Technician (Building)
- **Option B:** Radiologist (Thinking)

### Question 26
- **Option A:** Painter (Creating)
- **Option B:** Pilot (Building)

### Question 27
- **Option A:** Stage Makeup (Creating)
- **Option B:** Surgeon (Thinking)

### Question 28
- **Option A:** Massage Therapist (Helping)
- **Option B:** Manager (Persuading)

### Question 29
- **Option A:** Medical Secretary (Organizing)
- **Option B:** Psychotherapist (Helping)

### Question 30
- **Option A:** Real Estate Agent (Persuading)
- **Option B:** Military (Organizing)

---

## 7. Categories / Dimensions

### Building
**Theme:** Physical work, tools, machines, animals, outdoors  
**Image Count:** 10  
**Sample Images:** Carpenter, Firefighter, Athlete, Forester, Cook, Pilot, HVAC Tech

**Characteristics:**
- Hands-on work
- Practical problem-solving
- Physical activity
- Working with things rather than people

**Career Examples:**
- Construction Worker
- Mechanic
- Electrician
- Chef
- Pilot

---

### Thinking
**Theme:** Research, analysis, science, problem-solving  
**Image Count:** 10  
**Sample Images:** Organic Chemistry, Professor, Scientist, Researcher, Engineer, Pharmacist, Radiologist, Surgeon

**Characteristics:**
- Analytical thinking
- Scientific inquiry
- Complex problem-solving
- Working with ideas and data

**Career Examples:**
- Scientist
- Engineer
- Researcher
- Pharmacist
- Doctor

---

### Creating
**Theme:** Creative expression, design, arts, originality  
**Image Count:** 10  
**Sample Images:** Fashion Designer, Graphic Designer, Musician, Sketching, Writer, Dancer, Painter, Stage Makeup

**Characteristics:**
- Creative expression
- Artistic work
- Originality and innovation
- Unstructured environments

**Career Examples:**
- Graphic Designer
- Fashion Designer
- Musician
- Writer
- Artist

---

### Helping
**Theme:** Teaching, caring, counseling, helping people  
**Image Count:** 10  
**Sample Images:** Dental Tech, Elderly Caregiver, Nurse, Elementary Teacher, Family Counselor, Childhood Educator, Massage Therapist, Psychotherapist

**Characteristics:**
- Working with people
- Helping and teaching
- Social interaction
- Caring for others

**Career Examples:**
- Teacher
- Nurse
- Counselor
- Social Worker
- Therapist

---

### Persuading
**Theme:** Leading, selling, managing, influencing  
**Image Count:** 10  
**Sample Images:** Public Speaking, Businessperson, Broker, Lawyer, Attorney, Meeting, CEO, Conference, Manager, Real Estate Agent

**Characteristics:**
- Leadership
- Persuasion and influence
- Business and entrepreneurship
- Managing others

**Career Examples:**
- CEO
- Manager
- Lawyer
- Real Estate Agent
- Sales Representative

---

### Organizing
**Theme:** Organization, data, details, processes, structure  
**Image Count:** 10  
**Sample Images:** Court Reporter, Calculator, Number Columns, Systems Administrator, Accountant, Claims Adjuster, Filing, Forms, Medical Secretary, Military

**Characteristics:**
- Organization and structure
- Data management
- Following procedures
- Attention to detail

**Career Examples:**
- Accountant
- Administrative Assistant
- Systems Administrator
- Office Manager
- Paralegal

---

## 8. Scoring System

### Raw Score Calculation

Each question awards 1 point to the selected category:

```python
def score_question(user_choice, question):
    """
    Award 1 point to the category of selected image
    """
    if user_choice == 'A':
        selected_category = question['optionA']['category']
    else:  # user_choice == 'B'
        selected_category = question['optionB']['category']
    
    return selected_category
```

**Example:**
```
Question 1: User selects Option A (Carpenter - Building)
→ Building score += 1

Question 2: User selects Option B (Public Speaking - Persuading)
→ Persuading score += 1
```

### Raw Scores Range
- Minimum per category: 0 (never selected)
- Maximum per category: 10 (selected every time it appeared)
- Total points distributed: 30 (sum of all 6 categories = 30)

**Example Raw Scores:**
```json
{
  "Building": 3,
  "Thinking": 2,
  "Creating": 4,
  "Helping": 1,
  "Persuading": 6,
  "Organizing": 14
}
```

### Percentage Calculation

```python
def calculate_percentages(raw_scores):
    """
    Convert raw scores (0-10) to percentages (0-100)
    """
    percentages = {}
    for category, raw_score in raw_scores.items():
        percentages[category] = (raw_score / 10) * 100
    
    return percentages
```

**Example:**
```
Building: 3/10 = 30%
Thinking: 2/10 = 20%
Creating: 4/10 = 40%
Helping: 1/10 = 10%
Persuading: 6/10 = 60%
Organizing: 8/10 = 80%
```

### Interest Level Classification

Based on percentage scores:

```python
def classify_interest_level(percentage):
    if percentage >= 70:
        return "high"
    elif percentage >= 40:
        return "moderate"
    else:
        return "low"
```

**Thresholds:**
- **High:** 70-100% (7-10 selections)
- **Moderate:** 40-69% (4-6 selections)
- **Low:** 0-39% (0-3 selections)

---

## 9. Result Calculation Logic

### Step 1: Count Selections

```python
def calculate_raw_scores(answers, questions):
    scores = {
        "Building": 0,
        "Thinking": 0,
        "Creating": 0,
        "Helping": 0,
        "Persuading": 0,
        "Organizing": 0
    }
    
    for answer in answers:
        question = get_question(answer['question_id'], questions)
        
        if answer['choice'] == 'A':
            category = question['optionA']['category']
        else:
            category = question['optionB']['category']
        
        scores[category] += 1
    
    return scores
```

### Step 2: Convert to Percentages

```python
def to_percentages(raw_scores):
    return {
        category: (count / 10) * 100 
        for category, count in raw_scores.items()
    }
```

### Step 3: Determine Primary Career Type

```python
def get_primary_type(scores):
    return max(scores.items(), key=lambda x: x[1])[0]
```

### Step 4: Generate Top 3 Areas

```python
def get_top_areas(scores):
    """
    Return top 3 career areas in descending order
    """
    sorted_areas = sorted(
        scores.items(), 
        key=lambda x: x[1], 
        reverse=True
    )
    
    # Take top 3 with scores >= 40%
    top_areas = [
        area for area, score in sorted_areas 
        if score >= 40
    ][:3]
    
    return top_areas
```

**Example:**
```
Scores: Organizing=80%, Persuading=60%, Creating=40%, Building=30%, Thinking=20%, Helping=10%
Top Areas: ["Organizing", "Persuading", "Creating"]
```

### Step 5: Build Result Object

```python
def build_result(scores, primary_type, top_areas):
    return {
        "test_id": "photo-career-quiz",
        "completed_at": datetime.now(),
        "raw_scores": scores,
        "percentages": to_percentages(scores),
        "primary_type": primary_type,
        "top_areas": top_areas,
        "interest_levels": {
            category: classify_interest_level(percentage)
            for category, percentage in to_percentages(scores).items()
        },
        "interpretation": generate_interpretation(primary_type, scores)
    }
```

---

## 10. Possible Results

There are **6 primary result types** based on the highest-scoring category:

### Result Type 1: Builder
**Trigger:** Building is highest score  
**Title:** "You're a Builder"

**Profile Summary:**
- Enjoys physical work and hands-on tasks
- Prefers working with tools, machines, or outdoors
- Values practical problem-solving
- Often drawn to construction, mechanics, athletics

**Sample Careers:**
- Construction Worker
- Mechanic
- Electrician
- Firefighter
- Pilot
- Chef
- Athlete
- HVAC Technician

---

### Result Type 2: Thinker
**Trigger:** Thinking is highest score  
**Title:** "You're a Thinker"

**Profile Summary:**
- Enjoys research and analysis
- Prefers solving abstract or theoretical problems
- Values intellectual challenges
- Often drawn to science, technology, medicine

**Sample Careers:**
- Scientist
- Engineer
- Researcher
- Pharmacist
- Radiologist
- Surgeon
- Professor
- Archaeologist

---

### Result Type 3: Creator
**Trigger:** Creating is highest score  
**Title:** "You're a Creator"

**Profile Summary:**
- Enjoys artistic expression and creative work
- Prefers unstructured, imaginative environments
- Values originality and aesthetics
- Often drawn to arts, design, writing, music

**Sample Careers:**
- Graphic Designer
- Fashion Designer
- Musician
- Writer
- Dancer
- Painter
- Landscape Architect
- Stage Makeup Artist

---

### Result Type 4: Helper
**Trigger:** Helping is highest score  
**Title:** "You're a Helper"

**Profile Summary:**
- Enjoys helping and teaching others
- Prefers social interaction and teamwork
- Values making a difference in people's lives
- Often drawn to education, healthcare, counseling

**Sample Careers:**
- Teacher
- Nurse
- Counselor
- Caregiver
- Massage Therapist
- Psychotherapist
- Social Worker
- Childhood Educator

---

### Result Type 5: Persuader
**Trigger:** Persuading is highest score  
**Title:** "You're a Persuader"

**Profile Summary:**
- Enjoys leading and influencing others
- Prefers business and entrepreneurial activities
- Values achievement and recognition
- Often drawn to management, sales, law

**Sample Careers:**
- CEO
- Manager
- Lawyer
- Real Estate Agent
- Business Owner
- Sales Representative
- Attorney
- Stockbroker

---

### Result Type 6: Organizer
**Trigger:** Organizing is highest score  
**Title:** "You're an Organizer"

**Profile Summary:**
- Enjoys organizing data and following procedures
- Prefers structured, orderly environments
- Values accuracy and efficiency
- Often drawn to office work, accounting, administration

**Sample Careers:**
- Accountant
- Administrative Assistant
- Systems Administrator
- Office Manager
- Court Reporter
- Medical Secretary
- Claims Adjuster
- Paralegal

---

## 11. Result Structure

### Complete Result Object

```json
{
  "test_id": "photo-career-quiz",
  "user_id": "user_uuid",
  "completed_at": "2024-01-15T14:30:00Z",
  "duration_seconds": 385,
  
  "raw_scores": {
    "Building": 3,
    "Thinking": 2,
    "Creating": 4,
    "Helping": 1,
    "Persuading": 6,
    "Organizing": 8
  },
  
  "percentages": {
    "Building": 30,
    "Thinking": 20,
    "Creating": 40,
    "Helping": 10,
    "Persuading": 60,
    "Organizing": 80
  },
  
  "interest_levels": {
    "Building": "low",
    "Thinking": "low",
    "Creating": "moderate",
    "Helping": "low",
    "Persuading": "moderate",
    "Organizing": "high"
  },
  
  "primary_type": "Organizer",
  "top_areas": ["Organizing", "Persuading", "Creating"],
  
  "interpretation": {
    "section_1": {
      "title": "Your Career Type",
      "result_title": "You're an Organizer",
      "description": "Your primary interest area is Organizing, which means you enjoy handling data, details, and processes. Organizers like structured work environments where they can follow clear procedures to organize information. They often enjoy office work, especially managing systems, records, and files.\n\nOrganizers like to have a routine for their work and want precise standards for what they do. They typically do best to avoid jobs where the rules and expectations are unclear, or where there is not a clear process to follow.\n\nOrganizers like their work best when they can use a systematic process to finish tasks correctly and consistently. As an Organizer, your primary career goal will be to find a job where you can handle data and details with precision, and follow standardized procedures to organize and manage information.",
      "sample_careers": [
        "Administrative Assistant",
        "Accountant",
        "Office Manager",
        "Banker",
        "Paralegal"
      ]
    },
    
    "section_2": {
      "title": "Your Score Summary",
      "dimensions": [
        {
          "category": "Building",
          "description": "Building careers involve mechanics and construction, working with machines, or using physical skills. Builders are often attracted to careers in the military or law enforcement, construction, mechanics, and athletics.",
          "score": 30,
          "interest_level": "low",
          "interest_text": "Your interest level for the Building career area is low."
        },
        {
          "category": "Thinking",
          "description": "Thinking careers involve research, analysis, and solving abstract or theoretical problems. Thinkers are often attracted to careers in the sciences, computers and technology, mathematics, and medicine.",
          "score": 20,
          "interest_level": "low",
          "interest_text": "Your interest level for the Thinking career area is low."
        },
        {
          "category": "Creating",
          "description": "Creating careers involve artistic expression, imagination, and the creative use of language. Creators are often attracted to careers in performing or visual art, music, writing, and all areas of design.",
          "score": 40,
          "interest_level": "moderate",
          "interest_text": "Your interest level for the Creating career area is moderate."
        },
        {
          "category": "Helping",
          "description": "Helping careers involve assisting, teaching, or taking care of other people. Helpers are often attracted to careers in education, counseling, health care, social service, and human resources.",
          "score": 10,
          "interest_level": "low",
          "interest_text": "Your interest level for the Helping career area is low."
        },
        {
          "category": "Persuading",
          "description": "Persuading careers involve leading, influencing, or managing others. Persuaders are often attracted to careers in business, management, sales, retail, and entrepreneurship.",
          "score": 60,
          "interest_level": "moderate",
          "interest_text": "Your interest level for the Persuading career area is moderate."
        },
        {
          "category": "Organizing",
          "description": "Organizing careers involve managing data, files, and processes. Organizers are often attracted to careers in accounting, computers and information systems, administration, and office management.",
          "score": 80,
          "interest_level": "high",
          "interest_text": "Your interest level for the Organizing career area is high."
        }
      ]
    }
  }
}
```

---

## 12. What the User Gets

### Result Page Layout

**Section I: Your Career Type**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   You're an Organizer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your primary interest area is Organizing, which means 
you enjoy handling data, details, and processes. 
Organizers like structured work environments where 
they can follow clear procedures to organize 
information. They often enjoy office work, especially 
managing systems, records, and files.

Organizers like to have a routine for their work and 
want precise standards for what they do. They 
typically do best to avoid jobs where the rules and 
expectations are unclear, or where there is not a 
clear process to follow.

Organizers like their work best when they can use a 
systematic process to finish tasks correctly and 
consistently. As an Organizer, your primary career 
goal will be to find a job where you can handle data 
and details with precision, and follow standardized 
procedures to organize and manage information.

📋 Sample Careers for Organizers:
• Administrative Assistant
• Accountant
• Office Manager
• Banker
• Paralegal
```

**Section II: Your Score Summary**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Your Interest Levels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔨 Building - 30%
Your interest level: LOW
Building careers involve mechanics and construction, 
working with machines, or using physical skills.

🧠 Thinking - 20%
Your interest level: LOW
Thinking careers involve research, analysis, and 
solving abstract or theoretical problems.

🎨 Creating - 40%
Your interest level: MODERATE
Creating careers involve artistic expression, 
imagination, and creative use of language.

❤️ Helping - 10%
Your interest level: LOW
Helping careers involve assisting, teaching, or 
taking care of other people.

💼 Persuading - 60%
Your interest level: MODERATE
Persuading careers involve leading, influencing, 
or managing others.

📊 Organizing - 80%
Your interest level: HIGH ⭐
Organizing careers involve managing data, files, 
and processes.
```

### Visual Components

**1. Radar Chart**
- 6-sided radar chart showing all scores
- Highlighted primary category
- Visual pattern of interests

**2. Interest Level Bars**
```
Building     [▓▓▓░░░░░░░] 30%  LOW
Thinking     [▓▓░░░░░░░░] 20%  LOW
Creating     [▓▓▓▓░░░░░░] 40%  MODERATE
Helping      [▓░░░░░░░░░] 10%  LOW
Persuading   [▓▓▓▓▓▓░░░░] 60%  MODERATE
Organizing   [▓▓▓▓▓▓▓▓░░] 80%  HIGH ⭐
```

**3. Top Areas Badge**
```
┌────────────────────────┐
│ Your Top 3 Areas       │
│ 1. Organizing          │
│ 2. Persuading          │
│ 3. Creating            │
└────────────────────────┘
```

### Additional Features

**Career Matches:**
- List of careers matching primary type
- Match percentage for each
- Link to career detail pages

**Next Steps:**
- "Explore Organizing Careers"
- "Find Universities for Business/Admin programs"
- "Take Additional Tests"

**Share Results:**
- Download PDF
- Share on social media
- Email to self

---

## Database Schema

### photos_quiz_questions

```sql
CREATE TABLE photos_quiz_questions (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(20) UNIQUE NOT NULL,  -- 'photo_q_01'
    question_number INTEGER NOT NULL,
    
    option_a_id VARCHAR(50) NOT NULL,
    option_a_image_url TEXT NOT NULL,
    option_a_description VARCHAR(200),
    option_a_category VARCHAR(20) NOT NULL,
    
    option_b_id VARCHAR(50) NOT NULL,
    option_b_image_url TEXT NOT NULL,
    option_b_description VARCHAR(200),
    option_b_category VARCHAR(20) NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### photo_quiz_results

```sql
CREATE TABLE photo_quiz_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    test_session_id UUID,
    
    raw_scores JSONB NOT NULL,  -- {"Building": 3, "Thinking": 2, ...}
    percentages JSONB NOT NULL,
    interest_levels JSONB NOT NULL,
    
    primary_type VARCHAR(20) NOT NULL,
    top_areas TEXT[] NOT NULL,
    
    completed_at TIMESTAMP DEFAULT NOW(),
    duration_seconds INTEGER
);
```

### photo_quiz_answers

```sql
CREATE TABLE photo_quiz_answers (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES photo_quiz_results(id),
    question_id VARCHAR(20),
    selected_option CHAR(1),  -- 'A' or 'B'
    category_selected VARCHAR(20),
    answered_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### GET /api/tests/photo-career-quiz/questions
Returns all 30 questions with image URLs

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "photo_q_01",
      "question_number": 1,
      "optionA": {
        "id": "R_Carpenter",
        "imageSrc": "https://d31u95r9ywbjex.cloudfront.net/...",
        "description": "Carpenter at work",
        "category": "Building"
      },
      "optionB": {
        "id": "S_DentalTech",
        "imageSrc": "https://d31u95r9ywbjex.cloudfront.net/...",
        "description": "Dental technician with patient",
        "category": "Helping"
      }
    }
  ]
}
```

### POST /api/tests/photo-career-quiz/submit
Accepts answers and returns calculated result

**Request:**
```json
{
  "user_id": "uuid",
  "answers": [
    {"question_id": "photo_q_01", "choice": "A"},
    {"question_id": "photo_q_02", "choice": "B"},
    ...
  ],
  "duration_seconds": 385
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "primary_type": "Organizer",
    "top_areas": ["Organizing", "Persuading", "Creating"],
    "scores": {
      "Building": 30,
      "Thinking": 20,
      "Creating": 40,
      "Helping": 10,
      "Persuading": 60,
      "Organizing": 80
    },
    "interpretation": {...}
  }
}
```

### GET /api/users/{user_id}/tests/photo-career-quiz/result
Returns user's saved result

---

## Notes for Implementation

**Image Loading:**
- All images hosted on CloudFront CDN
- Lazy load images for performance
- Provide alt text for accessibility
- Cache images locally after first load
- Preload next image while user views current

**Mobile Optimization:**
- Stack images vertically on small screens (< 768px)
- Large touch targets for selection (min 48x48px)
- Swipe gestures for navigation (optional)
- Optimize image sizes for mobile (use srcset)

**Accessibility:**
- Screen reader descriptions for all images
- Keyboard navigation support (Tab, Enter, Arrow keys)
- High contrast mode compatible
- ARIA labels for progress and selections
- Focus indicators

**Performance:**
- Compress images (WebP with JPEG fallback)
- CDN delivery for fast loading
- Progressive image loading
- Service worker for offline capability

**Analytics:**
- Track time per question
- Track most/least selected images
- Monitor dropout rate by question
- A/B test image variations

**Validation:**
- Ensure all 30 questions answered
- Prevent double-submission
- Handle network errors gracefully
- Auto-save progress locally

**UX Enhancements:**
- Show preview of selected image
- Smooth transitions between questions
- Undo last selection option
- Save and resume functionality
- Estimated time remaining

---

## Example Question Data

```json
{
  "id": "photo_q_01",
  "question_number": 1,
  "type": "photo_pair",
  "optionA": {
    "id": "R_Carpenter",
    "imageSrc": "https://d31u95r9ywbjex.cloudfront.net/sites/default/files/images/visualtests/R_Carpenter.jpg",
    "description": "Carpenter working with wood and tools",
    "category": "Building",
    "alt_text": "Person using a hammer and working with wooden planks"
  },
  "optionB": {
    "id": "S_DentalTech",
    "imageSrc": "https://d31u95r9ywbjex.cloudfront.net/sites/default/files/images/visualtests/S_DentalTech.jpg",
    "description": "Dental technician helping a patient",
    "category": "Helping",
    "alt_text": "Dental professional examining a patient's teeth"
  }
}
```

---

## Frontend Component Example

```typescript
interface PhotoQuestion {
  id: string;
  question_number: number;
  optionA: {
    id: string;
    imageSrc: string;
    description: string;
    category: string;
  };
  optionB: {
    id: string;
    imageSrc: string;
    description: string;
    category: string;
  };
}

interface Answer {
  question_id: string;
  choice: 'A' | 'B';
  category_selected: string;
}

// Component usage
<PhotoQuizQuestion
  question={currentQuestion}
  onSelect={(choice) => handleAnswer(choice)}
  progress={currentIndex / totalQuestions}
/>
```

---

## Testing Checklist

- [ ] All 30 questions load correctly
- [ ] Images load from CDN
- [ ] Selection feedback is clear
- [ ] Progress bar updates
- [ ] Score calculation is accurate
- [ ] All 6 result types generate correctly
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Network error handling
- [ ] Save/resume functionality
- [ ] Analytics tracking works
