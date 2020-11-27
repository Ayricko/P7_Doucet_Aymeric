<template>
  <div>
    <div class="titre">
      <v-btn color="#53AFA7" @click="showNewMessageBloc = !showNewMessageBloc">
        <v-icon color="white">
          mdi-message-text
        </v-icon>
      </v-btn>
    </div>
    <v-card class="mx-auto" max-width="700" v-if="showNewMessageBloc">
      <v-card color="#B2DFDB">
        <div class="titre">
          <h3>Nouvelle publication</h3>
        </div>
      </v-card>
      <v-form>
        <div class="inputBloc">
          <v-text-field v-model="msgTitle" label="Titre" required></v-text-field>
          <v-text-field v-model="msgBody" label="Que voulez-vous dire?" required></v-text-field>
        </div>
        <div class="bouton">
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
      showNewMessageBloc: true,
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
      (this.msgBody = ''), (this.msgTitle = '');
      console.log('Annulé');
    },
  },
};
</script>
<style>
.bouton {
  justify-content: space-around;
}
.titre {
  display: flex;
  justify-content: center;
  padding: 0 0 20px 0;
}
.inputBloc {
  padding: 30px;
}
</style>
