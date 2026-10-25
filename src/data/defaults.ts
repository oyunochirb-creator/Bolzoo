import { ActivityOption, FoodOption, GradientTheme, DateInvitation } from '../types';

export const GRADIENT_THEMES: GradientTheme[] = [
  {
    id: 'sakura-sky',
    name: 'Сакура & Тэнгэр',
    description: 'Зөөлөн сакура ягаанаас цэлмэг бүдэг цэнхэр рүү уусах туяа',
    gradientClass: 'bg-gradient-to-b from-[#ffe4e6] via-[#fdf2f8] to-[#e0f2fe]',
    primaryColor: '#f43f5e',
    secondaryColor: '#0284c7',
    cardBg: 'bg-white/80 backdrop-blur-md border-pink-200/60 shadow-pink-100/50',
    previewColors: ['#ffe4e6', '#fdf2f8', '#e0f2fe'],
  },
  {
    id: 'cotton-candy',
    name: 'Хөвөн чихэр',
    description: 'Дур булаам пастел ягаан ба үүлэн хөх өнгийн уусалт',
    gradientClass: 'bg-gradient-to-b from-[#fce7f3] via-[#fae8ff] to-[#dbeafe]',
    primaryColor: '#ec4899',
    secondaryColor: '#3b82f6',
    cardBg: 'bg-white/80 backdrop-blur-md border-purple-200/60 shadow-purple-100/50',
    previewColors: ['#fce7f3', '#fae8ff', '#dbeafe'],
  },
  {
    id: 'milky-blue',
    name: 'Сүүн бүдэг цэнхэр & Сарнай',
    description: 'Дээрээсээ далайн сэвшээ шиг цэнхэр доошоо намуун ягаан',
    gradientClass: 'bg-gradient-to-b from-[#e0f2fe] via-[#f1f5f9] to-[#fce7f3]',
    primaryColor: '#0ea5e9',
    secondaryColor: '#f43f5e',
    cardBg: 'bg-white/80 backdrop-blur-md border-sky-200/60 shadow-sky-100/50',
    previewColors: ['#e0f2fe', '#f1f5f9', '#fce7f3'],
  },
  {
    id: 'sunset-blush',
    name: 'Нар жаргах ягаан туяа',
    description: 'Алтан шаргал болон дулаан ягаан өнгийн романтик төгсгөл',
    gradientClass: 'bg-gradient-to-b from-[#fed7aa] via-[#fce7f3] to-[#e0e7ff]',
    primaryColor: '#f97316',
    secondaryColor: '#ec4899',
    cardBg: 'bg-white/80 backdrop-blur-md border-amber-200/60 shadow-amber-100/50',
    previewColors: ['#fed7aa', '#fce7f3', '#e0e7ff'],
  },
];

