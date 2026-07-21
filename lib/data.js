import {supabase} from "@/lib/supabase";
import {lessons,lessonOne} from "@/lib/demo";
export async function getLessons(){if(!supabase)return lessons;const{data}=await supabase.from("lessons").select("*").eq("is_published",true).order("level_number");return data?.length?data:lessons}
export async function getLesson(level){if(!supabase)return level===1?lessonOne:{...lessons[level-1],blocks:lessonOne.blocks};const{data:l}=await supabase.from("lessons").select("*").eq("level_number",level).maybeSingle();if(!l)return level===1?lessonOne:{...lessons[level-1],blocks:lessonOne.blocks};const{data:b}=await supabase.from("lesson_blocks").select("*").eq("lesson_id",l.id).order("position");return b?.length?{...l,blocks:b}:{...l,blocks:lessonOne.blocks}}
