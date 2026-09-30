import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
} from 'lucide-react';
import { HomeworkSet, TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface HomeworkGeneratorProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: HomeworkSet;
}

export const HomeworkGenerator: React.FC<HomeworkGeneratorProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Fizika');
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '9-sinf');
  const [topic, setTopic] = useState(initialData?.topic || '');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HomeworkSet | null>(initialData || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!subject.trim()) {
      setValidationError('Avval fan nomini tanlang.');
      return;
    }
    if (!topic.trim()) {
      setValidationError('Mavzuni kiriting.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateContent<HomeworkSet>('homework', {
        subject,
        grade,
        topic: topic.trim(),
      });

      setResult(data);
      onShowToast('success', 'Tabaqalashtirilgan uy vazifasi muvaffaqiyatli tayyorlandi!');
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
    let text = `TABAQALASHTIRILGAN UY VAZIFASI\nFan: ${result.subject}\nSinf: ${result.grade}\nMavzu: ${result.topic}\n\n`;

    text += `🥉 1. BOSHLANG‘ICH DARAJA (Tavsiya etilgan vaqt: ~${result.beginnerLevel.estimatedMinutes} daqiqa):\n`;
    result.beginnerLevel.tasks.forEach((t, i) => (text += `  ${i + 1}. ${t}\n`));
    text += `  Baholash mezoni: ${result.beginnerLevel.criteria}\n\n`;

    text += `🥈 2. O‘RTA DARAJA (Tavsiya etilgan vaqt: ~${result.mediumLevel.estimatedMinutes} daqiqa):\n`;
    result.mediumLevel.tasks.forEach((t, i) => (text += `  ${i + 1}. ${t}\n`));
    text += `  Baholash mezoni: ${result.mediumLevel.criteria}\n\n`;

    text += `🥇 3. YUQORI DARAJA (Tavsiya etilgan vaqt: ~${result.advancedLevel.estimatedMinutes} daqiqa):\n`;
    result.advancedLevel.tasks.forEach((t, i) => (text += `  ${i + 1}. ${t}\n`));
    text += `  Baholash mezoni: ${result.advancedLevel.criteria}\n\n`;

    text += `O‘quvchilarga yo‘riqnoma: ${result.instructionsForStudents}\n`;
    return text.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-900">
          <Home className="w-3.5 h-3.5" />
          <span>Tabaqalashtirilgan uy vazifasi</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Uy vazifasi (Boshlang‘ich, O‘rta, Yuqori)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          O‘quvchilarning turli o‘zlashtirish darajasiga mos, individual va ijodiy topshiriqlar to‘plami.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm no-print">
        <form onSubmit={handleGenerate} className="space-y-6">
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm font-medium animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fan *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                {CURRICULUM_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sinf *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Mavzu *</span>
              <span className="text-[11px] text-slate-400 font-normal">Dars mavzusi</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Nyutonning harakat qonunlari va inersiya hodisasi"
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-amber-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Uy vazifalari tayyorlanmoqda...' : 'Uy vazifasini yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <LoadingCard
          title="Tabaqalashtirilgan uy vazifasi tuzilmoqda..."
          subtitle="O‘quvchilar darajasiga mos 3 bosqichli topshiriqlar, vaqt me'yori va baholash mezonlari hisoblanmoqda."
        />
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in">
          <ResultActions
            title={`Uy vazifasi: ${result.topic}`}
            type="homework"
            subject={result.subject}
            grade={result.grade}
            topic={result.topic}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi vazifa yaratish"
          />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-4 text-center space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-700 dark:text-amber-400">
                TABAQALASHTIRILGAN UY VAZIFASI
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Fan: {result.subject} ({result.grade})
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Mavzu: {result.topic}
              </p>
            </div>

            {/* General Instructions */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs sm:text-sm text-blue-900 dark:text-blue-200 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>O‘quvchilarga yo‘riqnoma:</strong> {result.instructionsForStudents}
              </div>
            </div>

            {/* Three Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level 1: Beginner */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      🥉 Boshlang‘ich daraja
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{result.beginnerLevel.estimatedMinutes} daqiqa
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {result.beginnerLevel.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  <strong>Mezon:</strong> {result.beginnerLevel.criteria}
                </div>
              </div>

              {/* Level 2: Medium */}
              <div className="p-5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                      🥈 O‘rta daraja
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{result.mediumLevel.estimatedMinutes} daqiqa
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {result.mediumLevel.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  <strong>Mezon:</strong> {result.mediumLevel.criteria}
                </div>
              </div>

              {/* Level 3: Advanced */}
              <div className="p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50/20 dark:bg-amber-950/20 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-800">
                    <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      🥇 Yuqori daraja (Ijodiy)
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{result.advancedLevel.estimatedMinutes} daqiqa
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {result.advancedLevel.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                        <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  <strong>Mezon:</strong> {result.advancedLevel.criteria}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
