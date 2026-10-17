<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'

withDefaults(
  defineProps<{
    header: string
    confirmLabel?: string
    cancelLabel?: string
    severity?: 'primary' | 'danger'
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Так',
    cancelLabel: 'Ні',
    severity: 'primary',
    loading: false,
  },
)

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="header"
    :closable="!loading"
    :draggable="false"
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '92vw' }"
  >
    <slot />

    <template #footer>
      <AppButton
        :label="cancelLabel"
        severity="secondary"
        variant="outlined"
        :disabled="loading"
        @click="visible = false"
      />
      <AppButton
        :label="confirmLabel"
        :severity="severity"
        :loading="loading"
        @click="emit('confirm')"
      />
    </template>
  </Dialog>
</template>
