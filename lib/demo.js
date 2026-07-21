const stageNames=["Starter Foundations","Essential English","Everyday Communication","Independent English","IELTS Core","Academic Development","Confident IELTS","Advanced IELTS","Band 7.5","Road to Band 8"];
const cefr=["Pre-A1","A1","A2","B1","B1+","B2","B2+","C1","C1+","IELTS 8.0"];
export const lessons=Array.from({length:100},(_,i)=>{const n=i+1,s=Math.ceil(n/10);return{id:n,level_number:n,title:n%10===0?`Stage ${s} Boss Battle`:`Mission ${n}: ${["Identity","Numbers","Family","Routines","Lifestyle","Community","Study","Travel","Communication"][i%9]}`,title_vi:n%10===0?`Trận Boss Chặng ${s}`:`Nhiệm vụ ${n}`,subtitle:"A 35–45 minute interactive mission with practice, game and review.",subtitle_vi:"Nhiệm vụ tương tác 35–45 phút với luyện tập, trò chơi và ôn tập.",stage_number:s,stage_name:stageNames[s-1],cefr_level:cefr[s-1],xp_reward:n%10===0?200:100,is_published:true}});
export const lessonOne={...lessons[0],blocks:[
{type:"mission_brief",title:"Mission brief",title_vi:"Mục tiêu nhiệm vụ",content:{objectives:["Introduce yourself confidently","Use am/is/are accurately","Recognise personal details in speech","Produce a short spoken and written introduction"],duration:4}},
{type:"flashcards",title:"Power-up vocabulary",title_vi:"Từ vựng tăng sức mạnh",content:{cards:[
{front:"introduce",back:"to tell someone who you are",example:"Let me introduce myself.",pronunciation:"/ˌɪntrəˈdjuːs/"},
{front:"hometown",back:"the town or city where you grew up",example:"Da Nang is my hometown.",pronunciation:"/ˈhəʊmtaʊn/"},
{front:"occupation",back:"a person's job",example:"What is your occupation?",pronunciation:"/ˌɒkjəˈpeɪʃən/"},
{front:"currently",back:"at the present time",example:"I currently live in Bien Hoa.",pronunciation:"/ˈkʌrəntli/"},
{front:"interest",back:"something you enjoy",example:"Reading is one of my interests.",pronunciation:"/ˈɪntrəst/"},
{front:"background",back:"a person's experience and history",example:"Tell me about your background.",pronunciation:"/ˈbækɡraʊnd/"}]}},
{type:"practice",title:"Vocabulary training",title_vi:"Luyện từ vựng",content:{exercises:[
{type:"memory",prompt:"Match words with meanings.",pairs:[["hometown","where you grew up"],["occupation","your job"],["interest","something you enjoy"],["currently","now"]]},
{type:"categorize",prompt:"Put each item into the correct category.",items:["teacher","reading","Hanoi","engineer","music","Da Nang"],categories:["Occupation","Interest","Place"],answer:{"teacher":"Occupation","reading":"Interest","Hanoi":"Place","engineer":"Occupation","music":"Interest","Da Nang":"Place"}},
{type:"sentence_builder",prompt:"Build a correct sentence.",items:["currently","I","in","live","Vietnam"],answer:["I","currently","live","in","Vietnam"]}
]}},
{type:"grammar",title:"Grammar discovery",title_vi:"Khám phá ngữ pháp",content:{explanation:"Use am with I, is with he/she/it, and are with you/we/they.",examples:["I am a student.","She is from Thailand.","They are colleagues."],exercises:[
{type:"multiple_choice",prompt:"Choose the correct sentence.",options:["I is a teacher.","I am a teacher.","I are a teacher."],answer:"I am a teacher.",explanation:"Use am after I."},
{type:"fill_blank",prompt:"She ___ from Singapore.",answer:"is"},
{type:"multi_select",prompt:"Select all correct sentences.",options:["We are students.","He am busy.","You are welcome.","They is ready."],answer:["We are students.","You are welcome."]}
]}},
{type:"listening",title:"Listening mission",title_vi:"Nhiệm vụ nghe",content:{transcript:"Hello, my name is Leo. I am from Brazil, but I currently live in London. I am a graphic designer and I enjoy photography.",exercises:[
{type:"dictation",prompt:"Type the speaker's current city.",audio_text:"Hello, my name is Leo. I am from Brazil, but I currently live in London.",answer:"London"},
{type:"multiple_choice",prompt:"What is Leo's occupation?",audio_text:"I am a graphic designer and I enjoy photography.",options:["Teacher","Graphic designer","Photographer"],answer:"Graphic designer"}
]}},
{type:"reading",title:"Reading mission",title_vi:"Nhiệm vụ đọc",content:{passage:"Mai is a 22-year-old university student from Hue. She currently lives in Ho Chi Minh City, where she studies marketing. In her free time, she enjoys running and learning Korean.",exercises:[
{type:"multiple_choice",prompt:"Why does Mai live in Ho Chi Minh City?",options:["She studies there.","Her family lives there.","She works as a runner."],answer:"She studies there."},
{type:"fill_blank",prompt:"Mai studies ________.",answer:"marketing"}
]}},
{type:"pronunciation",title:"Pronunciation & shadowing",title_vi:"Phát âm và shadowing",content:{exercises:[
{type:"pronunciation",prompt:"Listen, shadow and record.",text:"Hello, my name is Mai. I currently live in Ho Chi Minh City."}
]}},
{type:"speaking",title:"Speaking production",title_vi:"Thực hành nói",content:{prompt:"Record a 30–45 second personal introduction. Include your name, hometown, current city, occupation or study, and two interests.",model:"Hello, my name is Mai. I am from Hue, but I currently live in Ho Chi Minh City. I am a university student and I study marketing. I enjoy running and learning Korean."}},
{type:"writing",title:"Writing production",title_vi:"Thực hành viết",content:{prompt:"Write 70–90 words introducing yourself to a new international class.",checklist:["Include at least five personal details","Use am/is/are accurately","Use one linking word","Check capital letters and full stops"]}},
{type:"game",title:"Flappy Quiz challenge",title_vi:"Thử thách Flappy Quiz",content:{game_slug:"flappy-quiz",question_set:"level-1-core"}},
{type:"checkpoint",title:"Mission checkpoint",title_vi:"Kiểm tra nhiệm vụ",content:{exercises:[
{type:"multiple_choice",prompt:"Which sentence is correct?",options:["My hometown are Hue.","My hometown is Hue.","My hometown am Hue."],answer:"My hometown is Hue."},
{type:"fill_blank",prompt:"I ___ currently a student.",answer:"am"},
{type:"ordering",prompt:"Put the words in order.",items:["enjoy","I","music","and","reading"],answer:["I","enjoy","reading","and","music"]},
{type:"short_answer",prompt:"Write one sentence about your current city.",answer:"I currently live in Ho Chi Minh City."}
]}}
]};
export const placementQuestions=[
{skill:"grammar",level:1,type:"multiple_choice",prompt:"I ___ a student.",options:["am","is","are"],answer:"am"},
{skill:"vocabulary",level:1,type:"multiple_choice",prompt:"A hometown is...",options:["your job","where you grew up","your hobby"],answer:"where you grew up"},
{skill:"grammar",level:2,type:"multiple_choice",prompt:"She ___ English every day.",options:["study","studies","studying"],answer:"studies"},
{skill:"reading",level:2,type:"multiple_choice",prompt:"Tom missed the bus, so he walked to work. Why did Tom walk?",options:["He likes walking.","He missed the bus.","His car broke."],answer:"He missed the bus."},
{skill:"grammar",level:3,type:"multiple_choice",prompt:"If I had more time, I ___ another language.",options:["learn","would learn","will learn"],answer:"would learn"},
{skill:"vocabulary",level:3,type:"multiple_choice",prompt:"The word 'significant' is closest to...",options:["important","tiny","uncertain"],answer:"important"},
{skill:"reading",level:4,type:"multiple_choice",prompt:"Although the policy was unpopular initially, public support increased after its benefits became evident. What changed?",options:["The policy ended.","Support increased.","Benefits disappeared."],answer:"Support increased."},
{skill:"grammar",level:4,type:"multiple_choice",prompt:"By next June, she ___ the course.",options:["completes","will complete","will have completed"],answer:"will have completed"}
];
