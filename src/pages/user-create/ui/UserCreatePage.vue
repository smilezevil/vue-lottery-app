<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { CreateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { AppCard, useNotify } from '@/shared/ui'

const router = useRouter()
const usersStore = useUsersStore()
const { listQuery } = storeToRefs(usersStore)
const notify = useNotify()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

async function handleSubmit(values: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = null

  try {
    const user = await usersStore.createUser(values)
    notify.success('Користувача створено', `${user.firstName} ${user.lastName}`)
    router.push({ name: 'users' })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Не вдалося створити користувача'
  } finally {
    isSubmitting.value = false
  }
}

function cancel(): void {
  router.push({ name: 'users', query: listQuery.value })
}
</script>

<template>
  <RouterLink :to="{ name: 'users', query: listQuery }" class="back-link">
    <i class="pi pi-arrow-left"></i>
    До списку учасників
  </RouterLink>

  <AppCard>
    <h1 class="page-title">Новий учасник</h1>
    <p class="muted hint">Заповніть усі поля, щоб додати учасника.</p>

    <UserForm
      submit-label="Створити"
      :is-submitting="isSubmitting"
      :error-message="submitError"
      @submit="handleSubmit"
      @cancel="cancel"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.hint {
  margin-bottom: 24px;
}
</style>