export const POPULAR_ACTIVITIES: ActivityOption[] = [
  // Teen, Youth & Budget-friendly Activities
  {
    id: 'act-claw-machine',
    title: 'Хүүхэлдэй шүүрэх машинд тоглох',
    description: 'Arcade төвд хүүхэлдэй шүүрч бие биедээ хөөрхөн чихмэл тоглоом хожиж өгөх',
    icon: '🧸',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-earbuds',
    title: 'Нэг чихэвчээ хувааж дуу сонсох',
    description: 'Хөтлөлцөөд дуртай дуугаа нэг чихэвчээрээ хувааж сонсоод алхах',
    icon: '🎧',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-diy-matching',
    title: 'Хосын утасны гэр / Оосор урлах',
    description: 'Бяцхан бүтээлч студид бие биедээ зориулсан хөөрхөн стикер, оосор хийх',
    icon: '🎨',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-phone-photoshoot',
    title: 'Утсаараа гудамжинд зураг дарах',
    description: 'Хөөрхөн өнцөг олоод бие биедээ инээдтэй, нандин зураг дарж өгөх',
    icon: '📱',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-bubble-park',
    title: 'Савангийн хөөс үлээх & Зүлгэн дээр суух',
    description: 'Хөөс үлээгээд ногоон зүлгэн дээр сууж үүлс харах',
    icon: '🫧',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-ice-skating',
    title: 'Мөсөн дээр гар хөтлөлцөн гулгах',
    description: 'Хөтлөлцөөд инээд хөөрөөр дүүрэн мөсөн гулгуурын талбайд гулгах',
    icon: '⛸️',
    category: 'fun',
  },
  {
    id: 'act-rooftop-view',
    title: 'Дээвэр дээрээс оройн тэнгэр харах',
    description: 'Оройн нар жаргах үед өндөр дэнж эсвэл дээврээс хотоо тольдох',
    icon: '🌆',
    category: 'romantic',
    isBudget: true,
  },
  {
    id: 'act-study-date',
    title: 'Хамтдаа хичээл давтах / Номын сан',
    description: 'Номын сан эсвэл тухтай ширээний ард даалгавраа хамт хийж бие биедээ туслах',
    icon: '✏️',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-mobile-game',
    title: 'Утасны тоглоом хамт тоглох',
    description: 'PUBG, Roblox, Brawl Stars эсвэл Mobile Legends хамтдаа тоглох',
    icon: '🎮',
    category: 'teen_budget',
    isBudget: true,
  },
  {
    id: 'act-bowling-friendly',
    title: 'Боулинг тоглож өрсөлдөх',
    description: 'Страйк цохиж хөгжилдөн инээдтэй мөрий тавьж тоглох',
    icon: '🎳',
    category: 'fun',
  },
  {
    id: 'act-bridge-walk',
    title: 'Гүүрэн дээрээс хотын гэрэл харах',
    description: 'Оройн сэрүүнд гүүрэн дээр зогсоод машины гэрэл, хотын өнгө тольдох',
    icon: '🌉',
    category: 'teen_budget',
    isBudget: true,
  },

  // Romantic & Chill Activities
  {
    id: 'act-cafe',
    title: 'Тухтай кафе орох',
    description: 'Амттай кофе, халуун цай ууж чин сэтгэлээсээ ярилцах',
    icon: '☕',
    category: 'chill',
  },
  {
    id: 'act-photobooth',
    title: 'Photobooth зураг татуулах',
    description: 'Хөөрхөн, инээдтэй маск зүүж нандин дурсамжийн зураг даруулах',
    icon: '📸',
    category: 'fun',
  },
  {
    id: 'act-cinema',
    title: 'Кино үзэх',
    description: 'Шинэ гарсан кино театрт эсвэл попкорнтой тухлах',
    icon: '🎬',
    category: 'romantic',
  },
  {
    id: 'act-sunset-walk',
    title: 'Нар жаргах үед зугаалах',
    description: 'Гар гараасаа хөтлөлцөөд нам гүм цэцэрлэгт алхах',
    icon: '🌅',
    category: 'romantic',
  },
  {
    id: 'act-stargazing',
    title: 'Оройн хотын гэрэл & Од харах',
    description: 'Зайсан толгой эсвэл өндөрлөг газраас шөнийн гэрлийг тольдох',
    icon: '🌌',
    category: 'romantic',
  },
  {
    id: 'act-arcade',
    title: 'Arcade & Тоглоомын төв',
    description: 'Тоглоом тоглож хожих, сагс шидэж, агаарын хоккейд өрсөлдөх',
    icon: '🕹️',
    category: 'fun',
  },
  {
    id: 'act-picnic',
    title: 'Хөөрхөн пикник хийх',
    description: 'Зүлгэн дээр дэвсгэр тавиад жимс, амттан идэх',
    icon: '🧺',
    category: 'chill',
  },
  {
    id: 'act-biking',
    title: 'Дугуй эсвэл скүүтэр унах',
    description: 'Үндэсний цэцэрлэгт хүрээлэнд салхи татуулан дугуй жийх',
    icon: '🚲',
    category: 'fun',
  },
  {
    id: 'act-karaoke',
    title: 'Караокед дуулах',
    description: 'Дуртай дуунуудаа хамтдаа чангаар дуулж хөгжилдөх',
    icon: '🎤',
    category: 'fun',
  },
  {
    id: 'act-bookstore',
    title: 'Номын дэлгүүрээр аялах',
    description: 'Бие биедээ сонирхолтой ном сонгож өгөх, тайван байх',
    icon: '📚',
    category: 'chill',
  },
  {
    id: 'act-pet-cafe',
    title: 'Муур, нохойн кафе орох',
    description: 'Энхрий амьтдыг эрхлүүлж инээмсэглэлээр дүүрэн цагийг өнгөрөөх',
    icon: '🐾',
    category: 'chill',
  },
];

