<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { CreateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { useNotify } from '@/shared/ui'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const usersStore = useUsersStore()
const notify = useNotify()

const userId = computed(() => Number(props.id))

const initialValues = computed<CreateUserDto | undefined>(() => {
  const user = usersStore.getUser(userId.value)
  if (!user) {
    return undefined
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    password: user.password,
    age: user.age,
    gender: user.gender,
    phone: user.phone,
  }
})

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

function backToDetails(): void {
  router.push({ name: 'user-details', params: { id: props.id } })
}

async function handleSubmit(values: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = null

  try {
    const user = await usersStore.updateUser(userId.value, values)
    notify.success('Дані оновлено', `${user.firstName} ${user.lastName}`)
    backToDetails()
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Не вдалося оновити дані'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="edit-section">
    <h2 class="section-title">Редагування даних</h2>

    <UserForm
      v-if="initialValues"
      :key="userId"
      :initial-values="initialValues"
      submit-label="Оновити дані"
      :is-submitting="isSubmitting"
      :error-message="submitError"
      @submit="handleSubmit"
      @cancel="backToDetails"
    />
  </section>
</template>

<style scoped lang="scss">
.edit-section {
  padding-top: 24px;
  border-top: 1px solid var(--p-content-border-color);
}
</style>
