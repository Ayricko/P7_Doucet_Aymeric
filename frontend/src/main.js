import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

const moment = require('moment'); // gestion de l'affichage des dates avec vue-moment
require('moment/locale/fr');
Vue.use(require('vue-moment'), {
  moment,
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
