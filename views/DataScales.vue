<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="scaleName" label="Scale Name" />
        <v-chip-group multiple>
          <v-chip
            v-for="color in scaleColors"
            :key="color"
            :style="{ backgroundColor: color, color: getTextColor(color) }"
          >
            {{ color }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12" md="6">
        <v-tabs v-model="editMode" background-color="transparent" grow>
          <v-tab>Hex</v-tab>
          <v-tab>CMYK</v-tab>
          <v-tab>Bezier Curve</v-tab>
        </v-tabs>

        <v-tabs-items v-model="editMode">
          <v-tab-item>
            <pantone-picker @select="addPantoneColor" />
          </v-tab-item>
          <v-tab-item>
            <cmyk-editor v-model:hex="selectedColor" />
          </v-tab-item>
          <v-tab-item>
            <bezier-interpolator @curveChanged="updateCurve" />
            <v-list dense>
              <v-list-item
                v-for="(value, index) in numericPreview"
                :key="index"
              >
                <v-list-item-content>Step {{ index + 1 }}: {{ value.toFixed(3) }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PantonePicker from '../components/PantonePicker.vue';
import CmykEditor from '../components/CmykEditor.vue';
import BezierInterpolator from '../components/BezierInterpolator.vue';

const scaleName = ref('My Scale');
const scaleColors = ref<string[]>(['#ff0000', '#00ff00', '#0000ff']);
const selectedColor = ref('#ff0000');
const editMode = ref(0);
const numericPreview = ref<number[]>([]);

function getTextColor(bgColor: string): string {
  const c = bgColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 186 ? '#000000' : '#ffffff';
}

function addPantoneColor(color: any) {
  if (!scaleColors.value.includes(color.hex)) {
    scaleColors.value.push(color.hex);
  }
}

function updateCurve(curvePoints: number[]) {
  // Update numeric preview based on curve points
  numericPreview.value = curvePoints;
}
</script>