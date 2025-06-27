import { ref } from 'vue';
import axios from 'axios';

export default function useDataScaleService() {
  const loading = ref(false);
  const error = ref(null);

  async function listScales() {
    loading.value = true;
    try {
      const response = await axios.get('/api/scales');
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createScale(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/scales', data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateScale(id: string, data: any) {
    loading.value = true;
    try {
      const response = await axios.put(`/api/scales/${id}`, data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteScale(id: string) {
    loading.value = true;
    try {
      await axios.delete(`/api/scales/${id}`);
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
    listScales,
    createScale,
    updateScale,
    deleteScale,
  };
}