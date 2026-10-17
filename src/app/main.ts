import './styles/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from './providers/pinia'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setupUi } from './providers/ui'
import { setAuthHandler } from '@/shared/api'
import { useSessionStore } from '@/entities/session'

registerServices()

const app = createApp(App)

app.use(pinia)
app.use(router)
setupUi(app)

const session = useSessionStore()
setAuthHandler({
  getAccessToken: () => session.accessToken,
  refreshAccessToken: () => session.refreshAccessToken(),
})

app.mount('#app')
