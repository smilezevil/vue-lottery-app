<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import DeleteUserModal from '@/components/DeleteUserModal.vue'

const props = defineProps<{
  id: string
}>()

interface DetailItem {
  label: string
  value: string
}

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const userId = computed(() => Number(props.id))
const user = computed(() => usersStore.getUser(userId.value))
const isEditing = computed(() => route.name === 'user-edit')

const isLoading = ref(false)
const loadError = ref<string | null>(null)

const details = computed<DetailItem[]>(() => {
  const current = user.value
  if (!current) {
    return []
  }

  const items: Array<{ label: string; value: string | undefined }> = [
    { label: 'Email', value: current.email },
    { label: 'Phone number', value: current.phone },
    { label: 'Username', value: current.username },
    { label: 'Age', value: String(current.age) },
    { label: 'Gender', value: current.gender },
    { label: 'Birth date', value: current.birthDate },
    { label: 'Role', value: current.role },
    { label: 'University', value: current.university },
    {
      label: 'Company',
      value: current.company ? `${current.company.name}, ${current.company.title}` : undefined,
    },
    {
      label: 'Address',
      value: current.address
        ? `${current.address.address}, ${current.address.city}, ${current.address.country}`
        : undefined,
    },
  ]

  return items.filter((item): item is DetailItem => Boolean(item.value))
})

async function loadUser(): Promise<void> {
  isLoading.value = true
  loadError.value = null

  try {
    await usersStore.loadUser(userId.value)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Не вдалося завантажити користувача'
  } finally {
    isLoading.value = false
  }
}

watch(userId, loadUser, { immediate: true })

const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

function openDeleteModal(): void {
  deleteError.value = null
  isDeleteModalOpen.value = true
}

async function confirmDelete(): Promise<void> {
  isDeleting.value = true
  deleteError.value = null

  try {
    await usersStore.deleteUser(userId.value)
    isDeleteModalOpen.value = false
    router.push({ name: 'users', query: usersStore.listQuery })
  } catch (e) {
    deleteError.value = e instanceof Error ? e.message : 'Не вдалося видалити користувача'
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <RouterLink :to="{ name: 'users', query: usersStore.listQuery }" class="back-link">
    <i class="bi bi-arrow-left"></i>
    До списку учасників
  </RouterLink>

  <div class="card">
    <div v-if="isLoading && !user" class="card-body state">
      <i class="bi bi-arrow-repeat state__spinner"></i>
      Завантаження...
    </div>

    <div v-else-if="loadError" class="card-body state state--error">
      <p class="state__text">
        <i class="bi bi-exclamation-triangle"></i>
        {{ loadError }}
      </p>
      <button type="button" class="btn btn-primary" @click="loadUser">Спробувати ще раз</button>
    </div>

    <div v-else-if="user" class="card-body">
      <div class="profile">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="`${user.firstName} ${user.lastName}`"
          class="profile__avatar"
        />
        <span v-else class="profile__avatar profile__avatar--empty">
          <i class="bi bi-person"></i>
        </span>

        <div class="profile__info">
          <h1 class="profile__name">{{ user.firstName }} {{ user.lastName }}</h1>
          <p class="profile__username">@{{ user.username }}</p>
        </div>

        <div v-if="!isEditing" class="profile__actions">
          <RouterLink :to="{ name: 'user-edit', params: { id } }" class="btn btn-primary">
            <i class="bi bi-pencil"></i>
            Редагувати
          </RouterLink>
          <button type="button" class="btn btn-danger" @click="openDeleteModal">
            <i class="bi bi-trash"></i>
            Видалити
          </button>
        </div>
      </div>

      <dl v-if="!isEditing" class="details">
        <div v-for="item in details" :key="item.label" class="details__item">
          <dt class="details__label">{{ item.label }}</dt>
          <dd class="details__value">{{ item.value }}</dd>
        </div>
      </dl>

      <RouterView />
    </div>
  </div>

  <DeleteUserModal
    v-model="isDeleteModalOpen"
    :user="user"
    :is-deleting="isDeleting"
    :error-message="deleteError"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  color: #495057;
  text-decoration: none;
}

.back-link:hover {
  color: #0d6efd;
}

.profile {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
}

.profile__avatar {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  border: 3px solid #e7f1ff;
  border-radius: 50%;
  background-color: #f1f3f5;
  object-fit: cover;
}

.profile__avatar--empty {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 2.5rem;
}

.profile__info {
  flex: 1;
  min-width: 200px;
}

.profile__name {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.profile__username {
  color: #6c757d;
  margin: 0;
}

.profile__actions {
  display: flex;
  gap: 12px;
}

.profile__actions .bi {
  margin-right: 6px;
}

.details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 0;
}

.details__item {
  padding: 14px 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.details__label {
  margin-bottom: 4px;
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 500;
}

.details__value {
  margin: 0;
  word-break: break-word;
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
