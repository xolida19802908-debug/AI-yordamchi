import { SavedMaterial, TeacherProfile, MaterialType } from '../types';
import { INITIAL_TEACHER_PROFILE } from '../data/constants';

const STORAGE_KEY_MATERIALS = 'ustoz_ai_saved_materials_v1';
const STORAGE_KEY_PROFILE = 'ustoz_ai_teacher_profile_v1';

export function getSavedMaterials(): SavedMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MATERIALS);
    if (!raw) return getDefaultSampleMaterials();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Saqlangan materiallarni yuklashda xatolik:', e);
    return [];
  }
}

export function saveMaterial(material: Omit<SavedMaterial, 'id' | 'createdAt'>): SavedMaterial {
  const materials = getSavedMaterials();
  const newItem: SavedMaterial = {
    ...material,
    id: 'mat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...materials];
  try {
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(updated));
  } catch (e) {
    console.error('Materialni saqlashda xatolik:', e);
  }
  return newItem;
}

export function updateSavedMaterial(id: string, updates: Partial<SavedMaterial>): boolean {
  const materials = getSavedMaterials();
  const index = materials.findIndex((m) => m.id === id);
  if (index === -1) return false;

  materials[index] = { ...materials[index], ...updates };
  try {
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(materials));
    return true;
  } catch (e) {
    console.error('Materialni yangilashda xatolik:', e);
    return false;
  }
}

export function deleteSavedMaterial(id: string): boolean {
  const materials = getSavedMaterials();
  const filtered = materials.filter((m) => m.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Materialni o‘chirishda xatolik:', e);
    return false;
  }
}

export function searchMaterials(
  materials: SavedMaterial[],
  query: string,
  typeFilter: string = 'all',
  gradeFilter: string = 'all',
  subjectFilter: string = 'all'
): SavedMaterial[] {
  const q = query.trim().toLowerCase();

  return materials.filter((item) => {
    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // Grade filter
    if (gradeFilter !== 'all' && item.grade !== gradeFilter) return false;

    // Subject filter
    if (subjectFilter !== 'all' && item.subject !== subjectFilter) return false;

    // Query search
    if (!q) return true;

    const inTitle = item.title.toLowerCase().includes(q);
    const inTopic = item.topic.toLowerCase().includes(q);
    const inSubject = item.subject.toLowerCase().includes(q);
    const inNotes = item.notes?.toLowerCase().includes(q);

    return inTitle || inTopic || inSubject || inNotes;
  });
}

export function getTeacherProfile(): TeacherProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return INITIAL_TEACHER_PROFILE;
    return { ...INITIAL_TEACHER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_TEACHER_PROFILE;
  }
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Profilni saqlashda xatolik:', e);
  }
}

