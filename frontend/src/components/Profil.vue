<template>
  <v-card class="profilCard">
    <div class="headerProfil">
      <v-avatar color="#53AFA7">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
      <div class="centrage">
        <h2>{{ user }}</h2>
      </div>
    </div>
    <hr />
    <v-form ref="form" v-model="valid">
      <div class="inputForm">
        <v-text-field v-model="lastName" placeholder="Nom" filled rounded dense></v-text-field>
        <v-text-field v-model="firstName" placeholder="Prénom" filled rounded dense></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          placeholder="Mot de passe"
          hint="Minimum 8 caractères"
          @click:append="show1 = !show1"
          required
          filled
          rounded
          dense
        >
        </v-text-field>
      </div>
      <div class="btn">
        <v-btn color="#B2DFDB" @click="validate">
          Enregister
        </v-btn>
        <v-btn color="#B2DFDB" @click="deleteAccount">
          Supprimer mon compte
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Profil',
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
      valid: true,
    };
  },

  mounted() {
    const token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.user = response.data.lastName + ' ' + response.data.firstName;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        const token = localStorage.getItem('acces_token');
        const userUpdate = { firstName: this.firstName, lastName: this.lastName, password: this.password };
        axios
          .put('http://localhost:3000/api/users/profile', userUpdate, { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } })
          .then((response) => {
            this.$router.push('/home');
            alert('Mise à jour effectué');
            console.log(response.status);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    deleteAccount() {
      const token = localStorage.getItem('acces_token');
      axios
        .delete('http://localhost:3000/api/users/profile/', { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } })
        .then((response) => {
          alert('Votre compte a bien été supprimé');
          localStorage.removeItem('acces_token');
          localStorage.removeItem('userId');
          this.$router.push('/');
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style>
.profilCard {
  max-width: 700px;
  margin: 50px auto 0 auto;
  padding: 20px 20px 30px 20px;
}
.headerProfil {
  display: flex;
  justify-content: space-around;
  padding: 0 0 20px 0;
}
.btn {
  display: flex;
  justify-content: space-around;
}
.centrage {
  margin: auto 0 auto 0;
}
.inputForm {
  padding: 30px 0 20px 0;
}
@media screen and (max-width: 640px) {
  .profilCard {
    margin: 20px 20px 0 20px;
  }
}
</style>
