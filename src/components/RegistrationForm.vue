<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Participant } from '../types/Participant'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  register: [participant: Participant]
}>()

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
    props.participants.some(
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

  emit('register', {
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
  <div class="card form-card">
    <div class="card-body" @keyup.enter="handleSave">
      <h5 class="card-title">REGISTER FORM</h5>
      <p class="hint">Please fill in all the fields.</p>

      <BaseInput v-model="name" label="Name" placeholder="Enter user name" :error="errors.name" />
      <BaseInput v-model="dob" type="date" label="Date of Birth" :error="errors.dob" />
      <BaseInput v-model="email" label="Email" placeholder="Enter email" :error="errors.email" />
      <BaseInput
        v-model="phone"
        label="Phone number"
        placeholder="Enter Phone number"
        :error="errors.phone"
      />

      <div class="form-actions">
        <BaseButton @click="handleSave">Save</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  margin-bottom: 32px;
}

.card-title {
  font-size: 1.5rem;
}

.hint {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.form-actions {
  text-align: right;
}
</style>
