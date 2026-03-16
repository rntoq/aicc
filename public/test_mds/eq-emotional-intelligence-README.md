# Emotional Intelligence (EQ) Test - Technical Documentation

## 1. Test Overview

**Test Name:** Emotional Intelligence Assessment  
**Test Code:** `emotional-intelligence-eq`  
**Test ID:** `test_009`  
**Purpose:** Measure ability to understand, regulate, and use emotions effectively  
**Measures:** 5 dimensions of emotional intelligence  
**Questions:** 63 statements  
**Duration:** 8-10 minutes  
**Response Type:** 5-point Likert scale (Inaccurate → Accurate)  
**Weight in Analysis:** 20%

---

## 2. Test Description

Emotional intelligence (EQ) is the ability to understand, regulate, and use emotions so we can effectively relate to others and manage ourselves. The term "emotional intelligence" encompasses a wide range of skills and abilities that help us build relationships, manage stress, and make sound decisions.

**What Makes EQ Important:**

Traditional IQ measures intellectual ability, but research shows that IQ has a surprisingly weak correlation with life success. Psychologist Daniel Goleman and others discovered that highly successful people excel in:
- Navigating social relationships
- Managing their own emotional states
- Understanding and channeling emotions toward goals
- Interpreting and relating to others' emotions

These social and emotional skills became known as "emotional intelligence."

**EQ vs. IQ:**
- **IQ (Intelligence Quotient):** Measures intellectual/academic ability
- **EQ (Emotional Quotient):** Measures emotional and social skills

**Why EQ Matters:**
- Better predictor of life success than IQ
- Stronger, more stable relationships
- Improved ability to persist toward goals
- Better stress management
- Enhanced decision-making
- Greater career achievement and satisfaction

---

## 3. Test Format

**Structure:**
- 63 self-descriptive statements
- 5-point Likert scale for each statement
- No time limit (typically 8-10 minutes)
- Statements distributed across 5 dimensions

**Scale:**
1. **Inaccurate** - This statement does not describe me at all
2. **Mostly Inaccurate** - This statement rarely describes me
3. **Neutral** - Unsure or sometimes true, sometimes not
4. **Mostly Accurate** - This statement often describes me
5. **Accurate** - This statement describes me very well

**Question Distribution:**
- Self-Awareness: ~13 questions
- Other Awareness: ~13 questions
- Emotional Control: ~13 questions
- Empathy: ~12 questions
- Well-being: ~12 questions

---

## 4. The Five Elements of Emotional Intelligence

### Element 1: Self-Awareness
**Definition:** The ability to effectively recognize and identify one's own emotional experiences

**What High Scorers Do:**
- Highly in tune with their emotions
- Possess keen sense of what they're feeling at any moment
- Reflective about the reasons behind emotional reactions
- Can articulate emotions with specific words
- Track their moods throughout the day
- Recognize emotions the moment they feel them

**What Low Scorers Experience:**
- Get caught up in the heat of the moment
- May be impulsive or reactive
- Difficulty putting feelings into words
- Less aware of current emotional state
- May be "hard to read" by others

**Sample Questions:**
- "I am very good at identifying the emotions I am feeling"
- "I am highly aware of how I am feeling (my moods, emotions, etc.)"
- "I use very specific words to talk about how I am feeling"
- "I recognize emotions the moment I feel them"
- "I find it hard to put how I am feeling into words" (REVERSE)

**Career Implications:**
- High: Therapy, counseling, creative writing, leadership
- Self-awareness is foundational for all other EQ skills

---

### Element 2: Other Awareness (Social Awareness)
**Definition:** The ability to effectively perceive and understand the emotions of others

**What High Scorers Do:**
- Highly attuned to nonverbal cues
- Read body language and facial expressions accurately
- Can tell how people feel just by looking at them
- Understand emotions even when not explicitly expressed
- Pick up on subtle emotional shifts
- Accurately interpret emotional states

**What Low Scorers Experience:**
- Struggle to read nonverbal cues
- Miss emotional signals from others
- May experience misunderstandings
- Surprised by others' reactions
- Find people "hard to read"

**Sample Questions:**
- "I am very good at reading body language"
- "I have an acute sense of how people around me are feeling"
- "I am very good at reading nonverbal cues"
- "I can often tell how people feel just by looking at them"
- "I sometimes find it hard to figure out how people around me are feeling" (REVERSE)

