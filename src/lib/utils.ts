import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

export function generateShortCode(): string {
  return nanoid();
}

export function getAnonymousToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('qrtrace_anon_token');
  if (!token) {
    token = 'anon_' + nanoid(16);
    localStorage.setItem('qrtrace_anon_token', token);
  }
  return token;
}

export function parseUserAgent(ua: string | null): string {
  if (!ua) return 'Unknown';
  if (/mobile|android|iphone|ipad/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3000';
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
