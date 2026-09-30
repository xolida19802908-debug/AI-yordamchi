import {
  LessonPlan,
  TestCollection,
  QuestionTierSet,
  HomeworkSet,
  InteractiveActivityContent,
  TopicExplanation,
  AssessmentCriteria,
  InteractiveActivityType,
} from '../types';

export class ApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fallback generators in natural Uzbek if API is offline or key missing
function getFallbackLesson(params: {
  subject: string;
  grade: string;
  topic: string;
  duration?: string;
  lessonType?: string;
  objective?: string;
  studentLevel?: string;
}): LessonPlan {
  const { subject, grade, topic, duration = '45 daqiqa', lessonType = 'Yangi bilim beruvchi dars' } = params;
  return {
    topic,
    subject,
    grade,
    duration,
    lessonType,
    objectives: {
      educational: `O‘quvchilarga "${topic}" mavzusining mazmun-mohiyatini chuqur o‘rgatish, asosiy qoida va atamalarni mustaqil tahlil qilish ko‘nikmasini shakllantirish.`,
      developmental: `O‘quvchilarning mantiqiy fikrlash, tanqidiy qarash, xulosa chiqarish va o‘zaro fikr almashish qobiliyatlarini rivojlantirish.`,
      pedagogical: `O‘quvchilarda ilm-fanga qiziqish, jamoada o‘zaro hurmat bilan ishlash, milliy va umuminsoniy qadriyatlarga sodiqlik tuyg‘usini tarbiyalash.`,
    },
    expectedOutcomes: [
      `"${topic}" tushunchasining asosiy mohiyatini to‘liq tushunadi va o‘z so‘zlari bilan izohlab bera oladi.`,
      `Mavzuga oid formulalar, sanalar yoki qoidalarni amaliy misollarda xatosiz qo‘llay oladi.`,
      `Guruh va juftliklarda mustaqil topshiriqlarni faol bajaradi hamda o‘z natijasini baholay oladi.`,
    ],
    requiredEquipments: [
      'Darslik va ish daftarlari',
      'Mavzuga oid tarqatma materiallar va test kartochkalari',
      'Elektron doska yoki ko‘rgazmali plakatlar',
      'Baholash rag‘bat kartochkalari',
    ],
    stages: {
      organizational: `1. O‘quvchilar bilan salomlashish, sinf tozaligi va davomatni tekshirish (2 daqiqa).
2. O‘quvchilarda ijobiy psixologik kayfiyat uyg‘otish uchun "Xush kayfiyat ulash" tezkor mashqini o‘tkazish.
3. Dars maqsadi va baholash mezonlari bilan qisqacha tanishtirish.`,
      previousTopicReview: `1. O‘tgan dars yuzasidan "Zanjir" usulida tezkor savol-javob o‘tkazish (5 daqiqa).
2. O‘quvchilardan 2 nafariga uy vazifasi tahlilini doskada ko‘rsatish topshiriladi.
3. Yangi mavzu bilan o‘tgan mavzu o‘rtasidagi mantiqiy ko‘prik savoli o‘rtaga tashlanadi.`,
      newTopicExplanation: `1. Muammoli vaziyat yaratish: O‘qituvchi "${topic}" mavzusiga oid qiziqarli hayotiy savol bilan darsni boshlaydi (15 daqiqa).
2. Yangi atamalar va asosiy qoidalar doskada/slaydda namoyish qilinadi.
3. "Klaster" va "Insert" metodlari yordamida yangi ma'lumotlar o‘quvchilar bilan birgalikda tahlil qilinadi.
4. Muhim xulosalar daftarga qayd ettiriladi.`,
      practicalActivity: `1. O‘quvchilarni 3 guruhga ajratib, tabaqalashtirilgan amaliy mashqlar berish (12 daqiqa).
2. 1-guruh: Darslikdagi asosiy mashqni yechish.
3. 2-guruh: Mavzuning hayotiy tatbiqiga oid masalani tahlil qilish.
4. 3-guruh: Ijodiy sxema yoki aqliy xarita (mind-map) chizish.`,
      consolidation: `1. "To‘g‘ri yoki noto‘g‘ri" tezkor o‘yini orqali yangi bilimlarni mustahkamlash (5 daqiqa).
2. 3 ta yakuniy nazorat savoliga o‘quvchilarning tezkor javoblarini eshitish.`,
      assessment: `1. O‘quvchilarning darsdagi ishtiroki, amaliy mashg‘ulotdagi faolligi va javoblari bo‘yicha shakllantiruvchi baholash (3 daqiqa).
2. "Rangli stikerlar" va rag‘batlantiruvchi so‘zlar ("Barakalla", "Yaxshi urinish") orqali baholarni e'lon qilish.`,
      homework: `1. Darslikdagi ${topic} mavzusini diqqat bilan o‘qib chiqish va qoidalarni yod olish.
2. 1-darajali vazifa: Darslikdagi tegishli topshiriqni daftarda bajarish.
3. 2-darajali (ijodiy) vazifa: Mavzuga oid hayotiy misol yoki mini-esse tayyorlash.`,
      conclusion: `1. "3-2-1" refleksiya usuli: O‘quvchilar bugun o‘rgangan 3 ta yangi fakt, 2 ta qiziq jihat va 1 ta tushunmagan savolini aytadilar (3 daqiqa).
2. O‘qituvchining dars yakuni bo‘yicha umumiy xulosasi va o‘quvchilarga minnatdorchilik bildirish.`,
    },
    teacherNotes: `Dars jarayonida passiv o‘quvchilarni juftlikdagi ishlarga jalb qiling va individual yondashuvni ta'minlang.`,
  };
}

