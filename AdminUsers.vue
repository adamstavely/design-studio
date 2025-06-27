<template>
  <v-card>
    <v-card-title>Users Management</v-card-title>
    <v-card-text>
      <v-data-table :items="users" :headers="headers" class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="confirmDeleteUser(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="editDialog" max-width="600px">
        <v-card>
          <v-card-title>{{ isEditing ? 'Edit User' : 'Add User' }}</v-card-title>
          <v-card-text>
            <v-form ref="userForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="currentUser.username"
                label="Username"
                :rules="[v => !!v || 'Username is required']"
                required
              />
              <v-text-field
                v-model="currentUser.email"
                label="Email"
                :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'Email must be valid']"
                required
              />
              <v-select
                v-model="currentUser.roles"
                :items="roles"
                label="Roles"
                multiple
                required
                :rules="[v => v.length > 0 || 'At least one role is required']"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :loading="loading" @click="saveUser" :disabled="!valid">Save</v-btn>
            <v-btn text @click="closeDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this user?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="deleteUser">Delete</v-btn>
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

const users = ref([]);
const roles = ref([]);

const headers = [
  { text: 'Username', value: 'username' },
  { text: 'Email', value: 'email' },
  { text: 'Roles', value: 'roles' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const currentUser = reactive({
  id: '',
  username: '',
  email: '',
  roles: [] as string[],
});

const valid = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

const userForm = ref();

async function loadUsers() {
  loading.value = true;
  try {
    users.value = await adminService.listUsers();
  } catch (e) {
    alert('Failed to load users');
  } finally {
    loading.value = false;
  }
}

async function loadRoles() {
  try {
    roles.value = await adminService.listRoles();
  } catch {
    roles.value = [];
  }
}

function editUser(user: any) {
  Object.assign(currentUser, user);
  isEditing.value = true;
  editDialog.value = true;
}

function addUser() {
  currentUser.id = '';
  currentUser.username = '';
  currentUser.email = '';
  currentUser.roles = [];
  isEditing.value = false;
  editDialog.value = true;
}

function closeDialog() {
  editDialog.value = false;
}

async function saveUser() {
  if (!userForm.value.validate()) return;

  loading.value = true;
  try {
    if (isEditing.value) {
      await adminService.updateUser(currentUser.id, currentUser);
      alert('User updated successfully');
    } else {
      await adminService.createUser(currentUser);
      alert('User created successfully');
    }
    editDialog.value = false;
    await loadUsers();
  } catch (e) {
    alert('Failed to save user');
  } finally {
    loading.value = false;
  }
}

function confirmDeleteUser(user: any) {
  Object.assign(currentUser, user);
  deleteDialog.value = true;
}

async function deleteUser() {
  loading.value = true;
  try {
    await adminService.deleteUser(currentUser.id);
    alert('User deleted successfully');
    deleteDialog.value = false;
    await loadUsers();
  } catch (e) {
    alert('Failed to delete user');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>