<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: string
    placeholder?: string
  }>(),
  {
    value: '',
    placeholder: 'Пошук...',
  },
)

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref(props.value)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== query.value.trim()) {
      query.value = newValue
    }
  },
)

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, 300)
})
</script>

<template>
  <div class="search-bar">
    <i class="bi bi-search search-bar__icon"></i>
    <input
      v-model="query"
      type="search"
      class="form-control search-bar__input"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-bar__icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
}

.search-bar__input {
  padding-left: 36px;
}
</style>
