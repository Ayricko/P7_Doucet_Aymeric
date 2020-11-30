<template>
  <v-card class="mx-auto cardPost" max-width="700">
    <v-card class="titleCardPost" color="#B2DFDB">
      <h3>{{ titre }}</h3>
      <div class="signatureCardPost text--secondary">
        <div class="avatarBloc">
          <v-avatar color="#53AFA7">
            <span class="white--text headline">AD</span>
          </v-avatar>
          <div class="avatarSpace">{{ user }}</div>
        </div>
        <div class="centrage">
          {{ date }}
        </div>
      </div>
    </v-card>
    <div class="postBloc">{{ message }}</div>
    <v-card class="commentCard" color="#B2DFDB">
      <div class="iconBloc">
        <v-btn color="#53AFA7" @click="commentBloc = !commentBloc">
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
      <div v-if="commentBloc">
        <v-card class="commentBloc" color="#53AFA7">
          <div class="text--secondary">{{ user }} le: {{ date }}</div>
          <div class="bodyComment">
            {{ comments }}
          </div>
        </v-card>
      </div>
      <div class="commentFieldBloc">
        <div class="commentField">
          <v-text-field label="Commentaire" placeholder="Commentaire"></v-text-field>
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
  components: {},
  data() {
    return {
      commentBloc: false,
      titre: 'Titre du post',
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      user: 'Aymeric Doucet',
      date: '26/11/2020 - 12:35',
      comments: 'test',
    };
  },
  methods: {
    //   async created() {
    //     this.message = (await axios.get('http://localhost:3000/messages')).data;
    //   },
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
.cardPost {
  margin: 20px 0 10px 0;
}
.titleCardPost {
  text-align: center;
  min-block-size: 50px;
  padding: 12px;
}
.signatureCardPost {
  display: flex;
  justify-content: space-between;
}
.postBloc {
  padding: 30px;
}
.iconBloc {
  display: flex;
  justify-content: space-around;
}
.commentCard {
  padding: 15px;
}
.commentBloc {
  margin: 10px 0 0 0;
  padding: 10px;
}
.bodyComment {
  padding: 10px 0 0 40px;
  min-height: 50px;
}
.commentFieldBloc {
  margin: 10px 0 0 0;
  display: flex;
  justify-content: space-around;
}
.commentField {
  width: 80%;
}
.avatarBloc {
  display: flex;
}
.avatarSpace {
  padding: 0 0 0 10px;
  margin: auto 0 auto 0;
}
.centrage {
  margin: auto 0 auto 0;
}
</style>
