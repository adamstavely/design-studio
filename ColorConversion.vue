<template>
  <v-card class="pa-4">
    <v-card-title>Color Conversion Utility</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="inputColor"
            label="Input Color (HEX)"
            placeholder="#ff0000"
            @input="convertColor"
          />
        </v-col>
        <v-col cols="12" md="6">
          <div>
            <strong>Conversions:</strong>
            <ul>
              <li>RGB: {{ rgb }}</li>
              <li>LAB: {{ lab }}</li>
              <li>LCH: {{ lch }}</li>
              <li>CMYK: {{ cmykString }}</li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import useColorSpaces from '../composables/useColorSpaces';

const inputColor = ref('#ff0000');
const rgb = ref<[number, number, number]>([255, 0, 0]);
const lab = ref<[number, number, number]>([0, 0, 0]);
const lch = ref<[number, number, number]>([0, 0, 0]);
const cmyk = ref<[number, number, number, number]>([0, 0, 0, 0]);

const { hexToRgb, rgbToXyz, xyzToLab, labToLch } = useColorSpaces();

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;

  const k = 1 - Math.max(r1, g1, b1);
  const c = (1 - r1 - k) / (1 - k) || 0;
  const m = (1 - g1 - k) / (1 - k) || 0;
  const y = (1 - b1 - k) / (1 - k) || 0;

  return [c, m, y, k];
}

function convertColor() {
  try {
    const _rgb = hexToRgb(inputColor.value);
    rgb.value = _rgb;

    const xyz = rgbToXyz(..._rgb);
    const _lab = xyzToLab(...xyz);
    lab.value = _lab;

    const _lch = labToLch(..._lab);
    lch.value = _lch;

    cmyk.value = rgbToCmyk(..._rgb);
  } catch {
    // Invalid input, ignore
  }
}

const cmykString = computed(() => {
  return cmyk.value
    .map(v => (v * 100).toFixed(0) + '%')
    .join(', ');
});

convertColor();
</script>