**Career Implications:**
- High: Sales, HR, customer service, teaching, therapy
- Essential for roles requiring interpersonal sensitivity

---

### Element 3: Emotional Control
**Definition:** The ability to regulate and manage one's own emotions

**What High Scorers Do:**
- Strong sense of control over emotional experiences
- Direct emotions in ways that serve their goals
- Move on quickly from negative emotions
- Can cheer themselves up when sad
- Stay calm under pressure
- Don't let emotions derail tasks
- Make decisions based on logic, not emotions

**What Low Scorers Experience:**
- Get caught up in the heat of the moment
- Overwhelmed by emotions
- Difficulty calming down when upset
- Emotions interfere with daily functioning
- May raise voice or get carried away
- Struggle with emotional regulation

**Sample Questions:**
- "I have control over my emotions"
- "My emotions are under control"
- "I move on very quickly from negative emotions and bad moods"
- "I find it easy to cheer myself up when I am feeling sad or unmotivated"
- "I often get caught up in the heat of the moment" (REVERSE)

**Career Implications:**
- High: Emergency services, leadership, high-pressure roles
- Critical for stress management and professional demeanor

---

### Element 4: Empathy
**Definition:** The ability to relate to and care about the emotional experiences of others

**What High Scorers Do:**
- Care deeply about how people are feeling
- Show sensitivity toward others
- Easily upset by others' pain
- Feel compelled to act when seeing suffering
- Think constantly about caring for people in their life
- Affected by stories of suffering
- Donate to help those in need

**What Low Scorers Experience:**
- Not easily moved by tragic stories
- Don't feel responsible for others' problems
- Less affected by advertisements about suffering
- More emotionally detached from others' pain
- Focus more on self than others

**Sample Questions:**
- "I am very affected by advertisements about animal cruelty"
- "I am easily upset by the pain of other people"
- "I often feel compelled to act when I see someone suffering"
- "I am a very empathetic person"
- "I am not moved by other people's tragic stories" (REVERSE)

**Career Implications:**
- High: Healthcare, social work, counseling, non-profit
- Essential for helping professions and caregiving roles

---

### Element 5: Well-being
**Definition:** Overall state of psychological, emotional, and social wellness

**What High Scorers Do:**
- Positive attitudes toward life
- High levels of satisfaction in daily activities
- Feel fortunate and grateful
- Enjoy socializing and social gatherings
- Bring fun and excitement to interactions
- Good at getting people to laugh
- Confident in social situations

**What Low Scorers Experience:**
- May not enjoy socializing as much
- Less confident in social situations
- Don't bring as much fun to gatherings
- May prefer not to draw attention
- Lower overall life satisfaction

**Sample Questions:**
- "I really enjoy socializing"
- "I am confident in social situations"
- "I consider myself to be charming"
- "I consider myself extremely lucky to have the life I do"
- "I don't really like networking" (REVERSE)

**Career Implications:**
- High: Sales, entertainment, hospitality, public relations
- Important for roles requiring positive energy and enthusiasm

---

## 5. Question Structure

```json
{
  "id": 1,
  "text": "I am very good at identifying the emotions I am feeling",
  "dimension": "self_awareness",
  "reverse_scored": false,
  "scale": {
    "min": 1,
    "max": 5,
    "labels": {
      "1": "Inaccurate",
      "2": "Mostly Inaccurate",
      "3": "Neutral",
      "4": "Mostly Accurate",
      "5": "Accurate"
    }
  }
}
```

---

## 6. Complete Question List (63 Questions)

### Self-Awareness Questions (13)
1. "I am very good at identifying the emotions I am feeling"
2. "I am highly aware of how I am feeling (my moods, emotions, etc.)"
3. "I use very specific words to talk about how I am feeling"
4. "I recognize emotions the moment I feel them"
5. "I describe my emotional experiences vividly"
6. "I have a rich emotional vocabulary"
7. "I am consistently aware of what kind of mood I'm in"
8. "I am good at keeping track of how I'm feeling throughout the day"
9. "Talking about how I am feeling usually improves my mood"
10. "I find it hard to put how I am feeling into words" (REVERSE)
11. "Other people tell me that I am hard to read" (REVERSE)
12. "I don't really like talking about the way I feel" (REVERSE)
13. "I pay little attention to my emotions when there is a job to be done" (REVERSE)

