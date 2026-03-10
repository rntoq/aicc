# Big Five (OCEAN) Personality Test - Technical Documentation

## 1. Test Overview

**Test Name:** Big Five Personality Test (OCEAN Model)  
**Test Code:** `big-five-ocean`  
**Test ID:** `test_005`  
**Purpose:** Comprehensive personality assessment based on the Five-Factor Model  
**Measures:** Five fundamental personality dimensions (OCEAN)  
**Questions:** 74 statements (44 sentence-format + 20 single-word + 10 creativity/future/kindness items)  
**Duration:** 8-12 minutes  
**Response Type:** 5-point Likert scale (Inaccurate to Accurate)  
**Weight in Analysis:** 25% (core personality assessment)

---

## 2. Test Description
What are the Big Five Personality Traits?
The Big Five is the most widely accepted theory in personality psychology, and is used as the basis of the vast majority of scientific research on personality. The Big Five describes personality traits along five common dimensions: Openness, Conscientiousness, Extraversion, Agreeableness and Neuroticism. In the Big Five system, we each have varying levels of these key personality factors that impact our thoughts, decisions and behavior.

Openness describes a person's tendency to think abstractly. Those who are high in Openness tend to be creative, adventurous and intellectual. They enjoy playing with ideas and discovering novel experiences. Those who are low in Openness tend to be practical, traditional and focused on the concrete. They tend to avoid the unknown and follow traditional ways.

Conscientiousness describes a person's level of goal orientation and persistence. Those who are high in Conscientiousness are organized and determined, and are able to forgo immediate gratification for the sake of long-term achievement. Those who are low in this trait are impulsive and easily sidetracked.

Extraversion describes a person’s inclination to seek stimulation from the outside world, especially in the form of attention from other people. Extraverts engage actively with others to earn friendship, admiration, power, status, excitement and romance. Introverts, on the other hand, conserve their energy and do not work as hard to earn these social rewards.

Agreeableness describes the extent to which a person prioritizes the needs of others over their own needs. People who are high in Agreeableness experience a great deal of empathy and tend to get pleasure out of serving and taking care of others. People who are low in Agreeableness tend to experience less empathy and put their own concerns ahead of others.

Neuroticism describes a person's tendency to respond to stressors with negative emotions, including fear, sadness, anxiety, guilt, and shame. This trait can be thought of as an alarm system. People experience negative emotions as a sign that something is wrong in the world. Fear is a response to danger, guilt a response to having done something wrong. However, not everyone has the same reaction to a given situation. High Neuroticism scorers are more likely to react to a situation with strong negative emotions. Low Neuroticism scorers are more likely to brush off their misfortune and move on.

The Big Five is sometimes called the OCEAN model of personality, which is an acronym for the five dimensions of personality described within the theory.

What is the Big Five Personality Test?
The Big Five personality test measures your individual levels of five key traits which have been determined by psychologists to compose the fundamental makeup of your personality. When you take a Big Five test, you will receive scores for five dimensions of personality:

Openness - How open you are to new ideas and experiences
Conscientiousness - How goal-directed, persistent, and organized you are
Extraversion - How much you are energized by the outside world
Agreeableness - How much you puts others' interests and needs ahead of your own
Neuroticism - How sensitive you are to stress and negative emotional triggers
Each of the Big Five personality traits is considered to drive a significant aspect of cognition (how we think) and behavior (how we act). Each trait is completely distinct and independent of the other four traits; for instance, a highly Extraverted person is no more or less likely to be highly Conscientious as well.

Each of the Big Five personality traits is measured along a spectrum, so that one can be high, medium, or low in that particular trait. This makes the Big Five model distinct from many pop psychology systems that classify people in terms of personality "types." In a Big Five test, rather than being sorted into types, people are described in terms of how they compare with the average across each of the five personality traits.

Big Five Personality Test FAQ
Q. What is the Big Five personality test based on?
A. The Big Five personality test is a comprehensive personality inventory based on decades of psychological research. Psychologists and academic researchers investigating the fundamental traits of personality found repeatedly that people's personality differences naturally sort into five broad dimensions, referred to as the Big Five.

Today, the consensus among the scientific community is that human personality is most accurately described in terms of these Big Five personality traits. The Big Five model of personality is widely considered to be the most scientifically valid way to describe personality differences and is the basis of most current personality research.

## 3. Test Format

**Structure:**
- 74 total statements across 3 question formats
- Distributed across 5 OCEAN dimensions
- Consistent 5-point rating scale throughout
- Mixed positive and negative phrasing (reverse-scored items)

**Question Formats:**

1. **Sentence Statements** (44 items)
   - Full statements describing behaviors or attitudes
   - Example: "I accept people the way they are"
   - Scale: Inaccurate → Accurate

2. **Single-Word Adjectives** (20 items)  
   - One-word personality descriptors
   - Example: "Original", "Systematic", "Shy"
   - Scale: Inaccurate → Accurate

3. **Extended Statements** (10 items)
   - Longer, more specific statements
   - Focus on creativity, future orientation, kindness themes
   - Example: "I often come up with a new way of doing things"
   - Scale: Inaccurate → Accurate

**Rating Scale:**
```
1 = Inaccurate (Does not describe me)
2 = Somewhat inaccurate
3 = Neutral (Neither accurate nor inaccurate)
4 = Somewhat accurate
5 = Accurate (Describes me well)
```

**Dimension Distribution:**
- Openness (O) - ~18 items
- Conscientiousness (C) - ~13 items
- Extraversion (E) - ~14 items
- Agreeableness (A) - ~14 items
- Neuroticism (N) - ~15 items

**Special Features:**
- Reverse-scored items (negative phrasing)
- Balance of positive and negative statements
- Mix of abstract and concrete descriptions
- Three distinct question formats for engagement

---

## 4. How the Test Works

**Step-by-Step Flow:**

1. **Introduction Screen**
   - Display Big Five theory overview
   - Show test instructions: "Rate how well each statement describes you"
   - Emphasize: "Base your ratings on how you really are, not how you would like to be"
   - Explain 5-point scale (Inaccurate → Accurate)
   - Start button

