<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LoginForm } from '@/features/auth'
import { AppCard } from '@/shared/ui'

const route = useRoute()
const router = useRouter()

function onLoginSuccess(): void {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  router.push(redirect ?? { name: 'users' })
}
</script>

<template>
  <AppCard class="login">
    <h1 class="page-title">Вхід</h1>
    <p class="muted login__hint">
      Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
    </p>

    <LoginForm @success="onLoginSuccess" />
  </AppCard>
</template>

<style scoped lang="scss">
.login {
  width: 100%;

  &__hint {
    margin-bottom: 24px;
  }
}
</style>
