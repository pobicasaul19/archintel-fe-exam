<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import router from '../router'

import UserService from '../services/UserService'
import type { User, UserPayload } from '../models/User'

const authStore = useAuthStore()
const userName = computed(() => authStore.getUsername)

const logout = () => {
  authStore.logout()
  router.push('/account/login')
}

const editUser = ref(false)
const createUser = ref(false)
const selectedUser = ref({} as UserPayload)

const onClickOpenEdit = (data: UserPayload) => {
  editUser.value = true
  selectedUser.value = data
}
const onClickOpenCreate = () => {
  createUser.value = true
}

const users = ref([] as User[])
const loading = ref(true)
const onGetUsers = async () => {
  loading.value = true
  try {
    const data = await UserService.getUsers()
    users.value = data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await onGetUsers()
})
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen w-full space-y-5">
    <h1 class="text-2xl">Home Page</h1>
    <p>Welcome, {{ userName }}</p>
    <Button class="w-24" @click="logout" label="Logout" />

    <div class="flex space-x-5">
      <Button
        v-if="authStore.getUserInfo?.type === 'Editor'"
        @click="onClickOpenCreate"
        type="button"
        severity="warn"
        class="space-x-2 !border-transparent"
        label="Create user"
      />
    </div>
    <DataTable :value="users" tableStyle="min-width: 50rem">
      <template #empty>
        <p class="text-center" v-if="!loading">No data available</p>
        <Skeleton v-else />
      </template>
      <Column field="firstName" header="Firstname" />
      <Column field="lastName" header="Lastname" />
      <Column field="type" header="Type" />
      <Column field="status" header="Status" />
      <Column field="" header="Edit">
        <template #body="{ data }">
          <i class="pi pi-pencil cursor-pointer" @click="onClickOpenEdit(data)" />
        </template>
      </Column>
    </DataTable>
  </main>

  <Dialog v-model:visible="createUser" modal header="Crete new user" :style="{ width: '25rem' }">
    <AppForm
      :onGetData="onGetUsers"
      :user="selectedUser"
      @close="createUser = false"
      mode="create"
    />
  </Dialog>

  <Dialog v-model:visible="editUser" modal header="Update user" :style="{ width: '25rem' }">
    <AppForm
      :onGetData="onGetUsers"
      :users="users"
      :user="selectedUser"
      @close="createUser = false"
      mode="edit"
    />
  </Dialog>
</template>

<style scoped>
</style>
