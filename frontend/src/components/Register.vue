<template>
  <v-card class="mx-auto" max-width="700">
    <v-toolbar color="#B2DFDB">
      <v-row class="text-center">
        <v-col>
          <h3>Inscription</h3>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-form ref="form" v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="10" offset-md="1">
            <v-text-field v-model="lastName" label="Nom" placeholder="Nom" required></v-text-field>
            <v-text-field v-model="firstName" label="Prénom" placeholder="Prénom" required></v-text-field>
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
            <v-row class="bouton">
              <v-btn color="#B2DFDB" @click="submit">
                Inscription
              </v-btn>
              <v-btn color="#B2DFDB" @click="reset">
                Annuler
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      lastName: '',
      firstName: '',
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
      console.log(this.lastName);
      console.log(this.firstName);
      console.log(this.email);
      console.log(this.password);
    },
    reset() {
      (this.lastName = ''), (this.firstName = ''), (this.email = ''), (this.password = '');
      console.log('Annulé');
    },
  },
};
</script>
<style>
.bouton {
  justify-content: space-around;
}
</style>
