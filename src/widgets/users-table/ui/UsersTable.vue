<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '@/entities/user'
import { DeleteUserDialog } from '@/features/user-delete'
import { AppButton, AppTable } from '@/shared/ui'
import type { AppTableColumn } from '@/shared/ui'

defineProps<{
  users: User[]
  startIndex: number
  loading?: boolean
}>()

const columns: AppTableColumn[] = [
  { key: 'index', header: '#' },
  { key: 'name', header: 'Name' },
  { key: 'age', header: 'Age' },
  { key: 'gender', header: 'Gender' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone number' },
  { key: 'actions', header: 'Actions', align: 'right' },
]

const userToDelete = ref<User | null>(null)
const isDeleteDialogOpen = ref(false)

function openDeleteDialog(user: User): void {
  userToDelete.value = user
  isDeleteDialogOpen.value = true
}
</script>

<template>
  <AppTable
    :rows="users"
    :columns="columns"
    data-key="id"
    :loading="loading"
    empty-message="Користувачів не знайдено"
  >
    <template #cell-index="{ index }">
      <span class="muted">{{ startIndex + index + 1 }}</span>
    </template>

    <template #cell-name="{ row }">
      <RouterLink :to="{ name: 'user-details', params: { id: row.id } }" class="user-cell">
        <img
          v-if="row.image"
          :src="row.image"
          :alt="`${row.firstName} ${row.lastName}`"
          class="user-cell__avatar"
        />
        <span v-else class="user-cell__avatar user-cell__avatar--empty">
          <i class="pi pi-user"></i>
        </span>
        <span class="text-cell" :title="`${row.firstName} ${row.lastName}`">
          {{ row.firstName }} {{ row.lastName }}
        </span>
      </RouterLink>
    </template>

    <template #cell-email="{ row }">
      <span class="text-cell" :title="row.email">{{ row.email }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="actions">
        <AppButton
          :to="{ name: 'user-details', params: { id: row.id } }"
          icon="pi pi-eye"
          severity="secondary"
          variant="outlined"
          size="small"
          title="Переглянути"
          aria-label="Переглянути"
        />
        <AppButton
          :to="{ name: 'user-edit', params: { id: row.id } }"
          icon="pi pi-pencil"
          severity="secondary"
          variant="outlined"
          size="small"
          title="Редагувати дані"
          aria-label="Редагувати дані"
        />
        <AppButton
          icon="pi pi-trash"
          severity="danger"
          variant="outlined"
          size="small"
          title="Видалити учасника"
          aria-label="Видалити учасника"
          @click="openDeleteDialog(row)"
        />
      </div>
    </template>
  </AppTable>

  <DeleteUserDialog v-model:visible="isDeleteDialogOpen" :user="userToDelete" />
</template>

<style scoped lang="scss">
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;

  &:hover .text-cell {
    color: var(--p-primary-color);
    text-decoration: underline;
  }

  &__avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--p-content-hover-background);
    object-fit: cover;

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--p-text-muted-color);
    }
  }
}

.text-cell {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.actions {
  display: inline-flex;
  gap: 6px;
}
</style>
