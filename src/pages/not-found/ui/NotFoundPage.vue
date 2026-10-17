<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'
</script>

<template>
  <AppCard>
    <div class="not-found">
      <h1 class="not-found__code">404</h1>
      <p class="muted not-found__text">Сторінку не знайдено</p>
      <AppButton to="/" label="На головну" icon="pi pi-home" />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.not-found {
  padding: 32px 0;
  text-align: center;

  &__code {
    margin-bottom: 8px;
    color: var(--p-primary-color);
    font-size: 5rem;
    font-weight: 700;
  }

  &__text {
    margin-bottom: 24px;
    font-size: 1.25rem;
  }
}
</style>
