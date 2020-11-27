<template>
  <v-card class="mx-auto" max-width="700">
    <v-card color="#B2DFDB">
      <div class="titre">
        <h3>{{ titre }}</h3>
      </div>
      <div class="subtitle text--secondary">
        <div>
          <v-avatar color="#53AFA7">
            <span class="white--text headline">AD</span>
          </v-avatar>
          {{ user }}
        </div>
        <div class="centrage">
          {{ date }}
        </div>
      </div>
    </v-card>
    <p class="postBloc">{{ message }}</p>
    <v-card color="#B2DFDB">
      <div class="iconBloc">
        <v-btn color="#53AFA7" @click="comment">
          <v-icon color="white">
            mdi-message-text
          </v-icon>
        </v-btn>
        <v-btn color="#53AFA7" @click="like">
          <v-icon color="white">
            mdi-heart
          </v-icon>
        </v-btn>
      </div>
      <div class="row commentBloc">
        <div class="col-10 ">
          <v-text-field v-model="comments" label="Commentaire" placeholder="Commentaire"></v-text-field>
        </div>
        <div class="centrage">
          <v-btn small color="#53AFA7" @click="sendComment">
            <v-icon color="white">
              mdi-send
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-card>
</template>

<script>
// import axios from 'axios';
export default {
  data() {
    return {
      titre: 'Titre du post',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      user: 'Aymeric Doucet',
      date: '26/11/2020 - 12:35',
      comments: '',
    };
  },
  methods: {
    //   async created() {
    //     this.message = (await axios.get('http://localhost:3000/messages')).data;
    //   },
    comment() {
      console.log('Afficher les commentaires');
    },
    like() {
      console.log('liké');
    },
    sendComment() {
      console.log('Commentaire posté');
      this.comments = '';
    },
  },
};
</script>
<style>
.titre {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
.subtitle {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 20px 20px;
}
.centrage {
  margin: auto 0 auto 0;
}
.postBloc {
  padding: 30px;
}
.iconBloc {
  display: flex;
  justify-content: space-around;
  padding: 20px 0 0 0;
}
.commentBloc {
  display: flex;
  justify-content: space-around;
  padding: 10px 20px 0 20px;
}
</style>
