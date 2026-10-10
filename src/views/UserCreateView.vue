<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import UserForm from '@/components/UserForm.vue'

const router = useRouter()
const usersStore = useUsersStore()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

async function handleSubmit(values: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = null

  try {
    await usersStore.createUser(values)
    router.push({ name: 'users' })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Не вдалося створити користувача'
  } finally {
    isSubmitting.value = false
  }
}

function cancel(): void {
  router.push({ name: 'users', query: usersStore.listQuery })
}
</script>

<template>
  <RouterLink :to="{ name: 'users', query: usersStore.listQuery }" class="back-link">
    <i class="bi bi-arrow-left"></i>
    До списку учасників
  </RouterLink>

  <div class="card">
    <div class="card-body">
      <h1 class="page-title">Новий учасник</h1>
      <p class="hint">Заповніть усі поля, щоб додати учасника.</p>

      <UserForm
        submit-label="Створити"
        :is-submitting="isSubmitting"
        :error-message="submitError"
        @submit="handleSubmit"
        @cancel="cancel"
      />
    </div>
  </div>
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

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.hint {
  color: #6c757d;
  margin-bottom: 24px;
}
</style>