export const POPULAR_FOODS: FoodOption[] = [
  // Teen & Budget-Friendly Snacks & Meals
  { id: 'food-cu-ramen', name: 'CU / GS25 Халуун гоймон & Зайдас', emoji: '🍜', category: 'budget_snack', isBudget: true },
  { id: 'food-triangle-kimbap', name: 'Гурвалжин кимбаб', emoji: '🍙', category: 'budget_snack', isBudget: true },
  { id: 'food-tuts-icecream', name: 'Түцний 1000₮-ийн сүүтэй зайрмаг', emoji: '🍦', category: 'budget_snack', isBudget: true },
  { id: 'food-khuushuur', name: 'Шаржигнасан халуун хуушуур', emoji: '🥟', category: 'budget_snack', isBudget: true },
  { id: 'food-corndog', name: 'Хот-дог / Бяслагтай Корн-дог', emoji: '🌭', category: 'budget_snack', isBudget: true },
  { id: 'food-fries', name: 'Шарсан төмс & кетчуп', emoji: '🍟', category: 'budget_snack', isBudget: true },
  { id: 'food-donuts', name: 'Амтат пончик / Чихэр', emoji: '🍩', category: 'budget_snack', isBudget: true },
  { id: 'food-snack-pack', name: 'Чипс, чихэр & ундааны багц', emoji: '🥤', category: 'budget_snack', isBudget: true },
  { id: 'food-boba', name: 'Боба сүүн цай', emoji: '🧋', category: 'drink', isBudget: true },

  // Meals & Desserts
  { id: 'food-pizza', name: 'Итали Пицца & Паста', emoji: '🍕', category: 'meal' },
  { id: 'food-burger', name: 'Шүүслэг Бургер & Шарсан төмс', emoji: '🍔', category: 'meal' },
  { id: 'food-sushi', name: 'Япон Суши & Ролл', emoji: '🍣', category: 'meal' },
  { id: 'food-coffee', name: 'Халуун Латте / Капучино', emoji: '☕', category: 'drink' },
  { id: 'food-cheesecake', name: 'Нью-Йорк Чизкейк / Бялуу', emoji: '🍰', category: 'dessert' },
  { id: 'food-crepe', name: 'Гүзээлзгэнэтэй вафли, креп', emoji: '🧇', category: 'dessert' },
];

export interface SongItem {
  title: string;
  artist: string;
  videoId: string;
  query: string;
  vibe: string;
  category: 'mongol' | 'international' | 'jazz_chill';
}

