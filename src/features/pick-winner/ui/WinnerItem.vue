<script setup lang="ts">
import type { User } from '@/entities/user'

defineProps<{
  winner: User
}>()

defineEmits<{
  remove: [id: number]
}>()
</script>

<template>
  <span class="winner-chip">
    <i class="pi pi-star-fill"></i>
    {{ winner.firstName }} {{ winner.lastName }}
    <button
      type="button"
      class="winner-chip__remove"
      aria-label="Прибрати переможця"
      @click="$emit('remove', winner.id)"
    >
      <i class="pi pi-times"></i>
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  font-size: 0.9rem;

  &__remove {
    display: inline-flex;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
