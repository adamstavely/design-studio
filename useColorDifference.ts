import { Color } from 'colorjs.io';

export function deltaE(color1: Color, color2: Color) {
  return color1.deltaE(color2, { method: '2000' });
}

export function contrastRatio(color1: Color, color2: Color) {
  return color1.contrast(color2);
}