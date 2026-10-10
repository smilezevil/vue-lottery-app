<template>
  <div class="card">
    <div class="card-body not-found">
      <h1 class="not-found__code">404</h1>
      <p class="not-found__text">Сторінку не знайдено</p>
      <RouterLink to="/" class="btn btn-primary">На головну</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 64px 32px;
}

.not-found__code {
  font-size: 5rem;
  font-weight: 700;
  color: #0d6efd;
  margin-bottom: 8px;
}

.not-found__text {
  color: #6c757d;
  font-size: 1.25rem;
  margin-bottom: 24px;
}
</style>
