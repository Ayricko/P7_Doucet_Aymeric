<template>
  <div class="header">
    <div>
      <router-link to="/home">
        <span class="iconL logo"><img class="ajust" src="../assets/logo.png"/></span>
        <span class="iconS logo"><img class="ajust" src="../assets/logoSeul.png"/></span>
      </router-link>
    </div>

    <div class="itemNav">
      <div v-if="isAdmin == true">
        <router-link to="/moderate">
          <v-icon class="moderateIcon" color="black" x-large>
            mdi-police-badge-outline
          </v-icon>
        </router-link>
      </div>
      <router-link to="/profil">
        <v-avatar color="#53AFA7">
          <v-icon color="white">mdi-account</v-icon>
        </v-avatar>
      </router-link>
      <span class="profilNav">{{ firstName }}</span>
      <router-link to="/">
        <span @click="logout">
          <v-icon color="red">
            mdi-power
          </v-icon>
        </span>
      </router-link>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'Header',
  data() {
    return {
      firstName: '',
      isAdmin: '',
    };
  },
  created() {
    const token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.firstName = response.data.firstName;
        this.isAdmin = response.data.isAdmin;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    logout() {
      localStorage.clear();
    },
  },
};
</script>
<style>
.header {
  display: flex;
  justify-content: space-between;
  background: #b2dfdb;
  height: 80px;
  padding: 0 20px 0 20px;
  margin: 0 0 30px 0;
  align-items: center;
}
.profilNav {
  color: black;
  padding: 0 10px 0 10px;
  font-size: 1.3em;
}
.itemNav {
  display: flex;
  align-items: center;
}
.moderateIcon {
  padding: 5px 10px 0 0;
}
.ajust {
  padding: 7px 0 0 0;
}
@media screen and (max-width: 640px) {
  .iconL {
    display: none;
  }
}
@media screen and (min-width: 641px) {
  .iconS {
    display: none;
  }
}
</style>