function getFallbackTests(params: {
  subject: string;
  grade: string;
  topic: string;
  questionCount?: number;
  difficulty?: string;
}): TestCollection {
  const count = Number(params.questionCount) || 5;
  const sampleQuestions = [
    {
      id: 1,
      question: `"${params.topic}" mavzusining asosiy maqsadi va bosh tushunchasi nimadan iborat?`,
      options: {
        A: `Nazariy qoidalarni chuqur o‘rganish va amaliyotga tatbiq etish`,
        B: `Faqatgina ma'lumotlarni yodlab olish`,
        C: `Tarixiy sanalarni qayd etish`,
        D: `Kuzatuvchilik qobiliyatini cheklash`,
      },
      correctAnswer: 'A' as const,
      explanation: `Mavzuning bosh maqsadi nazariy bilimni amaliyot bilan uzviy bog‘lashdir.`,
    },
    {
      id: 2,
      question: `${params.subject} fanida "${params.topic}" doirasida o‘rganiladigan eng muhim tamoyil qaysi?`,
      options: {
        A: `Passiv qabul qilish tamoyili`,
        B: `Izchillik, ilmiylik va tizimlilik tamoyili`,
        C: `Faqat test yechish uslubi`,
        D: `Tasodifiy taxminlar tamoyili`,
      },
      correctAnswer: 'B' as const,
      explanation: `Har qanday ilmiy fanda izchillik va tizimlilik yetakchi o‘rin tutadi.`,
    },
    {
      id: 3,
      question: `Quyidagi keltirilgan fikrlardan qaysi biri "${params.topic}" mavzusiga to‘liq mos keladi?`,
      options: {
        A: `Mavzu amaliy qo‘llanish sohasiga ega emas`,
        B: `Olingan xulosalar tajriba va mantiqiy tahlilga asoslanadi`,
        C: `Ushbu tushuncha faqat yuqori sinflarga tegishli`,
        D: `Mavzu o‘quv dasturidan chiqarilgan`,
      },
      correctAnswer: 'B' as const,
      explanation: `Ilmiy xulosalar doimo tajriba va mantiqiy dalillar bilan quvvatlanadi.`,
    },
    {
      id: 4,
      question: `"${params.topic}" o‘rganilganda o‘quvchilarda qaysi tayanch kompetensiya rivojlanadi?`,
      options: {
        A: `Matematik savodxonlik, fan va texnika yangiliklaridan xabardor bo‘lish`,
        B: `Faqat jismoniy chaqqonlik`,
        C: `Hech qanday ko‘nikma hosil bo‘lmaydi`,
        D: `Xorijiy tillarni avtomatik o‘rganish`,
      },
      correctAnswer: 'A' as const,
      explanation: `Ushbu mavzu o‘quvchilarda fanga oid tayanch savodxonlikni shakllantiradi.`,
    },
    {
      id: 5,
      question: `Mavzuni mustahkamlashda eng samarali pedagogik usul qaysi?`,
      options: {
        A: `Muammoli vaziyatlarni tahlil qilish va amaliy topshiriqlar bajarish`,
        B: `Darslikni shunchaki ko‘chirib yozish`,
        C: `O‘rganilganlarni tahlil qilmaslik`,
        D: `Topshiriqlarni e'tiborsiz qoldirish`,
      },
      correctAnswer: 'A' as const,
      explanation: `Muammoli ta'lim va amaliyot o‘quvchilar xotirasida bilimlarni chuqur saqlaydi.`,
    },
  ];

  return {
    subject: params.subject,
    grade: params.grade,
    topic: params.topic,
    difficulty: (params.difficulty as any) || 'O‘rta',
    questions: sampleQuestions.slice(0, count),
  };
}

