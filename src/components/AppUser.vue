<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import UserService from '../services/UserService'
import type { User, UserPayload } from '../models/User'
import { type, status } from '../utils/types'

const authStore = useAuthStore()
const editor = computed(() => authStore.userInfo?.type === 'editor')

const userForm = reactive<Record<string, any>>({
  firstName: '',
  lastName: '',
  type: '',
  status: ''
})

const resetUserForm = () => {
  userForm.firstName = ''
  userForm.lastName = ''
  userForm.type = ''
  userForm.status = ''
}

const itemFields = [
  {
    type: 'input',
    label: 'Firstname',
    model: 'firstName'
  },
  {
    type: 'input',
    label: 'Lastname',
    model: 'lastName'
  },
  {
    type: 'select',
    label: 'Type',
    model: 'type',
    options: type
  },
  {
    type: 'select',
    label: 'Status',
    model: 'status',
    options: status
  }
]

const editUser = ref(false)
const createUser = ref(false)
const onClickOpenEdit = (data: UserPayload) => {
  editUser.value = true
  Object.assign(userForm, data)
}
const onClickOpenCreate = () => {
  createUser.value = true
  resetUserForm()
}

const users = ref<User[]>([])
const loading = ref(true)
const onGetUsers = async () => {
  loading.value = true
  try {
    const data = await UserService.getUsers()
    users.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onGetUsers()
})
</script>

<template>
  <Button
    v-if="editor"
    @click="onClickOpenCreate"
    type="button"
    severity="warn"
    class="space-x-2 !border-transparent mb-5"
    label="Create User"
  />

  <!-- User Table -->
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

  <Dialog v-model:visible="createUser" modal header="Create New User" :style="{ width: '25rem' }">
    <AppForm
      :formData="userForm"
      :itemFields="itemFields"
      :onGetData="onGetUsers"
      :create="UserService.addUser"
      mode="create"
      name="User"
      @close="createUser = false"
    />
  </Dialog>

  <Dialog v-model:visible="editUser" modal header="Update User" :style="{ width: '25rem' }">
    <AppForm
      :formData="userForm"
      :itemFields="itemFields"
      :onGetData="onGetUsers"
      :update="UserService.updateUser"
      :_id="userForm._id"
      mode="edit"
      name="User"
      @close="editUser = false"
    />
  </Dialog>
</template>
