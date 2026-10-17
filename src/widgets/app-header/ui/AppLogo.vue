<template>
  <RouterLink to="/" class="app-logo">
    <span class="app-logo__icon">
      <i class="pi pi-trophy"></i>
    </span>
    <span class="app-logo__text">Vue Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--p-text-color);
  text-decoration: none;

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
    font-size: 1.1rem;
  }

  &__text {
    font-size: 1.25rem;
    font-weight: 600;
  }
}
</style>
