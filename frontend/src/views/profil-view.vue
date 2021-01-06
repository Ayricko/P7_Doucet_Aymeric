<template>
  <div class="background">
    <div v-if="userId !== null">
      <Header />
      <Profil />
    </div>
  </div>
</template>
<script>
import Header from '../components/Header';
import Profil from '../components/Profil';
import axios from 'axios';
export default {
  components: {
    Header,
    Profil,
  },
  name: 'ProfilView',
  data() {
    return {
      userId: null,
    };
  },
  mounted() {
    const token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.userId = response.data.id;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
<style>
.background {
  width: 100%;
  height: 100%;
  background-color: #f1f4f0;
}
</style>