2. **Part 1: Sentence Statements (44 questions)**
   - Display statement
   - Show 5-point scale with labels
   - User selects rating (1-5)
   - Answer recorded
   - Progress indicator updates
   - Next question loads

3. **Part 2: Single-Word Format (20 questions)**
   - Instruction: "Rate each word according to how well it describes you"
   - Display one-word descriptor
   - Same 5-point scale
   - Continue through all words

4. **Part 3: Extended Statements (10 questions)**
   - Return to full sentence format
   - More specific, detailed statements
   - Same rating process

5. **Completion**
   - Calculate raw scores for each dimension
   - Apply reverse scoring where applicable
   - Normalize scores to percentile scale
   - Generate personality profile
   - Show comprehensive results page

**Navigation:**
- Can go back to previous questions
- Can change answers before final submission
- Progress bar shows completion percentage
- Optional: Save and resume later functionality

---

## 5. Question Structure

### Standard Question Format

```json
{
  "id": "bigfive_o_01",
  "question_number": 1,
  "text": {
    "ru": "Я принимаю людей такими, какие они есть",
    "kk": "Мен адамдарды олардың қалпында қабылдаймын",
    "en": "I accept people the way they are"
  },
  "dimension": "A",
  "reverse_scored": false,
  "format": "sentence",
  "weight": 1,
  "scale": {
    "min": 1,
    "max": 5,
    "labels": {
      "1": {
        "ru": "Неточно",
        "kk": "Дәл емес",
        "en": "Inaccurate"
      },
      "2": {
        "ru": "Скорее неточно",
        "kk": "Дәлірек емес",
        "en": "Somewhat inaccurate"
      },
      "3": {
        "ru": "Нейтрально",
        "kk": "Бейтарап",
        "en": "Neutral"
      },
      "4": {
        "ru": "Скорее точно",
        "kk": "Дәлірек",
        "en": "Somewhat accurate"
      },
      "5": {
        "ru": "Точно",
        "kk": "Дәл",
        "en": "Accurate"
      }
    }
  }
}
```

### Single-Word Question Format

```json
{
  "id": "bigfive_o_27",
  "question_number": 27,
  "text": {
    "ru": "Оригинальный",
    "kk": "Түпнұсқалық",
    "en": "Original"
  },
  "dimension": "O",
  "reverse_scored": false,
  "format": "word",
  "weight": 1,
  "scale": {
    "min": 1,
    "max": 5,
    "labels": {
      "1": {"ru": "Неточно", "kk": "Дәл емес", "en": "Inaccurate"},
      "2": {"ru": "Скорее неточно", "kk": "Дәлірек емес", "en": "Somewhat inaccurate"},
      "3": {"ru": "Нейтрально", "kk": "Бейтарап", "en": "Neutral"},
      "4": {"ru": "Скорее точно", "kk": "Дәлірек", "en": "Somewhat accurate"},
      "5": {"ru": "Точно", "kk": "Дәл", "en": "Accurate"}
    }
  }
}
```

**Field Definitions:**
- `id`: Unique question identifier (format: bigfive_[dimension]_[number])
- `question_number`: Display order (1-74)
- `text`: Question/statement in 3 languages
- `dimension`: OCEAN dimension (O, C, E, A, N)
- `reverse_scored`: Boolean - if true, score is inverted (6 - raw_score)
- `format`: "sentence", "word", or "extended"
- `weight`: Point value (always 1)
- `scale`: Rating scale configuration

---

## 6. Questions

### PART 1: Sentence Statements (Questions 1-44)

**Instructions:** "Rate each statement according to how well it describes you. Base your ratings on how you really are, not how you would like to be."

#### Agreeableness Items

1. **bigfive_a_01**: I accept people the way they are.
2. **bigfive_a_04**: I take care of other people before taking care of myself.
3. **bigfive_a_10**: I treat everyone with kindness and sympathy.
4. **bigfive_a_12**: I have a kind word for everyone.
5. **bigfive_a_15**: I start arguments just for the fun of it. *(REVERSE)*
6. **bigfive_a_22**: I stop what I am doing to help other people.
7. **bigfive_a_31**: I criticize other people. *(REVERSE)*
8. **bigfive_a_38**: I am not interested in abstract ideas.

#### Openness Items

9. **bigfive_o_02**: I believe in the importance of art.
10. **bigfive_o_06**: I have a vivid imagination.
11. **bigfive_o_21**: I do not like art. *(REVERSE)*
12. **bigfive_o_26**: I avoid philosophical discussions. *(REVERSE)*
13. **bigfive_o_30**: I am interested in the meaning of things.
14. **bigfive_o_34**: I am not interested in abstract ideas. *(REVERSE)*
15. **bigfive_o_40**: I enjoy hearing new ideas.

#### Neuroticism Items

16. **bigfive_n_03**: My moods change easily.
17. **bigfive_n_08**: I often feel blue.
18. **bigfive_n_14**: I often feel anxious about what could go wrong.
19. **bigfive_n_16**: I often worry that I am not good enough.
20. **bigfive_n_19**: There are many things that I do not like about myself.
21. **bigfive_n_20**: I seldom feel blue. *(REVERSE)*
22. **bigfive_n_24**: I am often troubled by negative thoughts.
23. **bigfive_n_25**: I feel comfortable with myself. *(REVERSE)*

#### Conscientiousness Items

24. **bigfive_c_05**: I am always prepared.
25. **bigfive_c_11**: I get chores done right away.
26. **bigfive_c_17**: I find it difficult to get to work. *(REVERSE)*
27. **bigfive_c_23**: I change my plans frequently. *(REVERSE)*
28. **bigfive_c_35**: I avoid taking on a lot of responsibility. *(REVERSE)*
29. **bigfive_c_39**: I always make good use of my time.
30. **bigfive_c_41**: I make plans and stick to them.

#### Extraversion Items

