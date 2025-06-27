<template>
  <v-card class="pa-4">
    <v-card-title>Export Tokens</v-card-title>
    <v-card-text>
      <v-select
        v-model="format"
        :items="formats"
        label="Export Format"
        dense
      />
      <v-checkbox
        v-model="includePantone"
        label="Include Pantone Data"
      />
      <v-checkbox
        v-model="includeCmyk"
        label="Include CMYK Data"
      />
      <v-btn color="primary" class="mt-4" @click="exportTokens">Export</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formats = ['JSON', 'CSS Variables', 'SCSS', 'XML'];
const format = ref('JSON');
const includePantone = ref(true);
const includeCmyk = ref(true);

const tokens = ref([
  // This should be passed in or fetched in real app
  {
    name: 'primary-color',
    value: '#ff0000',
    pantone: { name: 'PANTONE Red', code: '186 C' },
    cmyk: { c: 0, m: 100, y: 81, k: 4 }
  },
]);

function exportTokens() {
  let content = '';
  switch (format.value) {
    case 'JSON':
      content = JSON.stringify(tokens.value.map(t => {
        const base = { name: t.name, value: t.value };
        if (includePantone.value) base['pantone'] = t.pantone;
        if (includeCmyk.value) base['cmyk'] = t.cmyk;
        return base;
      }), null, 2);
      downloadFile('tokens.json', content, 'application/json');
      break;
    case 'CSS Variables':
      content = tokens.value.map(t => {
        let line = `--${t.name}: ${t.value};`;
        if (includePantone.value && t.pantone) {
          line += ` /* Pantone: ${t.pantone.name} (${t.pantone.code}) */`;
        }
        return line;
      }).join('\n');
      downloadFile('tokens.css', content, 'text/css');
      break;
    case 'SCSS':
      content = tokens.value.map(t => {
        let line = `$${t.name}: ${t.value};`;
        if (includePantone.value && t.pantone) {
          line += ` // Pantone: ${t.pantone.name} (${t.pantone.code})`;
        }
        return line;
      }).join('\n');
      downloadFile('tokens.scss', content, 'text/x-scss');
      break;
    case 'XML':
      content = `<tokens>\n${tokens.value.map(t => `
  <token name="${t.name}" value="${t.value}">
    ${includePantone.value && t.pantone ? `<pantone name="${t.pantone.name}" code="${t.pantone.code}"/>` : ''}
    ${includeCmyk.value && t.cmyk ? `<cmyk c="${t.cmyk.c}" m="${t.cmyk.m}" y="${t.cmyk.y}" k="${t.cmyk.k}"/>` : ''}
  </token>
`).join('')}\n</tokens>`;
      downloadFile('tokens.xml', content, 'application/xml');
      break;
  }
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
</script>