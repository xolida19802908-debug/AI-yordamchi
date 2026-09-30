import React, { useState } from 'react';
import { Copy, Check, Bookmark, Printer, FileDown, Sparkles } from 'lucide-react';
import { MaterialType, SavedMaterial } from '../../types';
import { saveMaterial } from '../../services/storage';

interface ResultActionsProps {
  title: string;
  type: MaterialType;
  subject: string;
  grade: string;
  topic: string;
  data: any;
  getTextToCopy: () => string;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onReset?: () => void;
  resetLabel?: string;
  isSavedAlready?: boolean;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  title,
  type,
  subject,
  grade,
  topic,
  data,
  getTextToCopy,
  onShowToast,
  onReset,
  resetLabel = 'Yangi yaratish',
  isSavedAlready = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isSavedAlready);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  const handleCopy = async () => {
    try {
      const text = getTextToCopy();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('success', 'Nusxalandi! Ma\'lumot xotiraga muvaffaqiyatli ko‘chirildi.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('error', 'Nusxalashda xatolik yuz berdi.');
    }
  };

  const handleSave = () => {
    if (saved) {
      onShowToast('info', 'Ushbu material allaqachon "Saqlanganlar" bo‘limida mavjud.');
      return;
    }
    setShowNotesModal(true);
  };

  const confirmSave = () => {
    saveMaterial({
      type,
      title,
      subject,
      grade,
      topic,
      data,
      notes: notes.trim() || undefined,
    });
    setSaved(true);
    setShowNotesModal(false);
    onShowToast('success', '“Saqlanganlar” bo‘limiga muvaffaqiyatli qo‘shildi!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 no-print">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            {subject}
          </span>
          <span>•</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {grade}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-600 transition shadow-sm"
              title="Formani tozalab yangi yaratish"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {resetLabel}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-600 transition shadow-sm"
            title="Matnni nusxalash"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Nusxalandi</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Nusxalash</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={saved}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition shadow-sm ${
              saved
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600'
            }`}
            title="Saqlanganlar ro‘yxatiga qo‘shish"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-emerald-500 fill-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>{saved ? 'Saqlandi' : 'Saqlash'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-600 transition shadow-sm"
            title="Chop etish yoki qog‘ozga chiqarish"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Chop etish</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800 transition shadow-sm"
            title="PDF formatida saqlash (Chop etish orqali)"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>PDFga tayyorlash</span>
          </button>
        </div>
      </div>

      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Materialni saqlash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ushbu material «Saqlanganlar» bo‘limiga kiritiladi. O‘zingiz uchun eslatma (izoh) qoldirishingiz mumkin:
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Eslatma yoki sinf izohi (ixtiyoriy)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masalan: 7-A sinfida ochiq dars uchun qo‘llanadi..."
                rows={3}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
