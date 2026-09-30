import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Home,
  Gamepad2,
  BookMarked,
  BarChart3,
  Layers,
  Filter,
  Check,
  X,
  Printer,
  Copy,
} from 'lucide-react';
import { SavedMaterial, MaterialType } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import { deleteSavedMaterial, updateSavedMaterial, searchMaterials } from '../../services/storage';

interface SavedMaterialsProps {
  materials: SavedMaterial[];
  onRefreshMaterials: () => void;
  onOpenMaterialDetail: (material: SavedMaterial) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialSearchQuery?: string;
}

const typeOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Barcha turlar' },
  { value: 'lesson', label: 'Dars ishlanmalari' },
  { value: 'test', label: 'Testlar' },
  { value: 'questions', label: 'Savollar' },
  { value: 'homework', label: 'Uy vazifalari' },
  { value: 'interactive', label: 'Interaktiv metodlar' },
  { value: 'explanation', label: 'Tushuntirishlar' },
  { value: 'assessment', label: 'Baholash mezonlari' },
];

export const SavedMaterials: React.FC<SavedMaterialsProps> = ({
  materials,
  onRefreshMaterials,
  onOpenMaterialDetail,
  onShowToast,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Edit modal state
  const [editingItem, setEditingItem] = useState<SavedMaterial | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Delete confirm modal state
  const [itemToDelete, setItemToDelete] = useState<SavedMaterial | null>(null);

  const filteredMaterials = useMemo(() => {
    return searchMaterials(materials, searchQuery, selectedType, selectedGrade, selectedSubject);
  }, [materials, searchQuery, selectedType, selectedGrade, selectedSubject]);

  const handleStartEdit = (item: SavedMaterial) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditNotes(item.notes || '');
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (!editTitle.trim()) {
      onShowToast('error', 'Material sarlavhasi bo‘sh bo‘lishi mumkin emas.');
      return;
    }

    const ok = updateSavedMaterial(editingItem.id, {
      title: editTitle.trim(),
      notes: editNotes.trim() || undefined,
    });

    if (ok) {
      onRefreshMaterials();
      onShowToast('success', 'Material muvaffaqiyatli tahrirlandi!');
      setEditingItem(null);
    } else {
      onShowToast('error', 'Tahrirlashda xatolik yuz berdi.');
    }
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const ok = deleteSavedMaterial(itemToDelete.id);
    if (ok) {
      onRefreshMaterials();
      onShowToast('success', 'Material o‘chirildi.');
      setItemToDelete(null);
    } else {
      onShowToast('error', 'O‘chirishda xatolik yuz berdi.');
    }
  };

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'test':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'questions':
        return <HelpCircle className="w-4 h-4 text-violet-600" />;
      case 'homework':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'interactive':
        return <Gamepad2 className="w-4 h-4 text-rose-600" />;
      case 'explanation':
        return <BookMarked className="w-4 h-4 text-cyan-600" />;
      case 'assessment':
        return <BarChart3 className="w-4 h-4 text-fuchsia-600" />;
    }
  };

  const getTypeLabel = (type: MaterialType) => {
    switch (type) {
      case 'lesson':
        return 'Dars ishlanmasi';
      case 'test':
        return 'Test';
      case 'questions':
        return 'Savollar';
      case 'homework':
        return 'Uy vazifasi';
      case 'interactive':
        return 'Interaktiv';
      case 'explanation':
        return 'Tushuntirish';
      case 'assessment':
        return 'Baholash';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Shaxsiy kutubxona</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Saqlangan materiallar ({materials.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            O‘zingiz yaratgan barcha dars ishlanmalari, testlar va topshiriqlarni qidiring va boshqaring.
          </p>
        </div>
      </div>

      {/* Global Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Fan, mavzu, sarlavha yoki eslatma bo‘yicha qidirish..."
            className="w-full text-sm pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Material Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Turi
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Fan
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Barcha fanlar</option>
              {CURRICULUM_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Grade */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Sinf
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Barcha sinflar</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <Layers className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Hech qanday material topilmadi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {getTypeIcon(item.type)}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {item.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.grade}
                  </span>
                  {item.topic && (
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">
                      Mavzu: {item.topic}
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    📝 {item.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons: Open, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenMaterialDetail(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ochish</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition"
                    title="Tahrirlash"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Materialni tahrirlash
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sarlavha
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Eslatma / Izoh
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                placeholder="Qo‘shimcha izoh..."
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rostdan ham o‘chirmoqchimisiz?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                “{itemToDelete.title}” materiali o‘chiriladi. Bu amalni ortga qaytarib bo‘lmaydi.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
