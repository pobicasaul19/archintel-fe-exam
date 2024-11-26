<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/useAuthStore';
import router from "../router";

const store = useAuthStore();
const userName = computed(() => `${store.userInfo?.firstName} ${store.userInfo?.lastName}`);

const logout = () => {
  store.logout();
  router.push('account/login');
};
</script>

<template>
  <main class="flex flex-col items-center">
    <HeaderView />
    <h1>Home Page</h1>
    <p>Welcome, {{ userName }}</p>
    <Button label="Logout" @click="logout" />
  </main>
</template>

<style scoped>
</style>
