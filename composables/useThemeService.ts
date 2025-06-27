import { ref } from 'vue';
import axios from 'axios';

export default function useThemeService() {
  const loading = ref(false);
  const error = ref(null);

  async function createTheme(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/themes', data);
      return response.data.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTheme(id: string, data: any) {
    loading.value = true;
    try {
      const response = await axios.put(`/api/themes/${id}`, data);
      return response.data.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTheme(id: string) {
    loading.value = true;
    try {
      await axios.delete(`/api/themes/${id}`);
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getTheme(id: string) {
    loading.value = true;
    try {
      const response = await axios.get(`/api/themes/${id}`);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function generateRamp(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/themes/generate-ramp', data);
      return response.data.ramp;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function checkContrast(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/themes/contrast-check', data);
      return response.data.ratio;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function exportTheme(id: string) {
    loading.value = true;
    try {
      const response = await axios.get(`/api/themes/export/${id}`);
      return response.data.exportData;
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
    createTheme,
    updateTheme,
    deleteTheme,
    getTheme,
    generateRamp,
    checkContrast,
    exportTheme,
  };
}