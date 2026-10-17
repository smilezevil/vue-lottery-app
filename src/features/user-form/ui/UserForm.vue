<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { CreateUserDto } from '@/entities/user'
import { AppButton, AppInput, AppMessage, AppSelect } from '@/shared/ui'
import type { AppSelectOption } from '@/shared/ui'

const props = withDefaults(
  defineProps<{
    initialValues?: CreateUserDto
    submitLabel?: string
    isSubmitting?: boolean
    errorMessage?: string | null
  }>(),
  {
    initialValues: undefined,
    submitLabel: 'Зберегти',
    isSubmitting: false,
    errorMessage: null,
  },
)

const emit = defineEmits<{
  submit: [values: CreateUserDto]
  cancel: []
}>()

const genderOptions: AppSelectOption[] = [
  { label: 'female', value: 'female' },
  { label: 'male', value: 'male' },
]

const REQUIRED = "Поле обов'язкове для заповнення"
const MIN_PASSWORD_LENGTH = 6

const userSchema = toTypedSchema(
  z.object({
    firstName: z.string({ required_error: REQUIRED }).trim().min(1, REQUIRED),
    lastName: z.string({ required_error: REQUIRED }).trim().min(1, REQUIRED),
    email: z
      .string({ required_error: REQUIRED })
      .trim()
      .min(1, REQUIRED)
      .email('Некоректний формат email'),
    username: z
      .string({ required_error: REQUIRED })
      .trim()
      .min(1, REQUIRED)
      .min(3, 'Мінімум 3 символи')
      .regex(/^\S+$/, 'Без пробілів'),
    password: z
      .string({ required_error: REQUIRED })
      .min(1, REQUIRED)
      .min(MIN_PASSWORD_LENGTH, `Мінімум ${MIN_PASSWORD_LENGTH} символів`),
    age: z.coerce
      .number({ invalid_type_error: 'Вкажіть вік числом' })
      .int('Вік має бути цілим числом')
      .min(1, 'Вік від 1 до 120')
      .max(120, 'Вік від 1 до 120'),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Оберіть стать' }) }),
    phone: z
      .string({ required_error: REQUIRED })
      .trim()
      .min(1, REQUIRED)
      .regex(/^\+?[\d\s()-]{7,20}$/, 'Некоректний номер телефону'),
  }),
)

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: userSchema,
  initialValues: props.initialValues,
})

const fieldConfig = (state: { errors: string[] }) => ({
  validateOnModelUpdate: state.errors.length > 0,
})

const [firstName, firstNameAttrs] = defineField('firstName', fieldConfig)
const [lastName, lastNameAttrs] = defineField('lastName', fieldConfig)
const [email, emailAttrs] = defineField('email', fieldConfig)
const [username, usernameAttrs] = defineField('username', fieldConfig)
const [password, passwordAttrs] = defineField('password', fieldConfig)
const [age, ageAttrs] = defineField('age', fieldConfig)
const [gender, genderAttrs] = defineField('gender', fieldConfig)
const [phone, phoneAttrs] = defineField('phone', fieldConfig)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="user-form__grid">
      <AppInput
        v-model="firstName"
        v-bind="firstNameAttrs"
        label="First name"
        placeholder="Emily"
        :error="errors.firstName"
      />
      <AppInput
        v-model="lastName"
        v-bind="lastNameAttrs"
        label="Last name"
        placeholder="Johnson"
        :error="errors.lastName"
      />
      <AppInput
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        label="Email"
        placeholder="emily@example.com"
        :error="errors.email"
      />
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
        autocomplete="new-password"
        :error="errors.password"
      />
      <AppInput
        v-model="age"
        v-bind="ageAttrs"
        type="number"
        label="Age"
        placeholder="25"
        :error="errors.age"
      />
      <AppSelect
        v-model="gender"
        v-bind="genderAttrs"
        label="Gender"
        :options="genderOptions"
        placeholder="Оберіть стать"
        :error="errors.gender"
      />
      <AppInput
        v-model="phone"
        v-bind="phoneAttrs"
        type="tel"
        label="Phone number"
        placeholder="+380 99 123 45 67"
        :error="errors.phone"
      />
    </div>

    <AppMessage v-if="errorMessage" severity="error" class="user-form__error">
      {{ errorMessage }}
    </AppMessage>

    <div class="user-form__actions">
      <AppButton
        label="Скасувати"
        severity="secondary"
        variant="outlined"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      />
      <AppButton type="submit" :label="submitLabel" icon="pi pi-check" :loading="isSubmitting" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 24px;
  }

  &__error {
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .user-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
