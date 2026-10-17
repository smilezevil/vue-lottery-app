<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import { useSessionStore } from '@/entities/session'
import { AppButton, AppInput, useNotify } from '@/shared/ui'

const emit = defineEmits<{
  success: []
}>()

const REQUIRED = "Поле обов'язкове для заповнення"
const MIN_PASSWORD_LENGTH = 6

const sessionStore = useSessionStore()
const notify = useNotify()

const loginSchema = toTypedSchema(
  z.object({
    username: z.string({ required_error: REQUIRED }).trim().min(1, REQUIRED),
    password: z
      .string({ required_error: REQUIRED })
      .min(1, REQUIRED)
      .min(MIN_PASSWORD_LENGTH, `Мінімум ${MIN_PASSWORD_LENGTH} символів`),
  }),
)

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: loginSchema,
})

const fieldConfig = (state: { errors: string[] }) => ({
  validateOnModelUpdate: state.errors.length > 0,
})

const [username, usernameAttrs] = defineField('username', fieldConfig)
const [password, passwordAttrs] = defineField('password', fieldConfig)

const isSubmitting = ref(false)

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true

  try {
    await sessionStore.login(values)
    emit('success')
  } catch (e) {
    notify.error('Помилка авторизації', e instanceof Error ? e.message : 'Не вдалося увійти')
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <AppInput
      v-model="username"
      v-bind="usernameAttrs"
      label="Username"
      placeholder="emilys"
      autocomplete="username"
      :error="errors.username"
    />
    <AppInput
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      label="Password"
      autocomplete="current-password"
      :error="errors.password"
    />

    <AppButton
      type="submit"
      label="Увійти"
      icon="pi pi-sign-in"
      :loading="isSubmitting"
      class="login-form__submit"
    />
  </form>
</template>

<style scoped lang="scss">
.login-form__submit {
  width: 100%;
  margin-top: 4px;
}
</style>
