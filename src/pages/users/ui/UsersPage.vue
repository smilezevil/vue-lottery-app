<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { buildUsersQuery, USERS_PAGE_SIZE, useUsersStore } from '@/entities/user'
import { WinnersList } from '@/features/pick-winner'
import { UsersTable } from '@/widgets/users-table'
import { AppButton, AppCard, AppMessage, AppPagination, AppSearchInput } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const { users, total, totalPages, isLoading, error } = storeToRefs(usersStore)
const { fetchUsers } = usersStore

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return Number.isInteger(page) && page > 0 ? page : 1
})

const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

const startIndex = computed(() => (currentPage.value - 1) * USERS_PAGE_SIZE)

function goToPage(page: number): void {
  router.push({ query: buildUsersQuery(page, searchQuery.value) })
}

function handleSearch(query: string): void {
  if (query === searchQuery.value) {
    return
  }

  router.replace({ query: buildUsersQuery(1, query) })
}

function retry(): void {
  fetchUsers(currentPage.value, searchQuery.value, true)
}

watch(
  [currentPage, searchQuery],
  ([page, query]) => {
    fetchUsers(page, query)
  },
  { immediate: true },
)
</script>

<template>
  <WinnersList />

  <AppCard>
    <div class="users-toolbar">
      <h2 class="users-title">
        Учасники
        <span class="users-count">{{ total }}</span>
      </h2>
      <div class="users-toolbar__actions">
        <AppSearchInput
          :value="searchQuery"
          placeholder="Пошук за іменем..."
          @search="handleSearch"
        />
        <AppButton :to="{ name: 'user-create' }" label="Новий учасник" icon="pi pi-plus" />
      </div>
    </div>

    <div v-if="error" class="state">
      <AppMessage severity="error">{{ error }}</AppMessage>
      <AppButton label="Спробувати ще раз" icon="pi pi-refresh" @click="retry" />
    </div>

    <template v-else>
      <UsersTable :users="users" :start-index="startIndex" :loading="isLoading" />
      <AppPagination :page="currentPage" :total-pages="totalPages" @change="goToPage" />
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.users-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    flex: 1;
    gap: 12px;
  }
}

.users-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.users-count {
  padding: 2px 10px;
  border-radius: 999px;
  background-color: var(--p-highlight-background);
  color: var(--p-highlight-color);
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
