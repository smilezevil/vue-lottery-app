<script setup lang="ts">
import type { User } from '@/types/user'

defineProps<{
  users: User[]
  startIndex: number
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
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
        <td class="index-cell">{{ startIndex + index + 1 }}</td>
        <td>
          <div class="user-cell">
            <img
              v-if="user.image"
              :src="user.image"
              :alt="`${user.firstName} ${user.lastName}`"
              class="user-cell__avatar"
            />
            <span class="text-cell" :title="`${user.firstName} ${user.lastName}`">
                {{ user.firstName }} {{ user.lastName }}
              </span>
          </div>
        </td>
        <td>{{ user.age }}</td>
        <td>{{ user.gender }}</td>
        <td>
          <span class="text-cell" :title="user.email">{{ user.email }}</span>
        </td>
        <td>{{ user.phone }}</td>
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
}

.user-cell__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f3f5;
  object-fit: cover;
}

.text-cell {
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 24px 0 8px;
}
</style>
