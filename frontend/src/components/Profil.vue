<template>
  <v-card class="mx-auto" max-width="700">
    <v-card color="#B2DFDB">
      <div class="entete">
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
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Mot de passe"
          placeholder="Mot de passe"
          hint="Minimum 8 caractères"
          @click:append="show1 = !show1"
        ></v-text-field>
      </div>
      <div class="bouton">
        <v-btn color="#B2DFDB" @click="send">
          Enregister les modifications
        </v-btn>
        <v-btn color="#B2DFDB" @click="reset">
          Annuler
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
// import axios from 'axios';
export default {
  data() {
    return {
      user: 'Aymeric DOUCET',
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
  methods: {
    //   async created() {
    //     this.message = (await axios.get('http://localhost:3000/messages')).data;
    //   },
    send() {
      console.log('Envoyé');
    },
    reset() {
      (this.lastName = ''), (this.firstName = ''), (this.password = '');
      console.log('Annulé');
    },
  },
};
</script>
<style>
.entete {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
.centrage {
  margin: auto 0 auto 0;
}
.inputForm {
  padding: 30px 30px 15px 30px;
}
</style>
