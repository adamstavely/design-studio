<template>
  <v-card class="pa-4">
    <v-card-title>Gradient Generator</v-card-title>
    <v-card-text>
      <v-row class="mb-4" align="center" justify="space-between">
        <v-col cols="12" md="6">
          <v-select
            v-model="direction"
            :items="directions"
            label="Gradient Direction"
            dense
          />
        </v-col>
        <v-col cols="12" md="6" class="text-right">
          <v-btn color="primary" @click="addStop" :disabled="stops.length >= maxStops">
            Add Color Stop
          </v-btn>
        </v-col>
      </v-row>

      <div v-for="(stop, index) in stops" :key="stop.id" class="d-flex align-center mb-3">
        <v-color-picker
          v-model="stop.color"
          hide-canvas
          hide-inputs
          hide-mode-switch
          flat
          dense
          width="150"
        />
        <v-slider
          v-model="stop.position"
          :max="100"
          class="mx-4"
          step="1"
          label="Position (%)"
          style="flex:1"
        />
        <v-btn icon @click="removeStop(index)" :disabled="stops.length <= minStops">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <div class="gradient-preview" :style="{ background: gradientCSS }"></div>

      <v-textarea
        label="CSS Gradient"
        :value="gradientCSS"
        readonly
        rows="3"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const maxStops = 8;
const minStops = 2;

const directions = [
  'to right',
  'to left',
  'to bottom',
  'to top',
  '45deg',
  '135deg',
  '225deg',
  '315deg',
];

const direction = ref('to right');

const stops = ref<ColorStop[]>([
  { id: uuidv4(), color: '#ff0000', position: 0 },
  { id: uuidv4(), color: '#0000ff', position: 100 },
]);

function addStop() {
  if (stops.value.length < maxStops) {
    stops.value.push({
      id: uuidv4(),
      color: '#ffffff',
      position: 50,
    });
  }
}

function removeStop(index: number) {
  if (stops.value.length > minStops) {
    stops.value.splice(index, 1);
  }
}

const gradientCSS = computed(() => {
  const sortedStops = [...stops.value].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');
  return `linear-gradient(${direction.value}, ${stopsStr})`;
});
</script>

<style scoped>
.gradient-preview {
  width: 100%;
  height: 100px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 1rem;
}
</style>