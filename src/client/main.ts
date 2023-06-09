import './main.css'

import { createApp } from 'vue'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(VueLazyload)

app.mount('#app')
