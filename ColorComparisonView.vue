<template>
  <v-container>
    <color-comparison :colors="colors" />
    <v-text-field
      v-model="newColor"
      label="Add Color (HEX) to Compare"
      @keydown.enter="addColor"
      clearable
    />
    <v-btn @click="addColor" color="primary" class="mt-2">Add Color</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ColorComparison from '../components/ColorComparison.vue';

const colors = ref<string[]>(['#ff0000', '#00ff00', '#0000ff']);
const newColor = ref('');

function isValidHex(hex: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

function addColor() {
  if (isValidHex(newColor.value) && !colors.value.includes(newColor.value)) {
    colors.value.push(newColor.value);
    newColor.value = '';
  }
}
</script>