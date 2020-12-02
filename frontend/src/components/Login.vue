<template>
  <div>
    <v-card class="authCard" v-if="showLogin">
      <v-toolbar color="#B2DFDB">
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
            <v-btn color="#B2DFDB" @click="connect">
              Connection
            </v-btn>
          </router-link>
        </div>
        <div class="bouton">
          <div class="register" @click="showLogin = !showLogin">
            Pas encore de compte? Inscrivez-vous!
          </div>
        </div>
      </form>
    </v-card>
    <v-card class="authCard" v-else>
      <v-toolbar color="#B2DFDB">
        <h3>Inscription</h3>
      </v-toolbar>
      <form>
        <div class="inputBloc">
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
          <div class="registerButton">
            <v-btn color="#B2DFDB" @click="submit">
              Inscription
            </v-btn>
            <v-btn color="#B2DFDB" @click="showLogin = !showLogin">
              Annuler
            </v-btn>
          </div>
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      showLogin: true,
      show1: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Minimum 8 caractères',
      },
    };
  },
  methods: {
    connect() {
      console.log(this.email);
      console.log(this.password);
    },
    submit() {
      console.log(this.lastName);
      console.log(this.firstName);
      console.log(this.email);
      console.log(this.password);
    },
  },
};
</script>
<style>
.register {
  cursor: pointer;
}
.authCard {
  max-width: 700px;
  margin: 50px auto 0 auto;
}
.inputBloc {
  padding: 30px;
}
.bouton {
  display: flex;
  justify-content: center;
  padding: 0 0 30px 0;
}
.registerButton {
  display: flex;
  justify-content: space-around;
}
a {
  text-decoration: none;
}
@media screen and (max-width: 640px) {
  .authCard {
    margin: 20px 20px 10px 20px;
  }
}
</style>
