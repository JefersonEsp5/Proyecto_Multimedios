import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router' 
import { OhVueIcon, addIcons } from "oh-vue-icons"
import { BiCompass, BiCollectionPlay, BiCalendar, BiBell } from "oh-vue-icons/icons"

const app = createApp(App);
const pinia = createPinia();
// Optionally make Turso client globally available (or inject where needed)
import tursoClient from './plugins/turso.js';

app.config.globalProperties.$turso = tursoClient; // Makes it accessible as this.$turso

addIcons(BiCompass, BiCollectionPlay, BiCalendar, BiBell)
app.component("v-icon", OhVueIcon)
app.use(pinia);
app.use(router)
app.mount('#app')