### Other Awareness Questions (13)
14. "I sometimes find it hard to figure out how people around me are feeling" (REVERSE)
15. "I am very good at reading body language"
16. "I have an acute sense of how people around me are feeling"
17. "I am very good at reading nonverbal cues"
18. "I can often tell how people feel just by looking at them"
19. "I understand a lot just from other people's facial expressions"
20. "I can tell if someone is upset without them having to say anything"
21. "I am good at understanding how people feel, even when they don't say so out loud"
22. "I sometimes find other people hard to read" (REVERSE)
23. "I am often surprised by other people's reactions to things" (REVERSE)
24. "I find it difficult to deal with people who get emotional about things" (REVERSE)

### Emotional Control Questions (13)
25. "I have control over my emotions"
26. "My emotions are under control"
27. "I move on very quickly from negative emotions and bad moods"
28. "My moods rarely affect my decisions"
29. "I make decisions based on logic, not emotions"
30. "I find it easy to cheer myself up when I am feeling sad or unmotivated"
31. "I don't let myself get carried away with my feelings"
32. "I control my emotions; my emotions don't control me"
33. "I rarely get angry"
34. "I often get caught up in the heat of the moment" (REVERSE)
35. "Once something upsets me, I find it hard to calm myself back down" (REVERSE)
36. "I am sometimes overwhelmed by my emotions" (REVERSE)
37. "I often can't go about my day because of the emotions I am feeling" (REVERSE)

### Empathy Questions (12)
38. "I regularly donate to charities that help people in need"
39. "I am very affected by advertisements about animal cruelty"
40. "I am easily upset by the pain of other people"
41. "I often feel compelled to act when I see someone suffering"
42. "I am a very empathetic person"
43. "I constantly think about how much I care about the people in my life"
44. "I am very concerned about poverty and injustice in the world"
45. "I do not feel responsible for rescuing people from their own problems" (REVERSE)
46. "I am not moved by other people's tragic stories" (REVERSE)

### Well-being Questions (12)
47. "I really enjoy socializing"
48. "I am confident in social situations"
49. "I consider myself to be charming"
50. "I am very good at getting people to laugh"
51. "I have very good social skills"
52. "I am a very persuasive person"
53. "I bring fun and excitement to social gatherings"
54. "I can be very forceful when I feel strongly about something"
55. "I really enjoy getting to know people better"
56. "I consider myself extremely lucky to have the life I do"
57. "I don't really like networking" (REVERSE)
58. "I try not to draw attention to myself" (REVERSE)
59. "I don't share a lot with other people" (REVERSE)

### Mixed/Additional Questions
60. "I get things done, regardless of how I am feeling" (Emotional Control)
61. "I don't burden other people with my emotions" (Emotional Control)
62. "I often raise my voice to show other people that I am serious" (Emotional Control - REVERSE)
63. "It's important to me to show other people that I am strong and powerful" (Well-being)

---

## 7. Scoring System

### Raw Score Calculation

```python
def calculate_raw_scores(answers):
    """
    Calculate raw scores for each EQ dimension
    """
    scores = {
        "self_awareness": 0,
        "other_awareness": 0,
        "emotional_control": 0,
        "empathy": 0,
        "wellbeing": 0
    }
    
    # Question mapping
    question_map = {
        "self_awareness": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        "other_awareness": [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        "emotional_control": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 60, 61, 62],
        "empathy": [38, 39, 40, 41, 42, 43, 44, 45, 46],
        "wellbeing": [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 63]
    }
    
    # Reverse scored questions
    reverse_scored = [10, 11, 12, 13, 14, 22, 23, 24, 34, 35, 36, 37, 45, 46, 57, 58, 59, 62]
    
    for answer in answers:
        question_id = answer['question_id']
        response = answer['response']  # 1-5
        
        # Handle reverse scoring
        if question_id in reverse_scored:
            response = 6 - response
        
        # Add to appropriate dimension(s)
        for dimension, questions in question_map.items():
            if question_id in questions:
                scores[dimension] += response
    
    return scores
```

### Normalization to 0-100 Scale

