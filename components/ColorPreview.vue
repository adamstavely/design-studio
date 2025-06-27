<template>
  <v-sheet
    :style="{ backgroundColor: colorString }"
    class="color-preview"
    elevation="2"
  />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  color: {
    type: Object,
    required: true,
  },
});

const colorString = computed(() => {
  try {
    return props.color.toString('hex');
  } catch {
    return '#000000';
  }
});
</script>

<style scoped>
.color-preview {
  width: 100%;
  height: 80px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>