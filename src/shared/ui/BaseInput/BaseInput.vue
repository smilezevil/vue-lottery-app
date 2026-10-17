<script setup lang="ts">
import { useId } from 'vue'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  modelValue?: string | number
  label: string
  type?: string
  placeholder?: string
  error?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = useId()
</script>

<template>
  <div class="field">
    <label class="form-label" :for="inputId">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="inputId"
      :type="type ?? 'text'"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 20px;
}

.field label {
  font-weight: 500;
  margin-bottom: 6px;
}
</style>