```python
def normalize_scores(raw_scores, question_counts):
    """
    Normalize raw scores to 0-100 scale
    """
    normalized = {}
    
    for dimension, raw_score in raw_scores.items():
        num_questions = question_counts[dimension]
        min_possible = num_questions * 1
        max_possible = num_questions * 5
        
        # Normalize to 0-100
        normalized[dimension] = (
            (raw_score - min_possible) / (max_possible - min_possible)
        ) * 100
    
    return normalized
```

**Score Ranges:**
- **Self-Awareness:** 13 questions → 13-65 points → 0-100%
- **Other Awareness:** 11 questions → 11-55 points → 0-100%
- **Emotional Control:** 16 questions → 16-80 points → 0-100%
- **Empathy:** 9 questions → 9-45 points → 0-100%
- **Well-being:** 14 questions → 14-70 points → 0-100%

### Overall EQ Score

```python
def calculate_overall_eq(normalized_scores):
    """
    Calculate overall EQ score as average of five dimensions
    """
    return sum(normalized_scores.values()) / len(normalized_scores)
```

---

## 8. EQ Superpowers (Result Archetypes)

Based on score patterns, users are assigned an "EQ Superpower" archetype:

### The Poet
**Profile:** High Self-Awareness, High Empathy  
**Description:** Deeply in tune with emotional experiences and has a rich inner life. Excellent at understanding and expressing feelings.  
**Strengths:** Emotional depth, self-reflection, empathy  
**Growth Areas:** May need to work on emotional control and social confidence

### The Empath
**Profile:** High Other Awareness, High Empathy  
**Description:** Exceptional at reading and relating to others' emotions. Highly sensitive to people's feelings and needs.  
**Strengths:** Understanding others, compassion, sensitivity  
**Growth Areas:** May need boundaries, can be overwhelmed by others' emotions

### The Navigator
**Profile:** High Emotional Control, High Self-Awareness  
**Description:** Excellent at managing emotions and staying calm under pressure. Self-aware and in control.  
**Strengths:** Emotional regulation, resilience, decision-making  
**Growth Areas:** May need to work on empathy and social warmth

### The Connector
**Profile:** High Well-being, High Other Awareness  
**Description:** Naturally social and charismatic. Brings positive energy to interactions and reads people well.  
**Strengths:** Social skills, positive attitude, relationship building  
**Growth Areas:** May need to work on emotional depth and self-reflection

### The Diplomat
**Profile:** Balanced across all dimensions  
**Description:** Well-rounded emotional intelligence with no major weaknesses. Can adapt to various situations.  
**Strengths:** Versatility, balance, adaptability  
**Growth Areas:** May want to develop specific areas of excellence

### The Stoic
**Profile:** High Emotional Control, Lower Empathy  
**Description:** Calm and rational, excellent at staying composed. May be less affected by emotions.  
**Strengths:** Composure, logic, independence  
**Growth Areas:** Developing empathy and emotional connection

### The Observer
**Profile:** High Other Awareness, Lower Self-Awareness  
**Description:** Great at reading others but less in tune with own emotions. Focuses outward rather than inward.  
**Strengths:** Social perception, objectivity  
**Growth Areas:** Self-reflection and emotional vocabulary

### The Spark
**Profile:** High Well-being, Lower Emotional Control  
**Description:** Enthusiastic and positive but emotions can be overwhelming. Lives life fully.  
**Strengths:** Enthusiasm, positivity, spontaneity  
**Growth Areas:** Emotional regulation and self-management

---

## 9. Result Structure

### Complete Result Object

