<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Gradient Editor</h1>
        <p>Create and edit color gradients with configurable stops and directions.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <gradient-editor />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import GradientEditor from '../components/GradientEditor.vue';
</script>