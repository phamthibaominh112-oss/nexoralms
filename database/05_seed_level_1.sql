-- NEXORA V2 — COMPLETE LEVEL 1 CONTENT
-- Run after 04_seed_lessons.sql.

do $$
declare
  v_lesson_id bigint;
  v_quiz_section_id bigint;
begin
  select id into v_lesson_id
  from public.lessons
  where level_number = 1;

  delete from public.lesson_questions where lesson_id = v_lesson_id;
  delete from public.vocabulary_items where lesson_id = v_lesson_id;
  delete from public.lesson_sections where lesson_id = v_lesson_id;

  insert into public.lesson_sections (
    lesson_id, section_type, title, instructions, content, position
  ) values
  (
    v_lesson_id,
    'overview',
    'What you will learn',
    'Complete each section before the checkpoint.',
    jsonb_build_object(
      'objectives', jsonb_build_array(
        'Use common greetings appropriately.',
        'Introduce yourself using simple sentences.',
        'Ask and answer basic personal questions.',
        'Recognise key information in a short conversation.'
      )
    ),
    1
  ),
  (
    v_lesson_id,
    'vocabulary',
    'Build your word bank',
    'Study each word, listen to it and create your own example.',
    '{}'::jsonb,
    2
  ),
  (
    v_lesson_id,
    'grammar',
    'The verb be: I am and You are',
    'Use I am for yourself and You are for another person.',
    jsonb_build_object(
      'explanation', 'Use “I am” to give information about yourself. In conversation, “I’m” is common.',
      'formula', jsonb_build_array(
        'I + am + information',
        'You + are + information',
        'My name + is + name'
      ),
      'examples', jsonb_build_array(
        'I am Minh.',
        'I’m from Vietnam.',
        'You are a student.',
        'My name is Emma.'
      )
    ),
    3
  ),
  (
    v_lesson_id,
    'reading',
    'Meet Daniel',
    'Read the passage and identify the key details.',
    jsonb_build_object(
      'passage', 'Hello! My name is Daniel. I am 19 years old. I am from Australia, but I live in Singapore. I am a university student. I study business. I speak English and a little Chinese. I enjoy football and music.',
      'questions', jsonb_build_array(
        jsonb_build_object('question','How old is Daniel?','answer','19'),
        jsonb_build_object('question','Where does Daniel live?','answer','Singapore'),
        jsonb_build_object('question','What does Daniel study?','answer','Business')
      )
    ),
    4
  ),
  (
    v_lesson_id,
    'listening',
    'Meeting a new classmate',
    'Listen twice, then identify names and places.',
    jsonb_build_object(
      'transcript', 'Mia: Hello! My name is Mia. What is your name? Leo: Hi, I’m Leo. Nice to meet you. Mia: Nice to meet you too. Where are you from? Leo: I’m from Brazil, but I live in London now.'
    ),
    5
  ),
  (
    v_lesson_id,
    'speaking',
    'Introduce yourself',
    'Speak for 20 to 30 seconds using complete sentences.',
    jsonb_build_object(
      'prompts', jsonb_build_array(
        'What is your name?',
        'Where are you from?',
        'Where do you live?',
        'Are you a student or do you work?',
        'What do you enjoy doing?'
      ),
      'sentence_starters', jsonb_build_array(
        'Hello, my name is...',
        'I am from...',
        'I live in...',
        'I am a...',
        'I enjoy...'
      ),
      'model_answer', 'Hello, my name is Anna. I am from Thailand, and I live in Bangkok. I am a university student. I enjoy reading and listening to music.'
    ),
    6
  ),
  (
    v_lesson_id,
    'writing',
    'Write a personal introduction',
    'Write four to six sentences.',
    jsonb_build_object(
      'prompt', 'Include your name, hometown, current city, study or job and one interest.',
      'checklist', jsonb_build_array(
        'I used capital letters correctly.',
        'I used full stops.',
        'I used I am or I’m.',
        'I wrote at least four sentences.'
      ),
      'model_answer', 'My name is Linh. I am from Da Nang, and I live in Ho Chi Minh City. I am a student. I study English. I enjoy watching films and travelling.'
    ),
    7
  );

  insert into public.lesson_sections (
    lesson_id, section_type, title, instructions, content, position
  ) values (
    v_lesson_id,
    'quiz',
    'Level checkpoint',
    'Answer every question correctly before completing the level.',
    '{}'::jsonb,
    8
  )
  returning id into v_quiz_section_id;

  insert into public.vocabulary_items (
    lesson_id, word, pronunciation, meaning, example, position
  ) values
  (v_lesson_id, 'hello', '/həˈləʊ/', 'a greeting used when meeting someone', 'Hello, my name is Anna.', 1),
  (v_lesson_id, 'name', '/neɪm/', 'the word used to identify a person', 'My name is Daniel.', 2),
  (v_lesson_id, 'from', '/frɒm/', 'used to show where someone comes from', 'I am from Vietnam.', 3),
  (v_lesson_id, 'live', '/lɪv/', 'to have your home in a place', 'I live in Ho Chi Minh City.', 4),
  (v_lesson_id, 'meet', '/miːt/', 'to see and speak to someone for the first time', 'Nice to meet you.', 5),
  (v_lesson_id, 'student', '/ˈstjuːdənt/', 'a person who studies', 'I am a student.', 6);

  insert into public.lesson_questions (
    lesson_id, section_id, question_type, prompt, options, correct_answer, explanation, position
  ) values
  (
    v_lesson_id, v_quiz_section_id, 'multiple_choice',
    'Choose the correct sentence.',
    '["I is Minh.","I am Minh.","I are Minh."]'::jsonb,
    '"I am Minh."'::jsonb,
    'Use am after the subject I.',
    1
  ),
  (
    v_lesson_id, v_quiz_section_id, 'multiple_choice',
    'Complete: My name ___ Sarah.',
    '["am","are","is"]'::jsonb,
    '"is"'::jsonb,
    'Use is after my name.',
    2
  ),
  (
    v_lesson_id, v_quiz_section_id, 'multiple_choice',
    'What question asks about a person’s country?',
    '["Where are you from?","How old is your house?","What time is it?"]'::jsonb,
    '"Where are you from?"'::jsonb,
    'This asks about someone’s country or hometown.',
    3
  ),
  (
    v_lesson_id, v_quiz_section_id, 'multiple_choice',
    'Choose the natural response: Nice to meet you.',
    '["Nice to meet you too.","I am nineteen.","It is Monday."]'::jsonb,
    '"Nice to meet you too."'::jsonb,
    'This is the standard response when meeting someone.',
    4
  ),
  (
    v_lesson_id, v_quiz_section_id, 'multiple_choice',
    'Complete: I ___ in Hanoi.',
    '["live","lives","living"]'::jsonb,
    '"live"'::jsonb,
    'Use the base verb live after I.',
    5
  );
end $$;
