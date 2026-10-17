<script setup lang="ts">
import Message from 'primevue/message'

withDefaults(
  defineProps<{
    severity?: 'error' | 'info' | 'success' | 'warn'
  }>(),
  {
    severity: 'info',
  },
)
</script>

<template>
  <Message :severity="severity">
    <slot />
  </Message>
</template>
