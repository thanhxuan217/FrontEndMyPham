import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()
import './assets/main.css'

const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
