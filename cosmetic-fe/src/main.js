import { createApp } from 'vue'
import { Quasar, Dialog } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()
import './assets/main.css'
import "~bootstrap-icons/font/bootstrap-icons.css"
// import "~bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App)
app.use(Quasar, {
  plugins: {
    Dialog
  }, // import Quasar plugins and add here
})
app.use(pinia)
app.use(router)
app.mount('#app')
