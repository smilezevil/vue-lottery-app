import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { CreateUserDto, UpdateUserDto, User } from './types'

const usersService = () => ServiceProvider.get<UserService>('users')

export const USERS_PAGE_SIZE = 10

export function buildUsersQuery(page: number, query: string): LocationQueryRaw {
  const result: LocationQueryRaw = {}

  if (page > 1) {
    result.page = String(page)
  }

  if (query) {
    result.q = query
  }

  return result
}

function matchesQuery(user: User, query: string): boolean {
  if (!query) {
    return true
  }

  const text = `${user.firstName} ${user.lastName} ${user.username} ${user.email}`
  return text.toLowerCase().includes(query.toLowerCase())
}

export const useUsersStore = defineStore('users', () => {

  const serverUsers = ref<User[]>([])
  const serverTotal = ref(0)
  const page = ref(1)
  const query = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const createdUsers = ref<User[]>([])
  const updatedUsers = ref<Record<number, User>>({})
  const deletedUsers = ref<User[]>([])
  const userCache = ref<Record<number, User>>({})

  let lastRequestKey = ''
  let requestCounter = 0

  function isDeleted(id: number): boolean {
    return deletedUsers.value.some((user) => user.id === id)
  }


  const visibleCreatedUsers = computed(() =>
    createdUsers.value.filter((user) => matchesQuery(user, query.value)),
  )

  const users = computed(() => {
    const fromServer = serverUsers.value
      .filter((user) => !isDeleted(user.id))
      .map((user) => updatedUsers.value[user.id] ?? user)

    return page.value === 1 ? [...visibleCreatedUsers.value, ...fromServer] : fromServer
  })

  const total = computed(() => {
    const removed = deletedUsers.value.filter((user) => matchesQuery(user, query.value)).length
    return Math.max(0, serverTotal.value + visibleCreatedUsers.value.length - removed)
  })

  const hasUsers = computed(() => users.value.length > 0)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / USERS_PAGE_SIZE)))

  const listQuery = computed(() => buildUsersQuery(page.value, query.value))


  async function fetchUsers(newPage = 1, newQuery = '', force = false): Promise<void> {
    const requestKey = `${newPage}|${newQuery}`
    if (!force && requestKey === lastRequestKey && !error.value) {
      return
    }

    lastRequestKey = requestKey
    page.value = newPage
    query.value = newQuery
    const requestId = ++requestCounter
    isLoading.value = true
    error.value = null

    try {
      const params = { limit: USERS_PAGE_SIZE, skip: (newPage - 1) * USERS_PAGE_SIZE }
      const result = newQuery
        ? await usersService().search(newQuery, params)
        : await usersService().getAll(params)

      if (requestId !== requestCounter) {
        return
      }

      serverUsers.value = result.items
      serverTotal.value = result.total
    } catch (e) {
      if (requestId !== requestCounter) {
        return
      }

      serverUsers.value = []
      serverTotal.value = 0
      error.value = e instanceof Error ? e.message : 'Не вдалося завантажити користувачів'
    } finally {
      if (requestId === requestCounter) {
        isLoading.value = false
      }
    }
  }

  function getUser(id: number): User | null {
    if (isDeleted(id)) {
      return null
    }

    return (
      createdUsers.value.find((user) => user.id === id) ??
      updatedUsers.value[id] ??
      userCache.value[id] ??
      null
    )
  }

  async function fetchUser(id: number): Promise<User> {
    if (isDeleted(id)) {
      throw new Error('Цього користувача видалено')
    }

    const localUser = getUser(id)
    if (localUser) {
      return localUser
    }

    const user = await usersService().getById(id)
    userCache.value[id] = user
    return user
  }

  function withoutStaleBirthDate(current: User, updated: User): User {
    return updated.age === current.age ? updated : { ...updated, birthDate: undefined }
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const response = await usersService().create(data)

    const id = Math.max(response.id, ...createdUsers.value.map((user) => user.id + 1))
    const user: User = { ...data, ...response, id }

    createdUsers.value.unshift(user)
    return user
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const current = getUser(id)
    if (!current) {
      throw new Error('Користувача не знайдено')
    }

    const createdIndex = createdUsers.value.findIndex((user) => user.id === id)

    if (createdIndex !== -1) {
      const updated = withoutStaleBirthDate(current, { ...current, ...data })
      createdUsers.value[createdIndex] = updated
      return updated
    }

    const response = await usersService().update(id, data)
    const updated = withoutStaleBirthDate(current, { ...current, ...response, ...data, id })

    updatedUsers.value[id] = updated
    return updated
  }

  async function removeUser(id: number): Promise<void> {
    const createdIndex = createdUsers.value.findIndex((user) => user.id === id)

    if (createdIndex !== -1) {
      createdUsers.value.splice(createdIndex, 1)
      return
    }

    const current = getUser(id) ?? serverUsers.value.find((user) => user.id === id)
    await usersService().delete(id)

    if (current) {
      deletedUsers.value.push(current)
    }
  }

  return {
    users,
    total,
    totalPages,
    isLoading,
    error,
    hasUsers,
    listQuery,
    fetchUsers,
    getUser,
    fetchUser,
    createUser,
    updateUser,
    removeUser,
  }
})
