<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWinnersStore } from '../model/winners.store'
import WinnerItem from './WinnerItem.vue'
import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'

const winnersStore = useWinnersStore()
const { winners, canPickWinner } = storeToRefs(winnersStore)
const { pickWinner, removeWinner } = winnersStore
</script>

<template>
  <div class="card winners-card">
    <div class="card-body winners-body">
      <div class="winners-list">
        <span v-if="winners.length === 0" class="winners-placeholder">Winners</span>
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="removeWinner"
        />
      </div>
      <BaseButton :disabled="!canPickWinner" @click="pickWinner">New winner</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.winners-card {
  margin-bottom: 32px;
}

.winners-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.winners-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.winners-placeholder {
  color: #adb5bd;
}
</style>
