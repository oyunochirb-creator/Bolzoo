import React, { useState } from 'react';
import { DateInvitation } from '../types';
import { GRADIENT_THEMES, POPULAR_ACTIVITIES } from '../data/defaults';
import { Maximize2, Minimize2, Sparkles, Heart, Music, Eye } from 'lucide-react';

interface LiveCornerPreviewProps {
  invitation: DateInvitation;
  onOpenFullPreview: () => void;
}

export const LiveCornerPreview: React.FC<LiveCornerPreviewProps> = ({
  invitation,
  onOpenFullPreview,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const theme = GRADIENT_THEMES.find((t) => t.id === invitation.themeId) || GRADIENT_THEMES[0];

  const selectedCount = invitation.suggestedActivities.length;

  return (
    <div className="fixed bottom-4 right-4 z-40 transition-all duration-300">
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 bg-white/95 text-pink-600 px-3.5 py-2.5 rounded-full shadow-lg border border-pink-200 hover:scale-105 active:scale-95 transition-all text-xs font-bold"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
          </span>
          <Eye className="w-3.5 h-3.5" />
          <span>Live Урьдчилж харах</span>
        </button>
      ) : (
        <div className="w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-pink-200 overflow-hidden text-slate-800 transition-all">
          {/* Header of the Mini Widget */}
          <div className="px-3.5 py-2.5 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">
                Шууд урьдчилан харах
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenFullPreview}
                title="Бүтэн дэлгэцээр харах"
                className="p-1 text-slate-400 hover:text-pink-600 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Хураах"
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mini Phone Screen Preview */}
          <div
            className={`p-3.5 ${theme.gradientClass} relative overflow-hidden transition-all duration-300 min-h-[160px] flex flex-col justify-between`}
          >
            {/* Top info */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-pink-700/80 mb-2">
                <span className="font-semibold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                  Болзооны урилга
                </span>
                <span className="bg-white/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-pink-600">
                  {theme.name}
                </span>
              </div>

              <div className="bg-white/85 backdrop-blur-xs rounded-xl p-2 border border-white/60 shadow-xs flex items-center gap-2">
                <img
                  src="/src/assets/images/cat_asking_date_1792815889647.jpg"
                  alt="Meme cat"
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-pink-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1 truncate">
                    <span>Хэнд:</span>
                    <span className="text-pink-600 underline decoration-pink-300">
                      {invitation.receiverName || 'Хонгор минь'}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-600 line-clamp-1 italic leading-relaxed">
                    "{invitation.message || 'Надтай болзоонд явах уу? 💕'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom mini tags */}
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <Music className="w-2.5 h-2.5 text-pink-500 shrink-0" />
                  <span className="truncate">
                    {invitation.musicTitle || invitation.musicQuery || 'Дуу сонгоогүй'}
                  </span>
                </span>
                <span className="text-[9px] font-bold text-pink-600">
                  {selectedCount} үйл ажиллагаа
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenFullPreview}
                className="w-full mt-1.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Хүлээн авагчийн нүдээр турших</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
