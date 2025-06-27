<template>
  <v-card>
    <v-card-title>Audit Logs</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="filters.user" label="User" @input="loadLogs" />
        </v-col>
        <v-col cols="12" md="4">
          <v-menu ref="dateMenu" v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="filters.date"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="filters.date" no-title scrollable @input="dateMenu = false; loadLogs()" />
          </v-menu>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="filters.action" label="Action" @input="loadLogs" />
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="logs"
        :items-per-page="10"
        :page.sync="page"
        :loading="loading"
        loading-text="Loading audit logs..."
        item-key="id"
      >
        <template #item.timestamp="{ item }">
          {{ new Date(item.timestamp).toLocaleString() }}
        </template>
      </v-data-table>

      <v-btn class="mt-4" color="primary" @click="exportLogs('csv')">Export CSV</v-btn>
      <v-btn class="mt-4 ml-2" color="primary" @click="exportLogs('json')">Export JSON</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import axios from 'axios';

const logs = ref([]);
const loading = ref(false);
const page = ref(1);
const dateMenu = ref(false);

const filters = reactive({
  user: '',
  date: '',
  action: '',
});

const headers = [
  { text: 'Timestamp', value: 'timestamp' },
  { text: 'User', value: 'user' },
  { text: 'Action', value: 'action' },
  { text: 'Details', value: 'details' },
];

async function loadLogs() {
  loading.value = true;
  try {
    const response = await axios.get('/api/audit', { params: { ...filters, page: page.value } });
    logs.value = response.data.items;
  } catch (e) {
    alert('Failed to load audit logs');
  } finally {
    loading.value = false;
  }
}

async function exportLogs(format: string) {
  try {
    const response = await axios.get(`/api/audit/export`, {
      params: { format, ...filters },
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_logs.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (e) {
    alert('Failed to export logs');
  }
}

watch(page, () => loadLogs());

onMounted(() => {
  loadLogs();
});
</script>