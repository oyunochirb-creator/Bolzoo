import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DateInvitation, DateResponse } from '../types';
import { GRADIENT_THEMES, POPULAR_ACTIVITIES, POPULAR_FOODS } from '../data/defaults';
import { AudioPlayer } from './AudioPlayer';
import { DateTicket } from './DateTicket';
import { FloatingHearts } from './FloatingHearts';
import {
  Heart,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Check,
  Send,
  RefreshCw,
  PartyPopper,
} from 'lucide-react';

interface ReceiverViewProps {
  invitation: DateInvitation;
  onResponseCompleted?: (response: DateResponse) => void;
  isPreview?: boolean;
}

export const ReceiverView: React.FC<ReceiverViewProps> = ({
  invitation,
  onResponseCompleted,
  isPreview = false,
}) => {
  // Step 0: The question, Step 1: Date & Time, Step 2: Activities, Step 3: Food, Step 4: Note, Step 5: Confirmed Ticket
  const [step, setStep] = useState<number>(0);

  // Playful 'No' button runaways & phrases
  const [noButtonCount, setNoButtonCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  // Response state chosen by the receiver
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>('18:00');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'sunset' | 'night'>('sunset');

  // Start with sender's suggested activities or top 3
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    invitation.suggestedActivities.length > 0
      ? invitation.suggestedActivities
      : ['act-cafe', 'act-photobooth']
  );
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  // Food preferences
  const [selectedFoods, setSelectedFoods] = useState<string[]>(
    invitation.suggestedFoods && invitation.suggestedFoods.length > 0
      ? invitation.suggestedFoods
      : ['food-pizza', 'food-coffee']
  );

  const [receiverNote, setReceiverNote] = useState('');
  const [finalResponse, setFinalResponse] = useState<DateResponse | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'teen_budget' | 'romantic' | 'fun'>('all');

  const theme = GRADIENT_THEMES.find((t) => t.id === invitation.themeId) || GRADIENT_THEMES[0];

  const noPhrases = [
    'Үгүй 🥺',
    'Үнэхээр үү? 🥺',
    'Дахиад сайн бодоод үз л дээ? 💕',
    'Би чамд амттай кофе авч өгнө ☕',
    'Жаахан боломж олгооч дээ ✨',
    'Үгүй гэж болохгүй шүү дээ 😂',
    'Ганцхан удаа тийм гэж хэлээч ❤️',
    'Сүүлчийн боломж! 🌸',
  ];

  const handleNoHoverOrClick = () => {
    setNoButtonCount((prev) => prev + 1);
    // Runaway coordinates
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 120;
    setNoPos({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    // Confetti explosion
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24', '#a855f7'],
      });
    } catch {
      // Fallback
    }
    setStep(1);
  };

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setCustomActivities((prev) => [...prev, customInput.trim()]);
    setCustomInput('');
  };

  const removeCustomActivity = (index: number) => {
    setCustomActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFood = (id: string) => {
    setSelectedFoods((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // safe
    }

    const response: DateResponse = {
      invitationId: invitation.id,
      receiverName: invitation.receiverName,
      senderName: invitation.senderName,
      selectedDate,
      selectedTime,
      timeOfDay,
      selectedActivities,
      customActivities,
      selectedFoods,
      receiverNote,
      confirmedAt: Date.now(),
    };

    setFinalResponse(response);
    setStep(5);
    if (onResponseCompleted) {
      onResponseCompleted(response);
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${theme.gradientClass} relative flex flex-col justify-between py-6 px-4 sm:px-6 transition-colors duration-500`}
    >
      <FloatingHearts count={18} />

      {/* Floating Top Audio Player */}
      <div className="max-w-xl mx-auto w-full z-20 mb-4">
        <AudioPlayer
          queryOrUrl={invitation.musicQuery}
          songTitle={invitation.musicTitle}
          autoPlay={true}
          minimal={step !== 0}
        />
      </div>

      {/* Main Interactive Container */}
      <div className="max-w-xl mx-auto w-full z-10 my-auto">
        {/* STEP 0: THE BIG ROMANTIC QUESTION */}
        {step === 0 && (
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Romantic Envelope / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 text-pink-700 text-xs font-bold border border-pink-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Танд зориулсан онцгой урилга</span>
            </div>

            {/* Cute Cat Meme Section */}
            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-white/90 shadow-xl shadow-pink-200/60 bg-pink-100 group">
              <img
                src={
                  noButtonCount > 0
                    ? '/src/assets/images/cat_crying_pleading_1792815889896.jpg'
                    : '/src/assets/images/cat_asking_date_1792815889647.jpg'
                }
                alt="Cute Cat Meme"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Speech bubble badge over cat */}
              <div className="absolute bottom-2 inset-x-2 bg-white/90 backdrop-blur-xs rounded-xl py-1 px-2 text-[11px] font-bold text-pink-700 shadow-sm border border-pink-100 animate-bounce">
                {noButtonCount > 0 ? (
                  <span>Битгий үгүй гэж хэлээч дээ... 😭💔</span>
                ) : (
                  <span>Надтай хамт яваач, тэгэх үү? 🥺🌹</span>
                )}
              </div>
            </div>

            {/* Names & Message */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-500">
                Хонгор <span className="text-pink-600 font-bold">{invitation.receiverName || 'Хонгор минь'}</span> чамдаа,
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance leading-snug">
                Надтай болзоонд явах уу? 💕
              </h1>
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-sm text-slate-700 leading-relaxed italic">
                "{invitation.message || 'Хоёулаа хамтдаа дурсамж дүүрэн нэгэн өдрийг өнгөрүүлье!'}"
              </div>
              <p className="text-xs text-slate-400">
                Урилга илгээгч: <span className="font-semibold text-slate-700">{invitation.senderName || 'Чамд хайртай нэгэн'}</span>
              </p>
            </div>

            {/* Interactive Yes / No Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[90px]">
              {/* YES BUTTON - Grows bigger with each NO attempt */}
              <button
                type="button"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${1 + Math.min(noButtonCount * 0.12, 0.6)})`,
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-pink-300 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 z-20"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>ТИЙМ! 😍</span>
              </button>

              {/* RUNAWAY NO BUTTON */}
              <button
                type="button"
                onMouseEnter={handleNoHoverOrClick}
                onClick={handleNoHoverOrClick}
                style={{
                  transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-2xl border border-slate-200 transition-transform duration-150 z-10 shrink-0"
              >
                {noPhrases[Math.min(noButtonCount, noPhrases.length - 1)]}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              (Хариулсан даруйд уулзах цаг, хийх зүйлсээ сонгох боломжтой болно 🎀)
            </p>
          </div>
        )}

        {/* STEP 1: SELECT DATE & TIME */}
        {step === 1 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  Алхам 1 / 4
                </span>
                <h2 className="text-xl font-bold text-slate-800">
                  Уулзах хугацаагаа сонгоорой 🗓️
                </h2>
              </div>
              <span className="text-2xl">💖</span>
            </div>

            <p className="text-xs text-slate-600">
              Танд хамгийн тохиромжтой өдөр, цаг болон өдрийн аль хэсэгт уулзахыг хүсэж байгаагаа сонгоорой.
            </p>

            <div className="space-y-4">
              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  <span>Болзооны өдөр</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-pink-50/50 border border-pink-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Time of Day selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Өдрийн ямар үе тохиромжтой вэ?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'morning', label: 'Өглөөний нар', time: '10:00', icon: '☀️' },
                    { id: 'afternoon', label: 'Үдийн налгар', time: '14:00', icon: '🌤️' },
                    { id: 'sunset', label: 'Нар жаргах мөч', time: '18:00', icon: '🌅' },
                    { id: 'night', label: 'Оройн од түгэхүй', time: '20:00', icon: '🌌' },
                  ].map((tod) => {
                    const isSelected = timeOfDay === tod.id;
                    return (
                      <button
                        key={tod.id}
                        type="button"
                        onClick={() => {
                          setTimeOfDay(tod.id as any);
                          setSelectedTime(tod.time);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-400/20 text-pink-900 font-bold'
                            : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{tod.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{tod.label}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{tod.time}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exact time picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Яг цаг (Хэрэв өөрчлөх бол):
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm rounded-xl shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Дараах: Хамт хийх зүйлс</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT ACTIVITIES */}
        {step === 2 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  Алхам 2 / 4
                </span>
                <h2 className="text-xl font-bold text-slate-800">
                  Хамтдаа юу хийх үү? ✨
                </h2>
              </div>
              <span className="text-xs text-pink-600 font-bold">
                {selectedActivities.length + customActivities.length} сонгосон
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs text-slate-600">
                Өөрт таалагдаж буй зүйлсийг сонгоорой (Хүсвэл өөрийн санаагаа нэмж болно):
              </p>

              {/* Activity category pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto overflow-x-auto">
                {[
                  { id: 'all', label: 'Бүгд' },
                  { id: 'teen_budget', label: '🎒 Өсвөр үе / Төсөвт ээлтэй' },
                  { id: 'romantic', label: '🌅 Романтик' },
                  { id: 'fun', label: '🕹️ Хөгжилтэй' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActivityFilter(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold whitespace-nowrap ${
                      activityFilter === cat.id
                        ? 'bg-white text-pink-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {POPULAR_ACTIVITIES.filter((act) => {
                if (activityFilter === 'all') return true;
                if (activityFilter === 'teen_budget') return act.isBudget;
                return act.category === activityFilter;
              }).map((act) => {
                const isSelected = selectedActivities.includes(act.id);
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => toggleActivity(act.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/20'
                        : 'border-slate-200/80 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{act.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-pink-900' : 'text-slate-800'}`}>
                          {act.title}
                        </p>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight mt-0.5">
                        {act.description}
                      </p>
                      {act.isBudget && (
                        <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                          🌱 Төсөвт ээлтэй
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Activities */}
            {customActivities.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-slate-700">Таны нэмсэн санаанууд:</p>
                <div className="flex flex-wrap gap-1.5">
                  {customActivities.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1.5 font-medium"
                    >
                      <span>✨ {c}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomActivity(i)}
                        className="text-purple-600 hover:text-purple-900 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Activity Form */}
            <form onSubmit={addCustomActivity} className="flex gap-2">
              <input
                type="text"
                placeholder="Өөр зүйл нэмэх (жишээ: Музей үзэх, Дугуй жийх...)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-pink-50/40 border border-pink-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Нэмэх</span>
              </button>
            </form>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Буцах
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm rounded-xl shadow-md shadow-pink-200 transition-all flex items-center gap-2"
              >
                <span>Дараах: Хоол & Амттан</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FOOD & DRINKS */}
        {step === 3 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  Алхам 3 / 4
                </span>
                <h2 className="text-xl font-bold text-slate-800">
                  Юу идэж, уух уу? 🍰
                </h2>
              </div>
              <span className="text-xs text-pink-600 font-bold">
                {selectedFoods.length} сонгосон
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Болзооны үеэр амтлахыг хүсэж буй хоол, амттанаа сонгоорой (Өсвөр үеийн CU гоймон, зайрмагнаас эхлээд оройн зоог хүртэл):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {POPULAR_FOODS.map((food) => {
                const isSelected = selectedFoods.includes(food.id);
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => toggleFood(food.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/20 text-pink-900 font-bold'
                        : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{food.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate leading-tight">{food.name}</p>
                      {food.isBudget && (
                        <span className="inline-block mt-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                          🌱 Хямд & Амттай
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Буцах
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm rounded-xl shadow-md shadow-pink-200 transition-all flex items-center gap-2"
              >
                <span>Дараах: Зурвас үлдээх</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: NOTE TO SENDER */}
        {step === 4 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  Алхам 4 / 4
                </span>
                <h2 className="text-xl font-bold text-slate-800">
                  Сэтгэлийн үгээ үлдээгээрэй 💌
                </h2>
              </div>
              <span className="text-2xl">💌</span>
            </div>

            <p className="text-xs text-slate-600">
              {invitation.senderName}-д хэлэхийг хүссэн бяцхан үг, нууц хүсэлт эсвэл хариугаа бичээрэй.
            </p>

            <div>
              <textarea
                rows={4}
                value={receiverNote}
                onChange={(e) => setReceiverNote(e.target.value)}
                placeholder="Жишээ: Би ч бас тэсэн ядан хүлээж байна! Дуртай хувцсаа өмсөөд ирээрэй, хамтдаа гоё дурсамж бүтээцгээе 💕"
                className="w-full p-4 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400 placeholder:text-slate-400"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Буцах
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-pink-300 transition-all flex items-center gap-2"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Болзоог баталгаажуулах! 🎉</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMED BOARDING PASS TICKET */}
        {step === 5 && finalResponse && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-3 border-white shadow-lg bg-pink-100">
                <img
                  src="/src/assets/images/cat_happy_celebrate_1792815890287.jpg"
                  alt="Happy Celebrating Cat"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/90 text-pink-600 rounded-full text-xs font-bold shadow-xs">
                <PartyPopper className="w-4 h-4 text-pink-500" />
                <span>БАЯР ХҮРГЭЕ! БОЛЗОО ТОВЛОГДЛОО 💕</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Та хоёрын болзооны тасалбар бэлэн боллоо!
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Story хэлбэрээр татаж авах, screenshot хийх эсвэл шууд {invitation.senderName}-руу илгээн нандин мөчөө хуваалцаарай 📸
              </p>
            </div>

            <DateTicket invitation={invitation} response={finalResponse} />

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-800 font-semibold underline decoration-pink-300"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Мэдээллээ дахин засах</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500/80 py-2 z-10">
        Болзоо · 100% Үнэгүй романтик урилга бүтээгч
      </footer>
    </div>
  );
};
