<script setup lang="ts">
import type { User } from '@/entities/user'

defineProps<{
  users: User[]
  startIndex: number
}>()

const emit = defineEmits<{
  delete: [user: User]
}>()
</script>

<template>
  <div class="table-wrapper">
    <table class="table participants-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
        <th>Email</th>
        <th>Phone number</th>
        <th class="actions-cell">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
        <td class="index-cell">{{ startIndex + index + 1 }}</td>
        <td>
          <RouterLink :to="{ name: 'user-details', params: { id: user.id } }" class="user-cell">
            <img
              v-if="user.image"
              :src="user.image"
              :alt="`${user.firstName} ${user.lastName}`"
              class="user-cell__avatar"
            />
            <span v-else class="user-cell__avatar user-cell__avatar--empty">
                <i class="bi bi-person"></i>
              </span>
            <span class="text-cell" :title="`${user.firstName} ${user.lastName}`">
                {{ user.firstName }} {{ user.lastName }}
              </span>
          </RouterLink>
        </td>
        <td>{{ user.age }}</td>
        <td>{{ user.gender }}</td>
        <td>
          <span class="text-cell" :title="user.email">{{ user.email }}</span>
        </td>
        <td>{{ user.phone }}</td>
        <td class="actions-cell">
          <div class="actions">
            <RouterLink
              :to="{ name: 'user-details', params: { id: user.id } }"
              class="icon-btn"
              title="Переглянути"
              aria-label="Переглянути"
            >
              <i class="bi bi-eye"></i>
            </RouterLink>
            <RouterLink
              :to="{ name: 'user-edit', params: { id: user.id } }"
              class="icon-btn icon-btn--edit"
              title="Редагувати дані"
              aria-label="Редагувати дані"
            >
              <i class="bi bi-pencil"></i>
            </RouterLink>
            <button
              type="button"
              class="icon-btn icon-btn--delete"
              title="Видалити учасника"
              aria-label="Видалити учасника"
              @click="emit('delete', user)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <p v-if="users.length === 0" class="empty-message">Користувачів не знайдено</p>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.participants-table {
  width: 100%;
  margin-bottom: 0;
}

.participants-table th,
.participants-table td {
  padding: 12px 10px;
  vertical-align: middle;
  white-space: nowrap;
}

.participants-table th {
  font-weight: 600;
}

.index-cell {
  color: #6c757d;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.user-cell:hover .text-cell {
  color: #0d6efd;
  text-decoration: underline;
}

.user-cell__avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f3f5;
  object-fit: cover;
}

.user-cell__avatar--empty {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.text-cell {
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.actions-cell {
  text-align: right;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #fff;
  color: #495057;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.icon-btn:hover {
  background-color: #f1f3f5;
}

.icon-btn--edit:hover {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  color: #0d6efd;
}

.icon-btn--delete {
  color: #dc3545;
}

.icon-btn--delete:hover {
  border-color: #dc3545;
  background-color: #fdecee;
}

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 24px 0 8px;
}
</style>
