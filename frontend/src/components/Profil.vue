<template>
  <v-card class="profilCard">
    <v-card color="#B2DFDB">
      <div class="headerProfil">
        <v-avatar color="#53AFA7">
          <span class="white--text headline">AD</span>
        </v-avatar>
        <div class="centrage">
          <h2>{{ user }}</h2>
        </div>
      </div>
    </v-card>
    <v-form>
      <div class="inputForm">
        <v-text-field v-model="lastName" label="Nom" placeholder="Nom" required></v-text-field>
        <v-text-field v-model="firstName" label="Prénom" placeholder="Prénom" required></v-text-field>
        <!-- <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Mot de passe"
          placeholder="Mot de passe"
          hint="Minimum 8 caractères"
          @click:append="show1 = !show1"
        ></v-text-field> -->
      </div>
      <div class="bouton">
        <v-btn color="#B2DFDB" @click="send">
          Enregister
        </v-btn>
        <v-btn color="#B2DFDB" @click="reset">
          Annuler
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      user: '',
      lastName: '',
      firstName: '',
      password: '',
      show1: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Minimum 8 caractères',
      },
    };
  },
  created() {
    const token = localStorage.getItem('acces_token');
    axios.get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } }).then((response) => {
      this.user = response.data.lastName + ' ' + response.data.firstName;
    });
  },
  methods: {
    send() {
      const router = this.$router;
      const token = localStorage.getItem('acces_token');
      const userUpdate = { firstName: this.firstName, lastName: this.lastName };
      axios
        .put('http://localhost:3000/api/users/profile', userUpdate, { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } })
        .then((response) => {
          router.push('/news');
          alert('Mise à jour effectué');
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reset() {
      (this.lastName = ''), (this.firstName = ''), (this.password = '');
      console.log('Annulé');
    },
  },
};
</script>
<style>
.profilCard {
  max-width: 700px;
  margin: 50px auto 0 auto;
}
.headerProfil {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
.bouton {
  display: flex;
  justify-content: space-around;
}
.centrage {
  margin: auto 0 auto 0;
}
.inputForm {
  padding: 30px 30px 15px 30px;
}
@media screen and (max-width: 640px) {
  .profilCard {
    margin: 20px 20px 0 20px;
  }
}
</style>
