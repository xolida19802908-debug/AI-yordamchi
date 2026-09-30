import React from 'react';
import { X, Printer, Copy, Check, Bookmark, Calendar, BookOpen } from 'lucide-react';
import { SavedMaterial } from '../../types';

interface MaterialDetailModalProps {
  material: SavedMaterial | null;
  onClose: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  material,
  onClose,
  onShowToast,
}) => {
  if (!material) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(material.data, null, 2));
      onShowToast('success', 'Material ma\'lumotlari nusxalandi!');
    } catch {
      onShowToast('error', 'Nusxalashda xatolik yuz berdi.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/80 no-print">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {material.subject}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-semibold">{material.grade}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400 text-[11px]">
                {new Date(material.createdAt).toLocaleDateString('uz-UZ')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {material.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              title="Chop etish"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Render based on material data */}
          {material.notes && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
              <strong>Eslatma:</strong> {material.notes}
            </div>
          )}

          {/* Fallback JSON / formatted renderer */}
          <div className="space-y-4">
            {material.type === 'lesson' && renderLessonPlan(material.data)}
            {material.type === 'test' && renderTestCollection(material.data)}
            {material.type === 'questions' && renderQuestions(material.data)}
            {material.type === 'homework' && renderHomework(material.data)}
            {material.type === 'interactive' && renderInteractive(material.data)}
            {material.type === 'explanation' && renderExplanation(material.data)}
            {material.type === 'assessment' && renderAssessment(material.data)}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderLessonPlan(data: any) {
  if (!data || !data.stages) return null;
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
        <h3 className="text-base font-bold text-blue-900 dark:text-blue-100">
          Mavzu: {data.topic}
        </h3>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          Dars davomiyligi: {data.duration} | Turi: {data.lessonType}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dars maqsadlari:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
            <strong className="text-blue-600 block mb-1">Ta'limiy:</strong>
            <span>{data.objectives?.educational}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
            <strong className="text-indigo-600 block mb-1">Rivojlantiruvchi:</strong>
            <span>{data.objectives?.developmental}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
            <strong className="text-emerald-600 block mb-1">Tarbiyaviy:</strong>
            <span>{data.objectives?.pedagogical}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dars bosqichlari:</h4>
        {Object.entries(data.stages || {}).map(([key, val]) => (
          <div key={key} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[11px] block">
              {key === 'organizational' && 'Tashkiliy qism'}
              {key === 'previousTopicReview' && 'O‘tgan mavzuni takrorlash'}
              {key === 'newTopicExplanation' && 'Yangi mavzuni tushuntirish'}
              {key === 'practicalActivity' && 'Amaliy mashg‘ulot'}
              {key === 'consolidation' && 'Mustahkamlash'}
              {key === 'assessment' && 'Baholash'}
              {key === 'homework' && 'Uyga vazifa'}
              {key === 'conclusion' && 'Yakuniy xulosa'}
            </span>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{String(val)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderTestCollection(data: any) {
  if (!data || !Array.isArray(data.questions)) return null;
  return (
    <div className="space-y-4">
      <div className="text-xs font-bold text-slate-500 uppercase">Jami {data.questions.length} ta savol:</div>
      {data.questions.map((q: any, i: number) => (
        <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {i + 1}. {q.question}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {q.options && Object.entries(q.options).map(([k, v]) => (
              <div
                key={k}
                className={`p-2.5 rounded-lg border ${
                  k === q.correctAnswer
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-100 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <strong>{k})</strong> {String(v)}
              </div>
            ))}
          </div>
          {q.explanation && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 p-2 rounded-lg">
              <strong>Izoh:</strong> {q.explanation}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function renderQuestions(data: any) {
  return (
    <div className="space-y-6">
      {['easy', 'medium', 'difficult'].map((tier) => (
        <div key={tier} className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {tier === 'easy' && '🟢 Oson savollar'}
            {tier === 'medium' && '🟡 O‘rta savollar'}
            {tier === 'difficult' && '🔴 Qiyin savollar'}
          </h4>
          <div className="space-y-2">
            {(data[tier] || []).map((q: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{idx + 1}. {q.question}</p>
                {q.answerHint && <p className="text-slate-500 text-xs">Javob namunasi: {q.answerHint}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderHomework(data: any) {
  return (
    <div className="space-y-4">
      {data.instructionsForStudents && (
        <p className="text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border">
          <strong>Yo‘riqnoma:</strong> {data.instructionsForStudents}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['beginnerLevel', 'mediumLevel', 'advancedLevel'].map((lvl) => {
          const lData = data[lvl];
          if (!lData) return null;
          return (
            <div key={lvl} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold uppercase text-slate-700 dark:text-slate-300 block">
                {lvl === 'beginnerLevel' && '🥉 Boshlang‘ich'}
                {lvl === 'mediumLevel' && '🥈 O‘rta'}
                {lvl === 'advancedLevel' && '🥇 Yuqori'}
              </span>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-700 dark:text-slate-300">
                {(lData.tasks || []).map((t: string, i: number) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              <p className="text-slate-400 text-[11px] pt-2 border-t">Mezon: {lData.criteria}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderInteractive(data: any) {
  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200">
        <h4 className="font-bold text-rose-900 dark:text-rose-200">{data.title}</h4>
        <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{data.description}</p>
      </div>
      {data.instructions && (
        <div className="space-y-1">
          <strong className="text-xs uppercase text-slate-500">Qoidalar:</strong>
          <ul className="list-decimal pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            {data.instructions.map((ins: string, i: number) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function renderExplanation(data: any) {
  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200">
        <strong className="text-xs uppercase text-cyan-800">Sodda tushuntirish:</strong>
        <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">{data.simpleExplanation}</p>
      </div>
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <strong className="text-xs uppercase text-slate-500">Batafsil tushuntirish:</strong>
        <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-line">{data.detailedExplanation}</p>
      </div>
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
        <strong className="text-xs uppercase text-amber-800">Hayotiy misol:</strong>
        <p className="text-slate-800 dark:text-slate-200 mt-1">{data.realLifeExample}</p>
      </div>
    </div>
  );
}

function renderAssessment(data: any) {
  return (
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="p-4 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-200">
        <h4 className="font-bold text-fuchsia-900 dark:text-fuchsia-200">{data.assignmentTitle}</h4>
        <p className="text-xs text-fuchsia-700 dark:text-fuchsia-300 mt-1">Daraja: {data.studentLevel}</p>
      </div>
      {Array.isArray(data.rubric) && (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
              <tr>
                <th className="p-3">Mezon</th>
                <th className="p-3">A'lo</th>
                <th className="p-3">Yaxshi</th>
                <th className="p-3">Qoniqarli</th>
                <th className="p-3">Qoniqarsiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {data.rubric.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="p-3 font-bold">{r.criterion}</td>
                  <td className="p-3">{r.levels?.excellent}</td>
                  <td className="p-3">{r.levels?.good}</td>
                  <td className="p-3">{r.levels?.satisfactory}</td>
                  <td className="p-3">{r.levels?.unsatisfactory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
