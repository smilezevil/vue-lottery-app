<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton, useNotify } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const notify = useNotify()

async function logout(): Promise<void> {
  await router.push({ name: 'home' })
  sessionStore.logout()
  notify.info('Ви вийшли з акаунта')
}
</script>

<template>
  <AppButton label="Logout" icon="pi pi-sign-out" variant="outlined" size="small" @click="logout" />
</template>
