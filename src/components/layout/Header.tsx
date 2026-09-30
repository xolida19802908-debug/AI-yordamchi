import React from 'react';
import { Menu, Search, Bookmark, Sparkles, GraduationCap } from 'lucide-react';
import { TeacherProfile } from '../../types';
import { NavSection } from './Sidebar';

interface HeaderProps {
  profile: TeacherProfile;
  activeSection: NavSection;
  savedCount: number;
  onOpenMobileMenu: () => void;
  onNavigateToSaved: (searchQuery?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeSection,
  savedCount,
  onOpenMobileMenu,
  onNavigateToSaved,
}) => {
  // Format current date in Uzbek
  const now = new Date();
  const monthsUzbek = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  const dayNameUzbek = [
    'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
  ];
  const formattedDate = `${now.getDate()}-${monthsUzbek[now.getMonth()]}, ${dayNameUzbek[now.getDay()]}`;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 no-print">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu + Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              USTOZ AI
            </span>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Assalomu alaykum, {profile.fullName || 'Ustoz'}! 👋
              </h2>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {profile.schoolName || 'Maktab o‘qituvchisi'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bugungi darslaringizni tayyorlashda USTOZ AI sizga yordam beradi.
            </p>
          </div>
        </div>

        {/* Right: Quick actions + date */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>

          <button
            onClick={() => onNavigateToSaved()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            title="Saqlangan materiallarni ko‘rish"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden xs:inline">Saqlanganlar</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
