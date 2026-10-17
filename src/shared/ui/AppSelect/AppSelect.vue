<script setup lang="ts">
import { useId } from 'vue'
import Select from 'primevue/select'
import Message from 'primevue/message'

export interface AppSelectOption {
  label: string
  value: string
}

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    label: string
    options: AppSelectOption[]
    placeholder?: string
    error?: string
  }>(),
  {
    placeholder: undefined,
    error: undefined,
  },
)

const model = defineModel<string>()

const selectId = useId()
</script>

<template>
  <div class="app-field">
    <label class="app-field__label" :for="selectId">{{ label }}</label>
    <Select
      v-bind="$attrs"
      v-model="model"
      :label-id="selectId"
      :options="options"
      option-label="label"
      option-value="value"
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

.app-field :deep(.p-select.p-invalid .p-select-label.p-placeholder) {
  color: var(--p-select-placeholder-color);
}
</style>
