<template>
  <div>
    <div class="iconNewMessage">
      <v-btn color="#53AFA7" @click="showNewMessageBloc = !showNewMessageBloc">
        <v-icon color="white">
          mdi-message-text
        </v-icon>
      </v-btn>
    </div>
    <v-card class="cardNewMessage" v-if="showNewMessageBloc">
      <v-card class="titleCardNewMessage" color="#B2DFDB">
        <h3>Nouvelle publication</h3>
      </v-card>
      <form class="inputBloc">
        <v-text-field v-model="title" label="Titre" required></v-text-field>
        <v-text-field v-model="postId" label="Test Post Id" required></v-text-field>
        <v-text-field v-model="body" label="Que voulez-vous dire?" required></v-text-field>
        <v-text-field v-model="user" label="Qui êtes vous?" required></v-text-field>
        <v-text-field v-model="date" label="On est le?" required></v-text-field>
        <div class="boutonCardNewMessage">
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
    return { title: '', postId: '', body: '', user: '', date: '', userId: '', like: '', comments: [], showNewMessageBloc: false };
  },
  methods: {
    send() {
      const newPost = { title: this.title, postId: this.postId, body: this.body, user: this.user, date: this.date, userId: '', like: '', comments: [] };
      axios.post('http://localhost:3000/posts', newPost).then((response) => {
        const data = response.data;
        console.log(data);
        this.$emit('updated', newPost);
      });
      (this.postId = ''), (this.title = ''), (this.body = ''), (this.user = ''), (this.date = ''), (this.showNewMessageBloc = false);
    },
    reset() {
      (this.postId = ''), (this.title = ''), (this.body = ''), (this.user = ''), (this.date = ''), (this.showNewMessageBloc = false);
    },
  },
};
</script>
<style scoped>
.iconNewMessage {
  display: flex;
  justify-content: center;
}
.cardNewMessage {
  max-width: 700px;
  margin: 20px auto 20px auto;
}
.titleCardNewMessage {
  text-align: center;
  min-block-size: 50px;
  padding: 10px 0 10px 0;
}
.inputBloc {
  padding: 30px;
}
.boutonCardNewMessage {
  display: flex;
  justify-content: space-around;
}
@media screen and (max-width: 640px) {
  .cardNewMessage {
    margin: 20px 20px 10px 20px;
  }
}
</style>
