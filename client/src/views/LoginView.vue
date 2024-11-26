<script setup lang='ts'>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import LoginService from "../services/LoginService";
import type { loginData } from "../models/Authentication";

import Progress from "../components/icons/Progress.vue";

const router = useRouter();
const store = useAuthStore();

const form = ref<loginData>({
  userName: '',
  password: '',
});

const loading = ref(false);
const login = async () => {
  loading.value = true;
  try {
    const response = await LoginService.validateLogin(form.value);
    store.setUserInfo(response.user);
    store.setToken(response.token);
    router.push("/");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <form class="form" @submit.prevent="login">
      <p class="form-title">Sign in to your account</p>
      <div class="input-container">
        <input
          placeholder="Enter username"
          type="name"
          v-model="form.userName"
        />
      </div>
      <div class="input-container">
        <input
          placeholder="Enter password"
          type="password"
          v-model="form.password"
        />
      </div>
      <button :class="loading ? 'load' : 'submit'" type="submit">
        <Progress v-if="loading" />
        <span v-else>Sign in</span>
      </button>
    </form>
  </div>
</template>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.form {
  background-color: #fff;
  display: block;
  padding: 1rem;
  max-width: 350px;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  text-align: center;
  color: #000;
}

.input-container {
  position: relative;
}

.input-container input,
.form button {
  outline: none;
  border: 1px solid #e5e7eb;
  margin: 8px 0;
}

.input-container input {
  background-color: #fff;
  padding: 1rem;
  padding-right: 3rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.input-container span {
  display: grid;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding-left: 1rem;
  padding-right: 1rem;
  place-content: center;
}

.input-container span svg {
  color: #9ca3af;
  width: 1rem;
  height: 1rem;
}

.load {
  background-color: #534afa;
  cursor: pointer;
  display: block;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  width: 100%;
  border-radius: 0.5rem;
  text-transform: uppercase;
}

.submit {
  cursor: pointer;
  display: block;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  width: 100%;
  border-radius: 0.5rem;
  text-transform: uppercase;
}
</style>