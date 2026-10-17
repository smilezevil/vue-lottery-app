import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const DARK_CLASS = 'app-dark'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const theme = ref<Theme>('light')

    const isDark = computed(() => theme.value === 'dark')

    function toggleTheme(): void {
      theme.value = isDark.value ? 'light' : 'dark'
    }

    watch(
      isDark,
      (dark) => {
        document.documentElement.classList.toggle(DARK_CLASS, dark)
      },
      { immediate: true },
    )

    return { theme, isDark, toggleTheme }
  },
  {
    persist: {
      key: 'settings:theme',
      pick: ['theme'],
    },
  },
)
