import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setAuthHandler } from '@/shared/api'
import { useAuthStore } from '@/entities/session'

registerServices()

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
setAuthHandler({
  getAccessToken: () => authStore.accessToken,
  refreshAccessToken: () => authStore.refreshAccessToken(),
})

app.mount('#app')
