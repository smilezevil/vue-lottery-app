<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteMeta } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

type LayoutName = NonNullable<RouteMeta['layout']>

const layouts: Record<LayoutName, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isRouterReady = ref(false)

const currentLayout = computed(() => layouts[route.meta.layout ?? 'default'])

onMounted(async () => {
  await router.isReady()
  isRouterReady.value = true
  await authStore.fetchCurrentUser()
})

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated && route.meta.requiresAuth) {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
    }
  },
)
</script>

<template>
  <component :is="currentLayout" v-if="isRouterReady">
    <RouterView />
  </component>
</template>
