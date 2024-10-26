import { createApp, markRaw } from 'vue'
import { createPinia} from 'pinia'
import type { Router } from 'vue-router'
import router from './router'
import axios from 'axios'

axios.defaults.withCredentials= true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = "http://localhost:8000";

//import "./style.css"
import App from './App.vue'
//import './samples/node-api'


// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
  },
})

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}

const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })