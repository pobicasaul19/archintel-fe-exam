<template>
  <div class="card">
    <DataTable
      :value="props.items"
      tableStyle="min-width: 50rem"
      class="capitalize datatable-container"
    >
      <template #empty>
        <Skeleton v-if="loading" />
        <p class="text-center" v-else>No data available</p>
      </template>
      <template v-for="items in props.header" :key="items">
        <Column :field="items.field" :header="items.header" :style="items.style">
          <template #body="{ data }">
            <Skeleton v-if="loading" width="100%" />
            <component v-else-if="items.renderComponent" :is="items.renderComponent(data)" />
            <template v-else>
              {{ formatValue(items.field, data) }}
            </template>
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang='ts'>
export interface IAppDatatableHeader {
  header: string
  field: string
  style?: string
  renderComponent?: any
}

const props = defineProps<{
  onGetData: () => void
  loading: boolean
  items: []
  header: IAppDatatableHeader
}>()

const formatValue = (
  field: string,
  data: Record<string, any>
) => {
  const value = field.split('.').reduce((acc, key) => (acc ? acc[key] : null), data)
  return value !== null && value !== undefined ? value : '--'
}
</script>