export const SUGGESTED_SONGS: SongItem[] = [
  // Mongol romantic
  { title: 'Зүүд', artist: 'A Cool', videoId: '4Q9S50_t-rQ', query: 'https://youtu.be/4Q9S50_t-rQ', vibe: 'Монгол романтик сэтгэл татам дуу', category: 'mongol' },
  { title: 'The Dream of a Kingfisher', artist: 'Magnolian', videoId: 'qK3p5fM8G4o', query: 'https://youtu.be/qK3p5fM8G4o', vibe: 'Уянгын намуун аялгуу', category: 'mongol' },
  { title: 'Араас минь тэврээч', artist: 'Uka', videoId: '29C4b1sUuBw', query: 'https://youtu.be/29C4b1sUuBw', vibe: 'Эрх дулаан мэдрэмж', category: 'mongol' },
  { title: '8090', artist: 'The Colors', videoId: '8Kx2y8u9gQ0', query: 'https://youtu.be/8Kx2y8u9gQ0', vibe: 'Ретро романтик vibe', category: 'mongol' },
  { title: 'Бид хоёр', artist: 'Ginjin x Mrs M', videoId: 'Z2kH_67K_f8', query: 'https://youtu.be/Z2kH_67K_f8', vibe: 'Хөнгөн хэмнэлтэй хайрын дуу', category: 'mongol' },
  { title: 'Цасан дээр', artist: 'A-Sound', videoId: 'pXm9oG1fEos', query: 'https://youtu.be/pXm9oG1fEos', vibe: 'Сонгодог амьд хөгжим', category: 'mongol' },

  // International Pop Romance
  { title: 'From The Start', artist: 'Laufey', videoId: 'lSD_L-xic9o', query: 'https://youtu.be/lSD_L-xic9o', vibe: 'Хөөрхөн жазз романс', category: 'jazz_chill' },
  { title: 'Until I Found You', artist: 'Stephen Sanchez', videoId: 'GxldQ9eX2wo', query: 'https://youtu.be/GxldQ9eX2wo', vibe: 'Сонгодог хайрын дуу', category: 'international' },
  { title: 'Die With A Smile', artist: 'Bruno Mars & Lady Gaga', videoId: 'kPa7bsKwL-c', query: 'https://youtu.be/kPa7bsKwL-c', vibe: 'Сэтгэл хөдөлгөм дуу', category: 'international' },
  { title: 'golden hour', artist: 'JVKE', videoId: 'PEM0Vs8jf1w', query: 'https://youtu.be/PEM0Vs8jf1w', vibe: 'Нар жаргах мөчийн аялгуу', category: 'international' },
  { title: 'strawberry moon', artist: 'IU', videoId: 'sqgxcCjD04s', query: 'https://youtu.be/sqgxcCjD04s', vibe: 'Ягаан үлгэрийн мэт', category: 'jazz_chill' },
  { title: 'Magnolia', artist: 'Keshi', videoId: 'G1P6Q2JqG7k', query: 'https://youtu.be/G1P6Q2JqG7k', vibe: 'Намуухан, сэтгэл татам', category: 'jazz_chill' },
  { title: 'Here With Me', artist: 'd4vd', videoId: 'b1kbLwvqugk', query: 'https://youtu.be/b1kbLwvqugk', vibe: 'Зөөлөн дулаан мэдрэмж', category: 'international' },
  { title: 'Perfect', artist: 'Ed Sheeran', videoId: '2Vv-BfVoq4g', query: 'https://youtu.be/2Vv-BfVoq4g', vibe: 'Төгс хайрын дуу', category: 'international' },
  { title: 'Lover', artist: 'Taylor Swift', videoId: '-BjZmE2gtdo', query: 'https://youtu.be/-BjZmE2gtdo', vibe: 'Дурлалт хосын сүлд дуу', category: 'international' },
  { title: 'Ballroom Extravaganza', artist: 'DPR IAN', videoId: '16bI31s4MhI', query: 'https://youtu.be/16bI31s4MhI', vibe: 'Киноны мэт сүрлэг', category: 'international' },
  { title: 'Glimpse of Us', artist: 'Joji', videoId: 'FvOpPeKSf_4', query: 'https://youtu.be/FvOpPeKSf_4', vibe: 'Төгөлдөр хууртай гүн мэдрэмж', category: 'jazz_chill' },
  { title: 'Daylight', artist: 'David Kushner', videoId: 'MoN9ql6Yymw', query: 'https://youtu.be/MoN9ql6Yymw', vibe: 'Гүн хоолойтой баллад', category: 'international' },
];

export const DEFAULT_INVITATION: DateInvitation = {
  id: 'bolzoo-sample',
  senderName: 'Би',
  receiverName: 'Хонгор минь',
  message: 'Чамайг анх харсан өдрөөс хойш инээмсэглэлийг чинь мартдаггүй ээ. Хоёулаа хамтдаа дурсамж дүүрэн нэгэн өдрийг өнгөрүүлэх үү? 💕',
  themeId: 'sakura-sky',
  musicQuery: 'GxldQ9eX2wo',
  musicTitle: 'Stephen Sanchez - Until I Found You',
  suggestedActivities: ['act-cafe', 'act-photobooth', 'act-claw-machine', 'act-sunset-walk'],
  suggestedFoods: ['food-pizza', 'food-coffee', 'food-tuts-icecream'],
  createdAt: Date.now(),
};
