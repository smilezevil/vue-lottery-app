<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #fff;
  border-bottom: 1px solid #dee2e6;
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
}
</style>
