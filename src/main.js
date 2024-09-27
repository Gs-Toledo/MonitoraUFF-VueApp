import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'  // Importe a store do Vuex

import vuetify from './plugins/vuetify'
import '@/assets/styles.css'


const app = createApp(App)


app.use(store)
app.use(vuetify)
app.use(router)

app.mount('#app')