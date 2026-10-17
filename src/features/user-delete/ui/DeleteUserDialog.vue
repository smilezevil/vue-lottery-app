<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppConfirmDialog, useNotify } from '@/shared/ui'

const props = defineProps<{
  user: User | null
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  deleted: [user: User]
}>()

const usersStore = useUsersStore()
const notify = useNotify()

const isDeleting = ref(false)

async function confirmDelete(): Promise<void> {
  const user = props.user
  if (!user) {
    return
  }

  isDeleting.value = true

  try {
    await usersStore.removeUser(user.id)
    visible.value = false
    notify.success('Користувача видалено', `${user.firstName} ${user.lastName}`)
    emit('deleted', user)
  } catch (e) {
    notify.error('Не вдалося видалити користувача', e instanceof Error ? e.message : undefined)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <AppConfirmDialog
    v-model:visible="visible"
    header="Видалення учасника"
    confirm-label="Так, видалити"
    severity="danger"
    :loading="isDeleting"
    @confirm="confirmDelete"
  >
    <p v-if="user" class="delete-text">
      Ви дійсно бажаєте видалити учасника
      <strong>{{ user.firstName }} {{ user.lastName }}</strong> ({{ user.email }})?
    </p>
  </AppConfirmDialog>
</template>

<style scoped lang="scss">
.delete-text {
  margin: 0;
}
</style>
