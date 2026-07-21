# Nexora Question Bank Guide

## 1. Database layers

Nexora separates reusable questions from delivery:

- `question_banks`: named collections such as `placement-b1-grammar`
- `questions`: reusable question records
- `placement_blueprints`: rules describing how many questions to draw by skill and difficulty
- `placement_attempts`: learner results and skill matrix
- `ielts_papers`: one complete test
- `ielts_sections`: Reading passages or Listening sections
- `ielts_items`: numbered questions within a section
- `ielts_attempts`: answers, flags, timing and scores

## 2. Supported question types

Use these stable values:

- `multiple_choice`
- `multi_select`
- `fill_blank`
- `short_answer`
- `matching`
- `ordering`
- `sentence_builder`
- `categorize`
- `dictation`
- `true_false_not_given`
- `yes_no_not_given`
- `matching_headings`
- `matching_information`
- `summary_completion`
- `note_completion`
- `form_completion`
- `table_completion`
- `map_labelling`
- `diagram_labelling`

## 3. Add a reusable question

```sql
insert into public.questions (
  bank_id,
  question_type,
  skill,
  difficulty,
  prompt,
  prompt_vi,
  options,
  correct_answer,
  explanation,
  audio_url,
  metadata
)
values (
  (select id from public.question_banks where slug='placement-b1-grammar'),
  'multiple_choice',
  'grammar',
  3,
  'If I had more time, I ___ another language.',
  'Nếu có nhiều thời gian hơn, tôi ___ một ngôn ngữ khác.',
  '["learn","would learn","will learn"]'::jsonb,
  '"would learn"'::jsonb,
  'Use the second conditional for an unreal present situation.',
  null,
  '{"cefr":"B1","topic":"conditionals","discrimination":0.65}'::jsonb
);
```

## 4. Recommended placement matrix

Create enough questions for each cell:

| Skill | A1 | A2 | B1 | B2/C1 |
|---|---:|---:|---:|---:|
| Grammar | 50 | 50 | 70 | 70 |
| Vocabulary | 50 | 50 | 70 | 70 |
| Reading | 30 | 40 | 50 | 50 |
| Listening | 30 | 40 | 50 | 50 |

A production attempt can draw:

- Grammar: 12
- Vocabulary: 10
- Reading: 10
- Listening: 8

Keep at least five times more questions in the bank than one attempt uses.

## 5. IELTS paper import

Start from:

`content/examples/ielts-paper.sample.json`

For a complete paper:

- Listening: 4 sections, 40 numbered items
- Academic Reading: 3 passages, 40 numbered items
- General Training Reading: 3 sections, 40 numbered items
- Writing: Task 1 and Task 2
- Speaking: Parts 1, 2 and 3

Import:

```sql
select public.import_ielts_paper_json(
  '<PASTE VALID JSON>'::jsonb
);
```

## 6. Audio storage

Create a public or signed Supabase Storage bucket named:

`lesson-audio`

Recommended paths:

```text
lesson-audio/
├── lessons/level-001/listening-01.mp3
├── placement/a2/listening-001.mp3
└── ielts/listening/test-001/section-01.mp3
```

Store the resulting URL in `audio_url`. The browser voice must remain fallback only.

## 7. Quality control

Every item should be reviewed for:

- one unambiguous key
- CEFR or IELTS difficulty
- skill and subskill
- explanation
- source/licensing status
- distractor quality
- language accuracy
- pilot statistics
