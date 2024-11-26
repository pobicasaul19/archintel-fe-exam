<script setup lang='ts'>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import LoginService from "../services/LoginService";
import type { loginData } from "../models/Authentication";

import Progress from "../components/icons/Progress.vue";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref<loginData>({
  userName: "",
  password: "",
});
const error = reactive({
  userName: "",
  password: "",
});

const loading = ref(false);
const login = async () => {
  loading.value = true;
  try {
    const response = await LoginService.validateLogin(form.value);
    authStore.setUserInfo({ ...response.user });
    authStore.setToken(response.token);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Login Successful',
      life: 3000,
    });
    router.push("/");
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'An error occurred while logging in.',
      life: 3000
    })
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen">
    <form @submit.prevent="login" class="border p-10 rounded-lg shadow-sm space-y-5">
      <div>
        <label class="block" for="username">Username</label>
        <InputText
          id="username"
          type="name"
          v-model="form.userName"
          class="mt-1 block w-full"
        />
      </div>
      <div>
        <label class="block" for="password">Password</label>
        <Password
          id="password"
          v-model="form.password"
          toggleMask
          class="mt-1"
          :feedback="false"
        />
      </div>
      <div class="flex items-center justify-center">
        <Button
          type="submit"
          :loading="loading"
          :label="loading ? '' : 'Login'"
          style="text-align: left; padding: 15px"
          class="rounded w-[18rem] bg-[#0799c7] hover:bg-gray-900 save !text-center"
        />
      </div>
    </form>
    <Toast />
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