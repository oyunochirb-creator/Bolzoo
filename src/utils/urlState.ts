import { DateInvitation, DateResponse } from '../types';

/**
 * Safely encode UTF-8 object into a URL-friendly Base64 string
 */
export function encodeInvitationToUrl(invitation: DateInvitation): string {
  try {
    const jsonStr = JSON.stringify(invitation);
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
    return JSON.parse(jsonStr) as DateInvitation;
  } catch (err) {
    console.warn('Could not decode invitation from URL param', err);
    return null;
  }
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
 * Extracts YouTube video ID from URL if provided, otherwise returns null
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  // Check if it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  // Standard youtube.com or youtu.be
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}
