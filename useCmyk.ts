import { ref } from 'vue';

function cmykToRgb(c: number, m: number, y: number, k: number): [number, number, number] {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return [Math.round(r), Math.round(g), Math.round(b)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;

  const k = 1 - Math.max(rPrime, gPrime, bPrime);
  if (k === 1) return [0, 0, 0, 1];

  const c = (1 - rPrime - k) / (1 - k);
  const m = (1 - gPrime - k) / (1 - k);
  const y = (1 - bPrime - k) / (1 - k);

  return [c, m, y, k];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export default function useCmyk() {
  const c = ref(0);
  const m = ref(0);
  const y = ref(0);
  const k = ref(0);
  const hex = ref('#000000');

  function updateFromCmyk(cVal: number, mVal: number, yVal: number, kVal: number) {
    c.value = cVal;
    m.value = mVal;
    y.value = yVal;
    k.value = kVal;
    const [r, g, b] = cmykToRgb(cVal, mVal, yVal, kVal);
    hex.value = rgbToHex(r, g, b);
  }

  function updateFromHex(newHex: string) {
    hex.value = newHex;
    const [r, g, b] = hexToRgb(newHex);
    const [cVal, mVal, yVal, kVal] = rgbToCmyk(r, g, b);
    c.value = cVal;
    m.value = mVal;
    y.value = yVal;
    k.value = kVal;
  }

  return {
    c,
    m,
    y,
    k,
    hex,
    updateFromCmyk,
    updateFromHex,
  };
}