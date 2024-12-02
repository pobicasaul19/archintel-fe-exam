<script lang="ts" setup>
import { reactive, ref, onMounted, h } from 'vue'
import UserService from '../services/UserService'
import type { User, UserPayload } from '../models/User'
import { type, status } from '../utils/types'
import type { IAppDatatableHeader } from './AppDatatable.vue'
import Button from 'primevue/button'

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

const header: IAppDatatableHeader[] = [
  {
    header: 'Firstname',
    field: 'firstName',
    style: 'min-width: 150px'
  },
  {
    header: 'Lastname',
    field: 'lastName',
    style: 'min-width: 150px'
  },
  {
    header: 'Type',
    field: 'type',
    style: 'min-width: 150px'
  },
  {
    header: 'Status',
    field: 'status',
    style: 'min-width: 200px'
  },
  {
    header: 'Action',
    field: '',
    style: 'min-width: 150px',
    renderComponent: (data: User) => {
      return h(Button, {
        icon: 'pi pi-pencil cursor-pointer',
        severity: 'secondary',
        rounded: true,
        onClick: () => onClickOpenEdit(data)
      })
    }
  }
]

onMounted(() => {
  onGetUsers()
})
</script>

<template>
  <div class="space-y-5">
    <h1 class="text-3xl font-medium">User Management</h1>
    <AppButton :editor="true" :onClick="onClickOpenCreate" label="Create User" />
    <AppDatatable :onGetData="onGetUsers" :items="users" :header="header" :loading="loading" />
  </div>

  <Dialog v-model:visible="createUser" modal header="Create New User" :style="{ width: '40rem' }">
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

  <Dialog v-model:visible="editUser" modal header="Update User" :style="{ width: '40rem' }">
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
