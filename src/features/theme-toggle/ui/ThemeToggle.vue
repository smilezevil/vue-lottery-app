<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useThemeStore } from '../model/theme.store'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore

const label = computed(() => (isDark.value ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'))
</script>

<template>
  <AppButton
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    severity="secondary"
    variant="text"
    rounded
    :title="label"
    :aria-label="label"
    @click="toggleTheme"
  />
</template>
