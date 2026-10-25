import React, { useState, useEffect } from 'react';
import { DateInvitation } from '../types';
import { POPULAR_ACTIVITIES, POPULAR_FOODS, GRADIENT_THEMES } from '../data/defaults';
import { ThemeSelector } from './ThemeSelector';
import { AudioPlayer } from './AudioPlayer';
import { QRCodeModal } from './QRCodeModal';
import { encodeInvitationToUrl, getSongDisplayTitle, createShortUrl } from '../utils/urlState';
import {
  Heart,
  Sparkles,
  Music,
  Copy,
  Check,
  Plus,
  Play,
  Eye,
  Mail,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Smile,
  ShieldCheck,
  ExternalLink,
  Lock,
  Link,
  RefreshCw,
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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [customActivityInput, setCustomActivityInput] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [activityCategory, setActivityCategory] = useState<'all' | 'teen_budget' | 'romantic' | 'fun'>('all');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isShortening, setIsShortening] = useState<boolean>(false);
  const [showFullLink, setShowFullLink] = useState<boolean>(false);

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
  const activeShareUrl = shortUrl || shareableUrl;

  const handleGenerateShortUrl = async () => {
    try {
      setIsShortening(true);
      const res = await createShortUrl(shareableUrl);
      if (res && res !== shareableUrl) {
        setShortUrl(res);
      }
    } catch (err) {
      console.warn('Failed to generate short link', err);
    } finally {
      setIsShortening(false);
    }
  };

  // Automatically trigger short link generation on entering Step 5
  useEffect(() => {
    if (currentStep === 5 && !shortUrl && !isShortening) {
      handleGenerateShortUrl();
    }
  }, [currentStep, shareableUrl]);

  // Reset short link if invitation details change
  useEffect(() => {
    setShortUrl('');
  }, [invitation.senderName, invitation.receiverName, invitation.message, invitation.themeId]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(activeShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToEmail = () => {
    const emailTo = invitation.senderEmail?.trim() || '';
    const subject = encodeURIComponent(
      `💌 Таны ${invitation.receiverName || 'болзоот хүн'}-д зориулсан урилгын линк ба QR код`
    );
    const body = encodeURIComponent(
      `Сайн байна уу, ${invitation.senderName || 'Эрхэм хэрэглэгч'}!\n\n` +
      `Таны ${invitation.receiverName || 'болзоот хүн'}-дээ бэлтгэсэн болзооны урилга амжилттай үүслээ! 🎉\n\n` +
      `🔗 Урилгын шууд богино линк:\n${activeShareUrl}\n\n` +
      `Хүлээн авагч энэхүү линкээр орж өөрөө уулзах тов болон хамт хийх зүйлсээ сонгох болно.\n\n` +
      `Болзоо.mn - 100% Үнэгүй романтик болзооны урилга бүтээгч 💕`
    );

    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    setEmailStatus('И-мэйл програм нээгдэж байна...');
    setTimeout(() => setEmailStatus(null), 4000);
  };

  const currentTheme =
    GRADIENT_THEMES.find((t) => t.id === invitation.themeId) || GRADIENT_THEMES[0];

  const stepsList = [
    { num: 1, title: 'Нэрс & И-мэйл', icon: '💌' },
    { num: 2, title: 'Өнгөний сэдэв', icon: '🎨' },
    { num: 3, title: 'Арын хөгжим (Тогтмол)', icon: '🎵' },
    { num: 4, title: 'Хөтөлбөр & Хоол', icon: '🎡' },
    { num: 5, title: 'Линк & QR код', icon: '✨' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Hero Welcome Banner */}
      <div
        className={`p-5 sm:p-7 rounded-3xl ${currentTheme.gradientClass} border border-pink-200/80 shadow-md relative overflow-hidden`}
      >
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-pink-600 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Алхам алхмаар бүтээх · 100% Үнэгүй</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-balance">
            Хайртай эсвэл crush-даа зориулан болзооны урилга бэлтгэх 💕
          </h1>
          <p className="text-xs text-slate-700 leading-relaxed">
            Та заавал бүртгүүлж нэвтрэх шаардлагагүй. Алхам бүрийг бөглөөд урилгын линк болон QR кодоо шууд аваарай.
          </p>
        </div>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 sm:pb-0">
          {stepsList.map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span className="text-sm">{st.icon}</span>
                <span className="hidden sm:inline">{st.num}. {st.title}</span>
                <span className="sm:hidden">{st.num}</span>
                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: NAMES, OPTIONAL EMAIL & MESSAGE */}
      {currentStep === 1 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Үндсэн мэдээлэл (Нэрс & E-mail)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Хэнд зориулсан урилга болохыг оруулна уу
                </p>
              </div>
            </div>
            <span className="text-xs text-pink-600 font-bold">1 / 5</span>
          </div>

          <div className="space-y-4">
            {/* Sender and Receiver Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Найз охин / Crush-ын тань нэр <span className="text-pink-500">*</span>
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
                  Таны нэр (Илгээгч) <span className="text-pink-500">*</span>
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

            {/* Optional Email Input */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Таны E-mail хаяг (Сонголтоор)</span>
                </label>
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
                  Заавал биш
                </span>
              </div>
              <input
                type="email"
                value={invitation.senderEmail || ''}
                onChange={(e) => updateField('senderEmail', e.target.value)}
                placeholder="жишээ: myemail@gmail.com"
                className="w-full px-3.5 py-2 bg-white border border-sky-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-400"
              />
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>
                  Сайтын урилгын линк болон QR кодыг и-мэйлээрээ хадгалж авах зорилготой. Заавал бүртгүүлэх шаардлагагүй!
                </span>
              </p>
            </div>

            {/* Romantic Message */}
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
              {/* Preset message chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 self-center">Санал болгох:</span>
                {[
                  'Хоёулаа энэ амралтын өдрөөр надтай хамт тухтай ярилцаж, сайхан дурсамж бүтээх үү? 💕',
                  'Чамайг би хамгийн дуртай, хамгийн гоё газарт аваачмаар байна ✨',
                  'Надтай болзоонд явахыг зөвшөөрөх үү? Би чамд амттай кофе авч өгье ☕',
                ].map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => updateField('message', msg)}
                    className="text-[11px] px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full border border-pink-200/60 transition-colors truncate max-w-[260px]"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Дараах: Өнгө сонгох</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TOP-TO-BOTTOM GRADIENT THEME */}
      {currentStep === 2 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Өнгөний уусгалт (Gradient) сонгох
                </h2>
                <p className="text-[11px] text-slate-500">
                  Ягаан ба бүдэг цэнхэр дээрээс доош уусах романтик өнгө
                </p>
              </div>
            </div>
            <span className="text-xs text-pink-600 font-bold">2 / 5</span>
          </div>

          <ThemeSelector
            selectedThemeId={invitation.themeId}
            onSelectTheme={(themeId) => updateField('themeId', themeId)}
          />

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Буцах</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Дараах: Арын хөгжим</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: YOUTUBE MUSIC (LOCKED TO STEPHEN SANCHEZ - UNTIL I FOUND YOU) */}
      {currentStep === 3 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Арын Дэвсгэр Хөгжим (Тогтмол дуу)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Болзооны бүх урилга дээр автоматаар эгшиглэх дуу
                </p>
              </div>
            </div>
            <span className="text-xs text-pink-600 font-bold">3 / 5</span>
          </div>

          <div className="space-y-4">
            {/* Dedicated Romantic Soundtrack Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-200 shrink-0">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold border border-pink-200 mb-1">
                      <Lock className="w-3 h-3 text-pink-600" />
                      <span>Үндсэн романтик дуу · Сонголт түгжигдсэн</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      Stephen Sanchez - Until I Found You
                    </h3>
                    <p className="text-xs text-slate-500">
                      Сонгодог дурлалын сүлд дуу · Зөөлөн, намуун хөгжим
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 bg-white/90 px-3 py-1 rounded-full border border-pink-200">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  Автомат
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-3 rounded-xl border border-pink-100">
                ✨ Энэхүү урилга нь романтик уур амьсгал бүрдүүлэх үүднээс зөвхөн <strong>Stephen Sanchez - "Until I Found You"</strong> дуугаар эгшиглэхээр бүрэн тохируулагдсан. Хүлээн авагч урилгаа нээх үед арын дэвсгэрт намуухан дуугарна.
              </p>
            </div>

            {/* Live Audio Test Player */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">
                🎧 Дууг шууд сонсож шалгах:
              </p>
              <AudioPlayer
                queryOrUrl="GxldQ9eX2wo"
                songTitle="Stephen Sanchez - Until I Found You"
                autoPlay={false}
              />
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Буцах</span>
            </button>
            <button
              type="button"
              onClick={() => {
                // Ensure music fields are fixed to Stephen Sanchez
                updateField('musicQuery', 'GxldQ9eX2wo');
                updateField('musicTitle', 'Stephen Sanchez - Until I Found You');
                setCurrentStep(4);
              }}
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Дараах: Болзооны хөтөлбөр</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ACTIVITIES & FOODS */}
      {currentStep === 4 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Хамт хийх зүйлс & Хоол
                </h2>
                <p className="text-[11px] text-slate-500">
                  Хүлээн авагчид санал болгох сонголтууд (Тэр өөрөө эцэст нь сонгоно)
                </p>
              </div>
            </div>
            <span className="text-xs text-pink-600 font-bold">4 / 5</span>
          </div>

          <div className="space-y-5">
            {/* Activities Header and Filter */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-800">
                  Хамт хийх үйл ажиллагаанууд:
                </p>

                {/* Categories */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto overflow-x-auto">
                  {[
                    { id: 'all', label: 'Бүгд' },
                    { id: 'teen_budget', label: '🎒 Өсвөр нас / Төсөвт ээлтэй' },
                    { id: 'romantic', label: '🌅 Романтик' },
                    { id: 'fun', label: '🕹️ Хөгжилтэй' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActivityCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold whitespace-nowrap ${
                        activityCategory === cat.id
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[270px] overflow-y-auto pr-1">
                {POPULAR_ACTIVITIES.filter((act) => {
                  if (activityCategory === 'all') return true;
                  if (activityCategory === 'teen_budget') return act.isBudget;
                  return act.category === activityCategory;
                }).map((act) => {
                  const isSelected = invitation.suggestedActivities.includes(act.id);
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => toggleActivity(act.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/90 ring-1 ring-pink-400/20'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{act.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-pink-900' : 'text-slate-800'}`}>
                            {act.title}
                          </p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
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
            </div>

            {/* Custom activity input */}
            <form onSubmit={addCustomActivity} className="flex gap-2">
              <input
                type="text"
                placeholder="Өөр зүйл нэмэх (жишээ: Музей үзэх, Дугуй жийх...)"
                value={customActivityInput}
                onChange={(e) => setCustomActivityInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-pink-50/40 border border-pink-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Нэмэх</span>
              </button>
            </form>

            {/* Suggested Foods */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">
                  Санал болгох хоол, амттан (Өсвөр нас & Сонгодог):
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">
                  CU гоймон, кимбаб, зайрмаг г.м
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {POPULAR_FOODS.map((food) => {
                  const isSelected = (invitation.suggestedFoods || []).includes(food.id);
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => toggleFood(food.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/90 text-pink-900 font-bold'
                          : 'border-slate-200/80 bg-white/70 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl shrink-0">{food.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] truncate">{food.name}</p>
                        {food.isBudget && (
                          <span className="text-[9px] text-emerald-600 font-semibold block">
                            🌱 Хямд & Амттай
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Буцах</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Төгсгөл: Линк & QR код авах</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL READY TO SHARE & QR CODE & EMAIL */}
      {currentStep === 5 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>УРИЛГА БЭЛЭН БОЛЛОО! 🎉</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {invitation.receiverName || 'Болзоот хүн'}-дээ илгээхэд бэлэн боллоо!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Хүлээн авагч энэ линкээр ороод болзооны асуултад хариулж, өөрөө уулзах өдөр, цаг, хийх зүйлсээ сонгох болно.
            </p>
          </div>

          {/* Quick Preview Card */}
          <div className={`p-4 rounded-2xl ${currentTheme.gradientClass} border border-pink-200/80 flex items-center gap-3.5`}>
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xs shrink-0">
              <img
                src="/src/assets/images/cat_asking_date_1792815889647.jpg"
                alt="Asking Cat"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {invitation.receiverName || 'Хонгор минь'}-д зориулсан урилга
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                "{invitation.message || 'Надтай болзоонд явах уу?'}"
              </p>
              <p className="text-[10px] text-pink-600 font-medium mt-0.5">
                🎵 {invitation.musicTitle || invitation.musicQuery}
              </p>
            </div>
          </div>

          {/* Share Link Row with AI Smart Short Link */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-pink-500" />
                <span>Урилгын шууд холбоос (Линк)</span>
              </label>

              {shortUrl ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Богино линк бэлэн</span>
                </span>
              ) : isShortening ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-bold border border-pink-200 animate-pulse">
                  <RefreshCw className="w-3 h-3 text-pink-500 animate-spin" />
                  <span>Богино линк үүсгэж байна...</span>
                </span>
              ) : null}
            </div>

            {/* Smart Short Link Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/90 via-rose-50/50 to-pink-50/90 border border-pink-200/90 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-pink-700 font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Ухаалаг Богино Холбоос:</span>
                </span>

                <button
                  type="button"
                  onClick={handleGenerateShortUrl}
                  disabled={isShortening}
                  className="text-[11px] font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 transition-colors disabled:opacity-50"
                  title="Шинэ богино линк үүсгэх"
                >
                  <RefreshCw className={`w-3 h-3 ${isShortening ? 'animate-spin' : ''}`} />
                  <span>{isShortening ? 'Үүсгэж байна...' : 'Шинэчлэх'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={activeShareUrl}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 font-mono font-bold selection:bg-pink-200 shadow-2xs truncate"
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Хуулагдлаа!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Линк хуулах</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                    title="Шалгах (Шинэ цонхонд нээх)"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                💡 Энэхүү богино холбоосыг Instagram DM, Messenger, SMS-ээр илгээхэд маш цэвэрхэн харагдах бөгөөд QR код нь илүү тод, хурдан уншигдана.
              </p>
            </div>

            {/* Toggle Full Long Link */}
            <div className="text-right pt-0.5">
              <button
                type="button"
                onClick={() => setShowFullLink((prev) => !prev)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 underline transition-colors"
              >
                {showFullLink ? 'Анхны бүрэн линкийг нуух' : 'Анхны бүрэн линкийг харах'}
              </button>

              {showFullLink && (
                <div className="mt-2 text-left p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Анхны бүтэн шууд линк:
                  </p>
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600 font-mono select-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Grid: QR Code & Send to Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="p-3.5 rounded-2xl border-2 border-pink-200 hover:border-pink-400 bg-pink-50/50 hover:bg-pink-50 text-pink-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <QrCode className="w-4 h-4 text-pink-600" />
              <span>QR Код харах & Татах</span>
            </button>

            <button
              type="button"
              onClick={handleSendToEmail}
              className="p-3.5 rounded-2xl border-2 border-sky-200 hover:border-sky-400 bg-sky-50/50 hover:bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Mail className="w-4 h-4 text-sky-600" />
              <span>
                {invitation.senderEmail
                  ? `${invitation.senderEmail} рүү илгээх`
                  : 'Миний E-mail рүү илгээх'}
              </span>
            </button>
          </div>

          {emailStatus && (
            <p className="text-center text-xs font-semibold text-sky-600 animate-pulse">
              {emailStatus}
            </p>
          )}

          {/* Preview Receiver Experience Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Засах руу буцах</span>
            </button>

            <button
              type="button"
              onClick={onPreview}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4 text-pink-400" />
              <span>Хүлээн авагчийн горимоор турших</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={activeShareUrl}
        invitation={invitation}
      />
    </div>
  );
};
