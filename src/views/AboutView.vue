<script setup lang="ts">
import avatarUrl from '@/assets/avatar.jpg'

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
  'Bootstrap',
  'Webpack',
  'Vite',
  'Git / GitHub',
  'ESLint / Prettier',
]
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="author">
        <img :src="avatarUrl" :alt="FULL_NAME" class="author__avatar" />
        <div>
          <h1 class="author__name">{{ FULL_NAME }}</h1>
          <p class="author__role">Автор проєкту</p>
        </div>
      </div>

      <h2 class="section-title">Technical skills</h2>
      <div class="tag-list">
        <span v-for="skill in skills" :key="skill" class="tag">{{ skill }}</span>
      </div>

      <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="bi bi-github"></i>
        GitHub профіль
      </a>
    </div>
  </div>
</template>

<style scoped>
.author {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.author__avatar {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  border: 3px solid #e7f1ff;
  border-radius: 50%;
  object-fit: cover;
}

.author__name {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.author__role {
  color: #6c757d;
  margin: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.tag {
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #e7f1ff;
  color: #0d6efd;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn .bi {
  margin-right: 6px;
}
</style>
