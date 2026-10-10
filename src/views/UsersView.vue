<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { USERS_PAGE_SIZE, useUsersStore } from '@/stores/users'
import WinnersList from '@/components/WinnersList.vue'
import SearchBar from '@/components/SearchBar.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import AppPagination from '@/components/AppPagination.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return Number.isInteger(page) && page > 0 ? page : 1
})

const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

const startIndex = computed(() => (currentPage.value - 1) * USERS_PAGE_SIZE)

function buildQuery(page: number, query: string): LocationQueryRaw {
  const result: LocationQueryRaw = {}

  if (page > 1) {
    result.page = String(page)
  }

  if (query) {
    result.q = query
  }

  return result
}

function goToPage(page: number): void {
  router.push({ query: buildQuery(page, searchQuery.value) })
}

function handleSearch(query: string): void {
  if (query === searchQuery.value) {
    return
  }

  router.replace({ query: buildQuery(1, query) })
}

function retry(): void {
  usersStore.fetchUsers(currentPage.value, searchQuery.value, true)
}

watch(
  [currentPage, searchQuery],
  ([page, query]) => {
    usersStore.fetchUsers(page, query)
  },
  { immediate: true },
)
</script>

<template>
  <WinnersList
    :winners="usersStore.winners"
    :can-pick-winner="usersStore.canPickWinner"
    @pick="usersStore.pickWinner"
    @remove="usersStore.removeWinner"
  />

  <div class="card">
    <div class="card-body">
      <div class="users-toolbar">
        <h2 class="users-title">
          Учасники
          <span class="users-count">{{ usersStore.total }}</span>
        </h2>
        <SearchBar
          :value="searchQuery"
          placeholder="Пошук за іменем..."
          @filter-by-name="handleSearch"
        />
      </div>

      <div v-if="usersStore.isLoading" class="state">
        <i class="bi bi-arrow-repeat state__spinner"></i>
        Завантаження...
      </div>

      <div v-else-if="usersStore.error" class="state state--error">
        <p class="state__text">
          <i class="bi bi-exclamation-triangle"></i>
          {{ usersStore.error }}
        </p>
        <button type="button" class="btn btn-primary" @click="retry">Спробувати ще раз</button>
      </div>

      <template v-else>
        <ParticipantsTable :users="usersStore.users" :start-index="startIndex" />
        <AppPagination
          :page="currentPage"
          :total-pages="usersStore.totalPages"
          @change="goToPage"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.users-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
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
  background-color: #e7f1ff;
  color: #0d6efd;
  font-size: 0.9rem;
  font-weight: 500;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 16px;
  color: #6c757d;
  text-align: center;
}

.state--error {
  color: #dc3545;
}

.state__text {
  margin: 0;
}

.state__spinner {
  font-size: 1.75rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
