import { DateInvitation, DateResponse } from '../types';

/**
 * Safely encode UTF-8 object into a URL-friendly Base64 string
 * Uses compact key mappings to keep the resulting URL small
 */
export function encodeInvitationToUrl(invitation: DateInvitation): string {
  try {
    const compact = {
      i: invitation.id,
      s: invitation.senderName,
      r: invitation.receiverName,
      m: invitation.message,
      t: invitation.themeId,
      a: invitation.suggestedActivities,
      f: invitation.suggestedFoods,
      e: invitation.senderEmail,
      c: invitation.createdAt,
    };
    const jsonStr = JSON.stringify(compact);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64 = btoa(binary);
    return encodeURIComponent(base64);
  } catch (err) {
    console.error('Failed to encode invitation', err);
    return '';
  }
}

/**
 * Safely decode URL parameter back to DateInvitation
 * Supports both compact format and full JSON format
 */
export function decodeInvitationFromUrl(param: string): DateInvitation | null {
  try {
    const decodedParam = decodeURIComponent(param);
    const binary = atob(decodedParam);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const obj = JSON.parse(jsonStr);

    // If compact format
    if (obj.s !== undefined || obj.r !== undefined) {
      return {
        id: obj.i || `blz-${Date.now()}`,
        senderName: obj.s || '',
        receiverName: obj.r || '',
        message: obj.m || '',
        themeId: obj.t || 'sakura-sky',
        musicQuery: 'GxldQ9eX2wo',
        musicTitle: 'Stephen Sanchez - Until I Found You',
        suggestedActivities: Array.isArray(obj.a) ? obj.a : [],
        suggestedFoods: Array.isArray(obj.f) ? obj.f : [],
        senderEmail: obj.e,
        createdAt: obj.c || Date.now(),
      };
    }

    // If legacy full format
    return {
      ...obj,
      musicQuery: 'GxldQ9eX2wo',
      musicTitle: 'Stephen Sanchez - Until I Found You',
    } as DateInvitation;
  } catch (err) {
    console.warn('Could not decode invitation from URL param', err);
    return null;
  }
}

/**
 * Creates a clean short link using public CORS-friendly shortener services (is.gd / v.gd)
 */
export async function createShortUrl(longUrl: string): Promise<string> {
  // 1. Try is.gd JSON endpoint (CORS enabled)
  try {
    const encoded = encodeURIComponent(longUrl);
    const res = await fetch(`https://is.gd/create.php?format=json&url=${encoded}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.shorturl) {
        return data.shorturl;
      }
    }
  } catch (err) {
    console.warn('is.gd shortener request failed', err);
  }

  // 2. Fallback to v.gd (CORS enabled)
  try {
    const encoded = encodeURIComponent(longUrl);
    const res = await fetch(`https://v.gd/create.php?format=json&url=${encoded}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.shorturl) {
        return data.shorturl;
      }
    }
  } catch (err) {
    console.warn('v.gd shortener request failed', err);
  }

  // Fallback to original longUrl
  return longUrl;
}

/**
 * Encode DateResponse into URL
 */
export function encodeResponseToUrl(response: DateResponse): string {
  try {
    const jsonStr = JSON.stringify(response);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64 = btoa(binary);
    return encodeURIComponent(base64);
  } catch (err) {
    console.error('Failed to encode response', err);
    return '';
  }
}

/**
 * Decode DateResponse from URL
 */
export function decodeResponseFromUrl(param: string): DateResponse | null {
  try {
    const decodedParam = decodeURIComponent(param);
    const binary = atob(decodedParam);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr) as DateResponse;
  } catch (err) {
    console.warn('Could not decode response from URL', err);
    return null;
  }
}

/**
 * Known popular songs catalog mapping keywords to verified YouTube video IDs
 */