export function exportDataAsJSON(): string {
  const data = {
    materials: getSavedMaterials(),
    profile: getTeacherProfile(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
    platform: 'USTOZ AI — Ustoz yordamchisi',
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJSON(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const data = JSON.parse(jsonString);
    if (data && Array.isArray(data.materials)) {
      const existing = getSavedMaterials();
      const existingIds = new Set(existing.map((m) => m.id));
      const newItems = data.materials.filter((m: SavedMaterial) => !existingIds.has(m.id));
      const merged = [...newItems, ...existing];
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(merged));

      if (data.profile) {
        saveTeacherProfile(data.profile);
      }
      return {
        success: true,
        message: `${newItems.length} ta yangi material muvaffaqiyatli import qilindi!`,
        count: newItems.length,
      };
    }
    return { success: false, message: 'Fayl formati noto‘g‘ri yoki materiallar topilmadi.' };
  } catch (e) {
    return { success: false, message: 'Faylni o‘qishda xatolik yuz berdi. Iltimos, to‘g‘ri JSON faylni tanlang.' };
  }
}

// Sample starter materials for teachers to explore immediately
function getDefaultSampleMaterials(): SavedMaterial[] {
  return [
    {
      id: 'sample_1',
      type: 'lesson' as MaterialType,
      title: 'Dars ishlanmasi: Ot so‘z turkumi va uning ma\'no guruhlari',
      subject: 'Ona tili',
      grade: '6-sinf',
      topic: 'Ot so‘z turkumi',
      createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
      notes: 'Ochiq dars uchun maxsus tayyorlangan namunaviy konspekt.',
      data: {
        topic: 'Ot so‘z turkumi',
        subject: 'Ona tili',
        grade: '6-sinf',
        duration: '45 daqiqa',
        lessonType: 'Yangi bilim beruvchi dars',
        objectives: {
          educational: 'O‘quvchilarga ot so‘z turkumi, shaxs, narsa va o‘rin-joy bildiruvchi otlar haqida tushuncha berish.',
          developmental: 'Lug‘at boyligini oshirish, gap tarkibida otlarni to‘g‘ri topish va tahlil qilish ko‘nikmasini rivojlantirish.',
          pedagogical: 'Ona tilimizning boy imkoniyatlariga mehr va hurmat tuyg‘usini shakllantirish.',
        },
        expectedOutcomes: [
          'Otning so‘roqlarini (Kim? Nima? Qayer?) xatosiz aniqlaydi.',
          'Atoqli va turdosh otlarni bir-biridan farqlaydi.',
          'Darslikdagi matndan otlarni ajratib, jadvalga to‘ldiradi.',
        ],
        requiredEquipments: ['Darslik', 'Ko‘rgazmali jadval', 'Rangli kartochkalar', 'Proyektor'],
        stages: {
          organizational: 'Salomlashish, davomatni aniqlash va o‘quvchilarga xush kayfiyat tilash (2 daqiqa).',
          previousTopicReview: 'So‘z turkumlari haqida o‘rganilgan umumiy bilimlarni "Savol-javob zanjiri" orqali takrorlash (5 daqiqa).',
          newTopicExplanation: 'Doskada rasmlar va ularning nomlari keltirilib, Kim? Nima? Qayer? so‘roqlari bilan bog‘lanadi (15 daqiqa).',
          practicalActivity: '12-mashqni guruhlarda bajarish: Berilgan so‘zlarni ma\'no guruhlariga ajratish (10 daqiqa).',
          consolidation: '"Sehrli quti" o‘yini: Qutidagi so‘zlarni turkumlarga saralash (5 daqiqa).',
          assessment: 'Rag‘batlantiruvchi yulduzchalar va shakllantiruvchi baholash (3 daqiqa).',
          homework: '14-mashqni bajarish, 5 ta gap tuzib, otlarning tagiga to‘g‘ri chiziq chizish (2 daqiqa).',
          conclusion: 'Dars xulosasi va o‘quvchilar refleksiyasi (3 daqiqa).',
        },
        teacherNotes: 'Ayniqsa passiv o‘quvchilarga "Nima?" so‘rog‘iga javob bo‘luvchi so‘zlarni topish topshirilsin.',
      },
    },
    {
      id: 'sample_2',
      type: 'test' as MaterialType,
      title: 'Test: Kvadrat tenglamalar va Viyet teoremasi',
      subject: 'Matematika',
      grade: '8-sinf',
      topic: 'Kvadrat tenglamalar',
      createdAt: new Date(Date.now() - 3600 * 48 * 1000).toISOString(),
      notes: 'Nazorat ishi oldidan o‘quvchilar bilimini tekshirish uchun 5 ta savol.',
      data: {
        subject: 'Matematika',
        grade: '8-sinf',
        topic: 'Kvadrat tenglamalar',
        difficulty: 'O‘rta',
        questions: [
          {
            id: 1,
            question: 'ax² + bx + c = 0 to‘liq kvadrat tenglamasining diskriminanti qaysi formula bilan topiladi?',
            options: {
              A: 'D = b² - 4ac',
              B: 'D = b² + 4ac',
              C: 'D = 2b - 4ac',
              D: 'D = (a + c)² - b',
            },
            correctAnswer: 'A',
            explanation: 'To‘liq kvadrat tenglama diskriminanti klassik tarzda D = b² - 4ac formulasi bilan aniqlanadi.',
          },
          {
            id: 2,
            question: 'Agar D > 0 bo‘lsa, kvadrat tenglama nechta haqiqiy ildizga ega bo‘ladi?',
            options: {
              A: 'Ildizga ega emas',
              B: 'Bitta ildizga ega',
              C: 'Ikkita turli haqiqiy ildizga ega',
              D: 'Cheksiz ko‘p ildizga ega',
            },
            correctAnswer: 'C',
            explanation: 'Diskriminant noldan katta bo‘lsa, tenglama ikkita haqiqiy ildizga ega bo‘ladi.',
          },
        ],
      },
    },
  ];
}
