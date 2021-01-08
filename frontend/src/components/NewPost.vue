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
        <form class="InputBloc">
          <v-textarea v-model="title" label="Titre" rows="1" auto-grow></v-textarea>
          <v-textarea v-model="content" label="Que voulez-vous dire?" rows="1" auto-grow></v-textarea>
          <v-file-input
            label="Une photo peut-être?"
            accept="image/png, image/jpeg,
                image/bmp"
            prepend-icon="mdi-image"
            v-model="imageUrl"
          >
          </v-file-input>
          <div class="CardNewPostBouton">
            <v-btn color="#B2DFDB" @click="send">
              Publier
            </v-btn>
          </div>
        </form>
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
      imageUrl: [],
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
    send() {
      const token = localStorage.getItem('acces_token');
      let newPost = { title: this.title, content: this.content, imageUrl: this.imageUrl.name };
      // if (this.imageUrl.name) {
      //   newPost = { title: this.title, content: this.content, imageUrl: this.imageUrl.name };
      // } else {
      //   newPost = { title: this.title, content: this.content };
      // }

      axios
        .post('http://localhost:3000/api/posts/new', newPost, { headers: { 'Content-Type': 'application/json', Authorization: token } })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      this.title = '';
      this.content = '';
      this.showNewPostBloc = false;
    },
    reset() {
      this.dialog = false;
      this.title = '';
      this.content = '';
      this.imageUrl = [];
      this.showNewPostBloc = false;
    },
  },
};
</script>
<style>
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
