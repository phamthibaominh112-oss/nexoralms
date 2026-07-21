# Nexora V3 Gamified

A gamified bilingual LMS scaffold with:

- Nexora mascot: **Nori**
- Placement test and recommended starting level
- 100-level roadmap
- Rich learning blocks
- Flappy Quiz game: every three gates triggers a knowledge question
- IELTS computer-based practice shell
- Normalized Supabase database
- JSON import format for lessons and IELTS papers
- XP, coins, hearts, streaks, badges, quests and game sessions
- English/Vietnamese UI
- Browser audio fallback and real audio URL support

## Setup

1. Copy `.env.example` to `.env.local`
2. Add Supabase URL and publishable key
3. Run database SQL in order
4. `npm install`
5. `npm run dev`

## Import content

Use:
- `content/examples/lesson.sample.json`
- `content/examples/ielts-paper.sample.json`

The database includes RPC functions:
- `import_lesson_json(jsonb)`
- `import_ielts_paper_json(jsonb)`

Use Supabase SQL Editor:

```sql
select public.import_lesson_json('<JSON>'::jsonb);
select public.import_ielts_paper_json('<JSON>'::jsonb);
```


## V3.1 fixes

- Correct multi-select scoring using set equality
- Correct options are revealed after checking
- Flappy Bird replaced with animated Nori
- Varied, continuously generated gates
- 40-question four-skill placement matrix
- Full 40-item Reading and Listening mock structures
- Persistent top-bar sign-out button
- Nexora favicon
- Question-bank setup guide and placement blueprint SQL


## V3.3 Admin Test Studio

- Role-protected `/admin/ielts`
- Admin/founder-only bundle import
- Draft/review/published/archive workflow
- Publishing validation for answer keys and Listening audio
- Published test library on `/ielts`
- Converted OSIR ACA 1 bundle with Reading 40, Listening 40, Writing and Speaking
- Source DOCX retained under `content/source`
- Admin promotion SQL and complete guide
