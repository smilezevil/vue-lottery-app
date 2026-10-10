import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'

export const USERS_PAGE_SIZE = 10
const MAX_WINNERS = 3

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const winners = ref<User[]>([])

  let lastRequestKey = ''
  let requestCounter = 0

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / USERS_PAGE_SIZE)))

  async function fetchUsers(page: number, query: string, force = false): Promise<void> {
    const requestKey = `${page}|${query}`
    if (!force && requestKey === lastRequestKey && !error.value) {
      return
    }

    lastRequestKey = requestKey
    const requestId = ++requestCounter
    isLoading.value = true
    error.value = null

    try {
      const params = { limit: USERS_PAGE_SIZE, skip: (page - 1) * USERS_PAGE_SIZE }
      const result = query
        ? await ServiceProvider.users.search(query, params)
        : await ServiceProvider.users.getAll(params)

      if (requestId !== requestCounter) {
        return
      }

      users.value = result.items
      total.value = result.total
    } catch (e) {
      if (requestId !== requestCounter) {
        return
      }

      users.value = []
      total.value = 0
      error.value = e instanceof Error ? e.message : 'Не вдалося завантажити користувачів'
    } finally {
      if (requestId === requestCounter) {
        isLoading.value = false
      }
    }
  }

  const availableForWinning = computed(() =>
    users.value.filter((user) => !winners.value.some((winner) => winner.id === user.id)),
  )

  const canPickWinner = computed(
    () => winners.value.length < MAX_WINNERS && availableForWinning.value.length > 0,
  )

  function pickWinner(): void {
    if (!canPickWinner.value) {
      return
    }

    const pool = availableForWinning.value
    const chosen = pool[Math.floor(Math.random() * pool.length)]

    if (chosen) {
      winners.value.push(chosen)
    }
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  return {
    users,
    total,
    isLoading,
    error,
    winners,
    totalPages,
    canPickWinner,
    fetchUsers,
    pickWinner,
    removeWinner,
  }
})
