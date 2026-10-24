import React, { useState } from 'react';
import { DateInvitation } from '../types';
import { POPULAR_ACTIVITIES, POPULAR_FOODS, SUGGESTED_SONGS, GRADIENT_THEMES } from '../data/defaults';
import { ThemeSelector } from './ThemeSelector';
import { AudioPlayer } from './AudioPlayer';
import { encodeInvitationToUrl } from '../utils/urlState';
import {
  Heart,
  Sparkles,
  Music,
  Share2,
  Copy,
  Check,
  Plus,
  Play,
  Eye,
  Send,
  MessageCircle,
} from 'lucide-react';

interface CreatorViewProps {
  invitation: DateInvitation;
  onChangeInvitation: (updated: DateInvitation) => void;
  onPreview: () => void;
}

export const CreatorView: React.FC<CreatorViewProps> = ({
  invitation,
  onChangeInvitation,
  onPreview,
}) => {
  const [copied, setCopied] = useState(false);
  const [customActivityInput, setCustomActivityInput] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Update helper
  const updateField = <K extends keyof DateInvitation>(field: K, value: DateInvitation[K]) => {
    onChangeInvitation({
      ...invitation,
      [field]: value,
    });
  };

  const toggleActivity = (id: string) => {
    const current = invitation.suggestedActivities;
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    updateField('suggestedActivities', next);
  };

  const addCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActivityInput.trim()) return;
    const title = customActivityInput.trim();
    updateField('suggestedActivities', [...invitation.suggestedActivities, title]);
    setCustomActivityInput('');
  };

  const toggleFood = (id: string) => {
    const current = invitation.suggestedFoods || [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    updateField('suggestedFoods', next);
  };

  // Generate shareable link
  const encodedParam = encodeInvitationToUrl(invitation);
  const shareableUrl = `${window.location.origin}${window.location.pathname}?inv=${encodedParam}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentTheme =
    GRADIENT_THEMES.find((t) => t.id === invitation.themeId) || GRADIENT_THEMES[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl ${currentTheme.gradientClass} border border-pink-200/80 shadow-md relative overflow-hidden`}>
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-pink-600 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>100% Үнэгүй Болзоо Төлөвлөгч</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-balance">
            Хайртай хүндээ зориулан болзооны урилга бүтээгээрэй 💕
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Та зөвхөн нэр, романтик дуу болон өнгө сонгоход л хангалттай. Харин уулзах хугацаа, хамт хийх зүйлсийг болзоот хүн тань өөрөө сонгож хариу илгээнэ.
          </p>
        </div>
      </div>

      {/* Main Creation Form Cards */}
      <div className="space-y-6">
        {/* Section 1: Names & Message */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-slate-800">
              Хэнд зориулсан урилга вэ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Хүлээн авагчийн нэр (Таны crush эсвэл болзоот хүн)
              </label>
              <input
                type="text"
                value={invitation.receiverName}
                onChange={(e) => updateField('receiverName', e.target.value)}
                placeholder="Жишээ: Мишээл, Ариунаа, Хонгор минь"
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Таны нэр (Илгээгч)
              </label>
              <input
                type="text"
                value={invitation.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                placeholder="Жишээ: Анар, Батаа, Чамд хайртай нэгэн"
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Урилгын сэтгэлийн үг / Мессеж
            </label>
            <textarea
              rows={3}
              value={invitation.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Чамайг анх харсан өдрөөс хойш инээмсэглэлийг чинь мартдаггүй ээ. Хоёулаа хамтдаа дурсамж дүүрэн нэг өдрийг өнгөрүүлэх үү? 💕"
              className="w-full p-3.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
            {/* Quick Template Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center">Жишээ:</span>
              {[
                'Хоёулаа энэ амралтын өдрөөр надтай хамт тухтай ярилцаж, сайхан дурсамж бүтээх үү? 💕',
                'Чамайг би хамгийн дуртай, хамгийн гоё газарт аваачмаар байна ✨',
                'Надтай болзоонд явахыг зөвшөөрөх үү? Би чамд амттай кофе авч өгье ☕',
              ].map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateField('message', msg)}
                  className="text-[11px] px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full border border-pink-200/60 transition-colors truncate max-w-[280px]"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Top-to-Bottom Pastel Gradient Theme */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-slate-800">
              Ягаан & Бүдэг Цэнхэр өнгөний уусгалт (Gradient)
            </h2>
          </div>

          <ThemeSelector
            selectedThemeId={invitation.themeId}
            onSelectTheme={(themeId) => updateField('themeId', themeId)}
          />
        </div>

        {/* Section 3: YouTube Background Music */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-base font-bold text-slate-800">
                YouTube Дэвсгэр Хөгжим (Дууны нэрээр)
              </h2>
            </div>
            <span className="text-xs text-pink-600 font-semibold flex items-center gap-1">
              <Music className="w-3.5 h-3.5" />
              Автомат хайлттай
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Хайртай хүнийхээ сонсох дуртай дууны нэрийг бичих эсвэл санал болгосон романтик дуунуудаас сонгоорой. YouTube-ээс шууд тоглуулах болно.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Дууны нэр эсвэл YouTube линк
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={invitation.musicQuery}
                  onChange={(e) => {
                    updateField('musicQuery', e.target.value);
                    updateField('musicTitle', e.target.value);
                  }}
                  placeholder="Жишээ: Laufey From The Start, A Cool Зүүд, Die With A Smile..."
                  className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400 pr-10"
                />
                <Music className="w-4 h-4 text-pink-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Popular Songs Quick Select */}
            <div>
              <p className="text-[11px] font-bold text-slate-600 mb-2">
                Тренд болсон романтик дуунууд:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_SONGS.map((song, i) => {
                  const isSelected = invitation.musicQuery === song.query;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        updateField('musicQuery', song.query);
                        updateField('musicTitle', song.title);
                      }}
                      className={`px-3 py-2 rounded-xl text-left border transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 text-pink-900 font-bold shadow-xs'
                          : 'border-slate-200/70 hover:border-pink-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-medium">{song.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{song.vibe}</p>
                      </div>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                      ) : (
                        <Play className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Audio Player Test */}
            <div className="pt-2">
              <AudioPlayer
                queryOrUrl={invitation.musicQuery}
                songTitle={invitation.musicTitle}
                autoPlay={false}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Activities (Хамт хийх зүйлс) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-base font-bold text-slate-800">
                Хамт хийх үйл ажиллагааны санаанууд
              </h2>
            </div>
            <span className="text-xs text-pink-600 font-semibold">
              {invitation.suggestedActivities.length} санал болгосон
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Болзоот хүндээ санал болгох зүйлсийг сонгоорой. Урилгыг нээсэн даруйд тэрээр өөрийн дуртай зүйлсээ сонгох боломжтой байна.
          </p>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {POPULAR_ACTIVITIES.map((act) => {
              const isSelected = invitation.suggestedActivities.includes(act.id);
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => toggleActivity(act.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-400/20'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{act.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-pink-900' : 'text-slate-800'}`}>
                        {act.title}
                      </p>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {act.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add Custom Activity */}
          <form onSubmit={addCustomActivity} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Өөр үйл ажиллагаа нэмэх (жишээ: Музей үзэх, Дугуй унах...)"
              value={customActivityInput}
              onChange={(e) => setCustomActivityInput(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-pink-50/40 border border-pink-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Нэмэх</span>
            </button>
          </form>
        </div>

        {/* Section 5: Suggested Foods */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h2 className="text-base font-bold text-slate-800">
                Санал болгох хоол, амттан
              </h2>
            </div>
            <span className="text-xs text-pink-600 font-semibold">
              {(invitation.suggestedFoods || []).length} сонгосон
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POPULAR_FOODS.slice(0, 8).map((food) => {
              const isSelected = (invitation.suggestedFoods || []).includes(food.id);
              return (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => toggleFood(food.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/90 text-pink-900 font-bold'
                      : 'border-slate-200/80 bg-white/70 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl">{food.emoji}</span>
                  <span className="text-[11px] truncate w-full">{food.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 6: Action & Sharing */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5">
          <div className="space-y-1">
            <h3 className="text-xl font-black">
              Урилгын линк бэлэн боллоо! 💌
            </h3>
            <p className="text-xs text-pink-100">
              Энэхүү линкийг хуулаад Messenger, Instagram эсвэл WhatsApp-аар {invitation.receiverName || 'болзоот хүн'}-дээ илгээгээрэй.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-xs text-white selection:bg-white selection:text-pink-600 font-mono"
            />
            <button
              type="button"
              onClick={copyShareLink}
              className="px-6 py-3 bg-white text-pink-600 hover:bg-pink-50 font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Хуулагдлаа!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Линк хуулах</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 items-center justify-between border-t border-white/20">
            <button
              type="button"
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Хүлээн авагч хэрхэн харахыг шалгах</span>
            </button>

            <span className="text-[11px] text-pink-100">
              Сервергүй, хувийн нууцлал 100% хамгаалагдсан 🔒
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
