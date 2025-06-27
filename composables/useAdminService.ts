import { ref } from 'vue';
import axios from 'axios';

export default function useAdminService() {
  const loading = ref(false);
  const error = ref(null);

  async function listUsers() {
    loading.value = true;
    try {
      const response = await axios.get('/api/admin/users');
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/admin/users', data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(id: string, data: any) {
    loading.value = true;
    try {
      const response = await axios.put(`/api/admin/users/${id}`, data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id: string) {
    loading.value = true;
    try {
      await axios.delete(`/api/admin/users/${id}`);
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function listRoles() {
    loading.value = true;
    try {
      const response = await axios.get('/api/admin/roles');
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createRole(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/admin/roles', data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateRole(id: string, data: any) {
    loading.value = true;
    try {
      const response = await axios.put(`/api/admin/roles/${id}`, data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRole(id: string) {
    loading.value = true;
    try {
      await axios.delete(`/api/admin/roles/${id}`);
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    listRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}