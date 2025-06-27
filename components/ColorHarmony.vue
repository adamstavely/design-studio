<template>
  <v-card class="pa-4">
    <v-card-title>Color Harmony Generator</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-color-picker v-model="baseColor" mode="hex" hide-canvas hide-inputs></v-color-picker>
        </v-col>
        <v-col cols="12" md="8">
          <v-select
            v-model="harmonyType"
            :items="harmonyTypes"
            label="Harmony Type"
            dense
          ></v-select>
          <v-row class="mt-4" justify="start" align="center">
            <v-col
              v-for="color in harmonyColors"
              :key="color"
              cols="auto"
              class="d-flex flex-column align-center"
            >
              <div :style="{ backgroundColor: color, width: '60px', height: '60px', borderRadius: '4px' }"></div>
              <small class="mt-2">{{ color }}</small>
            </v-col>
          </v-row>
          <v-btn class="mt-4" color="primary" @click="exportHarmony">Export Palette</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import useColorHarmony from '../composables/useColorHarmony';

const baseColor = ref('#ff0000');
const harmonyType = ref('complementary');
const harmonyTypes = ['complementary', 'analogous', 'triadic', 'split-complementary'];

const { harmonyColors, generateHarmony } = useColorHarmony();

watch([baseColor, harmonyType], () => {
  generateHarmony(baseColor.value, harmonyType.value as any);
}, { immediate: true });

function exportHarmony() {
  const dataStr = JSON.stringify(harmonyColors.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'harmony_palette.json';
  a.click();
  URL.revokeObjectURL(url);
}
</script>