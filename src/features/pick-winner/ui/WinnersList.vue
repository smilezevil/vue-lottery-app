<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton, AppCard } from '@/shared/ui'
import { useWinnersStore } from '../model/winners.store'
import WinnerItem from './WinnerItem.vue'

const winnersStore = useWinnersStore()
const { winners, canPickWinner } = storeToRefs(winnersStore)
const { pickWinner, removeWinner } = winnersStore
</script>

<template>
  <AppCard class="winners-card">
    <div class="winners">
      <div class="winners__list">
        <span v-if="winners.length === 0" class="muted">Winners</span>
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="removeWinner"
        />
      </div>
      <AppButton
        label="New winner"
        icon="pi pi-star"
        :disabled="!canPickWinner"
        @click="pickWinner"
      />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.winners-card {
  margin-bottom: 32px;
}

.winners {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
  }
}
</style>
