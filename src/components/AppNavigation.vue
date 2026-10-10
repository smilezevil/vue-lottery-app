<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface NavItem {
  label: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
]

const router = useRouter()
const authStore = useAuthStore()

function logout(): void {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="app-navigation">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
      {{ item.label }}
    </RouterLink>

    <template v-if="authStore.isAuthenticated">
      <span v-if="authStore.user" class="current-user">
        <img
          v-if="authStore.user.image"
          :src="authStore.user.image"
          :alt="authStore.user.firstName"
          class="current-user__avatar"
        />
        {{ authStore.user.firstName }}
      </span>
      <button type="button" class="nav-item nav-item--auth" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </template>

    <RouterLink v-else to="/login" class="nav-item nav-item--auth">
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
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  color: #495057;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
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

.nav-item--auth {
  margin-left: 8px;
  border-color: #0d6efd;
  color: #0d6efd;
}

.nav-item--auth:hover,
.nav-item--auth.router-link-active {
  background-color: #0d6efd;
  color: #fff;
}

.current-user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  color: #495057;
  font-weight: 500;
}

.current-user__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f3f5;
  object-fit: cover;
}
</style>
