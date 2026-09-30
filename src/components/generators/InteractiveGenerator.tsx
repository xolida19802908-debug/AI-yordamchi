import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  AlertCircle,
  Zap,
  Trophy,
  CheckCircle2,
  Shuffle,
  HelpCircle,
  Flame,
  Users,
  Eye,
  EyeOff,
  Check,
  X,
  Clock,
  Presentation,
} from 'lucide-react';
import { InteractiveActivityContent, InteractiveActivityType, TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS, INTERACTIVE_ACTIVITY_TYPES } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface InteractiveGeneratorProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: InteractiveActivityContent;
}

export const InteractiveGenerator: React.FC<InteractiveGeneratorProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Biologiya');
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '8-sinf');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [activityType, setActivityType] = useState<InteractiveActivityType>(
    initialData?.activityType || 'Tezkor savol-javob'
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractiveActivityContent | null>(initialData || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Interactive live state for classroom play
  const [revealedItems, setRevealedItems] = useState<Record<number, boolean>>({});
  const [userTFAnswers, setUserTFAnswers] = useState<Record<number, boolean>>({});

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
    setRevealedItems({});
    setUserTFAnswers({});
    try {
      const data = await generateContent<InteractiveActivityContent>('interactive', {
        subject,
        grade,
        topic: topic.trim(),
        activityType,
      });

      setResult(data);
      onShowToast('success', `“${activityType}” topshirig‘i muvaffaqiyatli yaratildi!`);
    } catch {
      onShowToast('error', 'AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setTopic('');
    setRevealedItems({});
    setUserTFAnswers({});
  };

  const toggleReveal = (index: number) => {
    setRevealedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getTextToCopy = (): string => {
    if (!result) return '';
    let text = `INTERAKTIV TOPSHIRIQ: ${result.title}\n`;
    text += `Fan: ${result.subject} | Sinf: ${result.grade}\nMavzu: ${result.topic}\nTuri: ${result.activityType}\n`;
    text += `Mo‘ljallangan vaqt: ${result.durationMinutes} daqiqa\n\n`;
    text += `QOIDALAR VA YO‘RIQNOMA:\n`;
    result.instructions.forEach((ins, idx) => (text += `${idx + 1}. ${ins}\n`));
    text += `\n`;

    if (result.blitzQuestions) {
      text += `TEZKOR SAVOL-JAVOBLAR:\n`;
      result.blitzQuestions.forEach((bq, i) => (text += `${i + 1}. ${bq.question} — Javob: ${bq.answer}\n`));
    }
    if (result.puzzleQuestion) {
      text += `SIRLI JUMBOQ:\n${result.puzzleQuestion.riddle}\nIshora: ${result.puzzleQuestion.clue}\nJavob: ${result.puzzleQuestion.answer}\n`;
    }
    if (result.trueFalseItems) {
      text += `TO‘G‘RI YOKI NOTO‘G‘RI:\n`;
      result.trueFalseItems.forEach((tf, i) => (text += `${i + 1}. [${tf.isTrue ? 'TO‘G‘RI' : 'NOTO‘G‘RI'}] ${tf.statement} (${tf.explanation})\n`));
    }
    if (result.matchingPairs) {
      text += `MOSLASHTIRISH:\n`;
      result.matchingPairs.forEach((mp, i) => (text += `${i + 1}. ${mp.term} <--> ${mp.definition}\n`));
    }
    if (result.fiveChallenges) {
      text += `5 TA SAVOL CHALLENGE:\n`;
      result.fiveChallenges.forEach((fc) => (text += `Bosqich ${fc.level} (${fc.points} ball): ${fc.question} -> ${fc.answer}\n`));
    }
    if (result.groupTasks) {
      text += `GURUH TOPSHIRIQLARI:\n`;
      result.groupTasks.forEach((gt) => {
        text += `\n[${gt.groupName}]: ${gt.assignment}\n`;
        gt.roles.forEach((r) => (text += ` - ${r.roleName}: ${r.duty}\n`));
      });
    }

    text += `\nO‘qituvchi uchun tavsiya: ${result.teacherGuidelines}\n`;
    return text.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Interfaol metodika generatori</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Interaktiv topshiriqlar va dars o‘yinlari
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sinfda o‘quvchilar faolligini oshirish uchun 7 xil zamonaviy pedagogik o‘yin va metodik topshiriqlar.
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

          {/* Activity Type Selection Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Interaktiv faoliyat turini tanlang *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {INTERACTIVE_ACTIVITY_TYPES.map((act) => {
                const isSelected = activityType === act.type;
                return (
                  <button
                    key={act.type}
                    type="button"
                    onClick={() => setActivityType(act.type)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-100 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-600' : 'bg-slate-400'}`} />
                      <span>{act.type}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                      {act.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fan *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
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
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
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
              placeholder="Masalan: Qon aylanish sistemasi yoki O‘zbekiston iqlim mintaqalari"
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-rose-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Topshiriq tuzilmoqda...' : 'Topshiriqni yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <LoadingCard
          title="Interaktiv topshiriq tuzilmoqda..."
          subtitle={`"${activityType}" uchun qiziqarli savollar, jumboqlar va guruh topshiriqlari tayyorlanmoqda.`}
        />
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in">
          <ResultActions
            title={`Interaktiv: ${result.title}`}
            type="interactive"
            subject={result.subject}
            grade={result.grade}
            topic={result.topic}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi o‘yin yaratish"
          />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Title Header */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-4 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-xs font-bold">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{result.activityType}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {result.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Fan: <strong>{result.subject}</strong> | Sinf: <strong>{result.grade}</strong> | Tavsiya etilgan vaqt: <strong>{result.durationMinutes} daqiqa</strong>
              </p>
            </div>

            {/* Description & Rules */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                O‘yin maqsadi va qoidalari:
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Qadamlar:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {result.instructions.map((ins, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specialized Content Rendering Based on Activity Type */}

            {/* 1. Blitz Questions */}
            {result.blitzQuestions && result.blitzQuestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Tezkor savol-javoblar to‘plami</span>
                  </h3>
                  <span className="text-xs text-slate-500">Sinfda javobni ochish uchun ustiga bosing</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.blitzQuestions.map((bq, idx) => {
                    const isRevealed = revealedItems[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleReveal(idx)}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-rose-300 transition cursor-pointer space-y-2 select-none"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                            {idx + 1}-savol ({bq.points} ball):
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {isRevealed ? 'Yopish' : 'Javobni ko‘rish'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {bq.question}
                        </p>
                        {isRevealed && (
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-200 animate-in fade-in">
                            Javob: {bq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Mystery Puzzle (Sirli savol) */}
            {result.puzzleQuestion && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-extrabold text-sm uppercase">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span>Sirli savol va detektiv jumboq</span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                  ❓ {result.puzzleQuestion.riddle}
                </div>
                <div className="text-xs text-indigo-800 dark:text-indigo-300 bg-indigo-100/60 dark:bg-indigo-950/60 p-3 rounded-xl border border-indigo-200">
                  💡 <strong>Yordamchi ishora:</strong> {result.puzzleQuestion.clue}
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleReveal(999)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
                  >
                    {revealedItems[999] ? 'Javobni yashirish' : 'Sirli javobni ochish'}
                  </button>
                  {revealedItems[999] && (
                    <div className="mt-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 animate-in fade-in">
                      ✅ To‘g‘ri yechim: {result.puzzleQuestion.answer}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. True or False */}
            {result.trueFalseItems && result.trueFalseItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>To‘g‘ri yoki noto‘g‘ri sinovi</span>
                </h3>
                <div className="space-y-3">
                  {result.trueFalseItems.map((tf, idx) => {
                    const answered = userTFAnswers[idx] !== undefined;
                    const userAnswer = userTFAnswers[idx];
                    const isCorrect = userAnswer === tf.isTrue;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {idx + 1}. {tf.statement}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setUserTFAnswers((p) => ({ ...p, [idx]: true }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                answered && userAnswer === true
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-rose-600 text-white'
                                  : 'bg-white dark:bg-slate-700 text-emerald-600 border border-emerald-300 hover:bg-emerald-50'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              To‘g‘ri
                            </button>
                            <button
                              type="button"
                              onClick={() => setUserTFAnswers((p) => ({ ...p, [idx]: false }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                answered && userAnswer === false
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-rose-600 text-white'
                                  : 'bg-white dark:bg-slate-700 text-rose-600 border border-rose-300 hover:bg-rose-50'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                              Noto‘g‘ri
                            </button>
                          </div>
                        </div>

                        {answered && (
                          <div
                            className={`p-2.5 rounded-lg text-xs animate-in fade-in flex items-start gap-2 ${
                              isCorrect
                                ? 'bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                                : 'bg-rose-100/80 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                            }`}
                          >
                            <span className="font-bold">
                              {tf.isTrue ? '✅ Aslida TO‘G‘RI' : '❌ Aslida NOTO‘G‘RI'}:
                            </span>
                            <span>{tf.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Matching Pairs */}
            {result.matchingPairs && result.matchingPairs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-blue-600" />
                  <span>Moslashtirish topshirig‘i</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3 w-1/3">Atama / Tushuncha</th>
                        <th className="p-3">Mos keluvchi ta'rif / Formula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {result.matchingPairs.map((pair, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-3 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/30">
                            {idx + 1}. {pair.term}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            {pair.definition}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. 5-Question Challenge Ladder */}
            {result.fiveChallenges && result.fiveChallenges.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>5 ta savol challenge (Bosqichma-bosqich cho‘qqi)</span>
                </h3>
                <div className="space-y-2.5">
                  {result.fiveChallenges.map((fc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 font-extrabold text-xs shrink-0">
                          {fc.level}-bosqich ({fc.points} ball)
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {fc.question}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
                        Javob: {fc.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Group Tasks */}
            {result.groupTasks && result.groupTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Guruhlar bilan ishlash topshiriqlari</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.groupTasks.map((gt, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 space-y-3"
                    >
                      <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400 block pb-1 border-b">
                        {gt.groupName}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                        Vazifa: {gt.assignment}
                      </p>
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Guruh a'zolari rollari:
                        </span>
                        {gt.roles.map((r, rIdx) => (
                          <div
                            key={rIdx}
                            className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          >
                            <strong className="text-indigo-600 dark:text-indigo-400">{r.roleName}:</strong>
                            <span className="text-slate-600 dark:text-slate-300">{r.duty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teacher Guidelines */}
            {result.teacherGuidelines && (
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <strong>O‘qituvchiga darsni boshqarish tavsiyasi:</strong> {result.teacherGuidelines}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
