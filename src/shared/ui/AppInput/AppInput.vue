<script setup lang="ts">
import { useId } from 'vue'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    label: string
    type?: string
    placeholder?: string
    error?: string
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    error: undefined,
  },
)

const model = defineModel<string | number>()

const inputId = useId()
</script>

<template>
  <div class="app-field">
    <label class="app-field__label" :for="inputId">{{ label }}</label>
    <InputText
      v-bind="$attrs"
      :id="inputId"
      v-model="model as string"
      :type="type"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      fluid
    />
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
  </div>
</template>

<style scoped lang="scss">
.app-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;

  &__label {
    font-weight: 500;
  }
}

.app-field .p-inputtext.p-invalid::placeholder {
  color: var(--p-inputtext-placeholder-color);
}
</style>
