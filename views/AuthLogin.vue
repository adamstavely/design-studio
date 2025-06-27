<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="credentials.email"
                label="Email"
                :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'Must be a valid email']"
                required
              />
              <v-text-field
                v-model="credentials.password"
                label="Password"
                type="password"
                :rules="[v => !!v || 'Password is required']"
                required
              />
              <v-btn :loading="loading" color="primary" @click="login" :disabled="!valid">Login</v-btn>
            </v-form>
          </v-card-text>
          <v-snackbar v-model="snackbar.show" :color="snackbar.color">
            {{ snackbar.text }}
            <v-btn text @click="snackbar.show = false">Close</v-btn>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const credentials = reactive({
  email: '',
  password: '',
});

const valid = ref(false);
const loading = ref(false);
const snackbar = reactive({
  show: false,
  text: '',
  color: 'error',
});
const loginForm = ref();

async function login() {
  if (!loginForm.value.validate()) return;

  loading.value = true;
  try {
    const response = await axios.post('/api/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    snackbar.color = 'success';
    snackbar.text = 'Login successful';
    snackbar.show = true;
    router.push('/');
  } catch (e) {
    snackbar.color = 'error';
    snackbar.text = 'Login failed: ' + (e.response?.data?.message || e.message);
    snackbar.show = true;
  } finally {
    loading.value = false;
  }
}
</script>