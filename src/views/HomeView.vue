<script setup lang="ts">
import moment from 'moment'
import { ref, onMounted } from 'vue'
import ArticleService from '../services/ArticleService'
import type { Article } from '../models/Article'

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

onMounted(() => {
  onGetArticles()
})
</script>

<template>
  <div v-if="loading" class="h-[50rem] flex items-center justify-center">
    <ProgressSpinner />
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5" v-else>
    <Card v-for="(article, i) in articles.slice(0, 2)" :key="i">
      <template #header>
        <img :src="article.image" :alt="article.title" class="p-5" />
      </template>
      <template #title
        >{{ article.title }} -
        <span
          :class="['text-sm', article.status === 'Published' ? 'text-green-600' : 'text-blue-600']"
          >{{ article.status }}</span
        ></template
      >
      <template #subtitle>
        <p class="flex flex-col capitalize">
          <span>{{ moment(article.date).format('DD/MM/YYYY') }}</span>

          <span>Editor: {{ article.editor || 'No valid editor' }}</span>
          <span>Writer: {{ article.writer || 'No valid writer' }}</span>
        </p>
      </template>
      <template #content>
        <p class="m-0">{{ article.content }}</p>
      </template>
      <template #footer>
        <a :href="article.link" target="_blank">
          <Button label="View" severity="secondary" outlined class="w-36" />
        </a>
      </template>
    </Card>
  </div>
</template>

<style scoped>
</style>
