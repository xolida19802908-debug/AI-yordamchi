import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  GraduationCap,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { LessonPlan, TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS, LESSON_TYPES } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface LessonGeneratorProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: LessonPlan;
}

export const LessonGenerator: React.FC<LessonGeneratorProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Ona tili');
  const [customSubject, setCustomSubject] = useState('');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '7-sinf');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [duration, setDuration] = useState(initialData?.duration || '45 daqiqa');
  const [lessonType, setLessonType] = useState(initialData?.lessonType || 'Yangi bilim beruvchi dars');
  const [objective, setObjective] = useState(
    initialData?.objectives?.educational || 'Mavzuning asosiy qoidalarini o‘zlashtirish va amaliyotda qo‘llash'
  );
  const [studentLevel, setStudentLevel] = useState('O‘rta');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LessonPlan | null>(initialData || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const activeSubject = isCustomSubject ? customSubject.trim() : subject;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form Validations in Uzbek Latin
    if (isCustomSubject && !customSubject.trim()) {
      setValidationError('Avval fan nomini kiriting.');
      return;
    }
    if (!activeSubject) {
      setValidationError('Avval fan nomini tanlang.');
      return;
    }
    if (!topic.trim()) {
      setValidationError('Mavzuni kiriting.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateContent<LessonPlan>('lesson', {
        subject: activeSubject,
        grade,
        topic: topic.trim(),
        duration,
        lessonType,
        objective: objective.trim(),
        studentLevel,
      });

      setResult(data);
      onShowToast('success', 'Dars ishlanmasi muvaffaqiyatli yaratildi!');
    } catch {
      onShowToast('error', 'AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setTopic('');
  };

  const getTextToCopy = (): string => {
    if (!result) return '';
    return `
DARS ISHLANMASI (KONSPEKT)
Fan: ${result.subject}
Sinf: ${result.grade}
Mavzu: ${result.topic}
Dars davomiyligi: ${result.duration}
Dars turi: ${result.lessonType}

1. DARS MAQSADI:
- Ta'limiy maqsad: ${result.objectives.educational}
- Rivojlantiruvchi maqsad: ${result.objectives.developmental}
- Tarbiyaviy maqsad: ${result.objectives.pedagogical}

2. KUTILAYOTGAN NATIJALAR:
${result.expectedOutcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}

3. KERAKLI JIHOZLAR:
${result.requiredEquipments.map((e, i) => `${i + 1}. ${e}`).join('\n')}

4. DARS JARAYONI:
A) Tashkiliy qism:
${result.stages.organizational}

B) O‘tgan mavzuni takrorlash:
${result.stages.previousTopicReview}

C) Yangi mavzuni tushuntirish:
${result.stages.newTopicExplanation}

D) Amaliy mashg‘ulot:
${result.stages.practicalActivity}

E) Mustahkamlash:
${result.stages.consolidation}

F) Baholash:
${result.stages.assessment}

G) Uyga vazifa:
${result.stages.homework}

H) Yakuniy xulosa va refleksiya:
${result.stages.conclusion}

Tavsiya va eslatmalar:
${result.teacherNotes || ''}
`.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Dars ishlanmasi konstruktori</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Dars yaratish (Konspekt)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          O‘zbekiston DTS talablariga mos, to‘liq 12 ta bosqichdan iborat professional dars rejasini bir zumda tayyorlang.
        </p>
      </div>

      {/* Main Generator Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm no-print">
        <form onSubmit={handleGenerate} className="space-y-6">
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm font-medium animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Subject selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Fan *</span>
                <button
                  type="button"
                  onClick={() => setIsCustomSubject(!isCustomSubject)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  {isCustomSubject ? 'Ro‘yxatdan tanlash' : 'Boshqa fan kiritish'}
                </button>
              </label>

              {isCustomSubject ? (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Fan nomini kiriting (masalan: Huquq)"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {CURRICULUM_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Grade level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sinf *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dars davomiyligi
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="45 daqiqa">45 daqiqa (Standart dars)</option>
                <option value="40 daqiqa">40 daqiqa (Qisqartirilgan)</option>
                <option value="80 daqiqa">80 daqiqa (Juft dars / Para)</option>
              </select>
            </div>

            {/* Lesson Type */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dars turi
              </label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {LESSON_TYPES.map((lt) => (
                  <option key={lt} value={lt}>
                    {lt}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Level */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                O‘quvchilar darajasi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Boshlang‘ich', 'O‘rta', 'Yuqori', 'Tabaqalashtirilgan'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStudentLevel(lvl)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                      studentLevel === lvl
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Mavzu *</span>
              <span className="text-[11px] text-slate-400 font-normal">Darslikdagi aniq dars mavzusi</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Qadimgi Baqtriya davlati madaniyati yoki Kvadrat tenglamalar"
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Educational Objective */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              O‘quv maqsadi (ixtiyoriy)
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="O‘quvchilar dars so‘nggida nimalarni bilishi va qila olishi lozim?"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-blue-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Dars ishlanmasi yaratilmoqda...' : 'Darsni yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading indicator */}
      {loading && (
        <LoadingCard
          title="Dars ishlanmasi shakllantirilmoqda..."
          subtitle="O‘zbekiston DTS standartlari, 12 bosqichli tuzilma va metodik mezonlar ishlab chiqilmoqda."
        />
      )}

      {/* Generated Lesson Plan Result */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in print:m-0">
          <ResultActions
            title={`Dars ishlanmasi: ${result.topic}`}
            type="lesson"
            subject={result.subject}
            grade={result.grade}
            topic={result.topic}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi dars yaratish"
          />

          {/* Printable Lesson Plan Sheet */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Header Document Banner */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-6 text-center space-y-2">
              <div className="text-xs uppercase font-extrabold tracking-widest text-blue-700 dark:text-blue-400">
                O‘ZBEKISTON RESPUBLIKASI XALQ TA'LIMI VAZIRLIGI TAVSIYASI ASOSIDA
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase">
                Namunaviy dars ishlanmasi (Konspekt)
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold pt-2">
                <span>Fan: <strong>{result.subject}</strong></span>
                <span>•</span>
                <span>Sinf: <strong>{result.grade}</strong></span>
                <span>•</span>
                <span>Vaqt: <strong>{result.duration}</strong></span>
                <span>•</span>
                <span>Turi: <strong>{result.lessonType}</strong></span>
              </div>
            </div>

            {/* 1. Dars mavzusi */}
            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
              <span className="text-xs uppercase font-extrabold text-blue-700 dark:text-blue-300 tracking-wider">
                1. Dars mavzusi
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {result.topic}
              </h3>
            </div>

            {/* 2. Dars maqsadi (Ta'limiy, Tarbiyaviy, Rivojlantiruvchi) */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-700">
                <Target className="w-4 h-4 text-blue-600" />
                <span>2. Dars maqsadi</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">
                    A) Ta'limiy maqsad:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.objectives.educational}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                    B) Rivojlantiruvchi maqsad:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.objectives.developmental}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    C) Tarbiyaviy maqsad:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.objectives.pedagogical}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Kutilayotgan natijalar */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Kutilayotgan natijalar</span>
              </h4>
              <ul className="space-y-2">
                {result.expectedOutcomes.map((outcome, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Kerakli jihozlar va vositalar */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-700">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>4. Kerakli jihozlar va vositalar</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.requiredEquipments.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-600"
                  >
                    📦 {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 5 - 12: Darsning bosqichma-bosqich jarayoni */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-700">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Darsning borishi va texnologik xaritasi (Bosqichlar)</span>
              </h4>

              <div className="space-y-4">
                {/* 5. Tashkiliy qism */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                      5. Darsning tashkiliy qismi
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2-3 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.organizational}
                  </p>
                </div>

                {/* 6. O‘tgan mavzuni takrorlash */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                      6. O‘tgan mavzuni takrorlash (Mustahkamlash savollari)
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 5-7 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.previousTopicReview}
                  </p>
                </div>

                {/* 7. Yangi mavzuni tushuntirish */}
                <div className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-800 dark:text-blue-300">
                      7. Yangi mavzuni tushuntirish (Asosiy bayon)
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 15 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {result.stages.newTopicExplanation}
                  </p>
                </div>

                {/* 8. Amaliy mashg‘ulot */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      8. Amaliy mashg‘ulot (Topshiriqlar va mashqlar)
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 10 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.practicalActivity}
                  </p>
                </div>

                {/* 9. Mustahkamlash */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-400">
                      9. Darsni mustahkamlash (Interaktiv faoliyat)
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 5 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.consolidation}
                  </p>
                </div>

                {/* 10. Baholash */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      10. Baholash (Shakllantiruvchi va rag‘batlantirish)
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2-3 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.assessment}
                  </p>
                </div>

                {/* 11. Uyga vazifa */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                      11. Uyga vazifa (Asosiy va ijodiy)
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.homework}
                  </p>
                </div>

                {/* 12. Yakuniy xulosa */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      12. Yakuniy xulosa va refleksiya
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2 daqiqa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {result.stages.conclusion}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Notes */}
            {result.teacherNotes && (
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <strong>O‘qituvchiga metodik eslatma:</strong> {result.teacherNotes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
