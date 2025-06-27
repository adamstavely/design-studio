// Delta E 2000 color difference implementation
// Based on the CIEDE2000 formula for perceptual color difference

import { lchToLab, labToLch } from '../composables/useColorSpaces';

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function deltaE00(Lab1: [number, number, number], Lab2: [number, number, number]): number {
  const [L1, a1, b1] = Lab1;
  const [L2, a2, b2] = Lab2;

  const avgLp = (L1 + L2) / 2.0;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2.0;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2.0;

  const h1p = Math.atan2(b1, a1p) >= 0 ? Math.atan2(b1, a1p) : Math.atan2(b1, a1p) + 2 * Math.PI;
  const h2p = Math.atan2(b2, a2p) >= 0 ? Math.atan2(b2, a2p) : Math.atan2(b2, a2p) + 2 * Math.PI;

  let avgHp =
    Math.abs(h1p - h2p) > Math.PI
      ? (h1p + h2p + 2 * Math.PI) / 2.0
      : (h1p + h2p) / 2.0;

  const T =
    1 -
    0.17 * Math.cos(avgHp - deg2rad(30)) +
    0.24 * Math.cos(2 * avgHp) +
    0.32 * Math.cos(3 * avgHp + deg2rad(6)) -
    0.20 * Math.cos(4 * avgHp - deg2rad(63));

  let deltahp = h2p - h1p;
  if (Math.abs(deltahp) > Math.PI) {
    if (h2p <= h1p) {
      deltahp += 2 * Math.PI;
    } else {
      deltahp -= 2 * Math.PI;
    }
  }

  const deltaLp = L2 - L1;
  const deltaCp = C2p - C1p;
  const deltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deltahp / 2.0);

  const SL = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const SC = 1 + 0.045 * avgCp;
  const SH = 1 + 0.015 * avgCp * T;

  const deltaTheta = deg2rad(30) * Math.exp(-Math.pow((rad2deg(avgHp) - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const RT = -RC * Math.sin(2 * deltaTheta);

  const KL = 1;
  const KC = 1;
  const KH = 1;

  const deltaE = Math.sqrt(
    Math.pow(deltaLp / (KL * SL), 2) +
      Math.pow(deltaCp / (KC * SC), 2) +
      Math.pow(deltaHp / (KH * SH), 2) +
      RT * (deltaCp / (KC * SC)) * (deltaHp / (KH * SH))
  );

  return deltaE;
}