import React, { useState } from 'react';
import {
  BookMarked,
  Sparkles,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Layers,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { TopicExplanation, TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface TopicExplainerProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: TopicExplanation;
}

export const TopicExplainer: React.FC<TopicExplainerProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Kimyo');
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '7-sinf');
  const [difficultyLevel, setDifficultyLevel] = useState<'O‘quvchiga sodda' | 'O‘rta' | 'Batafsil'>(
    initialData?.difficultyLevel || 'O‘quvchiga sodda'
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TopicExplanation | null>(initialData || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!topic.trim()) {
      setValidationError('Mavzuni kiriting.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateContent<TopicExplanation>('explain', {
        topic: topic.trim(),
        subject,
        grade,
        difficultyLevel,
      });

      setResult(data);
      onShowToast('success', 'Mavzu tushuntirishi muvaffaqiyatli tayyorlandi!');
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
    let text = `MAVZU TUSHUNTIRISHI: ${result.topic}\n`;
    text += `Fan: ${result.subject} | Sinf: ${result.grade} | Uslub: ${result.difficultyLevel}\n\n`;

    text += `1. SODDA TUSHUNTIRISH (O‘quvchilarga qulay):\n${result.simpleExplanation}\n\n`;
    text += `2. BATAFSIL VA ILMIY TUSHUNTIRISH:\n${result.detailedExplanation}\n\n`;
    text += `3. HAYOTIY MISOL:\n${result.realLifeExample}\n\n`;

    text += `4. ASOSIY ATAMALAR VA LUG‘AT:\n`;
    result.importantTerms.forEach((t) => (text += ` - ${t.term}: ${t.meaning}\n`));
    text += `\n`;

    text += `5. 5 TA ASOSIY QOIDA VA TAYANCH NUQTA:\n`;
    result.keyPoints.forEach((p, i) => (text += `${i + 1}. ${p}\n`));
    text += `\n`;

    text += `6. 5 TA TEKSHIRISH VA MUSTAHKAMLASH SAVOLI:\n`;
    result.checkingQuestions.forEach((q, i) => {
      text += `${i + 1}. ${q.question}\n   Javob: ${q.sampleAnswer}\n`;
    });

    return text.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-900">
          <BookMarked className="w-3.5 h-3.5" />
          <span>Mavzuni tushuntirish yordamchisi</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Mavzuni tushuntirish
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Har qanday murakkab mavzuni sodda tilda, qiziqarli hayotiy misollar va mustahkamlash savollari bilan bayon qiling.
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

          {/* Large Topic Text Field requested by user */}
          <div className="space-y-1.5">
            <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Qaysi mavzuni tushuntirish kerak? *</span>
              <span className="text-xs text-slate-400 font-normal">Mavzuni batafsil yozishingiz mumkin</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Mendeleyev davriy jadvali va kimyoviy elementlar xossalari yoki O‘zbekiston Konstitutsiyasining yaratilish tarixi..."
              rows={3}
              className="w-full text-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fan
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                {CURRICULUM_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sinf
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tushuntirish darajasi *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['O‘quvchiga sodda', 'O‘rta', 'Batafsil'] as const).map((dl) => (
                  <button
                    key={dl}
                    type="button"
                    onClick={() => setDifficultyLevel(dl)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition ${
                      difficultyLevel === dl
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-cyan-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Tushuntirish tayyorlanmoqda...' : 'Mavzuni tushuntirish'}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <LoadingCard
          title="Mavzu tahlili tayyorlanmoqda..."
          subtitle="Sodda tushuntirish, ilmiy tahlil, hayotiy misol, atamalar va tekshirish savollari shakllantirilmoqda."
        />
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in">
          <ResultActions
            title={`Tushuntirish: ${result.topic}`}
            type="explanation"
            subject={result.subject}
            grade={result.grade}
            topic={result.topic}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi mavzu kiritish"
          />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-4 text-center space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-700 dark:text-cyan-400">
                METODIK MATERIALLAR TO‘PLAMI
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Mavzu: {result.topic}
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Fan: {result.subject} | Sinf: {result.grade} | Uslub: {result.difficultyLevel}
              </p>
            </div>

            {/* 1. Simple explanation */}
            <div className="p-6 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-600" />
                1. O‘quvchiga sodda tushuntirish
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {result.simpleExplanation}
              </p>
            </div>

            {/* 2. Detailed explanation */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                2. Batafsil va ilmiy tushuntirish
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {result.detailedExplanation}
              </p>
            </div>

            {/* 3. Real-life example */}
            <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                3. Hayotiy misol (Turmush bilan bog‘liqlik)
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {result.realLifeExample}
              </p>
            </div>

            {/* 4. Important Terms */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                4. Muhim atamalar va lug‘at
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.importantTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-1"
                  >
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      {term.term}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {term.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. 5 Key Points */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                5. 5 ta asosiy qoida va tayanch nuqta
              </h3>
              <div className="space-y-2">
                {result.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. 5 Checking Questions */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                6. 5 ta tekshirish savoli (Mustahkamlash uchun)
              </h3>
              <div className="space-y-3">
                {result.checkingQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </p>
                    </div>
                    <div className="ml-6 p-2 rounded-lg bg-cyan-50/60 dark:bg-cyan-950/20 text-xs text-cyan-900 dark:text-cyan-300">
                      <strong>To‘g‘ri javob:</strong> {q.sampleAnswer}
                    </div>
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
