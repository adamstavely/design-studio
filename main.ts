import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
// Material 3 UI plugin registration
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ components, directives })

createApp(App).use(router).use(vuetify).mount('#app')