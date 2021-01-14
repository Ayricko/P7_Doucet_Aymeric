<template>
  <div>
    <v-card class="profilCard">
      <v-alert v-model="alertUpdate" color="red" dismissible elevation="10" text>
        <div>{{ alertMessage }}</div>
      </v-alert>
      <v-alert v-model="alertUpdateDone" color="green" dense elevation="10" text>
        Modification effectué
      </v-alert>
      <div class="headerProfil">
        <v-avatar size="90" color="#53AFA7">
          <img v-if="avatarUser" :src="avatarUser" alt="image postée par utilisateur" />
          <v-icon x-large v-else color="white">mdi-account</v-icon>
        </v-avatar>
        <div class="centrage">
          <h2>{{ user }}</h2>
        </div>
      </div>
      <hr />
      <v-form>
        <div class="inputForm">
          <v-text-field v-model="lastName" placeholder="Nom" filled rounded dense></v-text-field>
          <v-text-field v-model="firstName" placeholder="Prénom" filled rounded dense></v-text-field>
          <input
            style="display: none"
            @change="getAvatar"
            type="file"
            accept="image/png, image/jpeg,
                image/bmp, image/gif"
            ref="file"
          />
          <div class="imageInput">
            <span class="text--secondary">Modifier votre photo de profil: </span>
            <v-avatar size="32" class="AvatarSpace" color="#53AFA7">
              <v-icon small color="white" @click="$refs.file.click()">mdi-image</v-icon>
            </v-avatar>
          </div>
          <div class="avatarInputName">
            <div>{{ avatar.name }}</div>
            <v-icon v-if="avatar.name" color="#53AFA7" @click="resetImage">mdi-close</v-icon>
          </div>
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
  </div>
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
      avatar: '',
      avatarUser: '',
      show1: false,
      alertUpdate: false,
      alertUpdateDone: false,
      alertMessage: '',
    };
  },

  mounted() {
    const token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.user = response.data.lastName + ' ' + response.data.firstName;
        this.avatarUser = response.data.avatar;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    getAvatar() {
      this.avatar = this.$refs.file.files[0];
    },
    validate() {
      const token = localStorage.getItem('acces_token');
      const formData = new FormData();
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('image', this.avatar);
      axios
        .put('http://localhost:3000/api/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `${token}` } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          this.alertUpdate = true;
          this.alertMessage = err.response.data.error;
        });
    },
    deleteAccount() {
      const token = localStorage.getItem('acces_token');
      axios
        .delete('http://localhost:3000/api/users/profile/', { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } })
        .then(() => {
          alert('Votre compte a bien été supprimé');
          localStorage.removeItem('acces_token');
          localStorage.removeItem('userId');
          this.$router.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetImage() {
      this.avatar = '';
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
.avatarInputName {
  display: flex;
  flex-direction: row;
}
@media screen and (max-width: 640px) {
  .profilCard {
    margin: 20px 20px 0 20px;
  }
}
</style>
