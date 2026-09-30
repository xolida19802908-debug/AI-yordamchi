import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Table as TableIcon,
  MessageSquare,
  Award,
} from 'lucide-react';
import { AssessmentCriteria, TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import { generateContent } from '../../services/api';
import { LoadingCard } from '../common/LoadingCard';
import { ResultActions } from '../common/ResultActions';

interface AssessmentGeneratorProps {
  profile: TeacherProfile;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialData?: AssessmentCriteria;
}

export const AssessmentGenerator: React.FC<AssessmentGeneratorProps> = ({
  profile,
  onShowToast,
  initialData,
}) => {
  const [assignmentTitle, setAssignmentTitle] = useState(initialData?.assignmentTitle || '');
  const [subject, setSubject] = useState(initialData?.subject || profile.defaultSubject || 'Ona tili');
  const [grade, setGrade] = useState(initialData?.grade || profile.defaultGrade || '8-sinf');
  const [studentLevel, setStudentLevel] = useState(initialData?.studentLevel || 'Aralash');
  const [expectedResult, setExpectedResult] = useState(
    'O‘quvchilar mavzuni tushunib, mustaqil amaliy tahlil qila olishi va xulosalarni erkin ifodalashi'
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentCriteria | null>(initialData || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!assignmentTitle.trim()) {
      setValidationError('Topshiriq yoki dars mavzusini kiriting.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateContent<AssessmentCriteria>('assessment', {
        assignmentTitle: assignmentTitle.trim(),
        subject,
        grade,
        studentLevel,
        expectedResult: expectedResult.trim(),
      });

      setResult(data);
      onShowToast('success', 'Baholash mezonlari va rubrika muvaffaqiyatli tuzildi!');
    } catch {
      onShowToast('error', 'AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAssignmentTitle('');
  };

  const getTextToCopy = (): string => {
    if (!result) return '';
    let text = `BAHOLASH MEZONLARI VA RUBRIKA\n`;
    text += `Topshiriq: ${result.assignmentTitle}\n`;
    text += `Fan: ${result.subject} | Sinf: ${result.grade} | O‘quvchi darajasi: ${result.studentLevel}\n\n`;

    text += `UMUMIY MEZONLAR:\n`;
    result.generalCriteria.forEach((c, i) => (text += `${i + 1}. ${c}\n`));
    text += `\n`;

    text += `RUBRIKA JADVALI:\n`;
    result.rubric.forEach((row) => {
      text += `\n[${row.criterion}] (Maksimal: ${row.maxPoints} ball)\n`;
      text += ` - A'lo: ${row.levels.excellent}\n`;
      text += ` - Yaxshi: ${row.levels.good}\n`;
      text += ` - Qoniqarli: ${row.levels.satisfactory}\n`;
      text += ` - Qoniqarsiz: ${row.levels.unsatisfactory}\n`;
    });
    text += `\n`;

    text += `BALLAR TAQSIMOTI:\n`;
    result.pointsBreakdown.forEach((p) => {
      text += ` - ${p.category}: ${p.points} ball (${p.explanation})\n`;
    });
    text += `\n`;

    text += `FIKR-MULOHAZA (FEEDBACK) NAMUNALARI:\n`;
    text += `Maqto‘v: ${result.feedbackSamples.praise}\n`;
    text += `Rivojlantiruvchi tavsiya: ${result.feedbackSamples.constructiveGuidance}\n`;
    text += `Keyingi qadamlar: ${result.feedbackSamples.nextSteps}\n`;

    return text.trim();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 text-xs font-bold border border-fuchsia-200 dark:border-fuchsia-900">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Shakllantiruvchi baholash yordamchisi</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Baholash mezonlari va rubrika
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Aniqlangan mezonlar, 4 bosqichli rubrika, ballar taqsimoti va o‘quvchilar uchun konstruktiv fikr-mulohazalar.
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Topshiriq yoki dars mavzusi *</span>
              <span className="text-[11px] text-slate-400 font-normal">Baholanadigan topshiriq</span>
            </label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="Masalan: Insho yozish, Laboratoriya ishi yoki Loyiha taqdimoti"
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fan
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 font-medium"
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
                Sinf
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 font-medium"
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
                O‘quvchi darajasi
              </label>
              <select
                value={studentLevel}
                onChange={(e) => setStudentLevel(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 font-medium"
              >
                <option value="Aralash">Aralash (Umumiy sinf)</option>
                <option value="Boshlang‘ich">Boshlang‘ich o‘zlashtiruvchilar</option>
                <option value="O‘rta">O‘rta darajadagi o‘quvchilar</option>
                <option value="Iqtidorli">Iqtidorli va ilg‘or o‘quvchilar</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Kutilayotgan natija (ixtiyoriy)
            </label>
            <input
              type="text"
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="O‘quvchi ushbu topshiriqda qanday natijaga erishishi kerak?"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-fuchsia-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Mezonlar hisoblanmoqda...' : 'Baholash rubrikasini yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <LoadingCard
          title="Baholash mezonlari ishlab chiqilmoqda..."
          subtitle="4 darajali rubrika jadvali, ballar taqsimoti va o‘quvchini ruhlantiruvchi fikr-mulohazalar shakllantirilmoqda."
        />
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in">
          <ResultActions
            title={`Baholash: ${result.assignmentTitle}`}
            type="assessment"
            subject={result.subject}
            grade={result.grade}
            topic={result.assignmentTitle}
            data={result}
            getTextToCopy={getTextToCopy}
            onShowToast={onShowToast}
            onReset={handleReset}
            resetLabel="Yangi mezon yaratish"
          />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 dark:border-white/80 pb-4 text-center space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-700 dark:text-fuchsia-400">
                BAHOLASH MEZONLARI VA RUBRIKA
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {result.assignmentTitle}
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Fan: {result.subject} | Sinf: {result.grade} | Daraja: {result.studentLevel}
              </p>
            </div>

            {/* General Criteria */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-fuchsia-600" />
                <span>Asosiy baholash mezonlari:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.generalCriteria.map((crit, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-md bg-fuchsia-100 dark:bg-fuchsia-900/60 text-fuchsia-800 dark:text-fuchsia-200 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rubrics Table requested by user */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-blue-600" />
                <span>Rubrika jadvali (Baho darajalari)</span>
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
                <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-3.5 w-1/5">Mezon</th>
                      <th className="p-3.5 w-1/5 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                        A'lo (86-100%)
                      </th>
                      <th className="p-3.5 w-1/5 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20">
                        Yaxshi (71-85%)
                      </th>
                      <th className="p-3.5 w-1/5 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20">
                        Qoniqarli (56-70%)
                      </th>
                      <th className="p-3.5 w-1/5 text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20">
                        Qoniqarsiz (&lt;56%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    {result.rubric.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/40">
                          {row.criterion}
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                            Maksimal: {row.maxPoints} ball
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {row.levels.excellent}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {row.levels.good}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {row.levels.satisfactory}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {row.levels.unsatisfactory}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Ballar taqsimoti</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.pointsBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-extrabold">
                        {item.points} ball
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Examples */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>O‘quvchiga beriladigan fikr-mulohaza (Feedback) namunalari:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                    👏 Ijobiy e'tirof va maqtov:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{result.feedbackSamples.praise}"
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-1">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300 block">
                    💡 Rivojlantiruvchi yo‘naltirish:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{result.feedbackSamples.constructiveGuidance}"
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-1">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                    🚀 Keyingi qadamlar:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{result.feedbackSamples.nextSteps}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
