import { useToast } from 'primevue/usetoast'

const SUCCESS_LIFE = 3000
const ERROR_LIFE = 5000

export function useNotify() {
  const toast = useToast()

  return {
    success(summary: string, detail?: string): void {
      toast.add({ severity: 'success', summary, detail, life: SUCCESS_LIFE })
    },
    error(summary: string, detail?: string): void {
      toast.add({ severity: 'error', summary, detail, life: ERROR_LIFE })
    },
    info(summary: string, detail?: string): void {
      toast.add({ severity: 'info', summary, detail, life: SUCCESS_LIFE })
    },
  }
}
