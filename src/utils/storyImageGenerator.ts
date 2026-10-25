import { GRADIENT_THEMES, POPULAR_ACTIVITIES, POPULAR_FOODS } from '../data/defaults';

export interface StoryTicketData {
  senderName: string;
  receiverName: string;
  date: string;
  time: string;
  timeOfDayLabel: string;
  activityIds: string[];
  customActivities: string[];
  foodIds: string[];
  note?: string;
  themeId: string;
}

/**
 * Polyfill-safe rounded rectangle drawer
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Generates an ultra-crisp 1080 x 1920 (9:16 Instagram Story) PNG image
 */
export async function generateStoryImage(data: StoryTicketData): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const theme = GRADIENT_THEMES.find((t) => t.id === data.themeId) || GRADIENT_THEMES[0];
  const colors = theme.previewColors || ['#ffe4e6', '#fdf2f8', '#e0f2fe'];

  // 1. Draw Full Story Gradient Background (1080 x 1920)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, colors[0]);
  bgGrad.addColorStop(0.5, colors[1]);
  bgGrad.addColorStop(1, colors[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative floating background elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 20; i++) {
    const cx = (i * 137) % 1080;
    const cy = (i * 269) % 1920;
    const cr = 20 + (i % 5) * 15;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floating background sparkles/emojis
  ctx.font = '36px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  const deco = [
    { text: '✨', x: 80, y: 160 },
    { text: '💖', x: 920, y: 180 },
    { text: '🌸', x: 100, y: 1820 },
    { text: '🧸', x: 920, y: 1800 },
    { text: '🎀', x: 80, y: 980 },
    { text: '💫', x: 960, y: 940 },
  ];
  deco.forEach((d) => ctx.fillText(d.text, d.x, d.y));

  // Top Story Header
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('✦ OFFICIAL DATE PASS ✦', 540, 140);

  ctx.fillStyle = '#1e293b';
  ctx.font = '900 52px sans-serif';
  ctx.fillText('БОЛЗООНЫ ТАСАЛБАР 💕', 540, 210);

  // 2. Main Ticket Card Container (920w x 1460h)
  const cardX = 80;
  const cardY = 270;
  const cardW = 920;
  const cardH = 1460;
  const cardRadius = 48;

  // Drop shadow behind card
  ctx.save();
  ctx.shadowColor = 'rgba(244, 63, 94, 0.2)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#ffffff';
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.restore();

  // Draw card border
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
  ctx.lineWidth = 4;
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.stroke();

  // Ticket Header Banner inside card
  const headerH = 220;
  ctx.save();
  ctx.beginPath();
  drawRoundRect(ctx, cardX, cardY, cardW, headerH, cardRadius);
  ctx.clip();
  const headerGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + headerH);
  headerGrad.addColorStop(0, '#fff1f2');
  headerGrad.addColorStop(1, '#fce7f3');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(cardX, cardY, cardW, headerH);
  ctx.restore();

  // Header content
  ctx.textAlign = 'left';
  ctx.fillStyle = '#be123c';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('BOARDING PASS / 2 SEATS CONFIRMED', cardX + 50, cardY + 70);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 44px sans-serif';
  ctx.fillText('Болзоогоор Аялах Тасалбар ✈️', cardX + 50, cardY + 130);

  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('№ BLZ-2026-LOVE · CLASS: FIRST CLASS 💕', cardX + 50, cardY + 180);

  // Perforated dashed divider line below header
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 4;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + headerH);
  ctx.lineTo(cardX + cardW - 40, cardY + headerH);
  ctx.stroke();
  ctx.setLineDash([]);

  // Semicircle notch cutouts on ticket edges
  ctx.fillStyle = colors[1];
  ctx.beginPath();
  ctx.arc(cardX, cardY + headerH, 28, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cardX + cardW, cardY + headerH, 28, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.fill();

  // 3. Passenger Route Section: Sender -> Receiver
  let currentY = cardY + headerH + 60;

  // Flight Route Visualization
  ctx.fillStyle = '#f8fafc';
  drawRoundRect(ctx, cardX + 40, currentY, cardW - 80, 160, 28);
  ctx.fill();
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, cardX + 40, currentY, cardW - 80, 160, 28);
  ctx.stroke();

  // Sender column
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('УРИЛГА ИЛГЭЭГЧ (FROM)', cardX + 70, currentY + 50);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 36px sans-serif';
  ctx.fillText(data.senderName || 'Би', cardX + 70, currentY + 105);

  // Center Heart Airplane Icon
  ctx.textAlign = 'center';
  ctx.font = '36px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.fillText('💌 ──✈️── 💕', cardX + cardW / 2, currentY + 90);

  // Receiver column
  ctx.textAlign = 'right';
  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ХҮЛЭЭН АВАГЧ (TO)', cardX + cardW - 70, currentY + 50);
  ctx.fillStyle = '#e11d48';
  ctx.font = '900 36px sans-serif';
  ctx.fillText(data.receiverName || 'Хонгор минь', cardX + cardW - 70, currentY + 105);

  // 4. Date & Time Bar
  currentY += 190;
  ctx.fillStyle = '#fdf2f8';
  drawRoundRect(ctx, cardX + 40, currentY, cardW - 80, 110, 24);
  ctx.fill();
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, cardX + 40, currentY, cardW - 80, 110, 24);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#be123c';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(`🗓️ ${data.date || 'Тохиролцоно'}`, cardX + 70, currentY + 68);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(`⏰ ${data.time || '18:00'} · ${data.timeOfDayLabel}`, cardX + cardW - 70, currentY + 68);

  // 5. Activities Section
  currentY += 140;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('🎡 ХАМТДАА ХИЙХ ЗҮЙЛС & ОЧИХ ГАЗРУУД:', cardX + 50, currentY + 30);

  currentY += 60;
  const activityItems = [
    ...data.activityIds.map((id) => {
      const match = POPULAR_ACTIVITIES.find((a) => a.id === id);
      return match ? `${match.icon} ${match.title}` : id;
    }),
    ...data.customActivities.map((c) => `✨ ${c}`),
  ];

  // Draw Activity Tags
  let tagX = cardX + 50;
  let tagY = currentY;
  const maxTagWidth = cardW - 100;

  ctx.font = 'bold 24px sans-serif';
  for (const act of activityItems.slice(0, 6)) {
    const textWidth = ctx.measureText(act).width;
    const tagW = textWidth + 48;
    if (tagX + tagW > cardX + 50 + maxTagWidth) {
      tagX = cardX + 50;
      tagY += 64;
    }

    ctx.fillStyle = '#fce7f3';
    drawRoundRect(ctx, tagX, tagY, tagW, 52, 26);
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, tagX, tagY, tagW, 52, 26);
    ctx.stroke();

    ctx.fillStyle = '#9d174d';
    ctx.fillText(act, tagX + 24, tagY + 35);
    tagX += tagW + 16;
  }

  // 6. Food & Drinks Section
  currentY = tagY + 90;
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('🍰 АМТЛАХ ХООЛ & АМТТАН:', cardX + 50, currentY + 30);

  currentY += 60;
  const foodItems = data.foodIds.map((id) => {
    const match = POPULAR_FOODS.find((f) => f.id === id);
    return match ? `${match.emoji} ${match.name}` : id;
  });

  let foodX = cardX + 50;
  let foodY = currentY;
  ctx.font = 'bold 24px sans-serif';
  for (const food of foodItems.slice(0, 6)) {
    const textWidth = ctx.measureText(food).width;
    const tagW = textWidth + 48;
    if (foodX + tagW > cardX + 50 + maxTagWidth) {
      foodX = cardX + 50;
      foodY += 64;
    }

    ctx.fillStyle = '#e0f2fe';
    drawRoundRect(ctx, foodX, foodY, tagW, 52, 26);
    ctx.fill();
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, foodX, foodY, tagW, 52, 26);
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.fillText(food, foodX + 24, foodY + 35);
    foodX += tagW + 16;
  }

  // 7. Receiver Note if exists
  currentY = foodY + 80;
  if (data.note) {
    ctx.fillStyle = '#fef3c7';
    drawRoundRect(ctx, cardX + 50, currentY, cardW - 100, 90, 20);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, cardX + 50, currentY, cardW - 100, 90, 20);
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'italic 24px sans-serif';
    const noteText = data.note.length > 55 ? data.note.substring(0, 52) + '...' : data.note;
    ctx.fillText(`💌 "${noteText}"`, cardX + 75, currentY + 54);
    currentY += 110;
  }

  // 8. Bottom Barcode & Red Acceptance Stamp
  const bottomY = cardY + cardH - 150;

  // Realistic Barcode simulation
  ctx.fillStyle = '#334155';
  ctx.font = '22px monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText('||| | ||||| || |||||| | ||||| |||', cardX + 60, bottomY + 50);
  ctx.letterSpacing = '0px';

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('VALID FOR 2 PERSONS · NON-TRANSFERABLE 💕', cardX + 60, bottomY + 85);

  // RED RUBBER STAMP (Rotated aesthetic stamp)
  ctx.save();
  ctx.translate(cardX + cardW - 200, bottomY + 45);
  ctx.rotate(-0.16); // -9 degrees tilt
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 4;
  drawRoundRect(ctx, -140, -45, 280, 85, 16);
  ctx.stroke();

  ctx.fillStyle = '#e11d48';
  ctx.textAlign = 'center';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('★ CONFIRMED ★', 0, -10);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('БОЛЗОО БАТЛАГДЛАА', 0, 24);
  ctx.restore();

  // Bottom Story Watermark
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(100, 116, 139, 0.7)';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('📸 Instagram Story Date Pass · Created with Bolzoo', 540, 1850);

  return canvas.toDataURL('image/png');
}
