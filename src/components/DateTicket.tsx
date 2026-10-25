import React, { useState } from 'react';
import { DateInvitation, DateResponse } from '../types';
import { POPULAR_ACTIVITIES, POPULAR_FOODS, GRADIENT_THEMES } from '../data/defaults';
import { generateStoryImage } from '../utils/storyImageGenerator';
import {
  Calendar,
  Clock,
  Heart,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  Smartphone,
  Ticket,
  ArrowRight,
  Plane,
  Camera,
} from 'lucide-react';

interface DateTicketProps {
  invitation: DateInvitation;
  response: DateResponse;
  onShareOrCopy?: () => void;
}

export const DateTicket: React.FC<DateTicketProps> = ({ invitation, response }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [viewMode, setViewMode] = useState<'story' | 'classic'>('story');
  const [shared, setShared] = useState(false);

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
        return '☀️ Өглөө';
      case 'afternoon':
        return '🌤️ Үд';
      case 'sunset':
        return '🌅 Нар жаргах үе';
      case 'night':
        return '🌌 Үдэш';
      default:
        return '✨ Болзооны цаг';
    }
  };

  const copySummaryText = () => {
    const text = `🎉 БОЛЗООР АЯЛАХ ТАСАЛБАР БАТАЛГААЖЛАА! ✈️💕
💌 Уригч: ${response.senderName}
💖 Хүлээн авагч: ${response.receiverName}
🗓️ Огноо: ${response.selectedDate || 'Тохиролцоно'}
⏰ Цаг: ${response.selectedTime || '18:00'} (${getTimeOfDayLabel(response.timeOfDay)})
🎡 Хамт хийх зүйлс:
${activityNames.map((a) => `  • ${a}`).join('\n')}
🍰 Амтлах хоол:
${foodNames.map((f) => `  • ${f}`).join('\n')}
${response.receiverNote ? `💌 Сэтгэлийн үг: "${response.receiverNote}"\n` : ''}
✨ 100% Хайраар Баталгаажсан · First Class Date Ticket`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadStoryImage = async () => {
    try {
      setIsGeneratingImage(true);
      const dataUrl = await generateStoryImage({
        senderName: response.senderName,
        receiverName: response.receiverName,
        date: response.selectedDate,
        time: response.selectedTime,
        timeOfDayLabel: getTimeOfDayLabel(response.timeOfDay),
        activityIds: response.selectedActivities,
        customActivities: response.customActivities,
        foodIds: response.selectedFoods,
        note: response.receiverNote,
        themeId: invitation.themeId,
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `bolzoo-date-story-${response.receiverName || 'pass'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate story image', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Бид хоёрын болзооны тасалбар 💕',
          text: `Хөөе ${response.senderName}! Бид хоёрын болзооны тасалбар баталгаажлаа ✈️✨ ${response.selectedDate} өдөр уулзацгаая!`,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        copySummaryText();
      }
    } else {
      copySummaryText();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* View Mode Switcher (Story View vs Classic Pass) */}
      <div className="flex items-center justify-center p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-200/80 shadow-xs max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setViewMode('story')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'story'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Story загвар (9:16)</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('classic')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'classic'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Тасалбар</span>
        </button>
      </div>

      {/* 1. INSTAGRAM STORY (9:16) FORMAT CARD */}
      {viewMode === 'story' && (
        <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[380px] aspect-[9/16] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white/90 transition-all duration-300">
          {/* Story Background */}
          <div className={`absolute inset-0 ${theme.gradientClass} flex flex-col justify-between p-5 text-slate-800`}>
            {/* Top Story Header */}
            <div className="flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[10px] font-extrabold text-pink-600 shadow-xs">
                <Sparkles className="w-3 h-3 text-pink-500" />
                DATE PASS 2026
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Story Ready 📸
              </span>
            </div>

            {/* Inner Ticket Card */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border border-pink-200/90 my-auto space-y-3.5">
              {/* Header inside Ticket */}
              <div className="flex items-center justify-between border-b border-dashed border-pink-200 pb-2.5">
                <div>
                  <p className="text-[9px] font-black tracking-widest text-pink-500 uppercase">
                    BOARDING PASS · FIRST CLASS
                  </p>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Болзооны Нислэгийн Тасалбар ✈️
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Heart className="w-4 h-4 fill-pink-500" />
                </div>
              </div>

              {/* Sender -> Receiver Flight Route */}
              <div className="bg-slate-50 rounded-2xl p-2.5 flex items-center justify-between border border-slate-100 text-center">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">From</span>
                  <span className="text-xs font-black text-slate-800">{response.senderName || 'Би'}</span>
                </div>

                <div className="flex items-center gap-1 px-2 text-pink-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  <span className="h-0.5 w-6 bg-pink-300"></span>
                  <Plane className="w-3.5 h-3.5 text-pink-500 rotate-45" />
                  <span className="h-0.5 w-6 bg-pink-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-rose-500 block">To</span>
                  <span className="text-xs font-black text-rose-600">{response.receiverName || 'Хонгор минь'}</span>
                </div>
              </div>

              {/* Date & Time Chip */}
              <div className="grid grid-cols-2 gap-2 bg-pink-50/70 rounded-xl p-2 border border-pink-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">{response.selectedDate || 'Тохиролцоно'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 justify-end">
                  <Clock className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">{response.selectedTime || '18:00'} · {getTimeOfDayLabel(response.timeOfDay)}</span>
                </div>
              </div>

              {/* Activities */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  🎡 Хамт хийх зүйлс:
                </p>
                <div className="flex flex-wrap gap-1">
                  {activityNames.slice(0, 4).map((act, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-pink-100/80 text-pink-900 text-[11px] font-semibold rounded-lg border border-pink-200/60"
                    >
                      {act}
                    </span>
                  ))}
                  {activityNames.length > 4 && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">
                      +{activityNames.length - 4} өөр
                    </span>
                  )}
                </div>
              </div>

              {/* Food */}
              {foodNames.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    🍰 Амтлах амттан & хоол:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {foodNames.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-sky-100/80 text-sky-900 text-[11px] font-semibold rounded-lg border border-sky-200/60"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {response.receiverNote && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 italic">
                  💌 "{response.receiverNote.length > 45 ? response.receiverNote.substring(0, 42) + '...' : response.receiverNote}"
                </div>
              )}

              {/* Barcode & Confirmed Stamp */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] tracking-widest font-mono text-slate-400 leading-none">
                    |||| || ||||| ||| |||
                  </p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">
                    #BLZ-2026-LOVE · ADMIT TWO
                  </p>
                </div>

                {/* Aesthetic Red Rubber Stamp */}
                <div className="border-2 border-rose-600 text-rose-600 font-black rounded-lg px-2 py-0.5 text-[10px] uppercase rotate-[-6deg] tracking-wider shadow-xs">
                  ★ БАТЛАГДЛАА ★
                </div>
              </div>
            </div>

            {/* Bottom Story Hint */}
            <div className="text-center z-10">
              <p className="text-[10px] font-bold text-slate-600/90 bg-white/60 backdrop-blur-xs py-1 px-3 rounded-full inline-block">
                ✨ Story-доо хийхэд бэлэн боллоо ✨
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CLASSIC BOARDING PASS HORIZONTAL FORMAT */}
      {viewMode === 'classic' && (
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
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                БАТАЛГААЖСАН
              </span>
            </div>

            {/* Semicircle cutouts */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-100 border-r border-pink-200" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-slate-100 border-l border-pink-200" />
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-5 bg-white">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Хүлээн авагч</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{response.receiverName || 'Хонгор минь'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Урилга илгээгч</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{response.senderName || 'Чамд хайртай нэгэн'}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-xs shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Товлосон өдөр</p>
                  <p className="text-xs font-bold text-slate-800">{response.selectedDate || 'Тохиролцоно'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-xs shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Цаг & Үе</p>
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {response.selectedTime || '18:00'} · {getTimeOfDayLabel(response.timeOfDay)}
                  </p>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">🎡 Сонгосон болзооны хөтөлбөр:</p>
              <div className="flex flex-wrap gap-1.5">
                {activityNames.map((act, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pink-100/70 text-pink-800 text-xs font-medium rounded-full border border-pink-200/50"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Food */}
            {foodNames.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">🍰 Амтлах хоол, десерт:</p>
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
                <p className="text-[10px] uppercase font-bold text-amber-700 mb-1">💌 Сэтгэлийн бяцхан зурвас:</p>
                <p className="text-xs text-slate-700 italic">"{response.receiverNote}"</p>
              </div>
            )}

            {/* Barcode */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 tracking-widest text-[10px] font-mono text-slate-400">
                  |||| | ||||| || |||||| | |||||
                </div>
                <p className="text-[9px] text-slate-400 uppercase">
                  TICKET #BLZ-2026-LOVE · ADMIT TWO 💕
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-pink-500">100% Хайраар Батлагдсан 💕</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STORY & SHARING ACTION BUTTONS */}
      <div className="space-y-2.5 pt-1">
        {/* Primary: Download 1080x1920 Story Image */}
        <button
          type="button"
          onClick={handleDownloadStoryImage}
          disabled={isGeneratingImage}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-[0.98] disabled:opacity-75"
        >
          {isGeneratingImage ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Story зураг бэлтгэж байна...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>📸 Story-доо хийх зураг татах (1080x1920 PNG)</span>
            </>
          )}
        </button>

        {/* Secondary Buttons: Share & Copy */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white/90 hover:bg-pink-50 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 shadow-xs transition-colors"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5 text-pink-500" />
                <span>Илгээгдлээ!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Story / Чатаар илгээх</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={copySummaryText}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white/90 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-pink-500" />
                <span>Хуулагдлаа!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Текст хуулах</span>
              </>
            )}
          </button>
        </div>

        {/* Story Tip Callout */}
        <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-pink-200/70 text-center text-xs text-slate-600 shadow-xs">
          💡 <span className="font-bold text-pink-600">Story зөвлөмж:</span> Татсан зургаа Instagram Story-доо оруулаад <span className="font-semibold text-slate-800">"Until I Found You"</span> дууг наалтаар нэмбэл үнэхээр төгс харагдана! ✨
        </div>
      </div>
    </div>
  );
};
