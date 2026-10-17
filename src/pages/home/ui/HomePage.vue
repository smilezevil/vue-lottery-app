<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'

const REPOSITORY_URL = 'https://github.com/smilezevil/vue-lottery-app'

const features: string[] = [
  'Реєстрація учасників лотереї з валідацією форми',
  'Випадковий вибір до трьох переможців',
  'Список користувачів з DummyJSON API: пошук, пагінація, перегляд, редагування та видалення',
  'Авторизація за JWT-токеном і захищені сторінки',
]

const technologies: string[] = [
  'Vue 3',
  'Composition API',
  'TypeScript',
  'Vue Router',
  'Pinia',
  'PrimeVue',
  'Feature-Sliced Design',
  'SCSS',
  'Vite',
  'ESLint',
  'Steiger',
  'DummyJSON REST API',
]
</script>

<template>
  <AppCard>
    <h1 class="page-title">Vue Lottery App</h1>
    <p class="muted lead-text">
      Односторінковий застосунок для проведення лотереї та керування її учасниками.
    </p>

    <h2 class="section-title">Можливості</h2>
    <ul class="feature-list">
      <li v-for="feature in features" :key="feature">{{ feature }}</li>
    </ul>

    <h2 class="section-title">Технології</h2>
    <div class="tag-list">
      <span v-for="technology in technologies" :key="technology" class="tag">
        {{ technology }}
      </span>
    </div>

    <AppButton :href="REPOSITORY_URL" label="Проєкт на GitHub" icon="pi pi-github" />
  </AppCard>
</template>

<style scoped lang="scss">
.lead-text {
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.feature-list {
  margin: 0 0 32px;
  padding-left: 20px;

  li {
    margin-bottom: 6px;
  }
}
</style>
