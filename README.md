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
