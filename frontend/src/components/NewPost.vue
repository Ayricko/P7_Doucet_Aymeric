<template>
  <div>
    <v-card class="PublicationCard">
      <div>
        <v-avatar class="AvatarSpace" color="#53AFA7">
          <img v-if="avatarUser" :src="avatarUser" alt="image postée par utilisateur" />
          <v-icon v-else color="white">mdi-account</v-icon>
        </v-avatar>
      </div>
      <div class="PublicationCardBtn">
        <v-btn class="Btn text--secondary" large depressed plain rounded @click="dialog = true">Que voulez-vous dire, {{ firstName }} ?</v-btn>
      </div>
    </v-card>
    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <div class="Cross">
          <v-icon color="#53AFA7" @click="reset">mdi-close</v-icon>
        </div>
        <div class="AlertNewPost">
          <v-alert v-model="alertNewPost" color="red" dismissible rounded elevation="10" text>
            <div>{{ alertMessage }}</div>
          </v-alert>
        </div>
        <h2 class="CardNewPostTitle">Créer une publication</h2>
        <v-form class="InputBloc">
          <v-text-field v-model="title" label="Titre" rows="1" auto-grow></v-text-field>
          <v-textarea v-model="content" label="Que voulez-vous dire?" rows="1" auto-grow></v-textarea>
          <input
            style="display: none"
            @change="getImage"
            type="file"
            accept="image/png, image/jpeg,
                image/bmp, image/gif"
            ref="file"
          />
          <div class="imageInput">
            <span class="text--secondary">Ajouter une photo à votre publication: </span>
            <v-avatar size="32" class="AvatarSpace" color="#53AFA7">
              <v-icon small color="white" @click="$refs.file.click()">mdi-image</v-icon>
            </v-avatar>
          </div>
          <div class="ImageInputName">
            <div>{{ image.name }}</div>
            <v-icon v-if="image.name" color="#53AFA7" @click="resetImage">mdi-close</v-icon>
          </div>
          <div class="CardNewPostBouton">
            <v-btn color="#B2DFDB" @click="send">
              Publier
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'NewPost',
  data() {
    return {
      token: '',
      title: '',
      content: '',
      firstName: '',
      image: '',
      avatarUser: '',
      showNewPostBloc: false,
      dialog: false,
      alertNewPost: false,
      alertMessage: '',
    };
  },
  mounted() {
    this.token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { Authorization: this.token } })
      .then((response) => {
        this.firstName = response.data.firstName;
        this.avatarUser = response.data.avatar;
      })
      .catch((err) => {
        console.log(err);
        this.$router.push('/');
      });
  },
  methods: {
    send() {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('content', this.content);
      formData.append('image', this.image);
      axios
        .post('http://localhost:3000/api/posts/new', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: this.token } })
        .then(() => {
          window.location.reload();
          this.title = '';
          this.content = '';
          this.image = '';
          this.showNewPostBloc = false;
          this.alertNewPost = false;
        })
        .catch((err) => {
          console.log(err);
          this.alertNewPost = true;
          this.alertMessage = err.response.data.error;
        });
    },
    getImage() {
      this.image = this.$refs.file.files[0];
    },
    resetImage() {
      this.image = '';
    },
    reset() {
      this.dialog = false;
      this.title = '';
      this.content = '';
      this.image = '';
      this.showNewPostBloc = false;
    },
  },
};
</script>
<style scoped>
.PublicationCard {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px auto 20px auto;
  max-width: 700px;
  padding: 20px;
}
.ImageInputName {
  display: flex;
  flex-direction: row;
}
.imageInput {
  display: flex;
  justify-content: space-around;
  padding: 15px 0 15px 0;
}
.AvatarSpace {
  margin: 0 10px 0 0;
}
.PublicationCardBtn {
  width: 100%;
}
.Btn {
  width: 100%;
}
.Btn .v-btn__content {
  color: #666666;
}
.v-btn {
  text-transform: none;
  justify-content: start;
}
.Cross {
  text-align: right;
  padding: 10px 10px 0 0;
}
.CardNewPostTitle {
  text-align: center;
}
.CardNewPost {
  max-width: 700px;
  margin: 20px auto 20px auto;
}
.InputBloc {
  padding: 30px;
}
.CardNewPostBouton {
  display: flex;
  justify-content: space-around;
  padding: 30px 0 0 0;
}
.AlertNewPost {
  margin: 0 10px;
}
@media screen and (max-width: 640px) {
  .PublicationCard {
    margin: 20px 0 10px 0;
  }
  .CardNewPost {
    margin: 20px 20px 10px 20px;
  }
}
</style>
