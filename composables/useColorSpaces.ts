// Reference: https://en.wikipedia.org/wiki/CIELAB_color_space
// and standard formulas for conversions

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply sRGB companding
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using the sRGB matrix
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return [x * 100, y * 100, z * 100];
}

function xyzToRgb(x: number, y: number, z: number): [number, number, number] {
  x = x / 100;
  y = y / 100;
  z = z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // Apply inverse sRGB companding
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65 reference white point
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  x /= refX;
  y /= refY;
  z /= refZ;

  function f(t: number): number {
    return t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + (16 / 116);
  }

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  const l = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [l, a, b];
}

function labToXyz(l: number, a: number, b: number): [number, number, number] {
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  function fInv(t: number): number {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  }

  const x = refX * fInv(fx);
  const y = refY * fInv(fy);
  const z = refZ * fInv(fz);

  return [x, y, z];
}

function labToLch(l: number, a: number, b: number): [number, number, number] {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  if (h < 0) h += 360;
  return [l, c, h];
}

function lchToLab(l: number, c: number, h: number): [number, number, number] {
  const hr = h * (Math.PI / 180);
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  return [l, a, b];
}

export default function useColorSpaces() {
  return {
    rgbToXyz,
    xyzToRgb,
    xyzToLab,
    labToXyz,
    labToLch,
    lchToLab,
  };
}