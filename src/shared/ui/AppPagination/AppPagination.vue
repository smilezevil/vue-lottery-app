<script setup lang="ts">
import Paginator from 'primevue/paginator'
import type { PageState } from 'primevue/paginator'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

function onPage(state: PageState): void {
  const newPage = state.page + 1
  if (newPage !== props.page) {
    emit('change', newPage)
  }
}
</script>

<template>
  <Paginator
    v-if="totalPages > 1"
    :first="page - 1"
    :rows="1"
    :total-records="totalPages"
    :page-link-size="5"
    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
    class="app-pagination"
    @page="onPage"
  />
</template>

<style scoped lang="scss">
.app-pagination {
  margin-top: 16px;
}
</style>
