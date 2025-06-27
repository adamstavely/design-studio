<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center">
    <v-row>
      <v-col cols="12" class="mb-8 text-center">
        <h1>Leonardo Design Studio</h1>
        <p>Welcome! Select a tool to get started.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-card :to="{ name: 'ThemeEditor' }" class="pa-6" outlined>
          <v-card-title>Theme Editor</v-card-title>
          <v-card-text>Design and manage color themes and ramps.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card :to="{ name: 'DataScales' }" class="pa-6" outlined>
          <v-card-title>Data Scales</v-card-title>
          <v-card-text>Build, test, and preview data scales and color ramps.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card :to="{ name: 'Toolbox' }" class="pa-6" outlined>
          <v-card-title>Toolbox</v-card-title>
          <v-card-text>Access utilities: contrast tester, PDF/SVG export, and more.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Add more navigation cards as needed -->
  </v-container>
</template>
<script setup>
</script>