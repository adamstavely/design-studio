<template>
  <v-card class="pa-4">
    <v-card-title>Contrast Ratio Checker</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="color1"
        label="Foreground Color (Hex)"
        @input="validateColors"
      />
      <v-text-field
        v-model="color2"
        label="Background Color (Hex)"
        @input="validateColors"
      />
      <div class="contrast-bar" :style="contrastBarStyle"></div>
      <div>
        Contrast Ratio: {{ contrastRatio.toFixed(2) }} - <strong>{{ complianceLevel }}</strong>
      </div>
      <div v-if="!isCompliant" class="warning">
        ⚠️ Colors do not meet WCAG AA standards.
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { hexToRgb } from '../composables/useColorSpaces';

function relativeLuminance(rgb: [number, number, number]): number {
  const sRGB = rgb.map(c => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const color1 = ref('#000000');
const color2 = ref('#ffffff');
const contrastRatioValue = ref(21);

function validateColors() {
  try {
    const rgb1 = hexToRgb(color1.value);
    const rgb2 = hexToRgb(color2.value);
    const l1 = relativeLuminance(rgb1);
    const l2 = relativeLuminance(rgb2);
    contrastRatioValue.value = contrastRatio(l1, l2);
  } catch {
    contrastRatioValue.value = 0;
  }
}

const contrastRatioComputed = computed(() => contrastRatioValue.value);

const complianceLevel = computed(() => {
  const ratio = contrastRatioValue.value;
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
});

const isCompliant = computed(() => complianceLevel.value !== 'Fail');

const contrastBarStyle = computed(() => ({
  width: `${(contrastRatioValue.value / 21) * 100}%`,
  height: '10px',
  backgroundColor: isCompliant.value ? '#4caf50' : '#f44336',
  transition: 'width 0.3s ease-in-out',
}));

validateColors();
</script>

<style scoped>
.contrast-bar {
  margin: 8px 0;
  border-radius: 5px;
}
.warning {
  color: #d32f2f;
  margin-top: 10px;
}
</style>