<template>
  <v-card class="pa-4">
    <v-text-field
      v-model="searchTerm"
      label="Search Pantone Colors"
      @input="search"
      clearable
    />
    <v-list height="300" style="overflow-y:auto;">
      <v-list-item
        v-for="color in searchResults"
        :key="color.code"
        @click="selectColor(color)"
        class="pantone-item"
      >
        <v-list-item-avatar :style="{ backgroundColor: color.hex }"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ color.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ color.code }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="searchResults.length === 0">No results</v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import usePantone from '../composables/usePantone';

const searchTerm = ref('');
const { searchResults, searchPantone } = usePantone();

const emit = defineEmits(['select']);

watch(searchTerm, (val) => {
  if (val.length > 1) {
    searchPantone(val);
  } else {
    searchResults.value = [];
  }
});

function selectColor(color: any) {
  // Emit selected color to parent
  emit('select', color);
}
</script>

<style scoped>
.pantone-item {
  cursor: pointer;
}
.pantone-item:hover {
  background-color: #f0f0f0;
}
</style>