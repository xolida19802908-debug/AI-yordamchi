export type SubjectOption =
  | 'Ona tili'
  | 'Adabiyot'
  | 'Matematika'
  | 'Tarix'
  | 'Fizika'
  | 'Kimyo'
  | 'Biologiya'
  | 'Geografiya'
  | 'Informatika'
  | 'Ingliz tili'
  | 'Jismoniy tarbiya'
  | 'Musiqa'
  | 'Tasviriy san\'at'
  | 'Texnologiya'
  | 'Iqtisodiy bilim asoslari'
  | 'Davlat va huquq asoslari'
  | 'Boshlang‘ich ta\'lim'
  | string;

export type GradeLevel =
  | '1-sinf'
  | '2-sinf'
  | '3-sinf'
  | '4-sinf'
  | '5-sinf'
  | '6-sinf'
  | '7-sinf'
  | '8-sinf'
  | '9-sinf'
  | '10-sinf'
  | '11-sinf';

export type LessonType =
  | 'Yangi bilim beruvchi dars'
  | 'Mustahkamlovchi dars'
  | 'Aralash dars'
  | 'Amaliy mashg‘ulot darsi'
  | 'Takrorlash va umumlashtirish darsi'
  | 'Nazorat darsi';

export type DifficultyLevel = 'Oson' | 'O‘rta' | 'Qiyin';

export type StudentProficiency = 'Boshlang‘ich' | 'O‘rta' | 'Yuqori' | 'Aralash (tabaqalashtirilgan)';

export type MaterialType =
  | 'lesson'
  | 'test'
  | 'questions'
  | 'homework'
  | 'interactive'
  | 'explanation'
  | 'assessment';

export interface LessonPlan {
  topic: string;
  subject: string;
  grade: string;
  duration: string;
  lessonType: string;
  objectives: {
    educational: string;
    developmental: string;
    pedagogical: string;
  };
  expectedOutcomes: string[];
  requiredEquipments: string[];
  stages: {
    organizational: string;
    previousTopicReview: string;
    newTopicExplanation: string;
    practicalActivity: string;
    consolidation: string;
    assessment: string;
    homework: string;
    conclusion: string;
  };
  teacherNotes?: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface TestCollection {
  subject: string;
  grade: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: TestQuestion[];
}

export interface QuestionItem {
  id: number;
  question: string;
  answerHint: string;
}

export interface QuestionTierSet {
  subject: string;
  grade: string;
  topic: string;
  easy: QuestionItem[];
  medium: QuestionItem[];
  difficult: QuestionItem[];
}

export interface HomeworkSet {
  subject: string;
  grade: string;
  topic: string;
  beginnerLevel: {
    tasks: string[];
    criteria: string;
    estimatedMinutes: number;
  };
  mediumLevel: {
    tasks: string[];
    criteria: string;
    estimatedMinutes: number;
  };
  advancedLevel: {
    tasks: string[];
    criteria: string;
    estimatedMinutes: number;
  };
  instructionsForStudents: string;
}

export type InteractiveActivityType =
  | 'Tezkor savol-javob'
  | 'Kim tez topadi?'
  | 'To‘g‘ri yoki noto‘g‘ri'
  | 'Moslashtirish'
  | 'Sirli savol'
  | '5 ta savol challenge'
  | 'Guruh bilan ishlash';

export interface MatchingPair {
  term: string;
  definition: string;
}

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface GroupTaskRole {
  roleName: string;
  duty: string;
}

export interface GroupTask {
  groupName: string;
  assignment: string;
  roles: GroupTaskRole[];
}

export interface InteractiveActivityContent {
  activityType: InteractiveActivityType;
  subject: string;
  grade: string;
  topic: string;
  title: string;
  description: string;
  durationMinutes: number;
  instructions: string[];
  blitzQuestions?: { question: string; answer: string; points: number }[];
  puzzleQuestion?: { riddle: string; clue: string; answer: string };
  trueFalseItems?: TrueFalseItem[];
  matchingPairs?: MatchingPair[];
  fiveChallenges?: { level: number; question: string; points: number; answer: string }[];
  groupTasks?: GroupTask[];
  teacherGuidelines: string;
}

export interface TopicExplanation {
  topic: string;
  subject: string;
  grade: string;
  difficultyLevel: 'O‘quvchiga sodda' | 'O‘rta' | 'Batafsil';
  simpleExplanation: string;
  detailedExplanation: string;
  realLifeExample: string;
  importantTerms: { term: string; meaning: string }[];
  keyPoints: string[];
  checkingQuestions: { question: string; sampleAnswer: string }[];
}

export interface RubricRow {
  criterion: string;
  maxPoints: number;
  levels: {
    excellent: string; // 86-100%
    good: string;      // 71-85%
    satisfactory: string; // 56-70%
    unsatisfactory: string; // <56%
  };
}

export interface AssessmentCriteria {
  assignmentTitle: string;
  subject: string;
  grade: string;
  studentLevel: string;
  generalCriteria: string[];
  rubric: RubricRow[];
  pointsBreakdown: { category: string; points: number; explanation: string }[];
  feedbackSamples: {
    praise: string;
    constructiveGuidance: string;
    nextSteps: string;
  };
}

export interface SavedMaterial {
  id: string;
  type: MaterialType;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  createdAt: string;
  data:
    | LessonPlan
    | TestCollection
    | QuestionTierSet
    | HomeworkSet
    | InteractiveActivityContent
    | TopicExplanation
    | AssessmentCriteria;
  notes?: string;
}

export interface TeacherProfile {
  fullName: string;
  schoolName: string;
  defaultSubject: string;
  defaultGrade: string;
  city: string;
}
