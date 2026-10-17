<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteMeta } from 'vue-router'
import { useSessionStore } from '@/entities/session/model/session.store'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

type LayoutName = NonNullable<RouteMeta['layout']>

const layouts: Record<LayoutName, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()

const isRouterReady = ref(false)

const currentLayout = computed(() => layouts[route.meta.layout ?? 'default'])

onMounted(async () => {
  await router.isReady()
  isRouterReady.value = true
  await sessionStore.fetchCurrentUser()
})

watch(
  () => sessionStore.isAuthenticated,
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
