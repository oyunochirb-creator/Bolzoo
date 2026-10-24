import React, { useState } from 'react';
import { DateInvitation, DateResponse } from '../types';
import { POPULAR_ACTIVITIES, POPULAR_FOODS, GRADIENT_THEMES } from '../data/defaults';
import { Calendar, Clock, Heart, Sparkles, MapPin, CheckCircle, Share2, Copy, Check } from 'lucide-react';

interface DateTicketProps {
  invitation: DateInvitation;
  response: DateResponse;
  onShareOrCopy?: () => void;
}

export const DateTicket: React.FC<DateTicketProps> = ({ invitation, response }) => {
  const [copied, setCopied] = useState(false);
  const theme = GRADIENT_THEMES.find((t) => t.id === invitation.themeId) || GRADIENT_THEMES[0];

  // Map activity titles
  const activityNames = [
    ...response.selectedActivities.map((id) => {
      const match = POPULAR_ACTIVITIES.find((a) => a.id === id);
      return match ? `${match.icon} ${match.title}` : id;
    }),
    ...response.customActivities.map((c) => `✨ ${c}`),
  ];

  // Map foods
  const foodNames = response.selectedFoods.map((id) => {
    const match = POPULAR_FOODS.find((f) => f.id === id);
    return match ? `${match.emoji} ${match.name}` : id;
  });

  const getTimeOfDayLabel = (tod: string) => {
    switch (tod) {
      case 'morning':
        return '☀️ Өглөөний сэнгэнэсэн наранд';
      case 'afternoon':
        return '🌤️ Үдийн налгар цагаар';
      case 'sunset':
        return '🌅 Нар жаргах романтик агшинд';
      case 'night':
        return '🌌 Оройн од түгэх үдэш';
      default:
        return '✨ Болзооны цаг';
    }
  };

  const copySummaryText = () => {
    const text = `🎉 БОЛЗООР АЯЛАХ ТАСАЛБАР БАТАЛГААЖЛАА! 🎉
💌 Уригч: ${response.senderName}
💖 Хүлээн авагч: ${response.receiverName}
🗓️ Огноо: ${response.selectedDate || 'Тохиролцоно'}
⏰ Цаг: ${response.selectedTime || 'Тохиролцоно'} (${getTimeOfDayLabel(response.timeOfDay)})
🎡 Хамт хийх зүйлс:
${activityNames.map((a) => `  • ${a}`).join('\n')}
🍰 Хоол, амттан:
${foodNames.map((f) => `  • ${f}`).join('\n')}
${response.receiverNote ? `💌 Хүлээн авагчийн зурвас: "${response.receiverNote}"` : ''}

💕 Хамтдаа нандин дурсамж бүтээцгээе!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Ticket Container */}
      <div className="relative bg-white rounded-3xl shadow-xl border border-pink-200 overflow-hidden">
        {/* Ticket Header */}
        <div className={`p-6 pb-5 ${theme.gradientClass} border-b border-dashed border-pink-300 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/90 text-pink-500 flex items-center justify-center shadow-sm">
                <Heart className="w-4 h-4 fill-pink-500" />
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-pink-700">
                  OFFICIAL DATE PASS
                </p>
                <h3 className="text-lg font-bold text-slate-800">
                  Болзооны Нислэгийн Тасалбар ✈️
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 text-pink-600 rounded-full text-xs font-bold shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-pink-500" />
              БАТАЛГААЖСАН
            </span>
          </div>

          {/* Semicircle cutouts for real boarding pass feel */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-100 border-r border-pink-200" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-slate-100 border-l border-pink-200" />
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 bg-white">
          {/* Passenger & Inviter */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">
                Хүлээн авагч (Зорчигч)
              </p>
              <p className="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <span>{response.receiverName || 'Хонгор минь'}</span>
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">
                Урилга илгээгч
              </p>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {response.senderName || 'Чамд хайртай нэгэн'}
              </p>
            </div>
          </div>

          {/* Date, Time & Vibe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-xs shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Товлосон өдөр</p>
                <p className="text-xs font-bold text-slate-800">
                  {response.selectedDate || 'Тохиролцоно'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-xs shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Цаг & Мөч</p>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {response.selectedTime || '18:00'} · {getTimeOfDayLabel(response.timeOfDay)}
                </p>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <span>🎡 Сонгосон болзооны хөтөлбөр</span>
              <span className="text-[10px] text-pink-500 font-normal">
                ({activityNames.length} зүйл)
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activityNames.length > 0 ? (
                activityNames.map((act, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pink-100/70 text-pink-800 text-xs font-medium rounded-full border border-pink-200/50"
                  >
                    {act}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Сонгосон үйл ажиллагаа байхгүй</span>
              )}
            </div>
          </div>

          {/* Foods */}
          {foodNames.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">
                🍰 Амтлах хоол, десерт
              </p>
              <div className="flex flex-wrap gap-1.5">
                {foodNames.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-sky-100/70 text-sky-800 text-xs font-medium rounded-full border border-sky-200/50"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {response.receiverNote && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
              <p className="text-[10px] uppercase font-bold text-amber-700 mb-1">
                💌 Сэтгэлийн бяцхан зурвас
              </p>
              <p className="text-xs text-slate-700 italic">
                "{response.receiverNote}"
              </p>
            </div>
          )}

          {/* Barcode & Decorative Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1 tracking-widest text-[10px] font-mono text-slate-400">
                |||| | ||||| || |||||| | |||||
              </div>
              <p className="text-[9px] text-slate-400 uppercase">
                TICKET #BLZ-{response.confirmedAt ? response.confirmedAt.toString().slice(-6) : '889900'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-pink-500">
                100% Хайраар Батлагдсан 💕
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={copySummaryText}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-semibold text-sm rounded-2xl shadow-md shadow-pink-200 transition-all active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Хуулагдлаа! (Copied)</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Тасалбарын дэлгэрэнгүйг хуулах</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
