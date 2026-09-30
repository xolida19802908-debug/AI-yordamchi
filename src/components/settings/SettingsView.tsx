import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  School,
  BookOpen,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { TeacherProfile } from '../../types';
import { CURRICULUM_SUBJECTS, GRADE_LEVELS } from '../../data/constants';
import {
  saveTeacherProfile,
  exportDataAsJSON,
  importDataFromJSON,
} from '../../services/storage';

interface SettingsViewProps {
  profile: TeacherProfile;
  onUpdateProfile: (profile: TeacherProfile) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onRefreshMaterials: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onShowToast,
  onRefreshMaterials,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [schoolName, setSchoolName] = useState(profile.schoolName);
  const [city, setCity] = useState(profile.city);
  const [defaultSubject, setDefaultSubject] = useState(profile.defaultSubject);
  const [defaultGrade, setDefaultGrade] = useState(profile.defaultGrade);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TeacherProfile = {
      fullName: fullName.trim() || 'Hurmatli Ustoz',
      schoolName: schoolName.trim() || 'Umumiy o‘rta ta\'lim maktabi',
      city: city.trim() || 'Toshkent shahri',
      defaultSubject,
      defaultGrade,
    };
    saveTeacherProfile(updated);
    onUpdateProfile(updated);
    onShowToast('success', 'O‘qituvchi profili muvaffaqiyatli saqlandi!');
  };

  const handleExport = () => {
    try {
      const json = exportDataAsJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `USTOZ_AI_Zaxira_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('success', 'Barcha materiallar JSON faylida yuklab olindi!');
    } catch {
      onShowToast('error', 'Eksport qilishda xatolik yuz berdi.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataFromJSON(content);
        if (result.success) {
          onRefreshMaterials();
          onShowToast('success', result.message);
        } else {
          onShowToast('error', result.message);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
          <Settings className="w-3.5 h-3.5" />
          <span>Tizim sozlamalari</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          O‘qituvchi profili va sozlamalar
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Shaxsiy ma'lumotlaringiz, odatiy fanlaringiz va ma'lumotlar xavfsizligini boshqaring.
        </p>
      </div>

      {/* Teacher Profile Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Shaxsiy ma'lumotlar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ushbu ma'lumotlar dars ishlanmasi va testlarning sarlavha qismida avtomatik aks etadi.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Familiya, Ism va Otangizning ismi
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Karimova Malika Anvarovna"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Maktab / Ta'lim muassasasi
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Masalan: 14-sonli umumiy o‘rta ta'lim maktabi"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Shahar / Tuman / Viloyat
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Masalan: Toshkent shahri, Chilonzor tumani"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Asosiy faningiz (Birlamchi tanlov)
              </label>
              <select
                value={defaultSubject}
                onChange={(e) => setDefaultSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {CURRICULUM_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Asosiy dars beradigan sinfingiz
              </label>
              <select
                value={defaultGrade}
                onChange={(e) => setDefaultGrade(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              Profilni saqlash
            </button>
          </div>
        </form>
      </div>

      {/* Data Management Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ma'lumotlar xavfsizligi va zaxira nusxa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Barcha saqlangan darslaringiz brauzer xotirasida (localStorage) saqlanadi. Istalgan vaqtda fayl ko‘rinishida yuklab olishingiz mumkin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Zaxira nusxani yuklab olish
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Barcha dars ishlanmalari va testlaringizni kompyuteringizga JSON fayl qilib saqlang.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Zaxira faylini yuklab olish (.json)</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Zaxiradan tiklash (Import)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Oldin yuklab olingan zaxira faylini platformaga qayta yuklang.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 transition shadow-sm"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Zaxira faylini yuklash</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Application */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-100 dark:border-slate-700 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>USTOZ AI — Ustoz yordamchisi haqida</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Mazkur dasturiy ta'minot O‘zbekiston Respublikasi umumta'lim maktablari o‘qituvchilarining kundalik ish yuklamasini yengillashtirish, 
          darslarni zamonaviy interfaol metodlar va Davlat Ta'lim Standartlari (DTS) asosida tezkor hamda sifatli tayyorlash maqsadida ishlab chiqilgan.
        </p>
        <div className="text-[11px] text-slate-400 pt-2">
          Talqin: 1.0.0 Pro • Barcha huquqlar himoyalangan
        </div>
      </div>
    </div>
  );
};
