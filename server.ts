import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Siz O‘zbekiston Respublikasi Xalq ta'limi tizimi uchun oliy toifali, zamonaviy metodist va pedagog-maslahatchi ekansiz. 
Barcha javoblaringizni faqat toza, adabiy va grammatik jihatdan to‘g‘ri O‘zbek lotin alifbosida (O‘, G‘ harflari, tutuq belgilari to‘g‘ri qo‘llangan holda) yozing. 
Dars ishlanmalari va topshiriqlarni O‘zbekiston umumta'lim maktablarining Davlat Ta'lim Standartlari (DTS), Bloom taksonomiyasi va kompetensiyaviy yondashuv talablari asosida tuzing. 
Agarda JSON so‘ralgan bo‘lsa, faqatgina toza JSON formatida javob bering, hech qanday ortiqcha matn yoki izoh qo‘shmang.`;

// Endpoint: AI generation
app.post('/api/generate', async (req, res) => {
  const { type, params } = req.body;

  if (!type || !params) {
    return res.status(400).json({ error: 'Talab qilingan parametrlar to‘liq yuborilmadi.' });
  }

  // If no API key is provided, return structured fallback message
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY sozlanmagan. Iltimos, Secrets panelidan API kalitni tekshiring.',
      fallbackAvailable: true,
    });
  }

  try {
    let prompt = '';

    if (type === 'lesson') {
      prompt = `
Quyidagi ma'lumotlar asosida 45 daqiqalik to‘liq, namunali dars ishlanmasi (konspekt) yarating.
Fan: ${params.subject}
Sinf: ${params.grade}
Mavzu: ${params.topic}
Dars davomiyligi: ${params.duration || '45 daqiqa'}
Dars turi: ${params.lessonType || 'Yangi bilim beruvchi dars'}
O‘quv maqsadi: ${params.objective || 'Mavzuni to‘liq o‘zlashtirish va amalda qo‘llash'}
O‘quvchilar darajasi: ${params.studentLevel || 'O‘rta'}

Quyidagi JSON formatda javob bering:
{
  "topic": "${params.topic}",
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "duration": "${params.duration || '45 daqiqa'}",
  "lessonType": "${params.lessonType || 'Yangi bilim beruvchi dars'}",
  "objectives": {
    "educational": "Ta'limiy maqsad (o‘quvchilar mavzu bo‘yicha nimani bilib oladi)",
    "developmental": "Rivojlantiruvchi maqsad (mantiqiy fikrlash, tahlil qilish ko‘nikmasi)",
    "pedagogical": "Tarbiyaviy maqsad (qadriyatlar, vatanparvarlik, estetik tarbiya)"
  },
  "expectedOutcomes": [
    "1-kutilayotgan natija",
    "2-kutilayotgan natija",
    "3-kutilayotgan natija"
  ],
  "requiredEquipments": [
    "Darslik va daftarlar",
    "Elektron doska yoki proyektor",
    "Ko‘rgazmali tarqatma materiallar"
  ],
  "stages": {
    "organizational": "Tashkiliy qism (salomlashish, davomat, ijobiy psixologik muhit yaratish)",
    "previousTopicReview": "O‘tgan mavzuni takrorlash (3-4 ta aniq savol va javoblar)",
    "newTopicExplanation": "Yangi mavzuni tushuntirish (asosiy tushunchalar, qoidalar, slaydlar mazmuni)",
    "practicalActivity": "Amaliy mashg‘ulot (mashqlar, misollar, vazifalar)",
    "consolidation": "Mustahkamlash (savol-javob, interfaol mashq)",
    "assessment": "Baholash (rag‘batlantirish, mezonlar asosida shakllantiruvchi baholash)",
    "homework": "Uyga vazifa (asosiy va ijodiy topshiriq)",
    "conclusion": "Yakuniy xulosa va refleksiya (o‘quvchilar darsdan nima olganini aniqlash)"
  },
  "teacherNotes": "O‘qituvchi uchun qo‘shimcha metodik tavsiya"
}
`;
    } else if (type === 'test') {
      const count = Number(params.questionCount) || 5;
      prompt = `
