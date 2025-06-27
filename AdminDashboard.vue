<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Users</v-card-title>
          <v-card-text>
            <div class="headline">{{ stats.userCount }}</div>
            <v-btn text @click="$router.push('/admin/users')">Manage Users</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Roles</v-card-title>
          <v-card-text>
            <div class="headline">{{ stats.roleCount }}</div>
            <v-btn text @click="$router.push('/admin/roles')">Manage Roles</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Audit Logs</v-card-title>
          <v-card-text>
            <div class="headline">{{ stats.auditCount }}</div>
            <v-btn text @click="$router.push('/admin/audit')">View Audit Logs</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  userCount: 0,
  roleCount: 0,
  auditCount: 0,
});

async function loadStats() {
  try {
    const userRes = await axios.get('/api/admin/users/count');
    const roleRes = await axios.get('/api/admin/roles/count');
    const auditRes = await axios.get('/api/audit/count');

    stats.value.userCount = userRes.data.count || 0;
    stats.value.roleCount = roleRes.data.count || 0;
    stats.value.auditCount = auditRes.data.count || 0;
  } catch (e) {
    console.error('Failed to load admin stats', e);
  }
}

onMounted(() => {
  loadStats();
});
</script>