function getFallbackQuestions(params: { subject: string; grade: string; topic: string }): QuestionTierSet {
  return {
    subject: params.subject,
    grade: params.grade,
    topic: params.topic,
    easy: [
      {
        id: 1,
        question: `"${params.topic}" atamasining lug‘aviy ma'nosi va ta'rifi nima?`,
        answerHint: `Mavzuning tayanch qoidasida berilgan asosiy ta'rif keltiriladi.`,
      },
      {
        id: 2,
        question: `Ushbu mavzuda qaysi asosiy belgilar va tushunchalar o‘rganiladi?`,
        answerHint: `Darslikda keltirilgan 2-3 ta asosiy xususiyat sanab o‘tiladi.`,
      },
    ],
    medium: [
      {
        id: 3,
        question: `"${params.topic}" hodisasi yoki qoidasining o‘ziga xos sabab va oqibatlarini tushuntiring.`,
        answerHint: `Sabab-oqibat zanjiri va formulalar yordamida izoh beriladi.`,
      },
      {
        id: 4,
        question: `Ushbu mavzuni o‘tgan mavzu bilan qiyoslang: o‘xshash va farqli tomonlari nimada?`,
        answerHint: `Venn diagrammasi asosida 2 ta o‘xshash va 2 ta farqli jihat ko‘rsatiladi.`,
      },
    ],
    difficult: [
      {
        id: 5,
        question: `Agar berilgan shartlar o‘zgarsa, "${params.topic}" natijasi qanday o‘zgaradi? Hayotiy misol keltiring.`,
        answerHint: `Mantiqiy faraz ilgari suriladi va kundalik hayotdagi bog‘liqlik asoslanadi.`,
      },
      {
        id: 6,
        question: `Mavzu bo‘yicha muammoli vaziyatga o‘z mustaqil yechimingiz va taklifingizni bildiring.`,
        answerHint: `Tanqidiy tahlil va ijodiy yondashuv orqali muqobil yechim beriladi.`,
      },
    ],
  };
}

function getFallbackHomework(params: { subject: string; grade: string; topic: string }): HomeworkSet {
  return {
    subject: params.subject,
    grade: params.grade,
    topic: params.topic,
    beginnerLevel: {
      tasks: [
        `Darslikdagi "${params.topic}" mavzusini to‘liq o‘qib, lug‘at daftaringizga 3 ta yangi atamani yozing.`,
        `Mavzu oxiridagi 1 va 2-savollarga qisqa yozma javob bering.`,
      ],
      criteria: `Barcha atamalar to‘g‘ri yozilgan va savollarga aniq javob berilgan bo‘lishi lozim (Baho: Qoniqarli / Yaxshi).`,
      estimatedMinutes: 15,
    },
    mediumLevel: {
      tasks: [
        `Darslikdagi 3 va 4-amaliy mashqlarni mustaqil ravishda daftarga ishlab chiqing.`,
        `"${params.topic}" bo‘yicha asosiy tushunchalarni aks ettiruvchi sxema yoki klaster tuzing.`,
      ],
      criteria: `Misollar to‘g‘ri yechilgan, sxema mantiqiy va tushunarli tuzilgan (Baho: Yaxshi / A'lo).`,
      estimatedMinutes: 25,
    },
    advancedLevel: {
      tasks: [
        `"${params.topic} kundalik hayotimizda qanday yordam beradi?" mavzusida 1 varaqli mini-tadqiqot yoki esse tayyorlang.`,
        `Mavzuga oid sinfdoshlaringiz uchun 3 ta qiziqarli mantiqiy test yoki krossvord tuzing.`,
      ],
      criteria: `Fikrlar original, dalillar asoslangan va ijodkorlik yuqori darajada (Baho: A'lo va rag‘bat).`,
      estimatedMinutes: 35,
    },
    instructionsForStudents: `Hurmatli o‘quvchi! O‘z qobiliyatingizga qarab xohlagan darajadagi topshiriqni tanlashingiz mumkin. O‘z ustingizda ishlash va yuqori darajaga intilish doimo maqtovga sazovordir!`,
  };
}