31. **bigfive_e_07**: I feel comfortable around people.
32. **bigfive_e_09**: I am the life of the party.
33. **bigfive_e_13**: I am skilled in handling social situations.
34. **bigfive_e_18**: I stay in the background. *(REVERSE)*
35. **bigfive_e_32**: I don't talk a lot. *(REVERSE)*
36. **bigfive_e_36**: I don't like to draw attention to myself. *(REVERSE)*
37. **bigfive_e_37**: I feel I am better than other people. *(REVERSE)*
38. **bigfive_e_38**: I make friends easily.
39. **bigfive_e_44**: I have a lot to say.
40. **bigfive_e_48**: I find ways to bring happiness to my friends and family.

### PART 2: Single-Word Descriptors (Questions 45-64)

**Instructions:** "Rate each word according to how well it describes you. Base your ratings on how you really are, not how you would like to be."

45. **bigfive_o_27**: Original
46. **bigfive_c_28**: Systematic
47. **bigfive_e_29**: Shy *(REVERSE)*
48. **bigfive_a_30**: Soft-Hearted
49. **bigfive_n_31**: Tense
50. **bigfive_o_32**: Inquisitive
51. **bigfive_c_33**: Forgetful *(REVERSE)*
52. **bigfive_e_34**: Reserved *(REVERSE)*
53. **bigfive_a_35**: Agreeable
54. **bigfive_n_36**: Nervous
55. **bigfive_o_37**: Creative
56. **bigfive_c_38**: Self-Disciplined
57. **bigfive_e_39**: Outgoing
58. **bigfive_a_40**: Charitable
59. **bigfive_n_41**: Moody
60. **bigfive_o_42**: Imaginative
61. **bigfive_c_43**: Organized
62. **bigfive_e_44**: Talkative
63. **bigfive_a_45**: Humble
64. **bigfive_n_46**: Pessimistic

### PART 3: Extended Statements (Questions 65-74)

**Creativity & Innovation (Openness)**

65. **bigfive_o_49**: I tend to come up with better alternatives to established procedures.
66. **bigfive_o_52**: I often come up with a new way of doing things.
67. **bigfive_o_55**: I am an innovative problem-solver.
68. **bigfive_o_58**: I have ideas that are original and different from what has been done before.
69. **bigfive_o_61**: When I have a problem, I come up with a new and unexpected way to solve it.

**Future Orientation (Conscientiousness)**

70. **bigfive_c_47**: I can clearly visualize what could happen in the future.
71. **bigfive_c_50**: I make plans for many years into the future.
72. **bigfive_c_53**: I am often looking ahead, anticipating future events.
73. **bigfive_c_56**: I have a good sense of what my future holds.
74. **bigfive_c_59**: I have trouble picturing where I will be in five years. *(REVERSE)*

---

## 7. Categories / Dimensions

### O - Openness to Experience

**Theme:** Intellectual curiosity, creativity, preference for novelty  
**Question Count:** 18 items  
**Characteristics:**
- High Openness:
  - Creative and imaginative
  - Adventurous and intellectually curious
  - Enjoy abstract thinking and new ideas
  - Appreciate art, beauty, and aesthetics
  - Open to unconventional perspectives
  
- Low Openness:
  - Practical and traditional
  - Prefer routine and familiar ways
  - Focused on concrete facts
  - Conventional in thinking
  - Skeptical of abstract concepts

**What it Predicts:**
- Career fit: Creative fields, research, academia
- Learning style: Exploratory, concept-driven
- Problem-solving: Innovative approaches
- Political orientation: More liberal/progressive

**Sample High-O Behaviors:**
- Enjoys philosophical discussions
- Seeks out new experiences
- Appreciates diverse art forms
- Questions established norms
- Thinks about "big picture" questions

---

### C - Conscientiousness

**Theme:** Organization, goal-directedness, self-discipline  
**Question Count:** 13 items  
**Characteristics:**
- High Conscientiousness:
  - Organized and detail-oriented
  - Reliable and dependable
  - Plans ahead and follows through
  - Strong work ethic
  - Self-disciplined and persistent
  
- Low Conscientiousness:
  - Spontaneous and flexible
  - More impulsive
  - Less focused on organization
  - Easily sidetracked
  - Prefers adaptability over planning

**What it Predicts:**
- Academic performance (strongest predictor)
- Job performance across industries
- Health behaviors (exercise, diet)
- Financial responsibility
- Longevity (linked to health behaviors)

**Sample High-C Behaviors:**
- Maintains to-do lists
- Arrives on time
- Completes tasks before deadlines
- Keeps workspace organized
- Sets and achieves long-term goals

---

### E - Extraversion

**Theme:** Sociability, energy, positive emotionality  
**Question Count:** 14 items  
**Characteristics:**
- High Extraversion (Extraverts):
  - Energized by social interaction
  - Talkative and outgoing
  - Assertive and enthusiastic
  - Seek stimulation and excitement
  - Draw energy from others
  
- Low Extraversion (Introverts):
  - Prefer solitude or small groups
  - Reserved and quiet
  - Independent and introspective
  - Prefer low-stimulation environments
  - Recharge through alone time

**What it Predicts:**
- Social network size
- Career fit: Sales, management, teaching
- Leadership emergence
- Happiness baseline (extraverts slightly happier on average)
- Preferred activities (social vs. solitary)

**Sample High-E Behaviors:**
- Starts conversations with strangers
- Enjoys being center of attention
- Feels energized after social events
- Seeks out social gatherings
- Speaks up in groups

**Important Note:** Introversion is not shyness or social anxiety (which relates to Neuroticism)

---

### A - Agreeableness

**Theme:** Compassion, cooperation, trust in others  
**Question Count:** 14 items  
**Characteristics:**
- High Agreeableness:
  - Compassionate and empathetic
  - Cooperative and trusting
  - Values harmony
  - Helpful and generous
  - Avoids conflict
  
- Low Agreeableness:
  - Competitive and challenging
  - Skeptical and questioning
  - Prioritizes own needs
  - Direct and frank
  - Values truth over harmony

**What it Predicts:**
- Relationship satisfaction
- Helping behaviors
- Career fit: Healthcare, social work, counseling
- Conflict resolution style
- Volunteerism and altruism

**Sample High-A Behaviors:**
- Goes out of way to help others
- Gives people benefit of the doubt
- Compromises to maintain peace
- Shows empathy and concern
- Puts others' needs first

