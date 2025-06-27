import { Color } from 'colorjs.io';

export async function convertColor(input: string | Color) {
  const color = input instanceof Color ? input : new Color(input);
  return {
    hex: await color.toString('hex'),
    rgb: await color.toString('rgb'),
    hsl: await color.toString('hsl'),
    hsv: await color.toString('hsv'),
    lab: color.to('lab'),
    lch: color.to('lch'),
    oklab: color.to('oklab'),
    oklch: color.to('oklch'),
    hsluv: color.to('hsluv'),
    cam02: color.to('cam02'),
    cam02p: color.to('cam02p'),
    cmyk: color.to('cmyk'),
    xyz: color.to('xyz'),
  };
}