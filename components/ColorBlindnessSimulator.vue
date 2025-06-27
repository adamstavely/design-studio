<template>
  <v-card class="pa-4">
    <v-card-title>Color Blindness Simulator</v-card-title>
    <v-card-text>
      <v-select
        v-model="simulationType"
        :items="simulationTypes"
        label="Simulation Type"
        dense
      />
      <div class="simulation-preview" :style="{ filter: cssFilter }">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const simulationTypes = [
  { text: 'None', value: 'none' },
  { text: 'Protanopia', value: 'protanopia' },
  { text: 'Deuteranopia', value: 'deuteranopia' },
  { text: 'Tritanopia', value: 'tritanopia' },
  { text: 'Achromatopsia', value: 'achromatopsia' },
];

const simulationType = ref('none');

const cssFilter = computed(() => {
  switch (simulationType.value) {
    case 'protanopia':
      return 'url(#protanopia)'; // Will define SVG filter in parent or global scope
    case 'deuteranopia':
      return 'url(#deuteranopia)';
    case 'tritanopia':
      return 'url(#tritanopia)';
    case 'achromatopsia':
      return 'grayscale(100%)';
    default:
      return 'none';
  }
});
</script>

<style scoped>
.simulation-preview {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>