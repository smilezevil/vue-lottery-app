<script setup lang="ts">
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
  'Bootstrap 5',
  'SCSS',
  'Vite',
  'ESLint',
  'DummyJSON REST API',
]
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h1 class="page-title">Vue Lottery App</h1>
      <p class="lead-text">
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

      <a :href="REPOSITORY_URL" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="bi bi-github"></i>
        Проєкт на GitHub
      </a>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.lead-text {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.feature-list {
  margin-bottom: 32px;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 6px;
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