```json
{
  "test_id": "emotional-intelligence-eq",
  "user_id": "user_uuid",
  "completed_at": "2024-01-15T14:30:00Z",
  "duration_seconds": 540,
  
  "raw_scores": {
    "self_awareness": 52,
    "other_awareness": 41,
    "emotional_control": 58,
    "empathy": 35,
    "wellbeing": 48
  },
  
  "normalized_scores": {
    "self_awareness": 75.0,
    "other_awareness": 68.2,
    "emotional_control": 65.6,
    "empathy": 72.2,
    "wellbeing": 60.7
  },
  
  "overall_eq": 68.3,
  
  "eq_superpower": {
    "archetype": "The Poet",
    "title": "I'm deeply in tune with my emotional experiences and have a rich inner life",
    "description": "You have exceptional self-awareness and empathy. You understand your own emotions deeply and can relate strongly to others' feelings. Your rich emotional vocabulary and introspective nature make you excellent at expressing and processing emotions."
  },
  
  "percentile_ranks": {
    "self_awareness": 82,
    "other_awareness": 71,
    "emotional_control": 65,
    "empathy": 78,
    "wellbeing": 58,
    "overall_eq": 72
  },
  
  "interpretation": {
    "overview": {
      "summary": "Your emotional intelligence score of 68.3 places you in the upper range. You have particular strengths in self-awareness and empathy, with opportunities for growth in emotional control and well-being.",
      "strengths": [
        "Exceptional self-awareness - you're highly in tune with your emotions",
        "Strong empathy - you care deeply about others' feelings",
        "Good other awareness - you read people well"
      ],
      "growth_areas": [
        "Emotional control - practice managing intense emotions",
        "Well-being - build social confidence and positivity"
      ]
    },
    
    "dimension_insights": [
      {
        "dimension": "self_awareness",
        "score": 75.0,
        "percentile": 82,
        "level": "high",
        "description": "You're highly in tune with your emotions and have excellent self-awareness. You can identify your feelings easily and articulate them with specific words. You're reflective about your emotional experiences.",
        "strengths": [
          "Recognize emotions immediately",
          "Rich emotional vocabulary",
          "Track moods throughout the day"
        ],
        "tips": [
          "Use your self-awareness to help others develop theirs",
          "Journal about emotional patterns you notice",
          "Continue developing your emotional vocabulary"
        ]
      },
      {
        "dimension": "other_awareness",
        "score": 68.2,
        "percentile": 71,
        "level": "moderately_high",
        "description": "You're good at reading nonverbal cues and understanding how others are feeling. You pick up on body language and facial expressions well.",
        "strengths": [
          "Read body language accurately",
          "Understand unstated emotions",
          "Pick up on subtle cues"
        ],
        "tips": [
          "Practice predicting how people will react",
          "Watch faces in different emotional contexts",
          "Ask for feedback on your perceptions"
        ]
      },
      {
        "dimension": "emotional_control",
        "score": 65.6,
        "percentile": 65,
        "level": "moderate",
        "description": "You have decent emotional control but sometimes get caught up in intense emotions. You're working on moving past negative moods quickly.",
        "strengths": [
          "Generally make logical decisions",
          "Can calm yourself when needed",
          "Don't always let emotions control behavior"
        ],
        "tips": [
          "Practice deep breathing when upset",
          "Develop a 'pause' habit before reacting",
          "Use physical exercise to process emotions",
          "Create emotional regulation strategies"
        ]
      },
      {
        "dimension": "empathy",
        "score": 72.2,
        "percentile": 78,
        "level": "high",
        "description": "You're very empathetic and care deeply about others' suffering. You're moved by stories of pain and feel compelled to help.",
        "strengths": [
          "Deeply care about people",
          "Moved by others' suffering",
          "Feel compelled to help"
        ],
        "tips": [
          "Set boundaries to avoid emotional exhaustion",
          "Channel empathy into structured helping (volunteering)",
          "Practice self-compassion too"
        ]
      },
      {
        "dimension": "wellbeing",
        "score": 60.7,
        "percentile": 58,
        "level": "moderate",
        "description": "You have moderate social confidence and enjoy some social interaction, though it may not always be your preference.",
        "strengths": [
          "Can be charming when comfortable",
          "Enjoy meaningful connections",
          "Bring positivity when engaged"
        ],
        "tips": [
          "Practice small talk in low-stakes situations",
          "Join social groups around your interests",
          "Work on projecting confidence even when nervous",
          "Celebrate small social wins"
        ]
      }
    ],
    
    "career_guidance": {
      "best_fit": [
        "Counseling/Therapy",
        "Creative Writing",
        "Psychology",
        "Human Resources",
        "Social Work",
        "Teaching",
        "Life Coaching"
      ],
      "work_style": "You thrive in roles where emotional understanding is valued. You work best when you can help others, understand complex emotional dynamics, and express yourself thoughtfully.",
      "team_contribution": "The empathetic listener who helps team members process emotions and understand different perspectives"
    }
  }
}
```

---

## 10. User-Facing Results

