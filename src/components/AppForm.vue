<template>
  <form @submit.prevent="onSave" class="space-y-10">
    <div class="flex flex-col gap-5 w-full">
      <div v-for="(items, i) in itemFields" :key="i" class="flex">
        <div
          class="w-64 mr-10 flex justify-between"
          v-if="!(items.model === 'password' && props.mode === 'edit')"
        >
          <p class="m-0">{{ items.label }}</p>
          <span>:</span>
        </div>
        <div class="w-3/4">
          <template v-if="items.type === 'input'">
            <InputText
              v-if="items.model === 'firstName'"
              v-model="userForm.firstName"
              class="w-full capitalize"
            />
            <InputText
              v-if="items.model === 'lastName'"
              v-model="userForm.lastName"
              class="w-full capitalize"
            />
          </template>
          <template v-if="items.type === 'select'">
            <Select
              v-if="items.model === 'type'"
              v-model:model-value="userForm.type"
              :options="type"
              option-value="value"
              option-label="name"
              appendTo="body"
              class="w-full"
            />
            <Select
              v-if="items.model === 'status'"
              v-model:model-value="userForm.status"
              :options="status"
              option-value="value"
              option-label="name"
              appendTo="body"
              class="w-full"
            />
          </template>
          <template v-if="props.mode === 'create' && items.model === 'password'">
            <Password v-model="userForm.password" :feedback="false" toggleMask />
          </template>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <Button
          :loading="loading"
          type="submit"
          label="Save"
          icon="pi pi-save"
          iconPos="right"
          class="!bg-[#0799c7] w-36 h-14 rounded-xl text-start !border-transparent"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, watch } from 'vue'
import type { UserPayload } from '../models/User'
import { useToast } from 'primevue/usetoast'
import UserService from '../services/UserService'
import { status } from '../utils/types'
import { type } from '../utils/types'

const props = defineProps<{
  onGetData: () => void
  user: UserPayload
  mode: 'create' | 'edit'
}>()
const emit = defineEmits(['close'])
const showToast = useToast()

const userForm = reactive<Record<string, any>>({
  _id: '',
  firstName: '',
  lastName: '',
  type: '',
  status: '',
  password: ''
})

const resetUserForm = () => {
  userForm._id = ''
  userForm.firstName = ''
  userForm.lastName = ''
  userForm.type = ''
  userForm.status = ''
  userForm.password = ''
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
    model: 'type'
  },
  {
    type: 'select',
    label: 'Status',
    model: 'status'
  },
  {
    type: 'password',
    label: 'Password',
    model: 'password'
  }
]

const loading = ref(false)
const onSave = async () => {
  loading.value = true
  const payload = { ...userForm }
  delete payload._id
  if (props.mode !== 'create') {
    delete payload.password
  }
  try {
    props.mode === 'create'
      ? await UserService.addUser(payload as UserPayload)
      : await UserService.updateUser(payload as UserPayload, props.user._id)
    showToast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Subscription was ${props.mode === 'edit' ? 'updated' : 'created'}  successfully.`,
      life: 3000
    })
    props.onGetData()
    emit('close')
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.mode,
  (newMode) => {
    if (newMode === 'create') {
      resetUserForm()
    } else if (newMode === 'edit') {
      userForm._id = props.user._id
      userForm.firstName = props.user.firstName || ''
      userForm.lastName = props.user.lastName || ''
      userForm.type = props.user.type || ''
      userForm.status = props.user.status || ''
    }
  },
  { immediate: true }
)
</script>

<style lang='scss'>
.p-password {
  input {
    width: 100%;
  }
}
</style>
