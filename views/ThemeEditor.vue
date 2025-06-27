
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="themeName" label="Theme Name" />
        <v-chip-group multiple>
          <v-chip
            v-for="color in themeColors"
            :key="color"
            :style="{ backgroundColor: color, color: getTextColor(color) }"
          >
            {{ color }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12" md="6">
        <v-tabs v-model="editMode" background-color="transparent" grow>
          <v-tab>Hex / Harmony</v-tab>
          <v-tab>CMYK Editor</v-tab>
        </v-tabs>

        <v-tabs-items v-model="editMode">
          <v-tab-item>
            <color-harmony
              v-model:baseColor="baseColor"
              @update:harmonyColors="addHarmonyColors"
            />
            <pantone-picker @select="addPantoneColor" class="mt-4" />
          </v-tab-item>
          <v-tab-item>
            <cmyk-editor v-model:hex="selectedColor" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ColorHarmony from '../components/ColorHarmony.vue';
import PantonePicker from '../components/PantonePicker.vue';
import CmykEditor from '../components/CmykEditor.vue';

const themeName = ref('My Theme');
const themeColors = ref<string[]>(['#ff0000', '#00ff00', '#0000ff']);
const baseColor = ref('#ff0000');
const selectedColor = ref('#ff0000');
const editMode = ref(0);

function getTextColor(bgColor: string): string {
  const c = bgColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 186 ? '#000000' : '#ffffff';
}

function addHarmonyColors(colors: string[]) {
  colors.forEach(color => {
    if (!themeColors.value.includes(color)) {
      themeColors.value.push(color);
    }
  });
}

function addPantoneColor(color: any) {
  if (!themeColors.value.includes(color.hex)) {
    themeColors.value.push(color.hex);
  }
}

watch(selectedColor, (newColor) => {
  if (!themeColors.value.includes(newColor)) {
    themeColors.value.push(newColor);
  }
});
</script>
