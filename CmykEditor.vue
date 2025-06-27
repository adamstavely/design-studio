<template>
  <v-card class="pa-4">
    <v-card-title>CMYK Color Editor</v-card-title>
    <v-card-text>
      <v-slider
        v-model="c"
        label="Cyan"
        min="0"
        max="1"
        step="0.01"
        class="my-3"
      />
      <v-slider
        v-model="m"
        label="Magenta"
        min="0"
        max="1"
        step="0.01"
        class="my-3"
      />
      <v-slider
        v-model="y"
        label="Yellow"
        min="0"
        max="1"
        step="0.01"
        class="my-3"
      />
      <v-slider
        v-model="k"
        label="Black (Key)"
        min="0"
        max="1"
        step="0.01"
        class="my-3"
      />
      <v-text-field
        label="Hex Color"
        v-model="hex"
        @input="updateFromHex(hex)"
      />
      <div
        class="color-preview mt-4"
        :style="{ backgroundColor: hex, height: '60px', borderRadius: '6px' }"
      ></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import useCmyk from '../composables/useCmyk';

const { c, m, y, k, hex, updateFromCmyk, updateFromHex } = useCmyk();

watch([c, m, y, k], () => {
  updateFromCmyk(c.value, m.value, y.value, k.value);
});
</script>

<style scoped>
.color-preview {
  border: 1px solid #ccc;
}
</style>