<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'

import UserService from '../services/UserService'
import type { User, UserPayload } from '../models/User'

const authStore = useAuthStore()
const editor = computed(() => authStore.userInfo?.type === 'editor')

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

onMounted(() => {
  onGetUsers()
})
</script>

<template>
  <div class="space-y-10">
    <div>
      <app-user />
    </div>
    <div>
      <app-companies />
    </div>
    <div>
      <Button
        v-if="editor"
        @click="onClickOpenCreate"
        type="button"
        severity="warn"
        class="space-x-2 !border-transparent mb-5"
        label="Create article"
      />
      <DataTable
        :value="users"
        tableStyle="min-width: 50rem"
        class="capitalize datatable-container"
        v-if="editor"
      >
        <template #empty>
          <Skeleton v-if="loading" />
          <p class="text-center" v-else>No data available</p>
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
    </div>
  </div>

</template>

<style>
</style>
