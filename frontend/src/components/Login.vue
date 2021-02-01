<template>
  <div>
    <div class="authCard">
      <v-alert v-model="alertAuth" color="red" dismissible elevation="10" text>
        <div>{{ alertMessage }}</div>
      </v-alert>
      <div v-if="showLogin">
        <form>
          <div class="inputBlocAuth">
            <v-text-field v-model="email" label="E-mail" placeholder="Email"></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Mot de passe"
              placeholder="Mot de passe"
              hint="Minimum 8 caractères et au moins 1 chiffre."
              @click:append="show1 = !show1"
            ></v-text-field>
          </div>
          <div class="bouton">
            <v-btn color="#B2DFDB" @click="login">
              Connection
            </v-btn>
          </div>
          <div class="bouton">
            <div class="register" @click="showLogin = !showLogin">
              Pas encore de compte? Inscrivez-vous!
            </div>
          </div>
        </form>
      </div>
      <div v-else>
        <form>
          <div class="inputBlocAuth">
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
              hint="Minimum 8 caractères et au moins 1 chiffre."
              @click:append="show1 = !show1"
            ></v-text-field>
            <div class="registerButton">
              <v-btn color="#B2DFDB" @click="register">
                Inscription
              </v-btn>
            </div>
            <div class="bouton">
              <div class="register" @click="showLogin = !showLogin">
                J'ai déjà un compte!
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      showLogin: true,
      show1: false,
      alertAuth: false,
      alertMessage: '',
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Minimum 8 caractères et au moins 1 chiffre',
      },
    };
  },

  methods: {
    login() {
      const userLogin = { email: this.email, password: this.password };
      axios
        .post('http://localhost:3000/api/users/login', userLogin)
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem('acces_token', token);
          this.$router.push('/home');
        })
        .catch((err) => {
          if (err.response.status == 429) {
            this.alertAuth = true;
            this.alertMessage = 'Compte bloqué, réessayer dans 15min.';
          } else {
            this.alertAuth = true;
            this.alertMessage = err.response.data.error;
          }
        });
    },

    register() {
      const userRegister = { email: this.email, firstName: this.firstName, lastName: this.lastName, password: this.password };
      axios
        .post('http://localhost:3000/api/users/register', userRegister)
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem('acces_token', token);
          this.$router.push('/home');
        })
        .catch((err) => {
          this.alertAuth = true;
          this.alertMessage = err.response.data.error;
        });
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
  border-radius: 10px;
  background: #f0f0f0;
  box-shadow: 7px 7px 11px #abadaa, -7px -7px 11px #ffffff;
}
.inputBlocAuth {
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
  padding: 0 0 30px 0;
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
