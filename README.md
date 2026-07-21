# Nexora V5 LMS

V5 changes Nexora from a learner demo into a two-sided learning management system.

## Learner Portal

- Dashboard, roadmap and interactive lessons
- Placement test
- IELTS test engine
- Games and achievements
- Assignment submission data model
- Learner Support page
- Questions, content feedback and technical tickets
- Replies from the academic/admin team

## Admin Workspace

Routes:

```text
/admin
/admin/courses
/admin/questions
/admin/assignments
/admin/users
/admin/helpdesk
/admin/ielts
```

Admin capabilities:

- LMS operations dashboard
- Create and manage courses
- Author reusable question-bank items
- Create assignments
- Review learner accounts and roles
- View learner questions and feedback
- Reply through Helpdesk
- Import and publish IELTS test suites

## Branding

The uploaded Nexora logo is used as:

- Main application logo
- Sidebar logo
- Browser favicon
- Apple touch icon

Nori has been redesigned as a modern AI/robot learning companion.

## Supabase setup

Run:

```text
supabase/migrations/001_nexora_v4.sql
supabase/migrations/002_lms_admin.sql
supabase/seed/001_seed.sql
```

Then edit and run:

```text
supabase/promote_admin.sql
```

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` remains supported as a fallback.

## Deploy

```bash
npm install
npm run build
git add .
git commit -m "Launch Nexora V5 LMS"
git push
```

Redeploy on Vercel without using the previous build cache.
