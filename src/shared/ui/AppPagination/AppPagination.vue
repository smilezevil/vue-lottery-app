<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}

const pageItems = computed<PageItem[]>(() => {
  const { page, totalPages } = props

  if (totalPages <= 7) {
    return range(1, totalPages)
  }

  if (page <= 4) {
    return [...range(1, 5), 'ellipsis-end', totalPages]
  }

  if (page >= totalPages - 3) {
    return [1, 'ellipsis-start', ...range(totalPages - 4, totalPages)]
  }

  return [1, 'ellipsis-start', ...range(page - 1, page + 1), 'ellipsis-end', totalPages]
})
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination-nav" aria-label="Пагінація">
    <button
      type="button"
      class="page-btn"
      :disabled="page <= 1"
      aria-label="Попередня сторінка"
      @click="emit('change', page - 1)"
    >
      <i class="bi bi-chevron-left"></i>
    </button>

    <template v-for="item in pageItems" :key="item">
      <span v-if="typeof item === 'string'" class="page-ellipsis">…</span>
      <button
        v-else
        type="button"
        class="page-btn"
        :class="{ 'page-btn--active': item === page }"
        :aria-current="item === page ? 'page' : undefined"
        @click="emit('change', item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      class="page-btn"
      :disabled="page >= totalPages"
      aria-label="Наступна сторінка"
      @click="emit('change', page + 1)"
    >
      <i class="bi bi-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped>
.pagination-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 24px;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #fff;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #f1f3f5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn--active,
.page-btn--active:hover:not(:disabled) {
  border-color: #0d6efd;
  background-color: #0d6efd;
  color: #fff;
}

.page-ellipsis {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  color: #6c757d;
}
</style>
