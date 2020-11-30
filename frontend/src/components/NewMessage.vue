<template>
  <div>
    <div class="iconNewMessage">
      <v-btn color="#53AFA7" @click="showNewMessageBloc = !showNewMessageBloc">
        <v-icon color="white">
          mdi-message-text
        </v-icon>
      </v-btn>
    </div>
    <v-card class="mx-auto cardNewMessage" max-width="700" v-if="showNewMessageBloc">
      <v-card class="titleCardNewMessage" color="#B2DFDB">
        <h3>Nouvelle publication</h3>
      </v-card>
      <v-form class="inputBloc">
        <v-text-field v-model="msgTitle" label="Titre" required></v-text-field>
        <v-text-field v-model="msgBody" label="Que voulez-vous dire?" required></v-text-field>
        <div class="boutonCardNewMessage">
          <v-btn color="#B2DFDB" @click="send">
            Publier
          </v-btn>
          <v-btn color="#B2DFDB" @click="reset">
            Annuler
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>
<script>
// import axios from 'axios';
export default {
  data() {
    return {
      msgBody: '',
      msgTitle: '',
      showNewMessageBloc: false,
    };
  },
  // async created() {
  //   this.messages = (await axios.get('http://localhost:3000/messages')).data;
  // },
  methods: {
    send() {
      console.log(this.msgBody);
      console.log(this.msgTitle);
    },
    reset() {
      (this.msgBody = ''), (this.msgTitle = ''), (this.showNewMessageBloc = false);
      console.log('Annulé');
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
  margin: 20px 0 20px 0;
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
</style>
