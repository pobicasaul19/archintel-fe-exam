<template>
  <AppListItem
    :users='props.users'
    :user="props.user"
    :mode="props.mode"
  >
    <template #save-button="{ onClick }" v-if="props.mode === 'edit' || props.mode === 'create'">
      <div class="flex items-center justify-center">
        <Button
          :loading="onClick"
          type="submit"
          label="Save"
          icon="pi pi-save"
          iconPos="right"
          class="!bg-[#0799c7] w-36 h-14 rounded-xl text-start !border-transparent"
        />
      </div>
    </template>
  </AppListItem>
</template>


<script lang="ts" setup>
import type { User, UserPayload } from '../models/User'

const props = defineProps<{
  onGetData: () => void
  users?: User[];
  user: UserPayload
  mode: 'create' | 'edit'
}>()
</script>