### Result Page Layout

**Section I: Your EQ Superpower**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  The Poet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm deeply in tune with my emotional 
experiences and have a rich inner life.

You have exceptional self-awareness and 
empathy. You understand your own emotions 
deeply and can relate strongly to others' 
feelings. Your rich emotional vocabulary 
and introspective nature make you excellent 
at expressing and processing emotions.
```

**Section II: Your Overall EQ Score**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Your Emotional Intelligence
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall EQ: 68.3/100
Percentile: 72nd (Higher than 72% of people)

Your emotional intelligence is in the 
upper range. You have particular strengths 
in self-awareness and empathy, with 
opportunities for growth in emotional 
control and well-being.
```

**Section III: The Five Elements**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Your EQ Breakdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELF-AWARENESS          [███████████████░░░░] 75% ⭐
The ability to understand how you feel and why

You're highly in tune with your emotions and 
have excellent self-awareness. You recognize 
your feelings immediately and can articulate 
them with specific words.

───────────────────────────────────

OTHER AWARENESS         [█████████████░░░░░░] 68%
The ability to understand the feelings of others

You're good at reading nonverbal cues and 
understanding how others are feeling. You pick 
up on body language and facial expressions well.

───────────────────────────────────

EMOTIONAL CONTROL       [█████████████░░░░░░] 66%
The ability to control your emotions and behaviors

You have decent emotional control but sometimes 
get caught up in intense emotions. You're working 
on moving past negative moods quickly.

───────────────────────────────────

EMPATHY                 [██████████████░░░░░] 72% ⭐
The ability to understand and relate to others' feelings

You're very empathetic and care deeply about 
others' suffering. You're moved by stories of 
pain and feel compelled to help.

───────────────────────────────────

WELLBEING               [████████████░░░░░░░] 61%
The ability to care for your physical and emotional health

You have moderate social confidence and enjoy 
some social interaction, though it may not always 
be your preference.
```

**Section IV: Growth Recommendations**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Developing Your EQ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 EMOTIONAL CONTROL
Current: 66% → Target: 75%

Practice deep breathing when upset
• Take 3 deep breaths before responding
• Count to 10 when emotions are high

Develop a 'pause' habit before reacting
• Notice the urge to react
• Choose your response consciously

Use physical exercise to process emotions
• Go for a walk when overwhelmed
• Try yoga or meditation

───────────────────────────────────

🌟 WELLBEING
Current: 61% → Target: 70%

Practice small talk in low-stakes situations
• Chat with cashiers or servers
• Comment on the weather with strangers

Join social groups around your interests
• Book clubs, hiking groups, etc.
• Start with online communities

Work on projecting confidence
• Power pose before social events
• Smile and make eye contact
```

---

## 11. Database Schema

### eq_questions

```sql
CREATE TABLE eq_questions (
    id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    dimension VARCHAR(30) NOT NULL,  -- 'self_awareness', 'other_awareness', etc.
    reverse_scored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_eq_questions_dimension ON eq_questions(dimension);
```

### eq_results

```sql
CREATE TABLE eq_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    test_session_id UUID,
    
    -- Raw scores
    raw_scores JSONB NOT NULL,
    
    -- Normalized scores (0-100)
    self_awareness_score DECIMAL(5,2) NOT NULL,
    other_awareness_score DECIMAL(5,2) NOT NULL,
    emotional_control_score DECIMAL(5,2) NOT NULL,
    empathy_score DECIMAL(5,2) NOT NULL,
    wellbeing_score DECIMAL(5,2) NOT NULL,
    
    -- Overall EQ
    overall_eq_score DECIMAL(5,2) NOT NULL,
    
    -- Percentile ranks
    percentile_ranks JSONB NOT NULL,
    
    -- EQ Superpower
    eq_superpower VARCHAR(50) NOT NULL,
    superpower_description TEXT,
    
    completed_at TIMESTAMP DEFAULT NOW(),
    duration_seconds INTEGER
);

-- Indexes
CREATE INDEX idx_eq_results_user ON eq_results(user_id);
CREATE INDEX idx_eq_results_overall ON eq_results(overall_eq_score);
CREATE INDEX idx_eq_results_superpower ON eq_results(eq_superpower);
```

### eq_answers

