import { createApp } from 'vue'
import './style.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Drawer from 'primevue/drawer'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue)
app.component('Drawer', Drawer)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.mount('#app')
