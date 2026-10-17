import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setupUi } from './providers/ui'
import { setAuthHandler } from '@/shared/api'
import { useSessionStore } from '@/entities/session'

registerServices()

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupUi(app)

const session = useSessionStore()
setAuthHandler({
  getAccessToken: () => session.accessToken,
  refreshAccessToken: () => session.refreshAccessToken(),
})

app.mount('#app')