function getFallbackInteractive(params: {
  subject: string;
  grade: string;
  topic: string;
  activityType?: InteractiveActivityType;
}): InteractiveActivityContent {
  const actType = params.activityType || 'Tezkor savol-javob';
  return {
    activityType: actType,
    subject: params.subject,
    grade: params.grade,
    topic: params.topic,
    title: `"${params.topic}" bo‘yicha interfaol ${actType}`,
    description: `Ushbu faoliyat o‘quvchilarning diqqatini jamlash, darsga bo‘lgan qiziqishini oshirish va olgan bilimlarini jonli sinovdan o‘tkazishga qaratilgan.`,
    durationMinutes: 7,
    instructions: [
      `1. O‘qituvchi o‘yin qoidalarini va vaqt chegarasini sinfga tushuntiradi.`,
      `2. O‘quvchilar individual yoki guruh bo‘lib javoblarni tayyorlaydilar.`,
      `3. To‘g‘ri javob bergan ishtirokchilar maxsus ballar yoki rangli kartochkalar bilan rag‘batlantiriladi.`,
    ],
    blitzQuestions: [
      { question: `"${params.topic}" qaysi fanning muhim bo‘limiga kiradi?`, answer: params.subject, points: 5 },
      { question: `Ushbu tushuncha dastlab qayerda yoki qachon shakllangan?`, answer: `Darslikdagi tarixiy ma'lumot`, points: 5 },
      { question: `Mavzuning eng asosiy qoidasi nima?`, answer: `Asosiy qoida formulasi`, points: 10 },
      { question: `Kundalik hayotda bunga bitta misol keltiring.`, answer: `Turmushdagi amaliy qo‘llanilishi`, points: 10 },
    ],
    puzzleQuestion: {
      riddle: `Men har qadamda borman, lekin ko‘zga doim ham ko‘rinmayman. Ilm egalari meni formulada yoki qoidada ifodalaydi. Men nimaniman?`,
      clue: `Mavzuyimiz "${params.topic}" bilan bevosita bog‘liq!`,
      answer: `"${params.topic}" tushunchasining ilmiy ta'rifi.`,
    },
    trueFalseItems: [
      {
        statement: `"${params.topic}" tushunchasi faqat nazariy ahamiyatga ega, amalda qo‘llanilmaydi.`,
        isTrue: false,
        explanation: `Noto‘g‘ri! Bu tushuncha amaliyotda, ishlab chiqarishda va kundalik turmushda keng tatbiq etiladi.`,
      },
      {
        statement: `Mavzuni to‘g‘ri tushunish fanning keyingi bo‘limlarini o‘zlashtirishga yordam beradi.`,
        isTrue: true,
        explanation: `To‘g‘ri! Chunki bu bilimlar uzviy zanjir hisoblanadi.`,
      },
    ],
    matchingPairs: [
      { term: `Asosiy tushuncha`, definition: `Mavzuning poydevor ta'rifi` },
      { term: `Amaliy qoida`, definition: `Masalalar yechishda qo‘llaniladigan algoritm` },
      { term: `Xulosa`, definition: `Tahlil natijasida olingan yakuniy fikr` },
    ],
    fiveChallenges: [
      { level: 1, question: `1-bosqich (Oson): Mavzuning nomini va asosiy so‘zini ayting.`, points: 10, answer: params.topic },
      { level: 2, question: `2-bosqich: Mavzuga oid 1 ta qoidani yoddan ayting.`, points: 20, answer: `Qoida matni` },
      { level: 3, question: `3-bosqich: Bitta amaliy misol keltirib bering.`, points: 30, answer: `Misol tahlili` },
      { level: 4, question: `4-bosqich: Chalg‘ituvchi savolga to‘g‘ri javob toping.`, points: 40, answer: `Mantiqiy yechim` },
      { level: 5, question: `5-bosqich (Ekspert): Mavzuning yangi yechimini taklif qiling.`, points: 50, answer: `Innovatsion fikr` },
    ],
    groupTasks: [
      {
        groupName: `1-guruh: "Zukkolar"`,
        assignment: `"${params.topic}" mavzusiga oid 5 ta tayanch atamani saralab, ularning o‘zaro bog‘liqlik xaritasini chizing.`,
        roles: [
          { roleName: `Guruh yetakchisi`, duty: `Ishni muvofiqlashtirish va umumiy xulosa berish` },
          { roleName: `Dizayner/Kotib`, duty: `Plakatda ko‘rgazmali xaritani chizish` },
          { roleName: `Spiker`, duty: `Sinf oldida 2 daqiqada taqdimot qilish` },
        ],
      },
      {
        groupName: `2-guruh: "Kashfiyotchilar"`,
        assignment: `"${params.topic}" hayotimizda uchramasa nima bo‘lardi? degan savolga 3 ta asosli dalil keltiring.`,
        roles: [
          { roleName: `Guruh yetakchisi`, duty: `Fikrlar bahsini boshqarish` },
          { roleName: `Fakt tekshiruvchi`, duty: `Darslikdagi ma'lumotlar bilan solishtirish` },
          { roleName: `Spiker`, duty: `Guruh xulosasini himoya qilish` },
        ],
      },
    ],
    teacherGuidelines: `O‘quvchilarni faollikka undash uchun ularning har bir qiziqarli fikrini olqishlang. Vaqt tugashini qo‘ng‘iroq yoki orqaga hisoblash orqali belgilang.`,
  };
}

