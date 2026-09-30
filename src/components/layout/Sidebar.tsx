import React from 'react';
import {
  Home,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Home as HomeWorkIcon,
  Gamepad2,
  BarChart3,
  BookMarked,
  Bookmark,
  Settings,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export type NavSection =
  | 'dashboard'
  | 'lesson'
  | 'test'
  | 'questions'
  | 'homework'
  | 'interactive'
  | 'assessment'
  | 'explanation'
  | 'saved'
  | 'settings';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  savedCount: number;
}

export const navItems = [
  { id: 'dashboard' as NavSection, label: 'Bosh sahifa', icon: Home, badge: '' },
  { id: 'lesson' as NavSection, label: 'Dars yaratish', icon: BookOpen, badge: 'Konspekt' },
  { id: 'test' as NavSection, label: 'Test yaratish', icon: FileCheck2, badge: 'A, B, C, D' },
  { id: 'questions' as NavSection, label: 'Savollar yaratish', icon: HelpCircle, badge: '3 daraja' },
  { id: 'homework' as NavSection, label: 'Uy vazifasi', icon: HomeWorkIcon, badge: 'Tabaqali' },
  { id: 'interactive' as NavSection, label: 'Interaktiv topshiriqlar', icon: Gamepad2, badge: 'O‘yinlar' },
  { id: 'assessment' as NavSection, label: 'Baholash', icon: BarChart3, badge: 'Rubrika' },
  { id: 'explanation' as NavSection, label: 'Mavzuni tushuntirish', icon: BookMarked, badge: 'Sodda & Ilmiy' },
  { id: 'saved' as NavSection, label: 'Saqlanganlar', icon: Bookmark, badge: 'savedCount' },
  { id: 'settings' as NavSection, label: 'Sozlamalar', icon: Settings, badge: '' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  savedCount,
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-30 select-none no-print">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                USTOZ AI
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                PRO
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Ustoz yordamchisi
            </p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
          Har bir dars uchun aqlli yordamchi
        </p>
      </div>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-thin">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Asosiy bo‘limlar
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const badgeText = item.badge === 'savedCount' ? (savedCount > 0 ? `${savedCount}` : '') : item.badge;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {badgeText && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {badgeText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>O‘zbekiston DTS talablari</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Barcha metodik materiallar milliy ta'lim dasturlariga mos holda tuziladi.
          </p>
        </div>
      </div>
    </aside>
  );
};
