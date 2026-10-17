<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { DeleteUserDialog } from '@/features/user-delete'
import { AppButton, AppCard, AppMessage } from '@/shared/ui'

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
const { listQuery } = storeToRefs(usersStore)

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
    await usersStore.fetchUser(userId.value)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Не вдалося завантажити користувача'
  } finally {
    isLoading.value = false
  }
}

watch(userId, loadUser, { immediate: true })

const isDeleteDialogOpen = ref(false)

function backToList(): void {
  router.push({ name: 'users', query: listQuery.value })
}
</script>

<template>
  <RouterLink :to="{ name: 'users', query: listQuery }" class="back-link">
    <i class="pi pi-arrow-left"></i>
    До списку учасників
  </RouterLink>

  <AppCard>
    <div v-if="isLoading && !user" class="state">
      <i class="pi pi-spin pi-spinner"></i>
      Завантаження...
    </div>

    <div v-else-if="loadError" class="state">
      <AppMessage severity="error">{{ loadError }}</AppMessage>
      <AppButton label="Спробувати ще раз" icon="pi pi-refresh" @click="loadUser" />
    </div>

    <template v-else-if="user">
      <div class="profile">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="`${user.firstName} ${user.lastName}`"
          class="profile__avatar"
        />
        <span v-else class="profile__avatar profile__avatar--empty">
          <i class="pi pi-user"></i>
        </span>

        <div class="profile__info">
          <h1 class="page-title">{{ user.firstName }} {{ user.lastName }}</h1>
          <p class="muted profile__username">@{{ user.username }}</p>
        </div>

        <div v-if="!isEditing" class="profile__actions">
          <AppButton
            :to="{ name: 'user-edit', params: { id } }"
            label="Редагувати"
            icon="pi pi-pencil"
          />
          <AppButton
            label="Видалити"
            icon="pi pi-trash"
            severity="danger"
            variant="outlined"
            @click="isDeleteDialogOpen = true"
          />
        </div>
      </div>

      <dl v-if="!isEditing" class="details">
        <div v-for="item in details" :key="item.label" class="details__item">
          <dt class="details__label">{{ item.label }}</dt>
          <dd class="details__value">{{ item.value }}</dd>
        </div>
      </dl>

      <RouterView />
    </template>
  </AppCard>

  <DeleteUserDialog v-model:visible="isDeleteDialogOpen" :user="user" @deleted="backToList" />
</template>

<style scoped lang="scss">
.profile {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;

  &__avatar {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border: 3px solid var(--p-highlight-background);
    border-radius: 50%;
    background-color: var(--p-content-hover-background);
    object-fit: cover;

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--p-text-muted-color);
      font-size: 2.5rem;
    }
  }

  &__info {
    flex: 1;
    min-width: 200px;
  }

  &__username {
    margin: 0;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }
}

.details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 0;

  &__item {
    padding: 14px 16px;
    border-radius: 8px;
    background-color: var(--p-content-hover-background);
  }

  &__label {
    margin-bottom: 4px;
    color: var(--p-text-muted-color);
    font-size: 0.85rem;
    font-weight: 500;
  }

  &__value {
    margin: 0;
    word-break: break-word;
  }
}
</style>
