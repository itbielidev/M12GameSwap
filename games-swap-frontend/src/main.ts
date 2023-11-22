//import './assets/main.css'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'vue-final-modal/style.css';

import { createApp } from "vue";
import { createVfm } from 'vue-final-modal';
import PrimeVue from 'primevue/config'

import App from "./App.vue";
import { createPinia } from 'pinia'
import router from "./router";
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();
const vfm = createVfm();

app.use(router);

//We call the auth store to recover the auth state of the application when we refresh the page via localStorage. 
const storedToken = localStorage.getItem('token');
if (storedToken) {
    useAuthStore(pinia).setToken(storedToken);
}

app.use(pinia);
app.use(vfm);
app.use(PrimeVue);


app.mount("#app");
