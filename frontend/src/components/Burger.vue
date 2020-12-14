<template>
  <Slide width="250">
    <div>
      <router-link to="/news"><span class="itemNav">News</span></router-link>
    </div>
    <div>
      <router-link to="/profil">
        <span class="itemNav">Profile</span>
      </router-link>
    </div>
    <div>
      <router-link to="/">
        <span class="itemNav" @click="logout">
          Déconnexion
          <v-icon color="red">
            mdi-power
          </v-icon>
        </span>
      </router-link>
    </div>
  </Slide>
</template>
<script>
import { Slide } from 'vue-burger-menu';

export default {
  components: {
    Slide,
  },
  methods: {
    logout() {
      localStorage.removeItem('acces_token');
    },
  },
};
</script>
<style>
.itemNav {
  color: rgb(46, 46, 46);
  text-decoration: none;
}
.bm-burger-button {
  width: 30px;
  height: 24px;
  left: 36px;
  top: 28px;
  cursor: pointer;
}
.bm-burger-bars {
  background-color: #4e4e4e;
}
.line-style {
  position: absolute;
  height: 20%;
  left: 0;
  right: 0;
}
.cross-style {
  position: absolute;
  top: 12px;
  right: 22px;
  cursor: pointer;
}
.bm-cross {
  background: #bdc3c7;
}
.bm-cross-button {
  height: 24px;
  width: 24px;
}
.bm-menu {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1000; /* Stay on top */
  top: 0;
  left: 0;
  background-color: rgb(219, 219, 219);
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /*0.5 second transition effect to slide in the sidenav*/
}
</style>
