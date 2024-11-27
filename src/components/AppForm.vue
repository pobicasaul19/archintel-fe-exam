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
              v-model="formData[items.model]"
              :class="{ capitalize: items.capitalize }"
              class="w-full capitalize"
            />
          </template>
          <template v-if="items.type === 'select'">
            <Select
              v-model:model-value="formData[items.model]"
              :options="items.options"
              option-value="value"
              option-label="name"
              appendTo="body"
              class="w-full"
            />
          </template>
        </div>
      </div>
      <div class="flex items-center justify-center space-x-5">
        <Button
          :loading="loading"
          type="submit"
          label="Save"
          icon="pi pi-save"
          iconPos="right"
          class="!bg-[#0799c7] w-36 h-14 rounded-xl text-start !border-transparent"
        />
        <slot name="publish" />
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch, reactive } from 'vue'
import type { UserPayload } from '../models/User'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  onGetData: () => void
  formData: Record<string, any>
  itemFields: Array<{
    type: 'input' | 'select'
    label: string
    model: string
    capitalize?: boolean
    options?: Array<{ name: string; value: any }>
  }>
  user: UserPayload
  mode: 'create' | 'edit'
  create: (payload: Record<string, any>) => Promise<void>
  update: (payload: Record<string, any>, _id: number) => Promise<void>
  _id: number
  name: string
}>()
const emit = defineEmits(['close'])
const showToast = useToast()

const formData = reactive(props.formData)

const loading = ref(false)
const onSave = async () => {
  loading.value = true
  const payload = { ...formData }
  delete payload._id
  delete payload.alt
  try {
    props.mode === 'create' ? await props.create(payload) : await props.update(payload, props._id)
    showToast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${props.name} was ${props.mode === 'edit' ? 'updated' : 'created'}  successfully.`,
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
  (mode) => {
    if (mode === 'create') {
      Object.keys(props.formData).forEach((key) => (formData[key] = ''))
    } else if (mode === 'edit' && props._id) {
      Object.assign(props.formData, props.formData)
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
