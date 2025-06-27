
<template>
  <v-container>
    <v-tabs v-model="activeTab" grow>
      <v-tab>Palette Preview</v-tab>
      <v-tab>Color Blindness</v-tab>
      <v-tab>Color Comparison</v-tab>
      <v-tab>Contrast Checker</v-tab>
      <v-tab>Color Conversion</v-tab>
      <v-tab>Visual Stress Test</v-tab>
      <v-tab>Gradient Generator</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <!-- Palette Preview -->
        <v-row>
          <v-col cols="12" md="6">
            <v-chip-group multiple>
              <v-chip
                v-for="color in paletteColors"
                :key="color"
                :style="{ backgroundColor: color, color: getTextColor(color) }"
              >
                {{ color }}
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="12" md="6">
            <color-blindness-simulator>
              <v-chip-group multiple>
                <v-chip
                  v-for="color in paletteColors"
                  :key="color + '-sim' "
                  :style="{ backgroundColor: color, color: getTextColor(color) }"
                >
                  {{ color }}
                </v-chip>
              </v-chip-group>
            </color-blindness-simulator>
          </v-col>
        </v-row>
      </v-tab-item>

      <v-tab-item>
        <!-- Color Blindness -->
        <color-blindness-simulator>
          <v-chip-group multiple>
            <v-chip
              v-for="color in paletteColors"
              :key="color + '-sim2'"
              :style="{ backgroundColor: color, color: getTextColor(color) }"
            >
              {{ color }}
            </v-chip>
          </v-chip-group>
        </color-blindness-simulator>
      </v-tab-item>

      <v-tab-item>
        <!-- Color Comparison -->
        <v-text-field
          v-model="comparisonInput"
          label="Add color hex code (comma separated)"
          placeholder="#ff0000, #00ff00, #0000ff"
          @change="updateComparisonColors"
          clearable
        />
        <color-comparison :colors="comparisonColors" />
      </v-tab-item>

      <v-tab-item>
        <!-- Contrast Checker -->
        <contrast-ratio-checker />
      </v-tab-item>

      <v-tab-item>
        <!-- Color Conversion -->
        <color-conversion />
      </v-tab-item>

      <v-tab-item>
        <!-- Visual Stress Test -->
        <visual-stress-tester />
      </v-tab-item>

      <v-tab-item>
        <!-- Gradient Generator -->
        <gradient-generator />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ColorBlindnessSimulator from '../components/ColorBlindnessSimulator.vue';
import ColorComparison from '../components/ColorComparison.vue';
import ContrastRatioChecker from '../components/ContrastRatioChecker.vue';
import ColorConversion from '../components/ColorConversion.vue';
import VisualStressTester from '../components/VisualStressTester.vue';
import GradientGenerator from '../components/GradientGenerator.vue';

const paletteColors = ref(['#ff0000', '#00ff00', '#0000ff']);
const comparisonInput = ref('');
const comparisonColors = ref<string[]>(['#ff0000', '#00ff00', '#0000ff']);
const activeTab = ref(0);

function getTextColor(bgColor: string): string {
  const c = bgColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 186 ? '#000000' : '#ffffff';
}

function updateComparisonColors() {
  const colors = comparisonInput.value
    .split(',')
    .map(c => c.trim())
    .filter(c => /^#([0-9A-F]{3}){1,2}$/i.test(c));
  comparisonColors.value = colors.length ? colors : ['#000000', '#ffffff'];
}
</script>
