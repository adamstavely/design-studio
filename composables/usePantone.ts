import { ref } from 'vue';

interface PantoneColor {
  name: string;
  code: string;
  hex: string;
  cmyk: [number, number, number, number];
}

// Mock Pantone data sample - replace with full data as needed
const pantoneColors: PantoneColor[] = [
  { name: 'PANTONE Red', code: '186 C', hex: '#C8102E', cmyk: [0, 100, 81, 4] },
  { name: 'PANTONE Blue', code: '293 C', hex: '#0033A0', cmyk: [100, 77, 0, 2] },
  { name: 'PANTONE Yellow', code: 'Yellow C', hex: '#FFD100', cmyk: [0, 0, 100, 0] },
  // ...more colors
];

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

export default function usePantone() {
  const searchResults = ref<PantoneColor[]>([]);

  function searchPantone(term: string) {
    const t = term.toLowerCase();
    searchResults.value = pantoneColors.filter(c =>
      c.name.toLowerCase().includes(t) || c.code.toLowerCase().includes(t)
    );
  }

  function findNearestPantone(hex: string): PantoneColor | null {
    const rgb = hexToRgb(hex);
    let nearest = null;
    let minDist = Infinity;
    for (const color of pantoneColors) {
      const dist = colorDistance(rgb, hexToRgb(color.hex));
      if (dist < minDist) {
        minDist = dist;
        nearest = color;
      }
    }
    return nearest;
  }

  return {
    searchResults,
    searchPantone,
    findNearestPantone,
  };
}