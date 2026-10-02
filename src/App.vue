<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Participant } from './types/Participant'

const participants = ref<Participant[]>([])

const winnerIds = ref<number[]>([])

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => Boolean(p)),
)

const availableForWinning = computed(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed(
  () => winnerIds.value.length < 3 && availableForWinning.value.length > 0,
)

function pickWinner(): void {
  if (!canPickWinner.value) {
    return
  }

  const pool = availableForWinning.value
  const randomIndex = Math.floor(Math.random() * pool.length)
  winnerIds.value.push(pool[randomIndex].id)
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

const name = ref('')
const dob = ref('')
const email = ref('')
const phone = ref('')

const errors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+380\d{9}$/

function validateForm(): boolean {
  errors.name = name.value.trim() ? '' : "Поле обов'язкове для заповнення"

  if (!email.value.trim()) {
    errors.email = "Поле обов'язкове для заповнення"
  } else if (!EMAIL_REGEX.test(email.value.trim())) {
    errors.email = 'Некоректний формат email'
  } else if (
    participants.value.some(
      (p) => p.email.toLowerCase() === email.value.trim().toLowerCase(),
    )
  ) {
    errors.email = 'Учасник з такою поштою вже зареєстрований'
  } else {
    errors.email = ''
  }

  if (!phone.value.trim()) {
    errors.phone = "Поле обов'язкове для заповнення"
  } else if (!PHONE_REGEX.test(phone.value.trim())) {
    errors.phone = 'Формат телефону: +380XXXXXXXXX'
  } else {
    errors.phone = ''
  }

  if (!dob.value) {
    errors.dob = "Поле обов'язкове для заповнення"
  } else if (new Date(dob.value) > new Date()) {
    errors.dob = 'Дата народження не може бути у майбутньому'
  } else {
    errors.dob = ''
  }

  return !errors.name && !errors.email && !errors.phone && !errors.dob
}

function resetForm(): void {
  name.value = ''
  dob.value = ''
  email.value = ''
  phone.value = ''
  errors.name = ''
  errors.dob = ''
  errors.email = ''
  errors.phone = ''
}

function handleSave(): void {
  if (!validateForm()) {
    return
  }

  participants.value.push({
    id: Date.now(),
    name: name.value.trim(),
    dob: dob.value,
    email: email.value.trim(),
    phone: phone.value.trim(),
  })

  resetForm()
}
</script>

<template>
  <div class="app">
    <div class="card winners-card">
      <div class="card-body winners-body">
        <div class="winners-list">
          <span v-if="winners.length === 0" class="winners-placeholder">Winners</span>
          <span v-for="winner in winners" :key="winner.id" class="winner-chip">
            {{ winner.name }}
            <button
              type="button"
              class="winner-chip__remove"
              @click="removeWinner(winner.id)"
            >
              ×
            </button>
          </span>
        </div>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!canPickWinner"
          @click="pickWinner"
        >
          New winner
        </button>
      </div>
    </div>

    <div class="card form-card">
      <div class="card-body" @keyup.enter="handleSave">
        <h5 class="card-title">REGISTER FORM</h5>
        <p class="hint">Please fill in all the fields.</p>

        <div class="field">
          <label class="form-label">Name</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="Enter user name"
          />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
        </div>

        <div class="field">
          <label class="form-label">Date of Birth</label>
          <input
            v-model="dob"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.dob }"
          />
          <div v-if="errors.dob" class="invalid-feedback">{{ errors.dob }}</div>
        </div>

        <div class="field">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="Enter email"
          />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="field">
          <label class="form-label">Phone number</label>
          <input
            v-model="phone"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.phone }"
            placeholder="Enter Phone number"
          />
          <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-primary" @click="handleSave">Save</button>
        </div>
      </div>
    </div>

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
        <p v-if="participants.length === 0" class="empty-message">
          Список учасників пустий
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
}

.winners-card {
  margin-bottom: 32px;
}

.winners-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.winners-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.winners-placeholder {
  color: #adb5bd;
}

.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #0d6efd;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.winner-chip__remove {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.form-card {
  margin-bottom: 32px;
}

.card-body {
  padding: 32px;
}

.card-title {
  font-size: 1.5rem;
}

.hint {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.field {
  margin-bottom: 20px;
}

.field label {
  font-weight: 500;
  margin-bottom: 6px;
}

.form-control {
  padding: 10px 14px;
  font-size: 1rem;
}

.form-actions {
  text-align: right;
}

.btn {
  padding: 10px 24px;
  font-size: 1rem;
}

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
