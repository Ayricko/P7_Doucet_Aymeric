<template>
  <v-card class="mx-auto card" max-width="700">
    <v-toolbar class="text-center" color="#B2DFDB">
      <h3>Connectez-vous</h3>
    </v-toolbar>
    <form>
      <div class="inputBloc">
        <v-text-field v-model="email" label="E-mail" placeholder="Email"></v-text-field>
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
        <router-link to="/news">
          <v-btn color="#B2DFDB" @click="submit">
            Connection
          </v-btn>
        </router-link>
        <v-btn color="#B2DFDB" @click="reset">
          Annuler
        </v-btn>
      </div>
    </form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      show1: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Minimum 8 caractères',
      },
    };
  },
  methods: {
    submit() {
      console.log(this.email);
      console.log(this.password);
    },
    reset() {
      (this.email = ''), (this.password = '');
      console.log('Annulé');
    },
  },
};
</script>
<style>
.card {
  margin-top: 50px;
}
.inputBloc {
  padding: 30px;
}
.bouton {
  display: flex;
  justify-content: space-around;
  padding: 0 0 30px 0;
}
a {
  text-decoration: none;
}
</style>
