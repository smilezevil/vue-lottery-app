<script setup lang="ts">
import type { Participant } from '../types/Participant'

defineProps<{
  participants: Participant[]
}>()
</script>

<template>
  <div class="card">
    <div class="card-body">
      <table class="table">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Date of Birth</th>
          <th>Email</th>
          <th>Phone number</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(participant, index) in participants" :key="participant.id">
          <td>{{ index + 1 }}</td>
          <td>{{ participant.name }}</td>
          <td>{{ participant.dob }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
        </tr>
        </tbody>
      </table>
      <p v-if="participants.length === 0" class="empty-message">Список учасників пустий</p>
    </div>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
}

.table th,
.table td {
  padding: 14px 16px;
  font-size: 1rem;
  white-space: nowrap;
}

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 16px 0;
}
</style>
