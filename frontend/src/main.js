import Vue from 'vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueRouter);

import AuthView from './Vues/auth-view.vue';
import PostsView from './Vues/posts-view.vue';
import ProfilView from './Vues/profil-view.vue';

import App from './App.vue';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: AuthView },
    { path: '/news', component: PostsView },
    { path: '/profil', component: ProfilView },
  ],
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
