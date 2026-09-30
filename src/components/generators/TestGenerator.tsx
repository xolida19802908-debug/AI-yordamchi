import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  Eye,
  EyeOff,
  Printer,
  FileDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { TestCollection, TeacherProfile, DifficultyLevel } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface TestGeneratorProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: TestCollection;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Matematika');
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '8-sinf');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [questionCount, setQuestionCount] = useState(initialData?.questions?.length || 5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialData?.difficulty || 'O‘rta');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestCollection | null>(initialData || null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
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
    if (!questionCount || questionCount < 1) {
      setValidationError('Savollar sonini kiriting.');
      return;
    }

    setLoading(true);
    setUserAnswers({});
    try {
      const data = await generateContent<TestCollection>('test', {
        subject,
        grade,
        topic: topic.trim(),
        questionCount,
        difficulty,
      });

      setResult(data);
      onShowToast('success', `${data.questions.length} ta test savoli muvaffaqiyatli tuzildi!`);
    } catch {
      onShowToast('error', 'AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleReset = () => {
    setResult(null);
    setTopic('');
    setUserAnswers({});
    setShowAnswers(false);
  };

  const getTextToCopy = (): string => {
    if (!result) return '';
    let text = `FAN: ${result.subject}\nSINF: ${result.grade}\nMAVZU: ${result.topic}\nQIYINLIK DARAJASI: ${result.difficulty}\n\n`;

    result.questions.forEach((q, idx) => {
      text += `${idx + 1}. ${q.question}\n`;
      text += `A) ${q.options.A}\n`;
      text += `B) ${q.options.B}\n`;
      text += `C) ${q.options.C}\n`;
      text += `D) ${q.options.D}\n\n`;
    });

    text += `JAVOBLAR KALITI:\n`;
    result.questions.forEach((q, idx) => {
      text += `${idx + 1}-${q.correctAnswer} (${q.explanation})\n`;
    });

    return text.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-900">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Test generatori</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Test yaratish (A, B, C, D)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Har qanday mavzu bo‘yicha 4 variantli professional test savollari, to‘g‘ri javoblar kaliti va metodik izohlar.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fan *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
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
                Sinf *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Question count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Savollar soni *
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value={5}>5 ta savol (Tezkor tekshiruv)</option>
                <option value={10}>10 ta savol (Standart oraliq)</option>
                <option value={15}>15 ta savol (Nazorat ishi)</option>
                <option value={20}>20 ta savol (Katta sinov)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Qiyinlik darajasi *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Oson', 'O‘rta', 'Qiyin'] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition ${
                      difficulty === d
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topic input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Mavzu *</span>
              <span className="text-[11px] text-slate-400 font-normal">Test qaysi mavzu yuzasidan tuzilsin?</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Fotosintez jarayoni va uning bosqichlari"
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Testlar tuzilmoqda...' : 'Yangi test yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <LoadingCard
          title="Test savollari tuzilmoqda..."
          subtitle="4 ta variantli (A, B, C, D) savollar, chalg‘ituvchi javoblar va to‘g‘ri kalitlar ishlab chiqilmoqda."
        />
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in">
          {/* Main Action Bar */}
          <ResultActions
            title={`Test: ${result.topic}`}
            type="test"
            subject={result.subject}
            grade={result.grade}
            topic={result.topic}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi test yaratish"
          />

          {/* Test Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm no-print">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Jami: {result.questions.length} ta savol</span>
              <span>•</span>
              <span>Daraja: {result.difficulty}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAnswers(!showAnswers)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  showAnswers
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                }`}
              >
                {showAnswers ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Javoblarni yashirish</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Javoblarni ko‘rsatish</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Testni chop etish</span>
              </button>
            </div>
          </div>

          {/* Questions Container */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Print Header */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-4 text-center space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 dark:text-emerald-400">
                NAZORAT TEST MATERIALLARI
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Fan: {result.subject} ({result.grade})
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Mavzu: {result.topic}
              </p>
              <div className="pt-2 flex justify-between text-xs text-slate-500 font-medium">
                <span>O‘quvchining F.I.Sh: ___________________________</span>
                <span>Sana: ____________</span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {result.questions.map((q, idx) => {
                const selected = userAnswers[q.id];
                const isAnswerRevealed = showAnswers;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3.5 print:bg-transparent print:border-b print:rounded-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 print:bg-transparent print:border">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    {/* Options A, B, C, D */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-10 print:pl-6">
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const optText = q.options[optKey];
                        const isThisCorrect = q.correctAnswer === optKey;
                        const isThisSelected = selected === optKey;

                        let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                        if (isAnswerRevealed) {
                          if (isThisCorrect) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold';
                          } else if (isThisSelected) {
                            optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200';
                          }
                        } else if (isThisSelected) {
                          optionStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold';
                        }

                        return (
                          <div
                            key={optKey}
                            onClick={() => handleSelectOption(q.id, optKey)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none print:border-none print:p-1 ${optionStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                                isAnswerRevealed && isThisCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isThisSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {optKey}
                            </span>
                            <span className="text-xs sm:text-sm leading-relaxed">{optText}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Methodological Explanation (When Revealed) */}
                    {isAnswerRevealed && (
                      <div className="mt-2 ml-10 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                        <div>
                          <strong>To‘g‘ri javob: {q.correctAnswer}</strong> — {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer Key Footer (Always printed at the bottom or hidden on test paper) */}
            {showAnswers && (
              <div className="pt-6 border-t-2 border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Javoblar kaliti va metodik izoh:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-xs">
                  {result.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <span>{idx + 1}-savol: </span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{q.correctAnswer}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
