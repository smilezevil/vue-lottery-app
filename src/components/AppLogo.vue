<template>
  <RouterLink to="/" class="app-logo">
    <span class="app-logo__icon">
      <i class="bi bi-trophy-fill"></i>
    </span>
    <span class="app-logo__text">Vue Lottery</span>
  </RouterLink>
</template>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #212529;
  text-decoration: none;
}

.app-logo__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #0d6efd;
  color: #fff;
  font-size: 1.1rem;
}

.app-logo__text {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
