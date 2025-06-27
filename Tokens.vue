<template>
  <v-card>
    <v-card-title>Design Tokens</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="token in tokens" :key="token.id" @click="selectToken(token)">
          <v-list-item-content>
            <v-list-item-title>{{ token.name }} ({{ token.type }})</v-list-item-title>
            <v-list-item-subtitle>{{ token.value }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="editToken(token)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click.stop="confirmDelete(token)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <v-form ref="tokenForm" v-model="valid" lazy-validation>
        <v-text-field
          v-model="currentToken.name"
          :rules="[v => !!v || 'Name is required']"
          label="Token Name"
          required
        />
        <v-select
          v-model="currentToken.type"
          :items="tokenTypes"
          label="Token Type"
          required
        />
        <v-text-field
          v-model="currentToken.value"
          :rules="[v => !!v || 'Value is required']"
          label="Token Value"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :loading="loading" @click="saveToken" :disabled="!valid">
        {{ isEditing ? 'Update Token' : 'Create Token' }}
      </v-btn>
      <v-btn text @click="resetForm">Reset</v-btn>
    </v-card-actions>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this token?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="deleteToken">Delete</v-btn>
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
import useTokenService from '../composables/useTokenService';

const tokenService = useTokenService();

const tokens = ref([]);
const tokenTypes = ['color', 'spacing', 'typography', 'motion'];

const currentToken = reactive({
  id: '',
  name: '',
  type: '',
  value: '',
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

const tokenForm = ref();

async function loadTokens() {
  loading.value = true;
  try {
    tokens.value = await tokenService.listTokens();
  } catch (e) {
    showSnackbar('Failed to load tokens', 'error');
  } finally {
    loading.value = false;
  }
}

function selectToken(token: any) {
  Object.assign(currentToken, token);
  isEditing.value = true;
  valid.value = true;
}

function editToken(token: any) {
  selectToken(token);
}

function resetForm() {
  currentToken.id = '';
  currentToken.name = '';
  currentToken.type = '';
  currentToken.value = '';
  valid.value = false;
  isEditing.value = false;
}

async function saveToken() {
  if (!tokenForm.value.validate()) return;

  loading.value = true;
  try {
    if (isEditing.value) {
      await tokenService.updateToken(currentToken.id, {
        name: currentToken.name,
        type: currentToken.type,
        value: currentToken.value,
      });
      showSnackbar('Token updated successfully');
    } else {
      const created = await tokenService.createToken({
        name: currentToken.name,
        type: currentToken.type,
        value: currentToken.value,
      });
      currentToken.id = created.id;
      isEditing.value = true;
      showSnackbar('Token created successfully');
      await loadTokens();
    }
  } catch (e) {
    showSnackbar(e.message || 'Failed to save token', 'error');
  } finally {
    loading.value = false;
  }
}

function confirmDelete(token: any) {
  selectToken(token);
  deleteDialog.value = true;
}

async function deleteToken() {
  loading.value = true;
  try {
    await tokenService.deleteToken(currentToken.id);
    showSnackbar('Token deleted successfully');
    resetForm();
    await loadTokens();
  } catch (e) {
    showSnackbar(e.message || 'Failed to delete token', 'error');
  } finally {
    loading.value = false;
    deleteDialog.value = false;
  }
}

function showSnackbar(text: string, color: string = 'success') {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
}

onMounted(() => {
  loadTokens();
});
</script>