Fan: ${params.subject}
Sinf: ${params.grade}
Mavzu: ${params.topic}
Savollar soni: ${count} ta
Qiyinlik darajasi: ${params.difficulty || 'O‘rta'}

Quyidagi talablarga javob beradigan ${count} ta 4 variantli (A, B, C, D) test savollarini tuzing.
Har bir savol aniq, savodli va bitta to‘g‘ri javobga ega bo‘lishi shart.
To‘g‘ri javobning qisqa metodik izohi bo‘lsin.

Javobni quyidagi JSON formatda bering:
{
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "topic": "${params.topic}",
  "difficulty": "${params.difficulty || 'O‘rta'}",
  "questions": [
    {
      "id": 1,
      "question": "Savol matni",
      "options": {
        "A": "Variant A",
        "B": "Variant B",
        "C": "Variant C",
        "D": "Variant D"
      },
      "correctAnswer": "A",
      "explanation": "Nega aynan ushbu javob to‘g‘riligi haqida qisqa izoh"
    }
  ]
}
`;
    } else if (type === 'questions') {
      const count = Number(params.questionCount) || 6;
      prompt = `
Fan: ${params.subject}
Sinf: ${params.grade}
Mavzu: ${params.topic}
Jami savollar: ${count} ta

Ushbu mavzu bo‘yicha Bloom taksonomiyasiga mos 3 toifadagi savollar to‘plamini va ularning namuna javoblarini tuzing:
1. Oson savollar (Bilish va eslash)
2. O‘rta savollar (Tushunish va qo‘llash)
3. Qiyin savollar (Tahlil, sintez, mantiqiy fikrlash)

Javobni quyidagi JSON formatda bering:
{
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "topic": "${params.topic}",
  "easy": [
    { "id": 1, "question": "Oson savol matni", "answerHint": "To‘g‘ri javob namunasi" }
  ],
  "medium": [
    { "id": 1, "question": "O‘rta savol matni", "answerHint": "To‘g‘ri javob namunasi" }
  ],
  "difficult": [
    { "id": 1, "question": "Qiyin/mantiqiy savol matni", "answerHint": "To‘g‘ri javob namunasi" }
  ]
}
`;
    } else if (type === 'homework') {
      prompt = `
Fan: ${params.subject}
Sinf: ${params.grade}
Mavzu: ${params.topic}

O‘quvchilarning qobiliyatiga qarab 3 xil tabaqalashtirilgan uy vazifasi to‘plamini tuzing:
1. Boshlang‘ich daraja (bazaviy tushunchalar, darslikdagi sodda mashqlar)
2. O‘rta daraja (mustaqil tahlil, formulalar yoki qoidalarni qo‘llash)
3. Yuqori daraja (ijodiy loyiha, tadqiqot, mantiqiy masalalar)

Javobni quyidagi JSON formatda bering:
{
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "topic": "${params.topic}",
  "beginnerLevel": {
    "tasks": ["1-topshiriq", "2-topshiriq"],
    "criteria": "Baho mezoni",
    "estimatedMinutes": 15
  },
  "mediumLevel": {
    "tasks": ["1-topshiriq", "2-topshiriq"],
    "criteria": "Baho mezoni",
    "estimatedMinutes": 25
  },
  "advancedLevel": {
    "tasks": ["1-topshiriq", "2-topshiriq"],
    "criteria": "Baho mezoni",
    "estimatedMinutes": 40
  },
  "instructionsForStudents": "O‘quvchilarga umumiy yo‘riqnoma va maslahatlar"
}
`;
    } else if (type === 'interactive') {
      const actType = params.activityType || 'Tezkor savol-javob';
      prompt = `
Fan: ${params.subject}
Sinf: ${params.grade}
Mavzu: ${params.topic}
Tanlangan faoliyat turi: "${actType}"

