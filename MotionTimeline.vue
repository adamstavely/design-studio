<template>
  <div class="motion-timeline">
    <h2>Motion Timeline Preview</h2>
    <div v-for="timeline in timelines" :key="timeline.id" class="timeline">
      <h3>{{ timeline.id }}</h3>
      <p>Sequence: {{ timeline.sequence.join(' → ') }}</p>
      <p>Duration: {{ timeline.duration }}ms</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const timelines = ref([])

onMounted(async () => {
  const { data } = await axios.get('/api/motion/timeline')
  timelines.value = data
})
</script>

<style scoped>
.motion-timeline { padding: 1rem; }
.timeline { margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
</style>