NEXORA V2 DATABASE INSTALLATION

Run the SQL files in this exact order inside Supabase SQL Editor:

1. 01_schema.sql
2. 02_functions.sql
3. 03_rls.sql
4. 04_seed_lessons.sql
5. 05_seed_level_1.sql
6. 06_seed_achievements.sql
7. 07_verify.sql

Expected verification:
- lesson_count = 100
- Level 1 has 8 lesson sections
- Level 1 has 6 vocabulary items
- Level 1 has 5 checkpoint questions

Important:
- Keep your existing Supabase project and Auth users.
- Do not expose any sb_secret key in frontend code.
- The frontend should use the publishable key.
- complete_level() prevents duplicate XP awards.
