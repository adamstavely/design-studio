<template>
  <v-card>
    <v-card-title>Policy Management</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="policy in policies"
          :key="policy.id"
          @click="selectPolicy(policy)"
          :class="{ 'active-policy': policy.id === currentPolicy.id }"
        >
          <v-list-item-content>
            <v-list-item-title>{{ policy.name }}</v-list-item-title>
            <v-list-item-subtitle>Status: {{ policy.active ? 'Active' : 'Inactive' }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="editPolicy(policy)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon color="red" @click.stop="confirmDeletePolicy(policy)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <v-form ref="policyForm" v-model="valid" lazy-validation>
        <v-text-field
          v-model="currentPolicy.name"
          label="Policy Name"
          :rules="[v => !!v || 'Name is required']"
          required
        />
        <v-textarea
          v-model="currentPolicy.description"
          label="Description"
          rows="3"
        />
        <v-switch
          v-model="currentPolicy.active"
          label="Active"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" :loading="loading" @click="savePolicy" :disabled="!valid">
        {{ isEditing ? 'Update Policy' : 'Create Policy' }}
      </v-btn>
      <v-btn text @click="resetForm">Reset</v-btn>
    </v-card-actions>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this policy?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="deletePolicy">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const policies = ref([]);
const currentPolicy = reactive({
  id: '',
  name: '',
  description: '',
  active: false,
});
const valid = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const deleteDialog = ref(false);
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});
const policyForm = ref();

async function loadPolicies() {
  loading.value = true;
  try {
    const response = await axios.get('/api/policies');
    policies.value = response.data;
  } catch (e) {
    showSnackbar('Failed to load policies', 'error');
  } finally {
    loading.value = false;
  }
}

function selectPolicy(policy) {
  Object.assign(currentPolicy, policy);
  isEditing.value = true;
}

function resetForm() {
  currentPolicy.id = '';
  currentPolicy.name = '';
  currentPolicy.description = '';
  currentPolicy.active = false;
  valid.value = false;
  isEditing.value = false;
}

async function savePolicy() {
  if (!policyForm.value.validate()) return;

  loading.value = true;
  try {
    if (isEditing.value) {
      await axios.put(`/api/policies/${currentPolicy.id}`, currentPolicy);
      showSnackbar('Policy updated');
    } else {
      await axios.post('/api/policies', currentPolicy);
      showSnackbar('Policy created');
    }
    resetForm();
    await loadPolicies();
  } catch (e) {
    showSnackbar('Failed to save policy', 'error');
  } finally {
    loading.value = false;
  }
}

function editPolicy(policy) {
  selectPolicy(policy);
}

function confirmDeletePolicy(policy) {
  Object.assign(currentPolicy, policy);
  deleteDialog.value = true;
}

async function deletePolicy() {
  loading.value = true;
  try {
    await axios.delete(`/api/policies/${currentPolicy.id}`);
    showSnackbar('Policy deleted');
    deleteDialog.value = false;
    await loadPolicies();
  } catch (e) {
    showSnackbar('Failed to delete policy', 'error');
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
  loadPolicies();
});
</script>

<style scoped>
.active-policy {
  background-color: #f5f5f5;
}
</style>