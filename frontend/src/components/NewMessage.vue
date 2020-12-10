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
        <v-text-field v-model="content" label="Que voulez-vous dire?" required></v-text-field>
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
    return { title: '', content: '', showNewMessageBloc: false };
  },
  methods: {
    send() {
      const newPost = { title: this.title, content: this.content };
      axios.post('http://localhost:3000/posts', newPost).then((response) => {
        const data = response.data;
        console.log(data);
        this.$emit('updated', newPost);
      });
      (this.title = ''), (this.content = ''), (this.showNewMessageBloc = false);
    },
    reset() {
      (this.title = ''), (this.content = ''), (this.showNewMessageBloc = false);
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
