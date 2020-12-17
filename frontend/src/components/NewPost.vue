<template>
  <div>
    <div class="iconNewPost">
      <v-btn color="#53AFA7" @click="showNewPostBloc = !showNewPostBloc">
        <v-icon color="white">
          mdi-message-text
        </v-icon>
      </v-btn>
    </div>
    <v-card class="cardNewPost" v-if="showNewPostBloc">
      <v-card class="titleCardNewPost" color="#B2DFDB">
        <h3>Nouvelle publication</h3>
      </v-card>
      <form class="inputBloc">
        <v-text-field v-model="title" label="Titre" required></v-text-field>
        <v-text-field v-model="content" label="Que voulez-vous dire?" required></v-text-field>
        <div class="boutonCardNewPost">
          <v-btn color="#B2DFDB" @click="send">
            Publier
          </v-btn>
          <v-btn color="#B2DFDB" @click="reset">
            Annuler
          </v-btn>
        </div>
      </form>
    </v-card>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return { title: '', content: '', showNewPostBloc: false };
  },
  methods: {
    send() {
      const token = localStorage.getItem('acces_token');
      const newPost = { title: this.title, content: this.content };
      axios.post('http://localhost:3000/api/posts/new', newPost, { headers: { 'Content-Type': 'application/json', Authorization: token } }).then((response) => {
        const data = response.data;
        console.log(data.status);
        this.$router.push('/news');
      });
      (this.title = ''), (this.content = ''), (this.showNewPostBloc = false);
    },
    reset() {
      (this.title = ''), (this.content = ''), (this.showNewPostBloc = false);
    },
  },
};
</script>
<style scoped>
.iconNewPost {
  display: flex;
  justify-content: center;
}
.cardNewPost {
  max-width: 700px;
  margin: 20px auto 20px auto;
}
.titleCardNewPost {
  text-align: center;
  min-block-size: 50px;
  padding: 10px 0 10px 0;
}
.inputBloc {
  padding: 30px;
}
.boutonCardNewPost {
  display: flex;
  justify-content: space-around;
}
@media screen and (max-width: 640px) {
  .cardNewPost {
    margin: 20px 20px 10px 20px;
  }
}
</style>
