import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Brain, CheckCircle2 } from 'lucide-react';
import { TEACHER_QUOTES } from '../../data/constants';

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = 'AI yordamchisi ma\'lumotlarni tayyorlamoqda...',
  subtitle = 'Iltimos, kuting. DTS talablari va metodik mezonlar tahlil qilinmoqda.',
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TEACHER_QUOTES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-blue-100 dark:border-slate-700/60 p-8 shadow-xl shadow-blue-500/5 text-center space-y-6 animate-in fade-in">
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-slate-700 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin" />
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>{title}</span>
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      {/* Progress pipeline animation */}
      <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 text-[11px] text-slate-400">
        <div className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
          <Brain className="w-4 h-4 animate-bounce" />
          <span>Metodik tahlil</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
          <BookOpen className="w-4 h-4 animate-pulse" />
          <span>Tuzilish</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tayyorlash</span>
        </div>
      </div>

      {/* Rotating inspiring pedagogical quote */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 max-w-lg mx-auto">
        <p className="text-xs italic text-slate-500 dark:text-slate-400 transition-all duration-500">
          {TEACHER_QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
};