Ushbu faoliyat uchun darsda o‘quvchilarni jalb qiluvchi, jonli interaktiv topshiriq tayyorlang.
Quyidagi JSON formatda bering:
{
  "activityType": "${actType}",
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "topic": "${params.topic}",
  "title": "Faoliyatning qiziqarli nomi",
  "description": "Faoliyat maqsadi va qoidasi",
  "durationMinutes": 7,
  "instructions": [
    "1-qadam...",
    "2-qadam...",
    "3-qadam..."
  ],
  "blitzQuestions": [
    { "question": "Tezkor savol", "answer": "Javob", "points": 10 }
  ],
  "puzzleQuestion": {
    "riddle": "Sirli jumboq yoki qiziq hodisa ta'rifi",
    "clue": "Kichik yordamchi ishora",
    "answer": "Yechim va tushuntirish"
  },
  "trueFalseItems": [
    { "statement": "Fikr yoki tasdiq", "isTrue": true, "explanation": "Nega to‘g‘ri/noto‘g‘riligi" }
  ],
  "matchingPairs": [
    { "term": "Atama / Sana", "definition": "Mos keluvchi ta'rif" }
  ],
  "fiveChallenges": [
    { "level": 1, "question": "1-darajali savol", "points": 1, "answer": "Javob" },
    { "level": 2, "question": "2-darajali savol", "points": 2, "answer": "Javob" },
    { "level": 3, "question": "3-darajali savol", "points": 3, "answer": "Javob" },
    { "level": 4, "question": "4-darajali savol", "points": 4, "answer": "Javob" },
    { "level": 5, "question": "5-darajali savol", "points": 5, "answer": "Javob" }
  ],
  "groupTasks": [
    {
      "groupName": "1-guruh: Nazariyotchilar",
      "assignment": "Guruhga berilgan aniq vazifa",
      "roles": [
        { "roleName": "Spiker", "duty": "Fikrni taqdim etish" },
        { "roleName": "Tahlilchi", "duty": "Faktlarni saralash" },
        { "roleName": "Kotib", "duty": "Yozib borish" }
      ]
    },
    {
      "groupName": "2-guruh: Amaliyotchilar",
      "assignment": "Guruhga berilgan aniq vazifa",
      "roles": [
        { "roleName": "Spiker", "duty": "Fikrni taqdim etish" },
        { "roleName": "Tahlilchi", "duty": "Faktlarni saralash" },
        { "roleName": "Kotib", "duty": "Yozib borish" }
      ]
    }
  ],
  "teacherGuidelines": "O‘qituvchiga darsni boshqarish va g‘oliblarni aniqlash bo‘yicha tavsiyalar"
}
`;
    } else if (type === 'explain') {
      prompt = `
Quyidagi mavzuni o‘quvchilarga eng tushunarli, qiziqarli va ilmiy asoslangan holda tushuntirib bering.
Mavzu: ${params.topic}
Fan: ${params.subject || 'Umumiy'}
Sinf: ${params.grade || '7-sinf'}
Tushuntirish uslubi/darajasi: ${params.difficultyLevel || 'O‘quvchiga sodda'}

Quyidagi talablarga mos JSON formatda javob qaytaring:
{
  "topic": "${params.topic}",
  "subject": "${params.subject || ''}",
  "grade": "${params.grade || ''}",
  "difficultyLevel": "${params.difficultyLevel || 'O‘quvchiga sodda'}",
  "simpleExplanation": "O‘quvchiga sodda, tushunarli tilda 2-3 xatboshili bayon",
  "detailedExplanation": "Ilmiy, batafsil, qoidalar va mohiyatni ochib beruvchi to‘liq matn",
  "realLifeExample": "Ushbu mavzuning kundalik hayotimizda, tabiatda yoki texnikadagi aniq misoli",
  "importantTerms": [
    { "term": "Asosiy atama 1", "meaning": "Atamaning mazmuni" },
    { "term": "Asosiy atama 2", "meaning": "Atamaning mazmuni" },
    { "term": "Asosiy atama 3", "meaning": "Atamaning mazmuni" }
  ],
  "keyPoints": [
    "1-muhim qoida",
    "2-muhim qoida",
    "3-muhim qoida",
    "4-muhim qoida",
    "5-muhim qoida"
  ],
  "checkingQuestions": [
    { "question": "1-savol", "sampleAnswer": "To‘g‘ri javob" },
    { "question": "2-savol", "sampleAnswer": "To‘g‘ri javob" },
    { "question": "3-savol", "sampleAnswer": "To‘g‘ri javob" },
    { "question": "4-savol", "sampleAnswer": "To‘g‘ri javob" },
    { "question": "5-savol", "sampleAnswer": "To‘g‘ri javob" }
  ]
}
`;
    } else if (type === 'assessment') {
      prompt = `
