<template>
  <v-card class="pa-4">
    <v-card-title>Color Comparison</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          v-for="(color, index) in colors"
          :key="color + '-' + index"
          cols="12" md="3"
          class="text-center"
        >
          <div :style="{ backgroundColor: color, height: '100px', borderRadius: '6px' }"></div>
          <div>{{ color }}</div>
        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <div v-if="colors.length >= 2">
        <div v-for="(pair, idx) in colorPairs" :key="idx" class="mb-3">
          <div>
            <strong>Pair {{ idx + 1 }}:</strong> {{ pair[0] }} vs {{ pair[1] }}
          </div>
          <div>Delta E 2000: {{ deltaEs[idx].toFixed(2) }}</div>
          <div>Contrast Ratio: {{ contrastRatios[idx].toFixed(2) }} - {{ getContrastLevel(contrastRatios[idx]) }}</div>
        </div>
      </div>
      <div v-else>
        Add at least 2 colors to compare.
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useColorSpaces from '../composables/useColorSpaces';
import { deltaE00 } from '../utils/deltaE';

interface ColorPair {
  c1: string;
  c2: string;
}

const props = defineProps<{
  colors: string[];
}>();

const { hexToRgb, rgbToXyz, xyzToLab } = useColorSpaces();

function wcagContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(rgb: [number, number, number]): number {
  // Normalize and gamma correct
  const sRGB = rgb.map(c => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

const colorPairs = computed(() => {
  const pairs: [string, string][] = [];
  for (let i = 0; i < props.colors.length - 1; i++) {
    for (let j = i + 1; j < props.colors.length; j++) {
      pairs.push([props.colors[i], props.colors[j]]);
    }
  }
  return pairs;
});

const deltaEs = computed(() => {
  return colorPairs.value.map(([c1, c2]) => {
    const lab1 = xyzToLab(...rgbToXyz(...hexToRgb(c1)));
    const lab2 = xyzToLab(...rgbToXyz(...hexToRgb(c2)));
    return deltaE00(lab1, lab2);
  });
});

const contrastRatios = computed(() => {
  return colorPairs.value.map(([c1, c2]) => {
    const l1 = relativeLuminance(hexToRgb(c1));
    const l2 = relativeLuminance(hexToRgb(c2));
    return wcagContrastRatio(l1, l2);
  });
});

function getContrastLevel(ratio: number): string {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}
</script>

<style scoped>
</style>