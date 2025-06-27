<template>
  <v-card class="pa-4">
    <v-card-title>Visual Stress Tester</v-card-title>
    <v-card-text>
      <v-file-input
        label="Upload Image"
        accept="image/*"
        @change="onImageSelected"
        prepend-icon="mdi-image"
      />
      <div v-if="imageUrl" class="image-container">
        <img :src="imageUrl" alt="Uploaded Image" />
        <div
          v-if="overlayActive"
          class="overlay"
          :style="{ backgroundColor: overlayColor, opacity: overlayOpacity }"
        ></div>
      </div>

      <v-switch
        label="Toggle Contrast Overlay"
        v-model="overlayActive"
      />

      <v-slider
        v-model="overlayOpacity"
        :min="0"
        :max="1"
        step="0.05"
        label="Overlay Opacity"
        class="mt-3"
      />

      <v-select
        v-model="overlayColor"
        :items="overlayColors"
        label="Overlay Color"
        class="mt-2"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imageUrl = ref<string | null>(null);
const overlayActive = ref(false);
const overlayOpacity = ref(0.5);
const overlayColor = ref('rgba(255, 0, 0, 0.5)');
const overlayColors = [
  'rgba(255, 0, 0, 0.5)',   // Red
  'rgba(0, 255, 0, 0.5)',   // Green
  'rgba(0, 0, 255, 0.5)',   // Blue
  'rgba(255, 255, 0, 0.5)', // Yellow
];

function onImageSelected(fileList: FileList | File[] | null) {
  if (!fileList || fileList.length === 0) {
    imageUrl.value = null;
    return;
  }
  const file = fileList[0];
  imageUrl.value = URL.createObjectURL(file);
}
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 400px;
  margin-top: 1rem;
}
.image-container img {
  max-width: 100%;
  max-height: 400px;
  display: block;
  border-radius: 6px;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 6px;
}
</style>