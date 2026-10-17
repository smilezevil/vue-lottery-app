<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
import { ThemeToggle } from '@/features/theme-toggle'
import { AppButton } from '@/shared/ui'

interface NavItem {
  label: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
]

const { isAuthenticated, user } = storeToRefs(useSessionStore())
</script>

<template>
  <nav class="app-navigation">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
      {{ item.label }}
    </RouterLink>

    <ThemeToggle />

    <template v-if="isAuthenticated">
      <span v-if="user" class="current-user">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="user.firstName"
          class="current-user__avatar"
        />
        {{ user.firstName }}
      </span>
      <LogoutButton />
    </template>

    <AppButton
      v-else
      :to="{ name: 'login' }"
      label="Login"
      icon="pi pi-sign-in"
      variant="outlined"
      size="small"
    />
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.nav-item {
  padding: 8px 14px;
  border-radius: 6px;
  color: var(--p-text-muted-color);
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: var(--p-content-hover-background);
    color: var(--p-text-color);
  }

  &.router-link-active {
    background-color: var(--p-highlight-background);
    color: var(--p-highlight-color);
  }
}

.current-user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 8px 0 12px;
  color: var(--p-text-muted-color);
  font-weight: 500;

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--p-content-hover-background);
    object-fit: cover;
  }
}
</style>
