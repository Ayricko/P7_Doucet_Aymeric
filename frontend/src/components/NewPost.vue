<template>
  <div>
    <v-card class="PublicationCard">
      <div>
        <v-avatar class="AvatarSpace" color="#53AFA7">
          <v-icon color="white">mdi-account</v-icon>
        </v-avatar>
      </div>
      <div class="PublicationCardBtn">
        <v-btn class="Btn" large depressed plain rounded @click="dialog = true">Que voulez-vous dire, {{ firstName }} ?</v-btn>
      </div>
    </v-card>
    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <div class="Cross">
          <v-icon color="#53AFA7" @click="reset">mdi-close</v-icon>
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
          <div class="testA">
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
      title: '',
      content: '',
      firstName: '',
      image: '',
      showNewPostBloc: false,
      dialog: false,
    };
  },
  mounted() {
    const token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.firstName = response.data.firstName;
      })
      .catch((err) => {
        console.log(err);
        this.$router.push('/');
      });
  },
  methods: {
    getImage() {
      this.image = this.$refs.file.files[0];
    },
    send() {
      const token = localStorage.getItem('acces_token');
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('content', this.content);
      formData.append('image', this.image);
      console.log(this.image);
      axios
        .post('http://localhost:3000/api/posts/new', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: token } })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      this.title = '';
      this.content = '';
      this.image = '';
      this.showNewPostBloc = false;
    },
    reset() {
      this.dialog = false;
      this.title = '';
      this.content = '';
      this.image = '';
      this.showNewPostBloc = false;
    },
    resetImage() {
      this.image = '';
    },
  },
};
</script>
<style>
.testA {
  display: flex;
  flex-direction: row;
}
.imageInput {
  display: flex;
  justify-content: space-around;
  padding: 15px 0 15px 0;
}
.PublicationCard {
  display: flex;
  align-items: center;
  max-width: 700px;
  margin: 20px auto 20px auto;
  padding: 20px;
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
@media screen and (max-width: 640px) {
  .CardNewPost {
    margin: 20px 20px 10px 20px;
  }
  .PublicationCard {
    margin: 20px 20px 10px 20px;
  }
}
</style>
