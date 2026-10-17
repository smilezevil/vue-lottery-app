<script setup lang="ts" generic="T extends object">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { AppTableColumn } from './types'

withDefaults(
  defineProps<{
    rows: T[]
    columns: AppTableColumn[]
    dataKey: string
    loading?: boolean
    emptyMessage?: string
  }>(),
  {
    loading: false,
    emptyMessage: 'Даних немає',
  },
)

defineSlots<{
  [name: `cell-${string}`]: (props: { row: T; index: number }) => unknown
}>()

function cellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}
</script>

<template>
  <DataTable :value="rows" :data-key="dataKey" :loading="loading" class="app-table">
    <template #empty>
      <p class="app-table__empty">{{ emptyMessage }}</p>
    </template>

    <Column
      v-for="column in columns"
      :key="column.key"
      :header="column.header"
      :header-class="column.align === 'right' ? 'app-table__cell--right' : undefined"
      :body-class="column.align === 'right' ? 'app-table__cell--right' : undefined"
    >
      <template #body="{ data, index }">
        <slot :name="`cell-${column.key}`" :row="data as T" :index="index">
          {{ cellValue(data as T, column.key) }}
        </slot>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped lang="scss">
.app-table {
  :deep(.app-table__cell--right) {
    text-align: right;

    .p-datatable-column-header-content {
      justify-content: flex-end;
    }
  }

  :deep(td) {
    white-space: nowrap;
  }

  &__empty {
    margin: 0;
    padding: 16px 0;
    color: var(--p-text-muted-color);
    text-align: center;
  }
}
</style>
