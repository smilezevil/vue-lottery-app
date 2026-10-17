<script setup lang="ts">
import Card from 'primevue/card'
</script>

<template>
  <Card class="app-card">
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template #content>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Card>
</template>
