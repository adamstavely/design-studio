<template>
  <v-card class="pa-4">
    <v-card-title>Bezier Curve Interpolator</v-card-title>
    <v-card-text>
      <canvas
        ref="canvas"
        width="400"
        height="150"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mousemove="onDrag"
        style="border:1px solid #ccc; cursor: pointer;"
      ></canvas>
      <div class="mt-4">
        <v-btn @click="reset">Reset Curve</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'curveChanged', values: number[]): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const controlPoints = ref([
  { x: 50, y: 100 },
  { x: 150, y: 50 },
  { x: 250, y: 50 },
  { x: 350, y: 100 },
]);

const draggingPoint = ref<number | null>(null);

function sampleBezier(t: number): number {
  // Cubic Bezier formula y-component normalized between 0 and 1
  const [p0, p1, p2, p3] = controlPoints.value;
  const y =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * t * t * p2.y +
    Math.pow(t, 3) * p3.y;
  // Normalize y (canvas y=0 top, y=150 bottom)
  return 1 - y / 150;
}

function emitCurveValues() {
  const samples = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    samples.push(sampleBezier(t));
  }
  emit('curveChanged', samples);
}

function drawCurve() {
  if (!ctx.value || !canvas.value) return;
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Draw control lines
  ctx.value.strokeStyle = '#aaa';
  ctx.value.lineWidth = 1;
  ctx.value.beginPath();
  ctx.value.moveTo(controlPoints.value[0].x, controlPoints.value[0].y);
  for (let i = 1; i < controlPoints.value.length; i++) {
    ctx.value.lineTo(controlPoints.value[i].x, controlPoints.value[i].y);
  }
  ctx.value.stroke();

  // Draw Bezier curve
  ctx.value.strokeStyle = '#3f51b5';
  ctx.value.lineWidth = 3;
  ctx.value.beginPath();
  ctx.value.moveTo(controlPoints.value[0].x, controlPoints.value[0].y);
  ctx.value.bezierCurveTo(
    controlPoints.value[1].x,
    controlPoints.value[1].y,
    controlPoints.value[2].x,
    controlPoints.value[2].y,
    controlPoints.value[3].x,
    controlPoints.value[3].y
  );
  ctx.value.stroke();

  // Draw control points
  controlPoints.value.forEach((pt, idx) => {
    ctx.value.fillStyle = '#ff4081';
    ctx.value.beginPath();
    ctx.value.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
    ctx.value.fill();
  });

  // Emit updated curve samples
  emitCurveValues();
}

function getMousePos(evt: MouseEvent) {
  if (!canvas.value) return { x: 0, y: 0 };
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function startDrag(evt: MouseEvent) {
  const pos = getMousePos(evt);
  controlPoints.value.forEach((pt, idx) => {
    const dx = pt.x - pos.x;
    const dy = pt.y - pos.y;
    if (dx * dx + dy * dy < 36) {
      draggingPoint.value = idx;
    }
  });
}

function stopDrag() {
  draggingPoint.value = null;
}

function onDrag(evt: MouseEvent) {
  if (draggingPoint.value === null) return;
  const pos = getMousePos(evt);
  // Clamp within canvas
  const x = Math.min(Math.max(0, pos.x), 400);
  const y = Math.min(Math.max(0, pos.y), 150);
  // Restrict first and last points to horizontal line
  if (draggingPoint.value === 0) {
    controlPoints.value[0].x = x;
    controlPoints.value[0].y = 100;
  } else if (draggingPoint.value === controlPoints.value.length - 1) {
    controlPoints.value[controlPoints.value.length - 1].x = x;
    controlPoints.value[controlPoints.value.length - 1].y = 100;
  } else {
    controlPoints.value[draggingPoint.value].x = x;
    controlPoints.value[draggingPoint.value].y = y;
  }
  drawCurve();
}

function reset() {
  controlPoints.value = [
    { x: 50, y: 100 },
    { x: 150, y: 50 },
    { x: 250, y: 50 },
    { x: 350, y: 100 },
  ];
  drawCurve();
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    drawCurve();
  }
});

watch(controlPoints, () => {
  drawCurve();
}, { deep: true });
</script>
