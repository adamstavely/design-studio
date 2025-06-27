<template>
  <v-card>
    <v-card-title>Roles Management</v-card-title>
    <v-card-text>
      <v-data-table :items="roles" :headers="headers" class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editRole(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="confirmDeleteRole(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="editDialog" max-width="600px">
        <v-card>
          <v-card-title>{{ isEditing ? 'Edit Role' : 'Add Role' }}</v-card-title>
          <v-card-text>
            <v-form ref="roleForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="currentRole.name"
                label="Role Name"
                :rules="[v => !!v || 'Role name is required']"
                required
              />
              <v-textarea
                v-model="currentRole.description"
                label="Description"
                rows="3"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :loading="loading" @click="saveRole" :disabled="!valid">Save</v-btn>
            <v-btn text @click="closeDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this role?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="deleteRole">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import useAdminService from '../composables/useAdminService';

const adminService = useAdminService();

const roles = ref([]);

const headers = [
  { text: 'Role Name', value: 'name' },
  { text: 'Description', value: 'description' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const currentRole = reactive({
  id: '',
  name: '',
  description: '',
});

const valid = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

const roleForm = ref();

async function loadRoles() {
  loading.value = true;
  try {
    roles.value = await adminService.listRoles();
  } catch (e) {
    alert('Failed to load roles');
  } finally {
    loading.value = false;
  }
}

function editRole(role: any) {
  Object.assign(currentRole, role);
  isEditing.value = true;
  editDialog.value = true;
}

function addRole() {
  currentRole.id = '';
  currentRole.name = '';
  currentRole.description = '';
  isEditing.value = false;
  editDialog.value = true;
}

function closeDialog() {
  editDialog.value = false;
}

async function saveRole() {
  if (!roleForm.value.validate()) return;

  loading.value = true;
  try {
    if (isEditing.value) {
      await adminService.updateRole(currentRole.id, currentRole);
      alert('Role updated successfully');
    } else {
      await adminService.createRole(currentRole);
      alert('Role created successfully');
    }
    editDialog.value = false;
    await loadRoles();
  } catch (e) {
    alert('Failed to save role');
  } finally {
    loading.value = false;
  }
}

function confirmDeleteRole(role: any) {
  Object.assign(currentRole, role);
  deleteDialog.value = true;
}

async function deleteRole() {
  loading.value = true;
  try {
    await adminService.deleteRole(currentRole.id);
    alert('Role deleted successfully');
    deleteDialog.value = false;
    await loadRoles();
  } catch (e) {
    alert('Failed to delete role');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRoles();
});
</script>