<script setup lang="ts">
import { AppLogo } from '@/widgets/app-header'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__content">
      <AppLogo />
      <slot />
      <RouterLink to="/" class="back-link">
        <i class="pi pi-arrow-left"></i>
        На головну
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 48px 16px;
  background: linear-gradient(135deg, var(--p-highlight-background) 0%, transparent 60%);

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
    max-width: 440px;
  }
}
</style>
