import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'

const MAX_WINNERS = 3

export const useWinnersStore = defineStore('winners', () => {
  const usersStore = useUsersStore()

  const winners = ref<User[]>([])

  const availableForWinning = computed(() =>
    usersStore.users.filter((user) => !winners.value.some((winner) => winner.id === user.id)),
  )

  const canPickWinner = computed(
    () => winners.value.length < MAX_WINNERS && availableForWinning.value.length > 0,
  )

  function pickWinner(): void {
    if (!canPickWinner.value) {
      return
    }

    const pool = availableForWinning.value
    const chosen = pool[Math.floor(Math.random() * pool.length)]

    if (chosen) {
      winners.value.push(chosen)
    }
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  usersStore.$onAction(({ name, args, after }) => {
    after((result) => {
      if (name === 'removeUser') {
        removeWinner(args[0] as number)
      }

      if (name === 'updateUser') {
        const updated = result as User
        winners.value = winners.value.map((winner) => (winner.id === updated.id ? updated : winner))
      }
    })
  }, true)

  return { winners, canPickWinner, pickWinner, removeWinner }
})
