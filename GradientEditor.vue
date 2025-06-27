<template>
  <v-card class="pa-4">
    <v-card-title>Gradient Editor</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="gradientType"
            :items="['linear', 'radial', 'conic']"
            label="Gradient Type"
            dense
          />
          <v-text-field
            v-if="gradientType === 'linear'"
            v-model.number="linearAngle"
            label="Linear Angle (degrees)"
            type="number"
            min="0"
            max="360"
            dense
          />
        </v-col>
      </v-row>

      <div
        ref="gradientBar"
        class="gradient-bar"
        @click="addStop($event)"
      >
        <div
          v-for="(stop, index) in stops"
          :key="stop.id"
          class="stop-handle"
          :style="{
            left: stop.position * 100 + '%',
            backgroundColor: stop.color.hex,
          }"
          @mousedown="startDrag(index, $event)"
          tabindex="0"
        >
          <input
            type="color"
            v-model="stop.color.hex"
            @input="onStopColorInput(index, 'hex', $event.target.value)"
            class="color-picker"
          />
        </div>
      </div>

      <v-row class="mt-4" dense>
        <v-col cols="12" v-for="(stop, index) in stops" :key="'stop-editor-' + stop.id">
          <v-select
            v-model="stop.inputMode"
            :items="['HEX', 'RGB', 'CMYK']"
            label="Input Mode"
            dense
            style="max-width: 120px;"
          />
          <template v-if="stop.inputMode === 'HEX'">
            <v-text-field
              v-model="stop.color.hex"
              label="HEX"
              dense
              maxlength="7"
              @input="onStopColorInput(index, 'hex', stop.color.hex)"
              style="max-width: 140px;"
            />
          </template>
          <template v-else-if="stop.inputMode === 'RGB'">
            <v-text-field
              v-for="ch in ['r','g','b']"
              :key="ch"
              v-model.number="stop.color.rgb[ch]"
              label="RGB {{ ch.toUpperCase() }}"
              type="number"
              min="0"
              max="255"
              dense
              style="max-width: 80px; display: inline-block; margin-right: 8px;"
              @input="onStopColorInput(index, 'rgb', stop.color.rgb)"
            />
          </template>
          <template v-else-if="stop.inputMode === 'CMYK'">
            <v-text-field
              v-for="ch in ['c','m','y','k']"
              :key="ch"
              v-model.number="stop.color.cmyk[ch]"
              label="CMYK {{ ch.toUpperCase() }}"
              type="number"
              min="0"
              max="100"
              dense
              style="max-width: 80px; display: inline-block; margin-right: 8px;"
              @input="onStopColorInput(index, 'cmyk', stop.color.cmyk)"
            />
          </template>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12">
          <v-switch
            v-model="rampLocked"
            label="Lock Ramp to Curve"
            class="mb-4"
            @change="applyCurveToStops"
          />
          <curve-editor
            v-if="rampLocked"
            v-model:points="curvePoints"
            @update="applyCurveToStops"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12">
          <v-btn color="error" @click="removeSelectedStop" :disabled="selectedStop === null">Remove Selected Stop</v-btn>
          <v-btn color="primary" class="ml-2" @click="exportGradient">Export Gradient</v-btn>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12">
          <div
            class="gradient-preview"
            :style="{ background: cssGradient }"
          ></div>
          <pre>{{ cssGradient }}</pre>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import CurveEditor from './CurveEditor.vue';

interface Stop {
  id: number;
  position: number; // 0 to 1
  inputMode: 'HEX' | 'RGB' | 'CMYK';
  color: {
    hex: string;
    rgb: { r: number; g: number; b: number };
    cmyk: { c: number; m: number; y: number; k: number };
  };
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.substr(1,2),16);
  const g = parseInt(hex.substr(3,2),16);
  const b = parseInt(hex.substr(5,2),16);
  return {r, g, b};
}

