<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import { status } from '../utils/types'

import CompanyService from '../services/CompanyService'
import type { Company } from '../models/Company'

const authStore = useAuthStore()
const editor = computed(() => authStore.userInfo?.type === 'editor')

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

const companies = ref([] as Company[])
const loading = ref(true)
const images = ref([] as { logo: string; alt: string; name: string }[])
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
const onGetData = async () => {
  loading.value = true
  try {
    const data = await CompanyService.getCompanies()
    companies.value = data
    images.value = companies.value.map((company) => ({
      _id: company._id,
      logo: company.logo,
      alt: company.name,
      name: company.name,
      status: company.status
    }))
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  onGetData()
})
</script>

<template>
  <Button
    v-if="editor"
    @click="onClickOpenCreate"
    type="button"
    severity="warn"
    class="space-x-2 !border-transparent mb-5"
    label="Create company"
  />

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
        :alt="slotProps.item.alt"
        loading="eager"
        decoding="async"
        style="width: 100%; display: block"
      />
    </template>
    <template #thumbnail="slotProps">
      <img
        :src="slotProps.item.logo"
        :alt="slotProps.item.alt"
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

  <Dialog
    v-model:visible="createCompany"
    modal
    header="Create New Company"
    :style="{ width: '25rem' }"
  >
    <AppForm
      :formData="companyForm"
      :itemFields="itemFields"
      :onGetData="onGetData"
      :create="CompanyService.addCompany"
      mode="create"
      name="Company"
      @close="createCompany = false"
    />
  </Dialog>

  <Dialog v-model:visible="editCompany" modal header="Update Company" :style="{ width: '25rem' }">
    <AppForm
      :formData="companyForm"
      :itemFields="itemFields"
      :onGetData="onGetData"
      :update="CompanyService.updateCompany"
      :_id="companyForm._id"
      mode="edit"
      name="Company"
      @close="editCompany = false"
    />
  </Dialog>
</template>
