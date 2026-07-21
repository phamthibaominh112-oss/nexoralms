# Nexora Admin Test Studio

## Database setup order

Run these files in Supabase SQL Editor:

1. `01_schema.sql`
2. `02_functions_rls.sql`
3. `03_import_functions.sql`
4. `04_seed_100_levels.sql`
5. `05_verify.sql`
6. `06_question_bank_blueprints.sql`
7. `07_admin_test_studio.sql`
8. `08_promote_first_admin.sql`

## Open Test Studio

Sign in with an account whose `profiles.role` is:

- `admin`
- `founder`

Then open:

`/admin/ielts`

## Import the supplied OSIR test

Click:

`Load OSIR ACA 1`

Then:

`Import as draft`

The bundle contains:

- Academic Reading: 3 passages and 40 items
- Listening: 4 sections and 40 items
- Academic Writing: Task 1 and Task 2
- Speaking: Parts 1, 2 and 3

## Why it remains draft

The supplied DOCX does not contain:

- objective answer keys
- four Listening audio files
- Listening transcripts
- Writing/Speaking marking rubrics

The publish function intentionally blocks incomplete suites.

## Add answers

Edit:

`content/examples/osir-aca-1.bundle.json`

Each objective item uses:

```json
{
  "number": 7,
  "type": "yes_no_not_given",
  "prompt": "...",
  "options": ["YES", "NO", "NOT GIVEN"],
  "answer": "YES"
}
```

For completion questions:

```json
{
  "number": 1,
  "type": "table_completion",
  "prompt": "...",
  "answer": "7,522"
}
```

Re-importing the same bundle updates the existing papers because slugs are unique.

## Add Listening audio

Upload four MP3 files to Supabase Storage and insert URLs:

```json
{
  "title": "Listening Section 1",
  "audio_url": "https://PROJECT.supabase.co/storage/v1/object/public/ielts-audio/osir-aca-1/section-1.mp3",
  "transcript": "...",
  "questions": []
}
```

Recommended paths:

```text
ielts-audio/
└── osir-aca-1/
    ├── section-1.mp3
    ├── section-2.mp3
    ├── section-3.mp3
    └── section-4.mp3
```

## Publish

After answers and audio have been completed:

`Admin Test Studio → Published suites → Publish suite`

The test then appears on:

`/ielts`
