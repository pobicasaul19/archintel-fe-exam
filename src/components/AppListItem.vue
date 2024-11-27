<template>
  <form @submit.prevent="onSave" class="space-y-10">
    <div class="flex flex-col gap-5 w-full">
      <div v-for="(items, i) in itemFields" :key="i" class="flex text-xl">
        <div
          class="w-64 mr-10 flex justify-between"
          v-if="!(items.label === 'User' && props.mode === 'create')"
        >
          <p class="m-0">{{ items.label }}</p>
          <span>:</span>
        </div>
        <div class="w-3/4">
          <template v-if="items.type === 'input'">
            <InputText
              v-if="items.model === 'firstName'"
              v-model="userForm.firstName"
              class="w-full"
            />
            <InputText
              v-if="items.model === 'lastName'"
              v-model="userForm.lastName"
              class="w-full"
            />
          </template>
          <template v-if="items.type === 'select'">
            <Select
              v-if="items.model === 'type'"
              v-model="userForm.type"
              :options="type"
              option-value="value"
              option-label="name"
              appendTo="body"
              class="w-full"
            />
            <Select
              v-if="items.model === 'status'"
              v-model="userForm.status"
              :options="status"
              option-value="value"
              option-label="name"
              appendTo="body"
              class="w-full"
            />
          </template>
        </div>
      </div>
    </div>
    <slot name="save-button" :onClick="loading" />
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { User, UserPayload } from '../models/User'
import { useToast } from 'primevue/usetoast'
import UserService from '../services/UserService'
import { status } from '../utils/types';
import { type } from '../utils/types'


const props = defineProps<{
  onGetData: () => void,
  users: User[],
  user: UserPayload,
  mode: 'create' | 'edit',
  close?: boolean,
}>()
const emit = defineEmits(['close'])
const showToast = useToast()

const userForm = reactive({
  firstName: props.user.firstName || '',
  lastName: props.user.lastName || '',
  type: props.user.type || '',
  status: props.user.status || ''
} as User)

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
    model: 'type'
  },
  {
    type: 'select',
    label: 'Status',
    model: 'status'
  }
]

const loading = ref(false)
const onSave = async () => {
  loading.value = true
  const payload = { ...userForm }
  try {
    console.log(payload)
    props.mode === 'create'
      ? await UserService.addUser(payload)
      : await UserService.updateUser(payload, userForm._id)
    showToast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Subscription was ${props.mode === 'edit' ? 'updated' : 'created'}  successfully.`,
      life: 3000
    })
    emit('close')
    props.onGetData()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      userForm.firstName = newUser.firstName
      userForm.lastName = newUser.lastName
      userForm.type = newUser.type
      userForm.status = newUser.status
    }
  },
  { immediate: true }
)
</script>