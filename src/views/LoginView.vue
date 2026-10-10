<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const REQUIRED = "Поле обов'язкове для заповнення"
const MIN_PASSWORD_LENGTH = 6

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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
const loginError = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  loginError.value = null

  try {
    await authStore.login(values)

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    router.push(redirect ?? { name: 'users' })
  } catch (e) {
    loginError.value = e instanceof Error ? e.message : 'Не вдалося увійти'
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <div class="login">
    <div class="card login__card">
      <div class="card-body">
        <h1 class="login__title">Вхід</h1>
        <p class="login__hint">
          Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
        </p>

        <form novalidate @submit.prevent="onSubmit">
          <BaseInput
            v-model="username"
            v-bind="usernameAttrs"
            label="Username"
            placeholder="emilys"
            autocomplete="username"
            :error="errors.username"
          />
          <BaseInput
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            label="Password"
            autocomplete="current-password"
            :error="errors.password"
          />

          <p v-if="loginError" class="login__error">
            <i class="bi bi-exclamation-triangle"></i>
            {{ loginError }}
          </p>

          <BaseButton type="submit" class="login__submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Вхід...' : 'Увійти' }}
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
}

.login__card {
  width: 100%;
  max-width: 440px;
}

.login__title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.login__hint {
  color: #6c757d;
  margin-bottom: 24px;
}

.login__error {
  padding: 12px 16px;
  border-radius: 6px;
  background-color: #fdecee;
  color: #dc3545;
}

.login__submit {
  width: 100%;
}
</style>
