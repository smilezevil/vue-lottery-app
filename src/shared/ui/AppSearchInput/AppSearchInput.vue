<script setup lang="ts">
import { ref, watch } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

const props = withDefaults(
  defineProps<{
    value?: string
    placeholder?: string
    delay?: number
  }>(),
  {
    value: '',
    placeholder: 'Пошук...',
    delay: 300,
  },
)

const emit = defineEmits<{
  search: [value: string]
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
    emit('search', value.trim())
  }, props.delay)
})
</script>

<template>
  <IconField class="app-search">
    <InputIcon class="pi pi-search" />
    <InputText v-model="query" type="search" :placeholder="placeholder" fluid />
  </IconField>
</template>

<style scoped lang="scss">
.app-search {
  width: 100%;
  max-width: 320px;
}
</style>
