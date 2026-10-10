<script setup lang="ts">
import type { User } from '@/types/user'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

defineProps<{
  user: User | null
  isDeleting?: boolean
  errorMessage?: string | null
}>()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <BaseModal v-model="isOpen">
    <template #header>
      <h5 class="modal-title">Видалення учасника</h5>
    </template>

    <p v-if="user" class="delete-text">
      Ви дійсно бажаєте видалити учасника "{{ user.firstName }} {{ user.lastName }}", "{{
        user.email
      }}"?
    </p>

    <p v-if="errorMessage" class="delete-error">
      <i class="bi bi-exclamation-triangle"></i>
      {{ errorMessage }}
    </p>

    <template #footer>
      <BaseButton variant="secondary" :disabled="isDeleting" @click="isOpen = false">
        Ні
      </BaseButton>
      <BaseButton variant="danger" :disabled="isDeleting" @click="emit('confirm')">
        {{ isDeleting ? 'Видалення...' : 'Так' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.delete-text {
  margin: 0;
}

.delete-error {
  margin: 12px 0 0;
  color: #dc3545;
}
</style>
