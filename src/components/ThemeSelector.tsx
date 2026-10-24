import React from 'react';
import { GRADIENT_THEMES } from '../data/defaults';
import { GradientTheme } from '../types';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeId,
  onSelectTheme,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800">
          Өнгөний уусгалт (Дээрээс доош градиент)
        </label>
        <span className="text-xs text-pink-600 font-medium">
          4 пастел сонголт
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {GRADIENT_THEMES.map((theme: GradientTheme) => {
          const isSelected = theme.id === selectedThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`relative group p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${
                isSelected
                  ? 'border-pink-500 ring-2 ring-pink-400/30 shadow-md bg-white'
                  : 'border-slate-200/80 hover:border-pink-300 bg-white/70 hover:shadow-sm'
              }`}
            >
              {/* Gradient Preview Bar */}
              <div
                className={`w-full h-12 rounded-xl mb-2 relative overflow-hidden shadow-inner ${theme.gradientClass}`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {theme.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate leading-tight">
                  {theme.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
