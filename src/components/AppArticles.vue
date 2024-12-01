<script lang="ts" setup>
import { reactive, ref, onMounted, computed, h } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import ArticleService from '../services/ArticleService'
import type { Article, ArticlePayload } from '../models/Article'
import type { Company } from '../models/Company'
import type { IAppDatatableHeader } from './AppDatatable.vue'
import Button from 'primevue/button'

const props = defineProps<{
  onGetData: () => void
  company: Company[]
}>()

const authStore = useAuthStore()

const articleForm = reactive<Record<string, any>>({
  company: '',
  image: '',
  title: '',
  link: '',
  date: null,
  content: ''
})

const resetArticleForm = () => {
  articleForm.company = ''
  articleForm.image = ''
  articleForm.title = ''
  articleForm.link = ''
  articleForm.date = null
  articleForm.content = ''
}

const editUser = ref(false)
const createUser = ref(false)
const onClickOpenEdit = (data: ArticlePayload) => {
  editUser.value = true
  Object.assign(articleForm, data)
}
const onClickOpenCreate = () => {
  createUser.value = true
  resetArticleForm()
}

const articles = ref<Article[]>([])
const loading = ref(true)
const onGetArticles = async () => {
  loading.value = true
  try {
    const data = await ArticleService.getArticles()
    articles.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const company = computed(() => props.company.map((t) => t))
const itemFields = [
  {
    type: 'select',
    label: 'Company',
    model: 'company',
    options: company.value
  },
  {
    type: 'input',
    label: 'Image',
    model: 'image'
  },
  {
    type: 'input',
    label: 'Title',
    model: 'title'
  },
  {
    type: 'input',
    label: 'Link',
    model: 'link'
  },
  {
    type: 'calendar',
    label: 'Date',
    model: 'date'
  },
  {
    type: 'textarea',
    label: 'Content',
    model: 'content'
  }
]

const header: IAppDatatableHeader[] = [
  {
    header: 'Image',
    field: 'image',
    style: 'min-width: 150px',
    renderComponent: (data: Article) => {
      return h('img', {
        src: data.image,
        alt: data.title,
        class: 'w-24 h-24 rounded object-contain'
      })
    }
  },
  {
    header: 'Title',
    field: 'title',
    style: 'min-width: 150px'
  },
  {
    header: 'Link',
    field: 'Link',
    style: 'min-width: 150px',
    renderComponent: (data: Article) => {
      return h(
        'span',
        {
          class: 'underline underline-offset-2 cursor-pointer',
          onClick: () => {
            const url = data.link
            window.open(url, '_blank')
          }
        },
        'Source'
      )
    }
  },
  {
    header: 'Writer',
    field: 'writer',
    style: 'min-width: 200px'
  },
  {
    header: 'Editor',
    field: 'editor',
    style: 'min-width: 200px'
  },
  {
    header: 'Action',
    field: '',
    style: 'min-width: 150px',
    renderComponent: (data: Article) => {
      return h(Button, {
        disabled: data.status === 'Published' && !authStore.isEditor,
        icon: 'pi pi-pencil cursor-pointer',
        severity: 'secondary',
        rounded: true,
        onClick: () => onClickOpenEdit(data)
      })
    }
  }
]

onMounted(() => {
  onGetArticles()
})
</script>

<template>
  <div class="space-y-5">
    <h1 class="text-3xl font-medium">Article Management</h1>
    <AppButton :editor="true" :onClick="onClickOpenCreate" label="Create Article" />

    <AppDatatable
      :onGetData="onGetArticles"
      :items="articles"
      :header="header"
      :loading="loading"
    />
  </div>

  <Dialog
    v-model:visible="createUser"
    modal
    header="Create New Article"
    :style="{ width: '50rem' }"
  >
    <AppForm
      :onGetData="onGetArticles"
      :isPublish="true"
      :formData="articleForm"
      :itemFields="itemFields"
      :create="ArticleService.addArticle"
      mode="create"
      name="Article"
      @close="createUser = false"
    />
  </Dialog>

  <Dialog v-model:visible="editUser" modal header="Update Article" :style="{ width: '50rem' }">
    <AppForm
      :onGetData="onGetArticles"
      :isPublish="true"
      :formData="articleForm"
      :itemFields="itemFields"
      :update="ArticleService.updateArticle"
      :_id="articleForm._id"
      mode="edit"
      name="Article"
      @close="editUser = false"
    />
  </Dialog>
</template>
