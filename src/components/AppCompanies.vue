<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { status } from '../utils/types'

import CompanyService from '../services/CompanyService'
import type { Company } from '../models/Company'

const props = defineProps<{
  onGetCompany: () => void;
  images: { logo: string; name: string; status: string }[];
}>();

const companyForm = reactive<Record<string, any>>({
  logo: '',
  name: '',
  status: ''
})

const itemFields = [
  {
    type: 'input',
    label: 'Logo',
    model: 'logo'
  },
  {
    type: 'input',
    label: 'Name',
    model: 'name'
  },
  {
    type: 'select',
    label: 'Status',
    model: 'status',
    options: status
  }
]

const editCompany = ref(false)
const createCompany = ref(false)

const onClickOpenEdit = (data: Company) => {
  editCompany.value = true
  Object.assign(companyForm, data)
}

const onClickOpenCreate = () => {
  createCompany.value = true
}

const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
])
</script>

<template>
  <div class="space-y-5">
    <h1 class="text-3xl font-medium">Company Management</h1>
    <app-button :editor="true" :onClick="onClickOpenCreate" label="Create Company" />
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      :circular="true"
      containerStyle="max-width: 640px"
      :showItemNavigators="true"
      :showThumbnails="false"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.logo"
          :alt="slotProps.item.name"
          loading="eager"
          decoding="async"
          style="width: 100%; display: block"
        />
      </template>
      <template #thumbnail="slotProps">
        <img
          :src="slotProps.item.logo"
          :alt="slotProps.item.name"
          loading="eager"
          decoding="async"
          style="display: block"
        />
      </template>
      <template #caption="slotProps">
        <div class="text-xl mb-2 font-bold">{{ slotProps.item.name }}</div>
        <div class="flex justify-between">
          <p class="text-white capitalize">{{ slotProps.item.status }}</p>
          <p
            @click="onClickOpenEdit(slotProps.item)"
            class="cursor-pointer underline underline-offset-2"
          >
            Edit
          </p>
        </div>
      </template>
    </Galleria>
  </div>

  <Dialog
    v-model:visible="createCompany"
    modal
    header="Create New Company"
    :style="{ width: '40rem' }"
  >
    <AppForm
      :formData="companyForm"
      :itemFields="itemFields"
      :onGetData="props.onGetCompany"
      :create="CompanyService.addCompany"
      mode="create"
      name="Company"
      @close="createCompany = false"
    />
  </Dialog>

  <Dialog v-model:visible="editCompany" modal header="Update Company" :style="{ width: '40rem' }">
    <AppForm
      :formData="companyForm"
      :itemFields="itemFields"
      :onGetData="props.onGetCompany"
      :update="CompanyService.updateCompany"
      :_id="companyForm._id"
      mode="edit"
      name="Company"
      @close="editCompany = false"
    />
  </Dialog>
</template>
