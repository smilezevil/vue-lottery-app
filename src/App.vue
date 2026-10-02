<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant } from './types/Participant'
import WinnersList from './components/WinnersList.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'

const participants = ref<Participant[]>([])
const winnerIds = ref<number[]>([])

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => Boolean(p)),
)

const availableForWinning = computed(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed(
  () => winnerIds.value.length < 3 && availableForWinning.value.length > 0,
)

function pickWinner(): void {
  if (!canPickWinner.value) {
    return
  }

  const pool = availableForWinning.value
  const randomIndex = Math.floor(Math.random() * pool.length)
  const chosen = pool[randomIndex]

  if (!chosen) {
    return
  }

  winnerIds.value.push(chosen.id)
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

function registerParticipant(participant: Participant): void {
  participants.value.push(participant)
}
</script>

<template>
  <div class="app">
    <WinnersList
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick="pickWinner"
      @remove="removeWinner"
    />

    <RegistrationForm :participants="participants" @register="registerParticipant" />

    <ParticipantsTable :participants="participants" />
  </div>
</template>
