<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/useAuthStore';
import router from "../router";

import UserService from '../services/UserService';
import type { User } from '../models/User';

const store = useAuthStore();
const userName = computed(() => `${store.userInfo?.firstName} ${store.userInfo?.lastName}`);

const logout = () => {
  store.logout()
  router.push('/account/login');
};

const users = ref<User[]>([]);
const onGetUsers = async () => {
  try {
    const getUsers = await UserService.getUsers();
    users.value = getUsers;
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await onGetUsers();
})
</script>

<template>
  <main class="main--container">
    <h1>Home Page</h1>
    <p>Welcome, {{ userName }}</p>
    <button class="button" @click="logout">Logout</button>
    <pre>{{ users }}</pre>
  </main>
</template>

<style scoped>
.main--container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 10;
}

.button {
  height: 50px;
  width: 100px;
  border-radius: 50px;
  color: black;
}
</style>