---

### N - Neuroticism (Emotional Stability)

**Theme:** Emotional reactivity, stress sensitivity  
**Question Count:** 15 items  
**Characteristics:**
- High Neuroticism:
  - More reactive to stress
  - Experiences negative emotions intensely
  - Prone to worry and anxiety
  - Self-conscious
  - Mood instability
  
- Low Neuroticism (High Emotional Stability):
  - Calm under pressure
  - Emotionally resilient
  - Relaxed and secure
  - Even-tempered
  - Recovers quickly from setbacks

**What it Predicts:**
- Mental health risk (anxiety, depression)
- Physical health (stress-related illness)
- Job satisfaction and burnout
- Relationship stability
- Coping strategies

**Sample High-N Behaviors:**
- Worries about potential problems
- Mood swings
- Takes criticism personally
- Difficulty relaxing
- Dwells on negative experiences

**Important Note:** Neuroticism is a normal personality variation, not a disorder. High N individuals often benefit from stress management and mindfulness practices.

---

## 8. Scoring System

### Raw Score Calculation

**For Each Dimension:**

1. **Sum all item responses** for that dimension
2. **Apply reverse scoring** where indicated:
   - If `reverse_scored: true`, convert score: `6 - raw_response`
   - Example: If user selected "5" on reverse item → score becomes "1"
3. **Calculate dimension total**

**Example - Openness Calculation:**
```
Items: 18 questions
User responses: [5, 4, 2(R), 3, 5, 1(R), 4, 5, 3, 4, 5, 5, 4, 3, 5, 4, 3, 5]

Step 1: Apply reverse scoring
- Question 3 (reverse): 6 - 2 = 4
- Question 6 (reverse): 6 - 1 = 5
Adjusted: [5, 4, 4, 3, 5, 5, 4, 5, 3, 4, 5, 5, 4, 3, 5, 4, 3, 5]

Step 2: Sum all items
Raw Openness Score: 76
```

### Reverse-Scored Items by Dimension

**Openness:**
- "I do not like art"
- "I avoid philosophical discussions"
- "I am not interested in abstract ideas"
- "I do not try to predict what may happen in the future" (extended)

**Conscientiousness:**
- "I find it difficult to get to work"
- "I change my plans frequently"
- "I avoid taking on a lot of responsibility"
- "Forgetful" (word)
- "I have trouble picturing where I will be in five years" (extended)

**Extraversion:**
- "I stay in the background"
- "I don't talk a lot"
- "I don't like to draw attention to myself"
- "Shy" (word)
- "Reserved" (word)

**Agreeableness:**
- "I start arguments just for the fun of it"
- "I criticize other people"
- "I feel I am better than other people"

**Neuroticism:**
- "I seldom feel blue"
- "I feel comfortable with myself"
- "I am a serious person" (extended)

### Score Ranges

**Per Dimension:**
- Minimum possible: Number of items × 1
- Maximum possible: Number of items × 5
- Example for Openness (18 items): 18 - 90

**Total Test:**
- All 74 items: 74 - 370 points total
- Not used as single score (each dimension analyzed separately)

---

## 9. Result Calculation Logic

### Step-by-Step Calculation

```python
def calculate_big_five_results(answers):
    """
    Calculate Big Five personality scores from user answers
    
    Args:
        answers: List of {question_id, rating} objects
    
    Returns:
        Dictionary with raw scores, percentiles, and profile
    """
    
    # Step 1: Initialize dimension scores
    dimensions = {
        'O': {'items': [], 'reverse_items': []},
        'C': {'items': [], 'reverse_items': []},
        'E': {'items': [], 'reverse_items': []},
        'A': {'items': [], 'reverse_items': []},
        'N': {'items': [], 'reverse_items': []}
    }
    
    # Step 2: Categorize answers by dimension
    for answer in answers:
        question = get_question_by_id(answer.question_id)
        dimension = question.dimension
        rating = answer.rating
        
        if question.reverse_scored:
            # Reverse score: 6 - rating
            dimensions[dimension]['reverse_items'].append(6 - rating)
        else:
            dimensions[dimension]['items'].append(rating)
    
    # Step 3: Calculate raw scores
    raw_scores = {}
    for dim in dimensions:
        all_items = (dimensions[dim]['items'] + 
                    dimensions[dim]['reverse_items'])
        raw_scores[dim] = sum(all_items)
    
    # Step 4: Calculate percentiles
    percentiles = {}
    for dim in raw_scores:
        percentiles[dim] = calculate_percentile(
            raw_scores[dim], 
            dim,
            population_data
        )
    
    # Step 5: Classify levels (Low/Average/High)
    classifications = {}
    for dim in percentiles:
        if percentiles[dim] < 30:
            classifications[dim] = 'Low'
        elif percentiles[dim] < 70:
            classifications[dim] = 'Average'
        else:
            classifications[dim] = 'High'
    
    # Step 6: Generate interpretation
    profile = generate_profile(
        raw_scores,
        percentiles,
        classifications
    )
    
    return {
        'raw_scores': raw_scores,
        'percentiles': percentiles,
        'classifications': classifications,
        'profile': profile
    }

def calculate_percentile(score, dimension, population_data):
    """
    Calculate percentile rank for a score
    
    Args:
        score: Raw score for dimension
        dimension: O, C, E, A, or N
        population_data: Distribution data from database
    
    Returns:
        Percentile (0-100)
    """
    distribution = population_data[dimension]
    below_score = sum(d.count for d in distribution if d.score < score)
    total = sum(d.count for d in distribution)
    
    percentile = (below_score / total) * 100
    return round(percentile, 1)
```

### Percentile Interpretation

**Percentile Bands:**
- **0-15th**: Very Low
- **16-30th**: Low
- **31-45th**: Below Average
- **46-55th**: Average
- **56-70th**: Above Average
- **71-85th**: High
- **86-100th**: Very High

### Profile Generation