function getFallbackExplanation(params: {
  topic: string;
  subject?: string;
  grade?: string;
  difficultyLevel?: string;
}): TopicExplanation {
  return {
    topic: params.topic,
    subject: params.subject || 'Umumiy fan',
    grade: params.grade || '7-sinf',
    difficultyLevel: (params.difficultyLevel as any) || 'O‘quvchiga sodda',
    simpleExplanation: `"${params.topic}" — bu kundalik hayotimiz va atrofimizdagi olamni chuqurroq tushunishimizga yordam beradigan ajoyib mavzudir. Tasavvur qiling, har bir buyum yoki hodisaning o‘z qoidalari bor. Ushbu mavzu ana shu qoidalarning eng qiziqarli va foydali sirlarini bizga ochib beradi.`,
    detailedExplanation: `Ilmiy jihatdan olganda, "${params.topic}" tizimli qonuniyatlar majmuidir. U o‘z ichiga tarkibiy qismlar, o‘zaro ta'sir mexanizmlari hamda rivojlanish bosqichlarini qamrab oladi. Ushbu bilimlar fanda yangi kashfiyotlar qilish va amaliy masalalarni aniq hisob-kitoblar bilan yechish uchun asosiy tayanch hisoblanadi.`,
    realLifeExample: `Masalan, biz har kuni ovqat pishirganda, telefondan foydalanganda yoki ko‘chada transport harakatini kuzatganimizda "${params.topic}" bilan bog‘liq hodisalarga guvoh bo‘lamiz. U bizning hayotimizni yanada qulay, xavfsiz va qiziqarli qilishga xizmat qiladi.`,
    importantTerms: [
      { term: `Poydevor atama`, meaning: `Mavzuning negizida yotuvchi bosh tushuncha.` },
      { term: `Qonuniyat`, meaning: `Hodisalar o‘rtasidagi doimiy va zaruriy bog‘liqlik.` },
      { term: `Amaliy natija`, meaning: `Nazariyani hayotga tatbiq etish orqali olinadigan samara.` },
    ],
    keyPoints: [
      `1. "${params.topic}" tasodifiy emas, balki aniq qonuniyatlarga tayanadi.`,
      `2. Mavzuni o‘rganishda avvalgi darsdagi bilimlar mustahkam poydevor vazifasini o‘taydi.`,
      `3. Asosiy formulalar va ta'riflarni tushunib olish yodlab olishdan ko‘ra samaraliroqdir.`,
      `4. Ushbu tushuncha zamonaviy kasblar va texnologiyalarda keng qo‘llaniladi.`,
      `5. Savol berish va mustaqil izlanish mavzuni mukammal egallash kalitidir.`,
    ],
    checkingQuestions: [
      {
        question: `Bugungi mavzuning eng muhim ta'rifini o‘z so‘zingiz bilan qanday aytgan bo‘lardingiz?`,
        sampleAnswer: `O‘quvchi mavzuning mohiyatini sodda jumlalar bilan tushuntirib berishi kutiladi.`,
      },
      {
        question: `Ushbu qoidaning hayotiy misoli qayerda uchraydi?`,
        sampleAnswer: `Kundalik hayot, tabiat yoki texnikadan aniq bir misol keltiriladi.`,
      },
      {
        question: `Mavzuga oid eng asosiy atama qaysi va u nimani anglatadi?`,
        sampleAnswer: `Asosiy atamaning to‘g‘ri ma'nosi izohlanadi.`,
      },
      {
        question: `Agar ushbu qonuniyat ishlamasa qanday oqibat kelib chiqardi?`,
        sampleAnswer: `Mantiqiy tahlil orqali muammo va buzilishlar keltirib o‘tiladi.`,
      },
      {
        question: `Ushbu mavzudan olgan bilimingizni kelajakda qanday qo‘llashingiz mumkin?`,
        sampleAnswer: `Kelajak kasbiy faoliyat yoki o‘qishdagi amaliy foydasi aytiladi.`,
      },
    ],
  };
}

