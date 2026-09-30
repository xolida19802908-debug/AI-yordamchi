import React from 'react';
import {
  BookOpen,
  FileCheck2,
  HelpCircle,
  Home as HomeIcon,
  Gamepad2,
  BarChart3,
  BookMarked,
  ArrowRight,
  Sparkles,
  Bookmark,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { SavedMaterial, TeacherProfile } from '../../types';
import { NavSection } from '../layout/Sidebar';

interface DashboardProps {
  profile: TeacherProfile;
  savedMaterials: SavedMaterial[];
  onNavigate: (section: NavSection) => void;
  onOpenMaterial: (material: SavedMaterial) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  savedMaterials,
  onNavigate,
  onOpenMaterial,
}) => {
  const quickActions = [
    {
      id: 'lesson' as NavSection,
      title: 'Dars yaratish',
      description: '45 daqiqalik to‘liq, namunali 12 bosqichli dars ishlanmasi (konspekt)',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      tag: '12 bosqich',
      popular: true,
    },
    {
      id: 'test' as NavSection,
      title: 'Test yaratish',
      description: 'A, B, C, D variantli testlar, to‘g‘ri javoblar va chop etish formati',
      icon: FileCheck2,
      color: 'from-emerald-600 to-teal-600',
      tag: 'A, B, C, D',
      popular: true,
    },
    {
      id: 'questions' as NavSection,
      title: 'Savollar yaratish',
      description: 'Bloom taksonomiyasi bo‘yicha 3 darajali (oson, o‘rta, qiyin) savollar',
      icon: HelpCircle,
      color: 'from-violet-600 to-purple-600',
      tag: '3 daraja',
      popular: false,
    },
    {
      id: 'homework' as NavSection,
      title: 'Uy vazifasi',
      description: 'Boshlang‘ich, o‘rta va yuqori darajadagi tabaqalashtirilgan topshiriqlar',
      icon: HomeIcon,
      color: 'from-amber-600 to-orange-600',
      tag: 'Tabaqali',
      popular: false,
    },
    {
      id: 'interactive' as NavSection,
      title: 'Interaktiv topshiriqlar',
      description: 'Tezkor blitz, Kim tez topadi?, To‘g‘ri/noto‘g‘ri va guruh o‘yinlari',
      icon: Gamepad2,
      color: 'from-rose-600 to-pink-600',
      tag: '7 ta metod',
      popular: true,
    },
    {
      id: 'explanation' as NavSection,
      title: 'Mavzuni tushuntirish',
      description: 'Har qanday murakkab mavzuni sodda til, hayotiy misol va 5 asosiy qoidada bayon etish',
      icon: BookMarked,
      color: 'from-cyan-600 to-blue-600',
      tag: 'Hayotiy misol',
      popular: false,
    },
    {
      id: 'assessment' as NavSection,
      title: 'Baholash mezonlari',
      description: 'Kriteriyalar, ballar taqsimoti, 4 darajali rubrika va fikr-mulohaza namunalari',
      icon: BarChart3,
      color: 'from-fuchsia-600 to-indigo-600',
      tag: 'Rubrika',
      popular: false,
    },
  ];

  const recentMaterials = savedMaterials.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-10 shadow-2xl shadow-blue-900/20">
        {/* Decorative backdrop shapes */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>O‘zbekiston o‘qituvchilari uchun sun'iy intellekt platformasi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Assalomu alaykum, {profile.fullName || 'Ustoz'}! 👋
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Bugungi darslaringizni tayyorlashda <strong className="font-semibold text-white">USTOZ AI</strong> sizga yordam beradi. 
            Dars ishlanmalari, testlar, savollar, tabaqalashtirilgan uy vazifalarini bir zumda yarating va dars samaradorligini oshiring.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('lesson')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm hover:bg-blue-50 transition shadow-lg shadow-black/10"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Dars yaratishni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('test')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition backdrop-blur-md"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span>Test tuzish</span>
            </button>
          </div>
        </div>

        {/* Quick Stats in Hero */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <div className="text-2xl font-extrabold text-white">{savedMaterials.length}</div>
            <div className="text-xs text-blue-200/80 font-medium">Saqlangan materiallar</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-300">12 ta</div>
            <div className="text-xs text-blue-200/80 font-medium">Dars ishlanmasi bosqichlari</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-300">7 xil</div>
            <div className="text-xs text-blue-200/80 font-medium">Interfaol topshiriq turi</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-sky-300">1-11</div>
            <div className="text-xs text-blue-200/80 font-medium">Barcha sinflar uchun</div>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Tezkor yaratish bo‘limlari</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            Barcha vositalar
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          O‘zingizga kerakli dars vositasini tanlang va bir necha soniyada tayyor materialga ega bo‘ling.
        </p>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    {action.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Yaratishni boshlash</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Saved + Pedagogical Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Recent Saved Materials (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                So‘nggi saqlangan materiallar
              </h3>
            </div>
            {savedMaterials.length > 0 && (
              <button
                onClick={() => onNavigate('saved')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Barchasini ko‘rish ({savedMaterials.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentMaterials.length === 0 ? (
            <div className="py-8 text-center space-y-2 text-slate-400">
              <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm">Hozircha saqlangan materiallar mavjud emas.</p>
              <p className="text-xs">
                Yuqoridagi generatorlar orqali birinchi dars ishlanmangiz yoki testingizni yarating.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMaterials.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenMaterial(item)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:border-blue-200 dark:hover:border-blue-800 transition cursor-pointer group"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900">
                        {item.subject}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{item.grade}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedagogical Tip Card (1 col) */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-slate-700 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pedagogik tavsiya: Faol ta'lim
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tadqiqotlarga ko‘ra, darsning dastlabki <strong>7 daqiqasi</strong> o‘quvchilar diqqatini jalb qilishda hal qiluvchi rol o‘ynaydi. 
              Darsni an'anaviy so‘rov o‘rniga <em>“Sirli savol”</em> yoki <em>“Kim tez topadi?”</em> interaktiv o‘yini bilan boshlash o‘quvchilar faolligini 2 barobarga oshiradi.
            </p>
          </div>

          <div className="pt-4 border-t border-indigo-100 dark:border-slate-700">
            <button
              onClick={() => onNavigate('interactive')}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
            >
              <span>Interaktiv metodlarni sinab ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
