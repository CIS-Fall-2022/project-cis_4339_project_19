import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './index.css'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'

const app = createApp(App);
app.use(router);
app.mount('#app');
// Using https://chartkick.com/vue for Chart formatting
app.use(VueChartkick)
