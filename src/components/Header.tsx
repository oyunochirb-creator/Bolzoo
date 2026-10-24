import React from 'react';
import { Heart, Sparkles, PlusCircle, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onNewInvitation: () => void;
  onPreviewMode?: () => void;
  currentMode: 'creator' | 'receiver' | 'preview';
}

export const Header: React.FC<HeaderProps> = ({
  onNewInvitation,
  onPreviewMode,
  currentMode,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-5 py-3.5 bg-white/80 backdrop-blur-md border-b border-pink-200/60 sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNewInvitation();
        }}
        className="flex items-center gap-2 text-slate-900 whitespace-nowrap shrink-0 group"
      >
        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <Heart className="w-4 h-4 fill-white" />
        </span>
        <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-sky-600 bg-clip-text text-transparent">
          Болзоо.mn
        </span>
      </a>

      {/* Zone 2: Concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={onNewInvitation}
          className={`hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'creator' ? 'text-pink-600 font-bold' : ''
          }`}
        >
          Урилга зохиох
        </button>
        {onPreviewMode && (
          <button
            type="button"
            onClick={onPreviewMode}
            className={`hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 ${
              currentMode === 'preview' ? 'text-pink-600 font-bold' : ''
            }`}
          >
            Урьдчилан үзэх
          </button>
        )}
        <span className="text-slate-300">·</span>
        <span className="text-pink-500 whitespace-nowrap shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          100% Үнэгүй
        </span>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onNewInvitation}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Шинэ урилга</span>
        </button>
      </div>
    </header>
  );
};