Based on percentile scores, generate:
1. **Overall Profile Summary**: Describes dominant traits
2. **Dimension Descriptions**: Detailed explanation for each of 5 traits
3. **Behavioral Tendencies**: What to expect in different situations
4. **Career Implications**: How personality affects work style
5. **Development Suggestions**: Areas for growth (if applicable)

---

## 10. Possible Results

### Result Categories

Unlike Holland Code (discrete types), Big Five results are **continuous** across five independent dimensions. Each person receives a unique profile.

**Profile Structure:**
- 5 dimension scores (each scored independently)
- Each dimension: Very Low → Very High continuum
- 3,125 possible basic combinations (5^5)
- Infinite nuanced variations

### Common Profile Patterns

While every profile is unique, some patterns are more common:

#### 1. The Achiever
**Profile:** High C, High E, Low N  
**Characteristics:**
- Organized and driven
- Socially confident
- Emotionally stable
- Goal-oriented leader

**Careers:** CEO, Project Manager, Entrepreneur

---

#### 2. The Creative Thinker
**Profile:** High O, Low C, High N  
**Characteristics:**
- Imaginative and innovative
- Spontaneous and flexible
- Emotionally sensitive
- Abstract thinker

**Careers:** Artist, Writer, Designer, Researcher

---

#### 3. The Caregiver
**Profile:** High A, High E, Low N  
**Characteristics:**
- Compassionate and helpful
- Socially engaged
- Emotionally stable
- People-oriented

**Careers:** Nurse, Teacher, Counselor, Social Worker

---

#### 4. The Analyst
**Profile:** High O, High C, Low E  
**Characteristics:**
- Intellectually curious
- Detail-oriented
- Independent worker
- Systematic thinker

**Careers:** Scientist, Programmer, Accountant, Engineer

---

#### 5. The Peacemaker
**Profile:** High A, Low N, Average E  
**Characteristics:**
- Diplomatic and cooperative
- Calm and stable
- Balanced social needs
- Conflict-averse

**Careers:** HR Professional, Mediator, Customer Service

---

#### 6. The Innovator
**Profile:** High O, Low A, High E  
**Characteristics:**
- Creative and unconventional
- Competitive and challenging
- Socially bold
- Pushes boundaries

**Careers:** Entrepreneur, Consultant, Product Manager

---

#### 7. The Executor
**Profile:** High C, Low O, Low E  
**Characteristics:**
- Highly organized
- Follows established procedures
- Independent and focused
- Reliable and consistent

**Careers:** Operations Manager, Quality Assurance, Administrator

---

#### 8. The Free Spirit
**Profile:** High O, Low C, High E  
**Characteristics:**
- Spontaneous and creative
- Socially adventurous
- Flexible and adaptable
- Embraces uncertainty

**Careers:** Performer, Travel Guide, Event Planner

---

### Percentile Descriptions

For each dimension, provide interpretation based on percentile:

**Example - Openness Interpretations:**

**0-15th (Very Low):**
- Practical and down-to-earth
- Prefers traditional approaches
- Values concrete results
- Skeptical of abstract ideas
- Comfortable with routine

**16-30th (Low):**
- Conventional in thinking
- Prefers familiar methods
- Values practicality
- Less interest in artistic pursuits
- Focused on immediate concerns

**31-55th (Average):**
- Balance of practical and creative thinking
- Open to new ideas when relevant
- Moderate artistic appreciation
- Flexible approach to problems
- Comfortable with both routine and novelty

**56-70th (Above Average):**
- Intellectually curious
- Enjoys learning new concepts
- Appreciates creativity
- Open to different perspectives
- Comfortable with complexity

**71-100th (High/Very High):**
- Highly creative and imaginative
- Seeks intellectual stimulation
- Strong aesthetic appreciation
- Embraces unconventional ideas
- Thrives on novelty and complexity

---

## 11. Result Structure

### Complete Result Object

```json
{
  "user_id": "uuid",
  "test_id": "test_005",
  "test_code": "big-five-ocean",
  "completed_at": "2025-03-10T14:30:00Z",
  "duration_seconds": 580,
  
  "scores": {
    "O": {
      "raw_score": 76,
      "max_possible": 90,
      "percentile": 78,
      "classification": "High",
      "band": "71-85th",
      "interpretation": {
        "ru": "Вы обладаете высокой открытостью к опыту...",
        "kk": "Сізде тәжірибеге ашықтық жоғары...",
        "en": "You have high Openness to Experience..."
      }
    },
    "C": {
      "raw_score": 52,
      "max_possible": 65,
      "percentile": 62,
      "classification": "Above Average",
      "band": "56-70th",
      "interpretation": {...}
    },
    "E": {
      "raw_score": 45,
      "max_possible": 70,
      "percentile": 35,
      "classification": "Below Average",
      "band": "31-45th",
      "interpretation": {...}
    },
    "A": {
      "raw_score": 58,
      "max_possible": 70,
      "percentile": 71,
      "classification": "High",
      "band": "71-85th",
      "interpretation": {...}
    },
    "N": {
      "raw_score": 38,
      "max_possible": 75,
      "percentile": 42,
      "classification": "Average",
      "band": "31-55th",
      "interpretation": {...}
    }
  },
  
  "profile": {
    "type": "Creative Caregiver",
    "summary": {
      "ru": "Вы сочетаете творческое мышление с заботой о людях...",
      "kk": "Сіз шығармашылық ойлауды адамдар туралы қамқорлықпен біріктіресіз...",
      "en": "You combine creative thinking with caring for others..."
    },
    "strengths": [
      "Creative problem-solving",
      "Compassionate and empathetic",
      "Intellectually curious",
      "Reliable and organized"
    ],
    "growth_areas": [
      "Building social confidence",
      "Assertiveness in groups",
      "Public speaking"
    ]
  },
  
  "behavioral_tendencies": {
    "work_style": "You thrive in roles that allow for both creativity and helping others...",
    "social_preferences": "You prefer meaningful one-on-one connections...",
    "stress_response": "You maintain emotional equilibrium under pressure...",
    "learning_style": "You enjoy exploring new concepts and abstract ideas..."
  },
  
  "career_insights": {
    "top_matches": [
      "Clinical Psychologist",
      "UX Researcher",
      "Creative Therapist",
      "Educational Content Designer",
      "Non-profit Program Manager"
    ],
    "work_environments": [
      "Collaborative but not overly social",
      "Allows for independent creative work",
      "Mission-driven organizations",
      "Flexible and adaptive culture"
    ]
  },
  
  "dimension_details": [
    {
      "dimension": "O",
      "score": 76,
      "percentile": 78,
      "title": "Openness to Experience: High",
      "description": "Detailed explanation of what this means...",
      "behaviors": ["Seeks intellectual stimulation", "Enjoys artistic pursuits", ...],
      "tips": "Consider careers that reward innovation..."
    }
    // ... 4 more dimensions
  ]
}
```

