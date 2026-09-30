import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { QuestionTierSet, TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface QuestionGeneratorProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: QuestionTierSet;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Tarix');
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '7-sinf');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [questionCount, setQuestionCount] = useState(6);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuestionTierSet | null>(initialData || null);
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
      const data = await generateContent<QuestionTierSet>('questions', {
        subject,
        grade,
        topic: topic.trim(),
        questionCount,
      });

      setResult(data);
      onShowToast('success', '3 toifadagi savollar to‘plami muvaffaqiyatli yaratildi!');
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
    let text = `SAVOLLAR TO‘PLAMI (3 DARAJA)\nFan: ${result.subject}\nSinf: ${result.grade}\nMavzu: ${result.topic}\n\n`;

    text += `🟢 1. OSON DARAJADAGI SAVOLLAR (Bilish va eslash):\n`;
    result.easy.forEach((q, idx) => {
      text += `${idx + 1}. ${q.question}\n   Javob namunasi: ${q.answerHint}\n`;
    });

    text += `\n🟡 2. O‘RTA DARAJADAGI SAVOLLAR (Tushunish va qo‘llash):\n`;
    result.medium.forEach((q, idx) => {
      text += `${idx + 1}. ${q.question}\n   Javob namunasi: ${q.answerHint}\n`;
    });

    text += `\n🔴 3. QIYIN VA MANTIQIY SAVOLLAR (Tahlil, sintez, baholash):\n`;
    result.difficult.forEach((q, idx) => {
      text += `${idx + 1}. ${q.question}\n   Javob namunasi: ${q.answerHint}\n`;
    });

    return text.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-200 dark:border-violet-900">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tabaqalashtirilgan savollar</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Savollar yaratish (3 daraja)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Bloom taksonomiyasi asosida: Oson (bilish), O‘rta (qo‘llash) va Qiyin (tanqidiy tahlil) savollar.
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fan *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
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
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Har bir toifada savollar soni
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
              >
                <option value={3}>3 tadan (Jami 9 ta)</option>
                <option value={4}>4 tadan (Jami 12 ta)</option>
                <option value={5}>5 tadan (Jami 15 ta)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Mavzu *</span>
              <span className="text-[11px] text-slate-400 font-normal">Savollar qaysi mavzu yuzasidan bo‘lsin?</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Amir Temur davlatining tashkil topishi va harbiy yurishlari"
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-violet-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Savollar tuzilmoqda...' : 'Savollarni yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <LoadingCard
          title="Savollar to‘plami tuzilmoqda..."
          subtitle="Bloom taksonomiyasi bo‘yicha oson, o‘rta va yuqori darajadagi savollar va namuna javoblar tayyorlanmoqda."
        />
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in">
          <ResultActions
            title={`Savollar: ${result.topic}`}
            type="questions"
            subject={result.subject}
            grade={result.grade}
            topic={result.topic}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi savollar yaratish"
          />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-4 text-center space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-widest text-violet-700 dark:text-violet-400">
                BLOOM TAKSONOMIYASI ASOSIDAGI SAVOLLAR
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Fan: {result.subject} ({result.grade})
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Mavzu: {result.topic}
              </p>
            </div>

            {/* 1. Easy Questions (Oson) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                    1. Oson darajadagi savollar (Bilish va eslash)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Dars boshidagi so‘rov uchun
                </span>
              </div>

              <div className="space-y-3">
                {result.easy.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {idx + 1}.
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </p>
                    </div>
                    {q.answerHint && (
                      <div className="ml-5 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Namuna javob:</strong> {q.answerHint}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Medium Questions (O‘rta) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    2. O‘rta darajadagi savollar (Tushunish va qo‘llash)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                  Mantiqiy bog‘lanish va formulalar
                </span>
              </div>

              <div className="space-y-3">
                {result.medium.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        {idx + 1}.
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </p>
                    </div>
                    {q.answerHint && (
                      <div className="ml-5 p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Namuna javob:</strong> {q.answerHint}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Difficult Questions (Qiyin) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <h3 className="text-sm font-extrabold text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                    3. Qiyin va muammoli savollar (Tahlil, sintez va baholash)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                  Iqtidorli o‘quvchilar va bahs-munozara uchun
                </span>
              </div>

              <div className="space-y-3">
                {result.difficult.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                        {idx + 1}.
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </p>
                    </div>
                    {q.answerHint && (
                      <div className="ml-5 p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 text-xs text-rose-900 dark:text-rose-300 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span><strong>Namuna javob:</strong> {q.answerHint}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
