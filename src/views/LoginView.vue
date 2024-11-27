<script setup lang='ts'>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import LoginService from "../services/LoginService";
import type { loginData } from "../models/Authentication";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref<loginData>({
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
    console.log(error)
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
          class="mt-1 w-full"
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

<style lang='scss'>
.p-password {
 input {
  width: 100%;
 }
}
</style>