---

## 12. What the User Gets

### Results Page Components

**1. Overview Section**
```
┌─────────────────────────────────────┐
│  Your Big Five Personality Profile  │
│                                     │
│  Profile Type: Creative Caregiver   │
│  Completed: March 10, 2025          │
└─────────────────────────────────────┘

You combine creative thinking with genuine care 
for others, making you well-suited for roles 
that blend innovation with human impact.
```

**2. OCEAN Score Visualization**

Radar chart showing 5 dimensions:
```
         Openness (78th)
              / \
             /   \
    Neurot  /     \  Conscient
    (42nd) |   ⭐  | (62nd)
            \     /
             \   /
          Agreeable (71st)
              |
         Extraversion (35th)
```

**3. Percentile Bars**

```
Openness          ████████████████░░░░  78th percentile (High)
Conscientiousness ████████████░░░░░░░░  62nd percentile (Above Avg)
Extraversion      ███████░░░░░░░░░░░░░  35th percentile (Below Avg)
Agreeableness     ██████████████░░░░░░  71st percentile (High)
Neuroticism       ████████░░░░░░░░░░░░  42nd percentile (Average)
```

**4. Detailed Dimension Breakdowns**

For each of 5 dimensions:
- Score and percentile
- Classification (Very Low → Very High)
- What this means for you
- How this shows up in your life
- Careers that match this trait
- Tips for leveraging or developing this trait

**5. Profile Summary**

- Your personality archetype
- Top 5 strengths
- Potential growth areas
- Behavioral tendencies in key life domains:
  - Work and career
  - Relationships
  - Learning and development
  - Stress and coping

**6. Career Recommendations**

Based on complete profile:
- Top 10 career matches with explanations
- Work environment preferences
- Leadership style
- Team role tendencies

**7. Development Suggestions**

Personalized recommendations based on profile:
- Leverage high traits
- Develop moderate traits (if desired)
- Manage potential challenges from low traits
- Book/resource recommendations

**8. Comparison Data** (Optional)

- How you compare to general population
- How you compare to people in your field
- How you compare to successful people in target careers

**9. Downloadable Report** (PDF)

Complete analysis in shareable format:
- 10-15 page comprehensive report
- All visualizations
- Detailed interpretations
- Career guide
- Development plan template

---

## Database Schema

### bigfive_questions

```sql
CREATE TABLE bigfive_questions (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(20) UNIQUE NOT NULL,  -- 'bigfive_o_01'
    question_number INTEGER NOT NULL,
    
    text_ru TEXT NOT NULL,
    text_kk TEXT NOT NULL,
    text_en TEXT NOT NULL,
    
    dimension CHAR(1) NOT NULL,  -- O, C, E, A, N
    reverse_scored BOOLEAN DEFAULT false,
    format VARCHAR(20) NOT NULL,  -- 'sentence', 'word', 'extended'
    weight INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT check_dimension CHECK (dimension IN ('O', 'C', 'E', 'A', 'N')),
    CONSTRAINT check_format CHECK (format IN ('sentence', 'word', 'extended'))
);

CREATE INDEX idx_bigfive_questions_dimension ON bigfive_questions(dimension);
CREATE INDEX idx_bigfive_questions_format ON bigfive_questions(format);
```

### bigfive_results

```sql
CREATE TABLE bigfive_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    test_session_id UUID,
    
    -- Raw scores for each dimension
    score_o INTEGER NOT NULL,  -- Openness
    score_c INTEGER NOT NULL,  -- Conscientiousness
    score_e INTEGER NOT NULL,  -- Extraversion
    score_a INTEGER NOT NULL,  -- Agreeableness
    score_n INTEGER NOT NULL,  -- Neuroticism
    
    -- Percentiles (0-100)
    percentile_o DECIMAL(5,2),
    percentile_c DECIMAL(5,2),
    percentile_e DECIMAL(5,2),
    percentile_a DECIMAL(5,2),
    percentile_n DECIMAL(5,2),
    
    -- Classifications
    class_o VARCHAR(20),  -- 'Very Low', 'Low', 'Average', 'High', 'Very High'
    class_c VARCHAR(20),
    class_e VARCHAR(20),
    class_a VARCHAR(20),
    class_n VARCHAR(20),
    
    -- Profile
    profile_type VARCHAR(50),  -- 'Creative Caregiver', 'The Achiever', etc.
    
    completed_at TIMESTAMP DEFAULT NOW(),
    duration_seconds INTEGER,
    
    CONSTRAINT check_scores CHECK (
        score_o >= 18 AND score_o <= 90 AND
        score_c >= 13 AND score_c <= 65 AND
        score_e >= 14 AND score_e <= 70 AND
        score_a >= 14 AND score_a <= 70 AND
        score_n >= 15 AND score_n <= 75
    )
);

CREATE INDEX idx_bigfive_results_user ON bigfive_results(user_id);
CREATE INDEX idx_bigfive_results_completed ON bigfive_results(completed_at);
```

### bigfive_answers

```sql
CREATE TABLE bigfive_answers (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES bigfive_results(id) ON DELETE CASCADE,
    question_id VARCHAR(20) REFERENCES bigfive_questions(question_id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    answered_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(result_id, question_id)
);

CREATE INDEX idx_bigfive_answers_result ON bigfive_answers(result_id);
```

### bigfive_population_data

