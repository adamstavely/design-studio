<template>
  <v-card>
    <v-card-title>Migration Plans</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="plan in plans"
          :key="plan.id"
          @click="selectPlan(plan)"
          :class="{ 'active-plan': plan.id === currentPlan.id }"
        >
          <v-list-item-content>
            <v-list-item-title>{{ plan.name }}</v-list-item-title>
            <v-list-item-subtitle>Status: {{ plan.status }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text @click.stop="applyPlan(plan)">Apply</v-btn>
            <v-btn text color="error" @click.stop="rollbackPlan(plan)" :disabled="!plan.canRollback">Rollback</v-btn>
            <v-btn icon @click.stop="deletePlan(plan)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <v-form ref="planForm" v-model="valid" lazy-validation>
        <v-text-field
          v-model="newPlan.name"
          label="Plan Name"
          :rules="[v => !!v || 'Name is required']"
          required
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" :loading="loading" @click="createPlan" :disabled="!valid">Create Plan</v-btn>
      <v-btn text @click="resetForm">Reset</v-btn>
    </v-card-actions>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const plans = ref([]);
const currentPlan = ref(null);
const newPlan = reactive({
  name: '',
});
const valid = ref(false);
const loading = ref(false);
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});
const planForm = ref();

async function loadPlans() {
  loading.value = true;
  try {
    const response = await axios.get('/api/migration/plans');
    plans.value = response.data;
  } catch (e) {
    showSnackbar('Failed to load migration plans', 'error');
  } finally {
    loading.value = false;
  }
}

function selectPlan(plan) {
  currentPlan.value = plan;
}

function resetForm() {
  newPlan.name = '';
  valid.value = false;
}

async function createPlan() {
  if (!planForm.value.validate()) return;

  loading.value = true;
  try {
    await axios.post('/api/migration/plans', { name: newPlan.name });
    showSnackbar('Migration plan created');
    resetForm();
    await loadPlans();
  } catch (e) {
    showSnackbar('Failed to create migration plan', 'error');
  } finally {
    loading.value = false;
  }
}

async function applyPlan(plan) {
  loading.value = true;
  try {
    await axios.post(`/api/migration/plans/${plan.id}/apply`);
    showSnackbar('Migration plan applied');
    await loadPlans();
  } catch (e) {
    showSnackbar('Failed to apply migration plan', 'error');
  } finally {
    loading.value = false;
  }
}

async function rollbackPlan(plan) {
  loading.value = true;
  try {
    await axios.post(`/api/migration/plans/${plan.id}/rollback`);
    showSnackbar('Migration plan rolled back');
    await loadPlans();
  } catch (e) {
    showSnackbar('Failed to rollback migration plan', 'error');
  } finally {
    loading.value = false;
  }
}

async function deletePlan(plan) {
  loading.value = true;
  try {
    await axios.delete(`/api/migration/plans/${plan.id}`);
    showSnackbar('Migration plan deleted');
    await loadPlans();
  } catch (e) {
    showSnackbar('Failed to delete migration plan', 'error');
  } finally {
    loading.value = false;
  }
}

function showSnackbar(text, color = 'success') {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
}

onMounted(() => {
  loadPlans();
});
</script>

<style scoped>
.active-plan {
  background-color: #f5f5f5;
}
</style>