function rgbToHex(rgb: {r:number,g:number,b:number}) {
  return '#' + [rgb.r, rgb.g, rgb.b].map(x=> {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToCmyk(rgb: {r:number,g:number,b:number}) {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;
  let k = 1 - Math.max(r,g,b);
  if(k === 1) return {c:0,m:0,y:0,k:100};
  let c = (1-r-k) / (1-k);
  let m = (1-g-k) / (1-k);
  let y = (1-b-k) / (1-k);
  return {c: Math.round(c*100), m: Math.round(m*100), y: Math.round(y*100), k: Math.round(k*100)};
}

function cmykToRgb(cmyk: {c:number,m:number,y:number,k:number}) {
  let c = cmyk.c / 100;
  let m = cmyk.m / 100;
  let y = cmyk.y / 100;
  let k = cmyk.k / 100;
  let r = Math.round(255 * (1-c) * (1-k));
  let g = Math.round(255 * (1-m) * (1-k));
  let b = Math.round(255 * (1-y) * (1-k));
  return {r, g, b};
}

const gradientType = ref<'linear' | 'radial' | 'conic'>('linear');
const linearAngle = ref(90);

const stops = reactive<Stop[]>([
  {
    id: 1,
    position: 0,
    inputMode: 'HEX',
    color: {
      hex: '#ff0000',
      rgb: {r:255,g:0,b:0},
      cmyk: {c:0,m:100,y:100,k:0}
    }
  },
  {
    id: 2,
    position: 1,
    inputMode: 'HEX',
    color: {
      hex: '#0000ff',
      rgb: {r:0,g:0,b:255},
      cmyk: {c:100,m:100,y:0,k:0}
    }
  }
]);

const selectedStop = ref<number | null>(null);
const draggingIndex = ref<number | null>(null);
const gradientBar = ref<HTMLElement | null>(null);

const rampLocked = ref(false);
const curvePoints = ref([
  { x: 0, y: 100 },
  { x: 133, y: 50 },
  { x: 267, y: 50 },
  { x: 400, y: 0 },
]);

function updateStopColor(index: number, mode: 'hex' | 'rgb' | 'cmyk', value: any) {
  const stop = stops[index];
  if(mode === 'hex') {
    stop.color.hex = value;
    stop.color.rgb = hexToRgb(value);
    stop.color.cmyk = rgbToCmyk(stop.color.rgb);
  } else if(mode === 'rgb') {
    stop.color.rgb = value;
    stop.color.hex = rgbToHex(value);
    stop.color.cmyk = rgbToCmyk(value);
  } else if(mode === 'cmyk') {
    stop.color.cmyk = value;
    stop.color.rgb = cmykToRgb(value);
    stop.color.hex = rgbToHex(stop.color.rgb);
  }
}

function onStopColorInput(index: number, mode: 'hex' | 'rgb' | 'cmyk', value: any) {
  updateStopColor(index, mode, value);
}

function addStop(event: MouseEvent) {
  if(!gradientBar.value) return;
  const rect = gradientBar.value.getBoundingClientRect();
  const pos = (event.clientX - rect.left) / rect.width;
  const newStop: Stop = {
    id: Date.now(),
    position: Math.min(Math.max(pos, 0), 1),
    inputMode: 'HEX',
    color: {
      hex: '#ffffff',
      rgb: {r:255,g:255,b:255},
      cmyk: {c:0,m:0,y:0,k:0}
    }
  };
  stops.push(newStop);
  sortStops();
}

function removeSelectedStop() {
  if(selectedStop.value === null) return;
  const idx = stops.findIndex(s => s.id === selectedStop.value);
  if(idx !== -1) {
    stops.splice(idx,1);
    selectedStop.value = null;
  }
}

function sortStops() {
  stops.sort((a,b) => a.position - b.position);
}

function startDrag(index: number, event: MouseEvent) {
  draggingIndex.value = index;
  event.preventDefault();
}

function onMouseMove(event: MouseEvent) {
  if(draggingIndex.value === null || !gradientBar.value) return;
  const rect = gradientBar.value.getBoundingClientRect();
  let pos = (event.clientX - rect.left) / rect.width;
  pos = Math.min(Math.max(pos, 0), 1);
  stops[draggingIndex.value].position = pos;
  sortStops();
}

function onMouseUp() {
  draggingIndex.value = null;
}

const cssGradient = computed(() => {
  if(stops.length === 0) return '';
  const stopStr = stops
    .map(s => `${s.color.hex} ${(s.position * 100).toFixed(1)}%`)
    .join(', ');
  if(gradientType.value === 'linear') {
    return `linear-gradient(${linearAngle.value}deg, ${stopStr})`;
  } else if(gradientType.value === 'radial') {
    return `radial-gradient(circle, ${stopStr})`;
  } else {
    return `conic-gradient(${stopStr})`;
  }
});

function applyCurveToStops() {
  if(!rampLocked.value) return;
  const maxX = 400;
  stops.forEach(stop => {
    const px = stop.position * maxX;
    let y = 0;
    for(let i=0; i<curvePoints.value.length-1; i++) {
      const p1 = curvePoints.value[i];
      const p2 = curvePoints.value[i+1];
      if(px >= p1.x && px <= p2.x) {
        const t = (px - p1.x) / (p2.x - p1.x);
        y = p1.y + t * (p2.y - p1.y);
        break;
      }
    }
    stop.position = 1 - y / 100;
  });
  sortStops();
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

function exportGradient() {
  const data = {
    type: gradientType.value,
    angle: linearAngle.value,
    stops: stops.map(s => ({
      position: s.position,
      color: s.color,
      inputMode: s.inputMode
    })),
    css: cssGradient.value,
    rampLocked: rampLocked.value,
    curvePoints: curvePoints.value,
  };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gradient.json';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.gradient-bar {
  position: relative;
  width: 100%;
  height: 30px;
  border-radius: 6px;
  background: linear-gradient(90deg, red 0%, blue 100%);
  cursor: pointer;
  margin-bottom: 16px;
}
.stop-handle {
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  transform: translate(-50%, -50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.color-picker {
  opacity: 0;
  position: absolute;
  width: 18px;
  height: 18px;
  top: 0;
  left: 0;
  cursor: pointer;
}
.gradient-preview {
  height: 60px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>