```sql
CREATE TABLE eq_answers (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES eq_results(id),
    question_number INTEGER NOT NULL,
    response INTEGER NOT NULL,  -- 1-5
    answered_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_eq_answers_result ON eq_answers(result_id);
```

### eq_population_data

```sql
CREATE TABLE eq_population_data (
    id SERIAL PRIMARY KEY,
    dimension VARCHAR(30) NOT NULL,
    score_value DECIMAL(5,2) NOT NULL,
    percentile INTEGER NOT NULL,
    sample_size INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- For calculating percentile ranks
CREATE INDEX idx_eq_population_dimension ON eq_population_data(dimension, score_value);
```

---

## 12. API Endpoints

### GET /api/tests/eq/questions
Returns all 63 questions

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "I am very good at identifying the emotions I am feeling",
      "scale": {
        "min": 1,
        "max": 5,
        "labels": {
          "1": "Inaccurate",
          "2": "Mostly Inaccurate",
          "3": "Neutral",
          "4": "Mostly Accurate",
          "5": "Accurate"
        }
      }
    }
  ]
}
```

### POST /api/tests/eq/submit
Accepts answers and returns calculated result

**Request:**
```json
{
  "user_id": "uuid",
  "answers": [
    {"question_number": 1, "response": 5},
    {"question_number": 2, "response": 4},
    ...
  ],
  "duration_seconds": 540
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "overall_eq": 68.3,
    "eq_superpower": "The Poet",
    "dimension_scores": {
      "self_awareness": 75.0,
      "other_awareness": 68.2,
      "emotional_control": 65.6,
      "empathy": 72.2,
      "wellbeing": 60.7
    },
    "percentile_ranks": {...},
    "interpretation": {...}
  }
}
```

### GET /api/users/{user_id}/tests/eq/result
Returns user's saved result

---

## 13. Implementation Notes

### Question Presentation
- Randomize question order
- Show progress (X/63)
- Allow review before submit
- Clear scale labels

### Scoring
- Handle reverse-scored questions carefully
- Normalize across different question counts
- Calculate percentiles from population data
- Assign EQ Superpower based on profile

### Validation
- All 63 questions must be answered
- Responses must be 1-5
- Prevent submission until complete

### UI/UX
- Clear instructions emphasizing honesty
- Visual progress indicator
- Ability to go back and change answers
- Estimated time remaining
- Mobile-friendly scale interaction

### Percentile Calculation
```python
def calculate_percentile(score, dimension, population_data):
    """
    Calculate percentile rank for a score in a dimension
    """
    dimension_data = population_data[dimension]
    count_below = sum(1 for d in dimension_data if d['score'] < score)
    total_count = len(dimension_data)
    
    percentile = (count_below / total_count) * 100
    return round(percentile)
```

### Performance
- Cache questions locally
- Debounce auto-save
- Lazy load result visualizations
- Optimize percentile lookups

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Clear focus indicators
- ARIA labels for scales

---

## 14. Testing Checklist

- [ ] All 63 questions load correctly
- [ ] Scale displays properly
- [ ] Progress tracking accurate
- [ ] Reverse scoring works correctly
- [ ] Dimension scores calculate accurately
- [ ] Overall EQ score is correct
- [ ] Percentiles calculate correctly
- [ ] EQ Superpower assigns correctly
- [ ] All archetypes tested
- [ ] Results display properly
- [ ] Save/resume works
- [ ] Mobile responsive
- [ ] Accessibility compliant

---

## Technical Summary

**Database Requirements:**
- 4 tables (questions, results, answers, population_data)
- JSONB support for flexible data
- UUID support for user references
- Population data for percentile calculation

**Backend Processing:**
- Question randomization
- Reverse scoring logic
- Dimension-specific score calculation
- Normalization to 0-100 scale
- Overall EQ calculation
- Percentile rank determination
- EQ Superpower assignment
- Comprehensive result object generation

**Frontend Requirements:**
- 63-question form with progress tracking
- 5-point Likert scale UI
- Save/resume functionality
- Results visualization (radar chart, bars)
- Responsive design
- Accessibility compliance

**Integration:**
- Weight: 20% in overall career analysis
- Combines with other personality tests
- Influences profession recommendations
- Provides insights on interpersonal skills
- Highlights relationship strengths/challenges