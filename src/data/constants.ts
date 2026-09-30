import { GradeLevel, LessonType, InteractiveActivityType } from '../types';

export const CURRICULUM_SUBJECTS = [
  'Ona tili',
  'Adabiyot',
  'Matematika',
  'Tarix',
  'Fizika',
  'Kimyo',
  'Biologiya',
  'Geografiya',
  'Informatika',
  'Ingliz tili',
  'Jismoniy tarbiya',
  'Musiqa',
  'Tasviriy san\'at',
  'Texnologiya',
  'Iqtisodiy bilim asoslari',
  'Davlat va huquq asoslari',
  'Boshlang‘ich ta\'lim',
] as const;

export const GRADE_LEVELS: GradeLevel[] = [
  '1-sinf',
  '2-sinf',
  '3-sinf',
  '4-sinf',
  '5-sinf',
  '6-sinf',
  '7-sinf',
  '8-sinf',
  '9-sinf',
  '10-sinf',
  '11-sinf',
];

export const LESSON_TYPES: LessonType[] = [
  'Yangi bilim beruvchi dars',
  'Mustahkamlovchi dars',
  'Aralash dars',
  'Amaliy mashg‘ulot darsi',
  'Takrorlash va umumlashtirish darsi',
  'Nazorat darsi',
];

export const INTERACTIVE_ACTIVITY_TYPES: { type: InteractiveActivityType; icon: string; description: string }[] = [
  {
    type: 'Tezkor savol-javob',
    icon: 'Zap',
    description: 'Dars boshida yoki oxirida 3-5 daqiqalik chaqqonlik va xotirani sinash o‘yini',
  },
  {
    type: 'Kim tez topadi?',
    icon: 'Trophy',
    description: 'Qiziqarli mantiqiy jumboqlar va dars mavzusiga doir tezkor musobaqa',
  },
  {
    type: 'To‘g‘ri yoki noto‘g‘ri',
    icon: 'CheckCircle2',
    description: 'Ilmiy faktlar va chalg‘ituvchi fikrlarni tekshirib tanqidiy fikrlashni o‘stirish',
  },
  {
    type: 'Moslashtirish',
    icon: 'Shuffle',
    description: 'Atamalarni ularning ta\'riflari, sanalari yoki formulalari bilan juftlash',
  },
  {
    type: 'Sirli savol',
    icon: 'HelpCircle',
    description: 'O‘quvchilarda qiziqish uyg‘otuvchi, detektiv uslubidagi muammoli savol',
  },
  {
    type: '5 ta savol challenge',
    icon: 'Flame',
    description: 'Oson darajadan oliy qiyinlikkacha ko‘tariluvchi 5 bosqichli bilim marafon',
  },
  {
    type: 'Guruh bilan ishlash',
    icon: 'Users',
    description: 'Sinfni guruhlarga ajratib, rollar va umumiy loyiha vazifasini taqsimlash',
  },
];

export const TEACHER_QUOTES = [
  '“O‘qituvchi — kelajak muhandisi va yoshlar qalbining bog‘bonidir.”',
  '“Har bir dars — o‘quvchilar hayotida yangi ufqlarni ochuvchi mo‘jizadir.”',
  '“Zamonaviy pedagogika — bu o‘quvchini passiv tinglovchidan faol kashfiyotchiga aylantirishdir.”',
  '“Darsda interaktiv usullarni qo‘llash bilimlarning 80% gacha mustahkam saqlanishini ta\'minlaydi.”',
];

export const INITIAL_TEACHER_PROFILE = {
  fullName: 'Hurmatli Ustoz',
  schoolName: 'Umumiy o‘rta ta\'lim maktabi',
  defaultSubject: 'Ona tili',
  defaultGrade: '7-sinf',
  city: 'Toshkent shahri',
};
