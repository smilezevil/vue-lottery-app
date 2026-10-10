<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__content">
      <AppLogo class="auth-layout__logo" />
      <slot />
      <RouterLink to="/" class="auth-layout__back">
        <i class="bi bi-arrow-left"></i>
        На головну
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 48px 16px;
  background: linear-gradient(135deg, #e7f1ff 0%, #f4f4f4 60%);
}

.auth-layout__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 440px;
}

.auth-layout__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #495057;
  text-decoration: none;
}

.auth-layout__back:hover {
  color: #0d6efd;
}
</style>
