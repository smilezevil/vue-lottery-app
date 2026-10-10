<script setup lang="ts">
interface NavItem {
  label: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
]
</script>

<template>
  <nav class="app-navigation">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
      {{ item.label }}
    </RouterLink>

    <RouterLink to="/login" class="nav-item nav-item--login">
      <i class="bi bi-box-arrow-in-right"></i>
      Login
    </RouterLink>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  color: #495057;
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.nav-item:hover {
  background-color: #f1f3f5;
  color: #212529;
}

.nav-item.router-link-active {
  background-color: #e7f1ff;
  color: #0d6efd;
}

.nav-item--login {
  margin-left: 8px;
  border: 1px solid #0d6efd;
  color: #0d6efd;
}

.nav-item--login:hover {
  background-color: #0d6efd;
  color: #fff;
}

.nav-item--login.router-link-active {
  background-color: #0d6efd;
  color: #fff;
}
</style>