O‘qituvchi uchun baholash mezonlari va rubrikasini tuzing:
Topshiriq nomi / Dars mavzusi: ${params.assignmentTitle}
Fan: ${params.subject}
Sinf: ${params.grade}
O‘quvchi darajasi: ${params.studentLevel}
Kutilayotgan natija: ${params.expectedResult || 'Mavzuni to‘liq o‘zlashtirish va amaliy ko‘nikma'}

Javobni quyidagi JSON formatda bering:
{
  "assignmentTitle": "${params.assignmentTitle}",
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "studentLevel": "${params.studentLevel}",
  "generalCriteria": [
    "1-mezon",
    "2-mezon",
    "3-mezon"
  ],
  "rubric": [
    {
      "criterion": "Bilim va tushunchalar",
      "maxPoints": 25,
      "levels": {
        "excellent": "A'lo (86-100%): Mavzuni to‘liq tushungan, atamalarni mukammal biladi",
        "good": "Yaxshi (71-85%): Asosiy qoidalarni biladi, mayda noaniqliklar bor",
        "satisfactory": "Qoniqarli (56-70%): Faqat tayanch tushunchalarni biladi",
        "unsatisfactory": "Qoniqarsiz (<56%): Tushunchalarni o‘zlashtirmagan"
      }
    },
    {
      "criterion": "Amaliy qo‘llash va tahlil",
      "maxPoints": 25,
      "levels": {
        "excellent": "Mustaqil va xatosiz amalda qo‘llay oladi",
        "good": "Kichik yordam bilan qo‘llaydi",
        "satisfactory": "Namunaga qarab bajaradi",
        "unsatisfactory": "Qo‘llay olmaydi"
      }
    },
    {
      "criterion": "Mantiqiy fikrlash va izchillik",
      "maxPoints": 25,
      "levels": {
        "excellent": "Fikrlar mantiqiy, asoslangan va ijodiy",
        "good": "Fikrlar izchil, asos yetarli",
        "satisfactory": "Fikr uzuq-yuluq",
        "unsatisfactory": "Mantiqiy bog‘liqlik yo‘q"
      }
    },
    {
      "criterion": "Daftar va topshiriqning rasmiylashtirilishi",
      "maxPoints": 25,
      "levels": {
        "excellent": "Ozoda, barcha qoidalar asosida bajarilgan",
        "good": "Umuman ozoda, 1-2 tuzatish bor",
        "satisfactory": "Tuzatishlar ko‘p",
        "unsatisfactory": "Talabga javob bermaydi"
      }
    }
  ],
  "pointsBreakdown": [
    { "category": "Nazariy qism", "points": 40, "explanation": "Mavzu bo‘yicha savollarga to‘liq javob" },
    { "category": "Amaliy mashq", "points": 40, "explanation": "Vazifalarni to‘g‘ri yechish" },
    { "category": "Faollik va ozodalik", "points": 20, "explanation": "Darsdagi ishtirok va topshiriq sifati" }
  ],
  "feedbackSamples": {
    "praise": "Balli! Siz mavzuni chuqur anglaganingiz va amaliyotda ajoyib natija ko‘rsatganingiz maqtovga loyiq.",
    "constructiveGuidance": "Yaxshi urinish, biroq 2-qismdagi qoidalarni yana bir bor takrorlab, formulalarga e'tibor qaratishingizni tavsiya qilaman.",
    "nextSteps": "Keyingi darsgacha qo‘shimcha adabiyotlardagi 5-mashqni mustaqil ishlab ko‘ring."
  }
}
`;
    } else {
      return res.status(400).json({ error: 'Noma\'lum turdagi so‘rov.' });
    }

    let response;
    let lastError: any = null;

    // Retry up to 2 times if temporary 503/429
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        if (response && response.text) break;
      } catch (e: any) {
        lastError = e;
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1200));
        }
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    const text = response?.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean up markdown block if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ success: true, data: parsedData });
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('Gemini API xatoligi (pedagogik andoza bilan to‘ldirilmoqda):', error.message);
    
    // Provide rich pedagogical response so the teacher is never blocked
    const fallbackData = getServerFallback(type, params);
    if (fallbackData) {
      return res.json({
        success: true,
        data: fallbackData,
        fallbackUsed: true,
        notice: 'AI xizmati vaqtincha band bo‘lgani sababli andoza asosida tuzildi.',
      });
    }

    return res.status(500).json({
      error: 'AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
      details: error.message,
    });
  }
});

function getServerFallback(type: string, params: any) {
  const subject = params.subject || 'Ona tili';
  const grade = params.grade || '7-sinf';
  const topic = params.topic || 'Umumiy mavzu';

  if (type === 'lesson') {
    return {
      topic,
      subject,
      grade,
      duration: params.duration || '45 daqiqa',
      lessonType: params.lessonType || 'Yangi bilim beruvchi dars',
      objectives: {
        educational: `O‘quvchilarga "${topic}" mavzusi bo‘yicha nazariy va amaliy tushunchalarni chuqur o‘rgatish.`,
        developmental: `O‘quvchilarning tahlil qilish, mantiqiy fikrlash va erkin xulosa chiqarish qobiliyatlarini o‘stirish.`,
        pedagogical: `O‘quvchilarda jamoada o‘zaro hamkorlik, mas'uliyat va ilmga muhabbat tuyg‘ularini tarbiyalash.`,
      },
      expectedOutcomes: [
        `"${topic}" tushunchasining mohiyatini to‘liq biladi va mustaqil ta'riflaydi.`,
        `Mavzuga oid amaliy misol va mashqlarni xatosiz bajara oladi.`,
        `Darsda o‘rganilgan bilimlarni hayotiy vaziyatlarda qo‘llay oladi.`,
      ],
      requiredEquipments: [
        'Darslik va ish daftarlari',
        'Ko‘rgazmali plakatlar yoki taqdimot slaydlari',
        'Mavzuga oid tarqatma topshiriqlar',
      ],
      stages: {
        organizational: `Salomlashish, sinf davomati va tozaligini ko‘zdan kechirish (2 daqiqa).\nO‘quvchilar e'tiborini darsga jalb qilish uchun qisqa ruhiy tetiklashtiruvchi mashq o‘tkazish.`,
        previousTopicReview: `O‘tgan mavzu bo‘yicha "Tezkor zanjir" usulida 3 ta savol-javob o‘tkazish (5 daqiqa).\nUy vazifasini 2 nafar o‘quvchi orqali sinfda qisqa tekshirish.`,
        newTopicExplanation: `O‘qituvchining "${topic}" mavzusiga kirish so‘zi (15 daqiqa).\nAsosiy qoidalar, formulalar yoki faktlar ko‘rgazmali tarzda doskada bayon etiladi.\n"Insert" metodi yordamida asosiy tushunchalar daftarga qayd etiladi.`,
        practicalActivity: `Darslikdagi asosiy mashqlarni juftliklarda bajarish (10 daqiqa).\nDoskada 2 ta namunaviy misolni yechish va sinf bilan tahlil qilish.`,
        consolidation: `"To‘g‘ri yoki noto‘g‘ri" tezkor o‘yini yordamida olingan bilimlarni mustahkamlash (5 daqiqa).`,
        assessment: `O‘quvchilarning darsdagi ishtirokini shakllantiruvchi baholash (3 daqiqa).\nRag‘batlantiruvchi so‘zlar va ballar bilan baholash.`,
        homework: `Mavzuni to‘liq o‘qib chiqish, mavzu oxiridagi amaliy topshiriqlarni daftarda bajarish (3 daqiqa).`,
        conclusion: `"3-2-1" usuli: Bugun nima o‘rgandik? O‘qituvchining dars yakuniy xulosasi (2 daqiqa).`,
      },
      teacherNotes: `Dars davomida barcha o‘quvchilar faolligini ta'minlashga va tabaqalashtirilgan yondashuvga e'tibor qarating.`,
    };
  }

  if (type === 'test') {
    const count = Number(params.questionCount) || 5;
    return {
      subject,
      grade,
      topic,
      difficulty: params.difficulty || 'O‘rta',
      questions: [
        {
          id: 1,
          question: `"${topic}" mavzusining asosiy maqsadi nimadan iborat?`,
          options: {
            A: `Nazariy bilimlarni mustahkamlash va amalda qo‘llash`,
            B: `Faqat qoidalarni yodlab olish`,
            C: `Matnni ko‘chirib yozish`,
            D: `Faqat nazorat ishiga tayyorlanish`,
          },
          correctAnswer: 'A',
          explanation: `Mavzuning bosh maqsadi bilimlarni amaliyotga tatbiq etishdir.`,
        },
        {
          id: 2,
          question: `Quyidagi keltirilgan fikrlardan qaysi biri "${topic}" ga to‘liq mos keladi?`,
          options: {
            A: `Fikrlar ilmiy faktlarga tayanadi`,
            B: `Mavzu amaliy ahamiyatga ega emas`,
            C: `Faqat yuqori sinflarda o‘rganiladi`,
            D: `Darslikda yoritilmagan`,
          },
          correctAnswer: 'A',
          explanation: `Har qanday ilmiy xulosa dalil va faktlarga asoslanadi.`,
        },
        {
          id: 3,
          question: `${subject} fanida "${topic}" o‘rganilganda qanday ko‘nikma shakllanadi?`,
          options: {
            A: `Mantiqiy tahlil va fanga oid savodxonlik`,
            B: `Jismoniy chaqqonlik`,
            C: `Hech qanday ko‘nikma shakllanmaydi`,
            D: `Faqat tasviriy mahorat`,
          },
          correctAnswer: 'A',
          explanation: `Ushbu mavzu o‘quvchida fanga oid tayanch kompetensiyani rivojlantiradi.`,
        },
      ].slice(0, count),
    };
  }

  if (type === 'questions') {
    return {
      subject,
      grade,
      topic,
      easy: [
        { id: 1, question: `"${topic}" tushunchasiga ta'rif bering.`, answerHint: `Asosiy qoidadagi ta'rif keltiriladi.` },
        { id: 2, question: `Ushbu mavzuning asosiy belgilari nimalardan iborat?`, answerHint: `Darslikdagi tayanch belgilar aytiladi.` }
      ],
      medium: [
        { id: 3, question: `"${topic}" hodisasining sabab va oqibatlarini tushuntiring.`, answerHint: `Sabab-oqibat zanjiri izohlanadi.` },
        { id: 4, question: `Mavzuning hayotiy misolini ko‘rsating va asoslang.`, answerHint: `Kundalik hayotdagi tatbiqi ko‘rsatiladi.` }
      ],
      difficult: [
        { id: 5, question: `Agar berilgan shartlar o‘zgarsa, "${topic}" qanday o‘zgaradi?`, answerHint: `Mantiqiy xulosa va ijodiy yondashuv bildiriladi.` },
        { id: 6, question: `Mavzu bo‘yicha muammoli vaziyatga o‘z mustaqil yechimingizni bering.`, answerHint: `Tanqidiy tahlil orqali yangi yechim beriladi.` }
      ]
    };
  }

  if (type === 'homework') {
    return {
      subject,
      grade,
      topic,
      beginnerLevel: {
        tasks: [
          `Darslikdagi "${topic}" mavzusini o‘qib, 3 ta yangi atamani yozing.`,
          `Mavzu so‘ngidagi 1-2 savollarga yozma javob bering.`
        ],
        criteria: `Barcha savollarga aniq javob berilgan (Qoniqarli/Yaxshi).`,
        estimatedMinutes: 15
      },
      mediumLevel: {
        tasks: [
          `Mavzuga oid 3 va 4-amaliy mashqlarni bajaring.`,
          `Asosiy qoidani aks ettiruvchi sxema yoki klaster tuzing.`
        ],
        criteria: `Mashqlar xatosiz, sxema mantiqiy tuzilgan (Yaxshi/A'lo).`,
        estimatedMinutes: 25
      },
      advancedLevel: {
        tasks: [
          `"${topic}" mavzusining amaliy ahamiyati haqida 1 varaqli mini-tadqiqot tayyorlang.`,
          `Sinfdoshlar uchun 3 ta mantiqiy savol tuzing.`
        ],
        criteria: `Original fikr va ijodkorlik (A'lo va maxsus rag‘bat).`,
        estimatedMinutes: 35
      },
      instructionsForStudents: `O‘z imkoniyatingizga mos darajani tanlang va mustaqil ishlashga harakat qiling!`
    };
  }

  if (type === 'interactive') {
    const actType = params.activityType || 'Tezkor savol-javob';
    return {
      activityType: actType,
      subject,
      grade,
      topic,
      title: `"${topic}" bo‘yicha interfaol ${actType}`,
      description: `O‘quvchilarning darsdagi qiziqishini oshiruvchi va diqqatni jamlovchi faoliyat.`,
      durationMinutes: 7,
      instructions: [
        `1. O‘qituvchi qoidalarni e'lon qiladi.`,
        `2. O‘quvchilar tezkor javob tayyorlaydilar.`,
        `3. G‘oliblar rag‘batlantiriladi.`
      ],
      blitzQuestions: [
        { question: `"${topic}" qaysi fanga oid?`, answer: subject, points: 5 },
        { question: `Mavzuning eng asosiy tushunchasi nima?`, answer: topic, points: 10 }
      ],
      puzzleQuestion: {
        riddle: `Men hamma joydaman, mavzu bilan bog‘liqman. Men nimaniman?`,
        clue: `Dars mavzusiga diqqat qiling!`,
        answer: `"${topic}" tushunchasi.`
      },
      trueFalseItems: [
        { statement: `"${topic}" faqat nazariy ahamiyatga ega.`, isTrue: false, explanation: `Amalda keng qo‘llanadi.` },
        { statement: `Mavzuni bilish keyingi darslarga yordam beradi.`, isTrue: true, explanation: `Bilimlar uzviy bog‘liq.` }
      ],
      matchingPairs: [
        { term: `Asosiy tushuncha`, definition: `Poydevor ta'rif` },
        { term: `Qoida`, definition: `Masalalar yechish algoritmi` }
      ],
      fiveChallenges: [
        { level: 1, question: `1-bosqich: Mavzu nomini ayting.`, points: 10, answer: topic },
        { level: 2, question: `2-bosqich: 1 ta qoida ayting.`, points: 20, answer: `Qoida matni` },
        { level: 3, question: `3-bosqich: Misol keltiring.`, points: 30, answer: `Misol` },
        { level: 4, question: `4-bosqich: Mantiqiy savolga javob bering.`, points: 40, answer: `Yechim` },
        { level: 5, question: `5-bosqich: Xulosa chiqaring.`, points: 50, answer: `Innovatsion fikr` }
      ],
      groupTasks: [
        {
          groupName: `1-guruh: "Zukkolar"`,
          assignment: `Mavzu bo‘yicha klaster tuzing.`,
          roles: [
            { roleName: `Spiker`, duty: `Taqdimot qilish` },
            { roleName: `Kotib`, duty: `Yozib borish` }
          ]
        }
      ],
      teacherGuidelines: `O‘quvchilarni faollikka undash uchun ularning fikrlarini olqishlang.`
    };
  }

  if (type === 'explain') {
    return {
      topic,
      subject,
      grade,
      difficultyLevel: params.difficultyLevel || 'O‘quvchiga sodda',
      simpleExplanation: `"${topic}" — kundalik hayotimiz bilan chambarchas bog‘liq bo‘lgan ajoyib mavzudir. Har bir narsaning o‘z tartib-qoidasi bo‘lgani kabi, bu tushuncha ham olam qonuniyatlarini tushunishga yordam beradi.`,
      detailedExplanation: `Ilmiy nuqtai nazardan qaraganda, "${topic}" tizimli qonuniyatlar majmuidir. U tarkibiy qismlar, o‘zaro bog‘liqlik va rivojlanish mexanizmlarini qamrab oladi. Bu bilimlar yangi kashfiyotlar poydevoridir.`,
      realLifeExample: `Biz har kuni atrofimizda "${topic}" bilan bog‘liq hodisalarga guvoh bo‘lamiz. U insonlar turmushini qulayroq va xavfsizroq qilishga xizmat qiladi.`,
      importantTerms: [
        { term: `Bosh atama`, meaning: `Mavzuning asosiy negizi.` },
        { term: `Qonuniyat`, meaning: `Hodisalar o‘rtasidagi zaruriy bog‘liqlik.` }
      ],
      keyPoints: [
        `1. "${topic}" aniq mantiqiy qoidalarga tayanadi.`,
        `2. Oldingi bilimlarga tayanib o‘rganiladi.`,
        `3. Amaliyotda keng qo‘llanadi.`,
        `4. Zamonaviy kasblarda zarur.`,
        `5. Savol berish orqali chuqurroq o‘rganiladi.`
      ],
      checkingQuestions: [
        { question: `Mavzuni o‘z so‘zingiz bilan qanday tushuntirasiz?`, sampleAnswer: `Sodda ta'rif aytiladi.` },
        { question: `Hayotiy misol keltiring.`, sampleAnswer: `Turmushdan misol ko‘rsatiladi.` }
      ]
    };
  }

  if (type === 'assessment') {
    return {
      assignmentTitle: params.assignmentTitle || topic,
      subject,
      grade,
      studentLevel: params.studentLevel || 'Aralash',
      generalCriteria: [
        `Mavzuni to‘liq tushunganlik va qoidalarni to‘g‘ri qo‘llash`,
        `Topshiriqni mustaqil va izchil bajarish`,
        `Mantiqiy xulosalar va ozodalik`
      ],
      rubric: [
        {
          criterion: `Nazariy bilimlar`,
          maxPoints: 30,
          levels: {
            excellent: `A'lo (26-30 ball): Qoidalarni mukammal biladi.`,
            good: `Yaxshi (21-25 ball): Asosiy qoidalarni biladi, mayda xatolari bor.`,
            satisfactory: `Qoniqarli (16-20 ball): Faqat tayanch atamalarni biladi.`,
            unsatisfactory: `Qoniqarsiz (<16 ball): O‘zlashtirmagan.`
          }
        },
        {
          criterion: `Amaliy topshiriq`,
          maxPoints: 40,
          levels: {
            excellent: `A'lo (35-40 ball): Mustaqil va xatosiz yechgan.`,
            good: `Yaxshi (28-34 ball): Yaxshi yechgan, 1-2 noaniqlik bor.`,
            satisfactory: `Qoniqarli (20-27 ball): Yordam bilan yechgan.`,
            unsatisfactory: `Qoniqarsiz (<20 ball): Bajarolmagan.`
          }
        },
        {
          criterion: `Ozodalik va vaqt`,
          maxPoints: 30,
          levels: {
            excellent: `A'lo (26-30 ball): Talabga to‘liq mos, vaqtida.`,
            good: `Yaxshi (21-25 ball): Ozoda, vaqtida topshirilgan.`,
            satisfactory: `Qoniqarli (16-20 ball): Kechiktirilgan.`,
            unsatisfactory: `Qoniqarsiz (<16 ball): Tartibsiz.`
          }
        }
      ],
      pointsBreakdown: [
        { category: `Nazariya`, points: 30, explanation: `Og‘zaki yoki yozma savollarga javob` },
        { category: `Amaliyot`, points: 40, explanation: `Mashqlar yechimi` },
        { category: `Ozodalik`, points: 30, explanation: `Daftar yuritish madaniyati` }
      ],
      feedbackSamples: {
        praise: `Barakalla! Topshiriqni juda yaxshi va izchil bajargansiz.`,
        constructiveGuidance: `Nazariy qoidalarni yana bir bor takrorlab, mashqlarga ko‘proq e'tibor qarating.`,
        nextSteps: `Keyingi bosqichda ijodiy topshiriqlarni mustaqil yechishga intiling.`
      }
    };
  }

  return null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`USTOZ AI server ishga tushdi: http://0.0.0.0:${port}`);
  });
}

startServer();