function getFallbackAssessment(params: {
  assignmentTitle: string;
  subject: string;
  grade: string;
  studentLevel: string;
  expectedResult?: string;
}): AssessmentCriteria {
  return {
    assignmentTitle: params.assignmentTitle,
    subject: params.subject,
    grade: params.grade,
    studentLevel: params.studentLevel,
    generalCriteria: [
      `Mavzuni to‘liq tushunganlik va nazariy qoidalarni xatosiz bayon etish darajasi`,
      `Amaliy mashq va topshiriqlarni mustaqil, izchil va aniq bajara olish qobiliyati`,
      `Mantiqiy fikrlash, o‘z fikrini dalillar bilan asoslash va ijodiy yondashuv`,
      `Topshiriqning daftarda yoki varaqda ozoda, talab darajasida rasmiylashtirilishi`,
    ],
    rubric: [
      {
        criterion: `Bilim va nazariy tushunchalar`,
        maxPoints: 25,
        levels: {
          excellent: `A'lo (22-25 ball): Mavzu atamalarini mukammal biladi, barcha savollarga aniq va keng qamrovli javob beradi.`,
          good: `Yaxshi (18-21 ball): Asosiy qoidalarni yaxshi biladi, biroq ayrim kichik noaniqliklarga yo‘l qo‘yadi.`,
          satisfactory: `Qoniqarli (14-17 ball): Faqat tayanch atamalarni biladi, chuqur izoh bera olmaydi.`,
          unsatisfactory: `Qoniqarsiz (0-13 ball): Mavzuni o‘zlashtirmagan, savollarga javob bera olmaydi.`,
        },
      },
      {
        criterion: `Amaliy qo‘llash va mashqlar`,
        maxPoints: 30,
        levels: {
          excellent: `A'lo (26-30 ball): Barcha mashq va topshiriqlarni mustaqil, xatosiz va tez bajara oladi.`,
          good: `Yaxshi (21-25 ball): Mashqlarni to‘g‘ri yechadi, 1-2 ta arifmetik yoki imlo xatosi bor.`,
          satisfactory: `Qoniqarli (16-20 ball): Faqat o‘qituvchi yordami yoki namuna asosida bajara oladi.`,
          unsatisfactory: `Qoniqarsiz (0-15 ball): Amaliy topshiriqlarni bajara olmagan.`,
        },
      },
      {
        criterion: `Mantiqiy fikrlash va tahlil`,
        maxPoints: 25,
        levels: {
          excellent: `A'lo (22-25 ball): Fikrlari teran, tahliliy, o‘z xulosasini mustaqil dalillar bilan isbotlaydi.`,
          good: `Yaxshi (18-21 ball): Mantiqiy fikrlaydi, xulosalari asosli, biroq qo‘shimcha dalil yetishmaydi.`,
          satisfactory: `Qoniqarli (14-17 ball): Fikrlari yuzaki, mustaqil fikr bildirishda qiynaladi.`,
          unsatisfactory: `Qoniqarsiz (0-13 ball): Mantiqiy bog‘liqlik yo‘q.`,
        },
      },
      {
        criterion: `Ozodalik va vaqtga rioya qilish`,
        maxPoints: 20,
        levels: {
          excellent: `A'lo (18-20 ball): Daftar nihoyatda ozoda, qoidalarga mos, belgilangan vaqtda topshirilgan.`,
          good: `Yaxshi (15-17 ball): Umumiy ozodalik qoniqarli, vaqtida topshirilgan.`,
          satisfactory: `Qoniqarli (12-14 ball): Tuzatishlar ko‘p, kechiktirib topshirilgan.`,
          unsatisfactory: `Qoniqarsiz (0-11 ball): Tartibsiz, talabga mos emas.`,
        },
      },
    ],
    pointsBreakdown: [
      { category: `Nazariy savollar`, points: 25, explanation: `Mavzu bo‘yicha og‘zaki yoki yozma javoblar` },
      { category: `Amaliy topshiriq`, points: 30, explanation: `Misol, masala yoki mashqlar yechimi` },
      { category: `Tahlil va ijodkorlik`, points: 25, explanation: `Qo‘shimcha fikr va mustaqil xulosalar` },
      { category: `Faollik va ozodalik`, points: 20, explanation: `Darsdagi ishtirok va ish daftari sifati` },
    ],
    feedbackSamples: {
      praise: `Barakalla! Siz ushbu topshiriqni a'lo darajada bajardingiz. Mantiqiy xulosalaringiz va mustaqil yondashuvingiz alohida e'tirofga loyiq!`,
      constructiveGuidance: `Yaxshi natija! Nazariy tushunchalarni mustahkamlash uchun darslikdagi 2-qoidani yana bir marta ko‘rib chiqishingiz va mashqlarda ko‘proq e'tiborli bo‘lishingizni maslahat beraman.`,
      nextSteps: `Keyingi bosqichda yuqori qiyinlikdagi ijodiy masalalarni yechishga harakat qiling, bu sizning salohiyatingizni yanada oshiradi.`,
    },
  };
}

export async function generateContent<T>(type: string, params: Record<string, any>): Promise<T> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, params }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Check if fallback is available
      console.warn('API javobi xatolik bilan qaytdi, pedagogik andoza ishlatiladi:', result.error);
      return getFallbackByType(type, params) as T;
    }

    if (result && result.success && result.data) {
      return result.data as T;
    }

    return getFallbackByType(type, params) as T;
  } catch (error) {
    console.warn('Serverga ulanishda xatolik, lokal pedagogik generator ishlatilmoqda:', error);
    return getFallbackByType(type, params) as T;
  }
}

function getFallbackByType(type: string, params: any): any {
  switch (type) {
    case 'lesson':
      return getFallbackLesson(params);
    case 'test':
      return getFallbackTests(params);
    case 'questions':
      return getFallbackQuestions(params);
    case 'homework':
      return getFallbackHomework(params);
    case 'interactive':
      return getFallbackInteractive(params);
    case 'explain':
      return getFallbackExplanation(params);
    case 'assessment':
      return getFallbackAssessment(params);
    default:
      throw new ApiError('Noma\'lum turdagi material.');
  }
}
