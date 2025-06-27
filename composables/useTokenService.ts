import { ref } from 'vue';
import axios from 'axios';

export default function useTokenService() {
  const loading = ref(false);
  const error = ref(null);

  async function listTokens() {
    loading.value = true;
    try {
      const response = await axios.get('/api/tokens');
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createToken(data: any) {
    loading.value = true;
    try {
      const response = await axios.post('/api/tokens', data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateToken(id: string, data: any) {
    loading.value = true;
    try {
      const response = await axios.put(`/api/tokens/${id}`, data);
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteToken(id: string) {
    loading.value = true;
    try {
      await axios.delete(`/api/tokens/${id}`);
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
    listTokens,
    createToken,
    updateToken,
    deleteToken,
  };
}