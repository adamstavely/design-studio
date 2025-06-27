import { ref } from 'vue';

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary';

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

export default function useColorHarmony() {
  const harmonyColors = ref<string[]>([]);

  function generateHarmony(baseHex: string, harmonyType: HarmonyType): string[] {
    const [h, s, l] = hexToHsl(baseHex);
    const results: string[] = [];

    switch (harmonyType) {
      case 'complementary':
        results.push(baseHex);
        results.push(rgbToHex(...hslToRgb((h + 0.5) % 1, s, l)));
        break;
      case 'analogous':
        results.push(baseHex);
        results.push(rgbToHex(...hslToRgb((h + 1 / 12) % 1, s, l)));
        results.push(rgbToHex(...hslToRgb((h - 1 / 12 + 1) % 1, s, l)));
        break;
      case 'triadic':
        results.push(baseHex);
        results.push(rgbToHex(...hslToRgb((h + 1 / 3) % 1, s, l)));
        results.push(rgbToHex(...hslToRgb((h + 2 / 3) % 1, s, l)));
        break;
      case 'split-complementary':
        results.push(baseHex);
        results.push(rgbToHex(...hslToRgb((h + 5 / 12) % 1, s, l)));
        results.push(rgbToHex(...hslToRgb((h + 7 / 12) % 1, s, l)));
        break;
    }

    harmonyColors.value = results;
    return results;
  }

  return {
    harmonyColors,
    generateHarmony,
  };
}