import Vue from 'vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';

const moment = require('moment'); // gestion de l'affichage des dates avec vue-moment
require('moment/locale/fr');
Vue.use(require('vue-moment'), {
  moment,
});

Vue.config.productionTip = false;
Vue.use(VueRouter);

import AuthView from './Vues/auth-view.vue';
import HomeView from './Vues/home-view.vue';
import PostView from './Vues/post-view.vue';
import ProfilView from './Vues/profil-view.vue';

import App from './App.vue';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: AuthView },
    { path: '/home', component: HomeView },
    { path: '/post/:id', component: PostView },
    { path: '/profil', component: ProfilView },
  ],
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
