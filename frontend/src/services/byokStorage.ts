export type ByokProvider = 'gemini';

export type ByokConfig = {
  enabled: boolean;
  provider: ByokProvider;
  model: string;
  apiKey: string;
  tier?: string; // e.g. "Free", "Tier 1", "Tier 2+"
};

const BYOK_STORAGE_KEY = '0buck.byok';
// Simple local obfuscation to prevent casual XSS scraping.
// In a fully secure setup, Web Crypto API with a user pin should be used.
const SALT = "0buck_local_salt_8f9a2b";

function obfuscate(text: string): string {
  try {
    return btoa(encodeURIComponent(text + SALT));
  } catch {
    return text;
  }
}

function deobfuscate(text: string): string {
  try {
    const decoded = decodeURIComponent(atob(text));
    if (decoded.endsWith(SALT)) {
      return decoded.slice(0, -SALT.length);
    }
    return text; // Fallback for old un-obfuscated keys
  } catch {
    return text; // Fallback
  }
}

export function loadByokConfig(): ByokConfig | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = window.localStorage.getItem(BYOK_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.provider !== 'gemini') return null;
    if (typeof parsed.apiKey !== 'string') return null;
    if (typeof parsed.model !== 'string') return null;
    if (typeof parsed.enabled !== 'boolean') return null;

    return {
      enabled: parsed.enabled,
      provider: 'gemini',
      model: parsed.model,
      apiKey: deobfuscate(parsed.apiKey),
      tier: parsed.tier,
    };
  } catch {
    return null;
  }
}

export function saveByokConfig(config: ByokConfig): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const safeConfig = {
    ...config,
    apiKey: obfuscate(config.apiKey)
  };
  window.localStorage.setItem(BYOK_STORAGE_KEY, JSON.stringify(safeConfig));
}

export function clearByokConfig(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(BYOK_STORAGE_KEY);
}

