<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'
import avatarUrl from './avatar.jpg'

const FULL_NAME = 'Демʼянчук Анастасія Михайлівна'
const GITHUB_URL = 'https://github.com/smilezevil'

const skills: string[] = [
  'HTML',
  'CSS / SCSS',
  'JavaScript',
  'TypeScript',
  'Vue 3',
  'Vue Router',
  'Pinia',
  'PrimeVue',
  'Bootstrap',
  'Webpack',
  'Vite',
  'Git / GitHub',
  'ESLint / Prettier',
]
</script>

<template>
  <AppCard>
    <div class="author">
      <img :src="avatarUrl" :alt="FULL_NAME" class="author__avatar" />
      <div>
        <h1 class="page-title">{{ FULL_NAME }}</h1>
        <p class="muted author__role">Автор проєкту</p>
      </div>
    </div>

    <h2 class="section-title">Technical skills</h2>
    <div class="tag-list">
      <span v-for="skill in skills" :key="skill" class="tag">{{ skill }}</span>
    </div>

    <AppButton :href="GITHUB_URL" label="GitHub профіль" icon="pi pi-github" />
  </AppCard>
</template>

<style scoped lang="scss">
.author {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;

  &__avatar {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border: 3px solid var(--p-highlight-background);
    border-radius: 50%;
    object-fit: cover;
  }

  &__role {
    margin: 0;
  }
}
</style>
