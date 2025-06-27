<template>
  <v-list dense nav>
    <v-list-item link :to="{ name: 'ColorComparison' }">
      <v-list-item-title>Color Comparison</v-list-item-title>
    </v-list-item>
    <v-list-item link :to="{ name: 'Gradients' }">
      <v-list-item-title>Gradient Editor</v-list-item-title>
    </v-list-item>
    <!-- other navigation items -->
  </v-list>
</template>

<script setup lang="ts">
// No script changes needed for static links
</script>