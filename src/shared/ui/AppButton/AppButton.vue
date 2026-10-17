<script setup lang="ts">
import Button from 'primevue/button'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    type?: 'button' | 'submit'
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'contrast'
    variant?: 'outlined' | 'text'
    size?: 'small' | 'large'
    loading?: boolean
    disabled?: boolean
    rounded?: boolean
    to?: RouteLocationRaw
    href?: string
  }>(),
  {
    label: undefined,
    icon: undefined,
    type: 'button',
    severity: 'primary',
    variant: undefined,
    size: undefined,
    loading: false,
    disabled: false,
    rounded: false,
    to: undefined,
    href: undefined,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    v-if="props.to"
    :as="RouterLink"
    :to="props.to"
    :label="label"
    :icon="icon"
    :severity="severity === 'primary' ? undefined : severity"
    :variant="variant"
    :size="size"
    :rounded="rounded"
  />
  <Button
    v-else-if="props.href"
    as="a"
    :href="props.href"
    target="_blank"
    rel="noopener noreferrer"
    :label="label"
    :icon="icon"
    :severity="severity === 'primary' ? undefined : severity"
    :variant="variant"
    :size="size"
    :rounded="rounded"
  />
  <Button
    v-else
    :type="type"
    :label="label"
    :icon="icon"
    :severity="severity === 'primary' ? undefined : severity"
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :rounded="rounded"
    @click="emit('click', $event)"
  />
</template>

<style scoped lang="scss">
.p-button {
  text-decoration: none;
}
</style>