```sql
CREATE TABLE bigfive_population_data (
    id SERIAL PRIMARY KEY,
    dimension CHAR(1) NOT NULL,
    score INTEGER NOT NULL,
    count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(dimension, score),
    CONSTRAINT check_dimension CHECK (dimension IN ('O', 'C', 'E', 'A', 'N'))
);

CREATE INDEX idx_bigfive_population_dim ON bigfive_population_data(dimension);
```

---

## API Endpoints

### GET /api/tests/big-five/questions

Returns all 74 questions in proper order

**Query Parameters:**
- `language` (optional): ru, kk, en (default: ru)
- `format` (optional): sentence, word, extended, all (default: all)

**Response:**
```json
{
  "success": true,
  "data": {
    "test_info": {
      "test_id": "test_005",
      "test_code": "big-five-ocean",
      "total_questions": 74,
      "estimated_duration": 600
    },
    "instructions": {
      "part1": "Rate each statement according to how well it describes you...",
      "part2": "Rate each word according to how well it describes you...",
      "part3": "Continue rating statements..."
    },
    "questions": [
      {
        "id": "bigfive_a_01",
        "question_number": 1,
        "text": "Я принимаю людей такими, какие они есть",
        "dimension": "A",
        "format": "sentence",
        "reverse_scored": false,
        "scale": {
          "min": 1,
          "max": 5,
          "labels": {
            "1": "Неточно",
            "2": "Скорее неточно",
            "3": "Нейтрально",
            "4": "Скорее точно",
            "5": "Точно"
          }
        }
      }
      // ... 73 more questions
    ]
  }
}
```

### POST /api/tests/big-five/submit

Submit test answers and get results

**Request:**
```json
{
  "user_id": "uuid",
  "answers": [
    {"question_id": "bigfive_a_01", "rating": 4},
    {"question_id": "bigfive_o_02", "rating": 5},
    {"question_id": "bigfive_n_03", "rating": 2},
    // ... 71 more answers (total 74)
  ],
  "duration_seconds": 580
}
```

**Validation:**
- Must have exactly 74 answers
- All ratings must be 1-5
- All question_ids must be valid
- No duplicate question_ids

**Response:**
```json
{
  "success": true,
  "result": {
    "result_id": "12345",
    "scores": {
      "O": {
        "raw_score": 76,
        "percentile": 78,
        "classification": "High",
        "interpretation": "You have high Openness..."
      },
      "C": { /* ... */ },
      "E": { /* ... */ },
      "A": { /* ... */ },
      "N": { /* ... */ }
    },
    "profile": {
      "type": "Creative Caregiver",
      "summary": "You combine creative thinking...",
      "strengths": [ /* ... */ ],
      "growth_areas": [ /* ... */ ]
    },
    "career_insights": {
      "top_matches": [ /* ... */ ],
      "work_environments": [ /* ... */ ]
    }
  }
}
```

### GET /api/users/{user_id}/tests/big-five/result

Get user's saved Big Five result

**Response:** Same as submit response

### GET /api/tests/big-five/distribution

Get population score distribution for percentile calculations

**Response:**
```json
{
  "O": [
    {"score": 18, "count": 5},
    {"score": 19, "count": 12},
    // ... up to score 90
  ],
  "C": [ /* ... */ ],
  "E": [ /* ... */ ],
  "A": [ /* ... */ ],
  "N": [ /* ... */ ]
}
```

### GET /api/tests/big-five/interpretation/{dimension}/{percentile}

Get interpretation text for specific dimension and percentile

**Parameters:**
- `dimension`: O, C, E, A, or N
- `percentile`: 0-100

**Query:**
- `language`: ru, kk, en

**Response:**
```json
{
  "dimension": "O",
  "percentile": 78,
  "classification": "High",
  "band": "71-85th",
  "interpretation": {
    "title": "High Openness to Experience",
    "description": "You are highly creative and imaginative...",
    "behaviors": [
      "Seeks intellectual stimulation",
      "Enjoys artistic pursuits",
      "Questions conventional thinking"
    ],
    "tips": [
      "Consider careers that reward innovation",
      "Engage in creative hobbies",
      "Explore diverse perspectives"
    ]
  }
}
```

---

## Notes for Implementation

**Question Presentation:**
- Present in 3 clear sections (sentence/word/extended)
- Add section headers between format changes
- Show progress indicator for all 74 questions
- Allow previous/next navigation within sections
- Auto-save progress

**Rating Scale UI:**
- Use horizontal 5-point scale with clear labels
- Radio buttons recommended over slider
- Show both numerical (1-5) and text labels
- Keyboard shortcuts: 1-5 keys for rating
- Visual highlight on selection

**Reverse Scoring:**
- Apply automatically in backend
- Do NOT show "reverse" in UI to user
- Maintain consistency in scale presentation
- Log both original and reversed scores

**Score Calculation:**
- Validate all 74 questions answered before calculating
- Apply reverse scoring per dimension
- Calculate raw scores, percentiles, classifications
- Store complete answer set for future analysis
- Handle partial completions (save draft)

**Percentile Calculation:**
- Maintain running population distribution
- Update after each test completion
- Use appropriate statistical methods
- Handle edge cases (score at min/max)
- Provide smooth percentile curves

**Profile Generation:**
- Use rule-based system for profile types
- Consider all 5 dimensions holistically
- Provide nuanced interpretations
- Avoid stereotyping or oversimplification
- Personalize based on unique combination

**Performance Optimization:**
- Cache question data
- Batch population data updates
- Pre-calculate common interpretations
- Lazy load detailed results
- Optimize PDF generation

**User Experience:**
- Clear instructions at each section
- Encouraging feedback during test
- Avoid fatigue (74 questions is long)
- Option to take break and resume
- Engaging results presentation

**Data Privacy:**
- Encrypt sensitive personality data
- Allow users to delete results
- Anonymize population statistics
- Provide data export option
- Clear privacy policy

**Accessibility:**
- Screen reader support for all questions
- Keyboard-only navigation
- High contrast mode
- Clear, simple language
- Alternative text for visualizations

**Multilingual Support:**
- Consistent translations across all languages
- Culturally appropriate interpretations
- Test equivalence across languages
- Professional translation review

