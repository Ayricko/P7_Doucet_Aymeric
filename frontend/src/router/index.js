import Vue from 'vue';
import VueRouter from 'vue-router';
// Import Vues
import AuthView from '../views/auth-view.vue';
import HomeView from '../views/home-view.vue';
import ProfilView from '../views/profil-view.vue';
import ModerateView from '../components/Moderate.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home-view',
    component: AuthView,
  },
  {
    path: '/home',
    name: 'OnePostView',
    component: HomeView,
  },
  {
    path: '/profil',
    name: 'Profil',
    component: ProfilView,
  },
  {
    path: '/moderate',
    name: 'Moderate',
    component: ModerateView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
export default router;
