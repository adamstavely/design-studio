<template>
  <v-card class="pa-3 mt-4">
    <v-card-title>Ramp Curve Editor</v-card-title>
    <v-card-text>
      <svg
        width="100%"
        height="100"
        viewBox="0 0 400 100"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mousemove="onDrag"
      >
        <path
          :d="pathD"
          stroke="#2196f3"
          stroke-width="3"
          fill="none"
        />
        <circle
          v-for="(pt, i) in points"
          :key="i"
          :cx="pt.x"
          :cy="pt.y"
          r="8"
          fill="#2196f3"
          stroke="#fff"
          stroke-width="2"
          @mousedown.prevent="selectPoint(i)"
          :class="{ dragging: draggingIndex === i }"
        />
      </svg>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

interface Point {
  x: number;
  y: number;
}

const points = reactive<Point[]>([
  { x: 0, y: 100 },
  { x: 133, y: 50 },
  { x: 267, y: 50 },
  { x: 400, y: 0 },
]);

const draggingIndex = ref<number | null>(null);

const pathD = computed(() => {
  const p = points;
  return `M${p[0].x},${p[0].y} C${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[3].x},${p[3].y}`;
});

function selectPoint(i: number) {
  draggingIndex.value = i;
}

function startDrag(event: MouseEvent) {
  // noop: handled by circle mousedown
}

function stopDrag() {
  draggingIndex.value = null;
}

function onDrag(event: MouseEvent) {
  if (draggingIndex.value === null) return;
  const svg = event.currentTarget as SVGSVGElement;
  const rect = svg.getBoundingClientRect();
  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
  points[draggingIndex.value].x = x;
  points[draggingIndex.value].y = y;
}
</script>

<style scoped>
circle.dragging {
  fill: #f44336;
}
</style>