---

## Scientific Background

**Theory Development:**
- Emerged from lexical hypothesis (1930s-1940s)
- Consolidated by multiple research teams (1980s-1990s)
- Cross-cultural validation (100+ countries)
- Consensus model in academic psychology

**Five-Factor Model (FFM):**
- Also called Big Five or OCEAN model
- Based on factor analysis of personality descriptors
- Represents fundamental dimensions of personality
- Hierarchical structure (5 broad factors, 30+ facets)

**Reliability:**
- Test-retest reliability: r = 0.70-0.85 over years
- Internal consistency: α = 0.75-0.90 per dimension
- Cross-observer agreement: r = 0.50-0.60

**Validity:**
- Predicts life outcomes (job performance, relationships, health)
- Stable across cultures and languages
- Correlates with brain structure and function
- Genetic heritability: 40-60%

**Applications:**
- Personnel selection and development
- Career counseling
- Clinical psychology
- Relationship counseling
- Academic research

**Limitations:**
- Self-report bias
- Cultural variations in expression
- Situational influences
- Not diagnostic tool for disorders
- Descriptive, not explanatory

**Research Base:**
- 10,000+ published studies
- Validated across 50+ languages
- Used in organizational and clinical settings
- Foundation for modern personality research

---

## Testing Checklist

### Functionality
- [ ] All 74 questions load correctly
- [ ] Questions grouped properly by format
- [ ] Scale labels display for all languages
- [ ] Previous/Next navigation works
- [ ] Progress tracking accurate (X/74)
- [ ] Reverse scoring applied correctly
- [ ] Raw score calculation accurate
- [ ] Percentile calculation works
- [ ] Classification logic correct
- [ ] Profile type generation accurate
- [ ] All result components generate

### User Experience
- [ ] Clear instructions at start
- [ ] Section headers between formats
- [ ] Engaging visual design
- [ ] Loading states during calculation
- [ ] Error handling for incomplete responses
- [ ] Option to save and resume
- [ ] Results page comprehensive
- [ ] PDF export functional

### Technical
- [ ] Database schema created
- [ ] All API endpoints functional
- [ ] Population data updates
- [ ] Caching implemented
- [ ] Performance optimized (<2s results)
- [ ] Multi-language support complete
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Data & Privacy
- [ ] Answers stored securely
- [ ] Results encrypted
- [ ] User can delete data
- [ ] Analytics tracking (optional)
- [ ] GDPR compliant
- [ ] Privacy policy linked

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] High contrast mode
- [ ] Clear font sizing
- [ ] Alt text for visuals
- [ ] WCAG 2.1 AA compliant

### Validation
- [ ] Scores match expected ranges
- [ ] Percentiles distributed normally
- [ ] Profile types make sense
- [ ] Interpretations accurate
- [ ] Career matches relevant
- [ ] Test-retest reliability checked
- [ ] Compared with validated Big Five tests

---

## Appendix: Complete Question List

### Part 1: Sentences (1-44)

1. I accept people the way they are. [A]
2. I believe in the importance of art. [O]
3. My moods change easily. [N]
4. I take care of other people before taking care of myself. [A]
5. I am always prepared. [C]
6. I have a vivid imagination. [O]
7. I feel comfortable around people. [E]
8. I often feel blue. [N]
9. I am the life of the party. [E]
10. I treat everyone with kindness and sympathy. [A]
11. I get chores done right away. [C]
12. I have a kind word for everyone. [A]
13. I am skilled in handling social situations. [E]
14. I often feel anxious about what could go wrong. [N]
15. I start arguments just for the fun of it. [A-R]
16. I often worry that I am not good enough. [N]
17. I find it difficult to get to work. [C-R]
18. I stay in the background. [E-R]
19. There are many things that I do not like about myself. [N]
20. I seldom feel blue. [N-R]
21. I do not like art. [O-R]
22. I stop what I am doing to help other people. [A]
23. I change my plans frequently. [C-R]
24. I am often troubled by negative thoughts. [N]
25. I feel comfortable with myself. [N-R]
26. I avoid philosophical discussions. [O-R]

### Part 2: Words (27-46)

27. Original [O]
28. Systematic [C]
29. Shy [E-R]
30. Soft-Hearted [A]
31. Tense [N]
32. Inquisitive [O]
33. Forgetful [C-R]
34. Reserved [E-R]
35. Agreeable [A]
36. Nervous [N]
37. Creative [O]
38. Self-Disciplined [C]
39. Outgoing [E]
40. Charitable [A]
41. Moody [N]
42. Imaginative [O]
43. Organized [C]
44. Talkative [E]
45. Humble [A]
46. Pessimistic [N]

### Part 3: Extended (47-74)

47. I have a lot to say. [E]
48. I enjoy going to art museums. [O]
49. I always make good use of my time. [C]
50. I am interested in the meaning of things. [O]
51. I avoid taking on a lot of responsibility. [C-R]
52. I don't like to draw attention to myself. [E-R]
53. I feel I am better than other people. [A-R]
54. I make friends easily. [E]
55. I make plans and stick to them. [C]
56. I am not interested in abstract ideas. [O-R]
57. I criticize other people. [A-R]
58. I don't talk a lot. [E-R]
59. I enjoy hearing new ideas. [O]
60. It's important to me that people are on time. [C]
61. I express myself through art, music, or writing [O]
62. I do not try to predict what may happen in the future [C-R]
63. I find ways to bring happiness to my friends and family [A/E]
64. I tend to come up with better alternatives to established procedures [O]
65. I like to joke around [E]
66. I feel connected to a larger force or power in the world around me [O]
67. I can see my feelings and experiences reflected in creative works [O]
68. I can clearly visualize what could happen in the future [C]
69. I spend my time helping the people closest to me [A]
70. I often come up with a new way of doing things [O]
71. I feel that most situations can be improved with a little humor and playfulness [E]
72. I see universal or spiritual forces at work in my life [O]
73. Creative outlets are a stress reliever for me [O]
74. I make plans for many years into the future [C]

**Note:** [A-R] means Agreeableness - Reverse scored