export const SONG_CATALOG: { keywords: string[]; videoId: string; title: string }[] = [
  // Mongolian Hits
  { keywords: ['zuud', 'зүүд', 'a cool', 'acool'], videoId: '4Q9S50_t-rQ', title: 'A Cool - Зүүд' },
  { keywords: ['magnolian', 'kingfisher', 'dream of a kingfisher'], videoId: 'qK3p5fM8G4o', title: 'Magnolian - The Dream of a Kingfisher' },
  { keywords: ['uka', 'араас минь тэврээч', 'araas'], videoId: '29C4b1sUuBw', title: 'Uka - Араас минь тэврээч' },
  { keywords: ['the colors', 'colors', '8090'], videoId: '8Kx2y8u9gQ0', title: 'The Colors - 8090' },
  { keywords: ['бид хоёр', 'bid hoyor', 'ginjin', 'mrs m'], videoId: 'Z2kH_67K_f8', title: 'Ginjin x Mrs M - Бид хоёр' },
  { keywords: ['a-sound', 'asound', 'цасан дээр', 'tsasan deer'], videoId: 'pXm9oG1fEos', title: 'A-Sound - Цасан дээр' },

  // International Hits & Pop Romance
  { keywords: ['laufey', 'from the start'], videoId: 'lSD_L-xic9o', title: 'Laufey - From The Start' },
  { keywords: ['until i found you', 'stephen sanchez'], videoId: 'GxldQ9eX2wo', title: 'Stephen Sanchez - Until I Found You' },
  { keywords: ['die with a smile', 'bruno mars', 'lady gaga'], videoId: 'kPa7bsKwL-c', title: 'Bruno Mars & Lady Gaga - Die With A Smile' },
  { keywords: ['golden hour', 'jvke'], videoId: 'PEM0Vs8jf1w', title: 'JVKE - golden hour' },
  { keywords: ['strawberry moon', 'iu'], videoId: 'sqgxcCjD04s', title: 'IU - strawberry moon' },
  { keywords: ['magnolia', 'keshi'], videoId: 'G1P6Q2JqG7k', title: 'Keshi - Magnolia' },
  { keywords: ['here with me', 'd4vd'], videoId: 'b1kbLwvqugk', title: 'd4vd - Here With Me' },
  { keywords: ['perfect', 'ed sheeran'], videoId: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect' },
  { keywords: ['lover', 'taylor swift'], videoId: '-BjZmE2gtdo', title: 'Taylor Swift - Lover' },
  { keywords: ['ballroom', 'dpr ian'], videoId: '16bI31s4MhI', title: 'DPR IAN - Ballroom Extravaganza' },
  { keywords: ['glimpse of us', 'joji'], videoId: 'FvOpPeKSf_4', title: 'Joji - Glimpse of Us' },
  { keywords: ['daylight', 'david kushner'], videoId: 'MoN9ql6Yymw', title: 'David Kushner - Daylight' },
];

/**
 * Extracts YouTube video ID from URL or matches song keyword, otherwise returns null
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. Direct 11-char ID check (e.g. "lSD_L-xic9o", "4Q9S50_t-rQ")
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Comprehensive YouTube URL regex patterns (handles watch?v=, watch?...&v=, youtu.be/, shorts/, embed/)
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?(?:[^&]+&)*v=))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  if (match) return match[1];

  // 3. Match against song catalog by keywords or exact videoId presence
  const lower = trimmed.toLowerCase();
  for (const song of SONG_CATALOG) {
    if (trimmed.includes(song.videoId) || song.keywords.some((kw) => lower.includes(kw))) {
      return song.videoId;
    }
  }

  return null;
}

/**
 * Get display title for a song query or video ID
 */
export function getSongDisplayTitle(input: string, fallbackTitle?: string): string {
  if (fallbackTitle && fallbackTitle.trim()) return fallbackTitle;
  if (!input) return 'Дуу сонгоогүй';

  const lower = input.toLowerCase();
  for (const song of SONG_CATALOG) {
    if (input.includes(song.videoId) || song.keywords.some((kw) => lower.includes(kw))) {
      return song.title;
    }
  }

  return input;
}
