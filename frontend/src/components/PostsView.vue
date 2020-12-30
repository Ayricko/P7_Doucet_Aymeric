<template>
  <div>
    <div v-for="post in posts" :key="post.postId">
      <v-card class="Card">
        <div class="PostHeader">
          <div class="PostAvatar">
            <v-avatar color="#53AFA7">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div class="PostAvatarSpace">
              <h3>{{ post.User.firstName }}</h3>
              <div class="text--secondary">
                {{ post.createdAt | moment('calendar') }}
              </div>
            </div>
          </div>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="#53AFA7" v-bind="attrs" v-on="on">
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-list>
              <div v-if="post.UserId == userId || isAdmin == true" class="itemMenu" @click="deletePost(post.id)">
                <v-icon class="iconMenu">mdi-delete</v-icon>
                Supprimer
              </div>
              <div v-if="post.UserId == userId || isAdmin == true" class="itemMenu" @click="updatePost(post.id)">
                <v-icon class="iconMenu">mdi-pencil</v-icon>
                Modifier
              </div>
              <div v-if="post.UserId !== userId" class="itemMenu" @click="signalePost(post.id)">
                <v-icon class="iconMenu">mdi-alert-circle-outline</v-icon>
                Signaler
              </div>
            </v-list>
          </v-menu>
        </div>
        <h3 class="PostTitle">{{ post.title }}</h3>
        <div class="PostContent">{{ post.content }}</div>
        <div class="PostComment text--secondary">4 commentaires</div>
        <div>
          <hr />
          <div class="Icon">
            <div @click="alert = true" v-if="!alert">
              <v-icon color="#53AFA7">
                mdi-thumb-up-outline
              </v-icon>
              Liker
            </div>
            <v-alert v-model="alert" close-text="Close Alert" border="top" dark dismissible>
              Nos equipes travaillent encore sur cette fonctionnalitée
            </v-alert>
            <div>
              <router-link :to="`/post/${post.id}`">
                <v-icon color="#53AFA7">
                  mdi-comment-outline
                </v-icon>
                Commenter
              </router-link>
            </div>
            <div>
              <v-icon color="#53AFA7">
                mdi-share-outline
              </v-icon>
              Partager
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'PostsView',
  data() {
    return {
      alert: false,
      userId: null,
      isAdmin: null,
      commentBloc: false,
      posts: [],
      content: '',
      comments: [],
    };
  },
  mounted() {
    const token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.isAdmin = response.data.isAdmin;
        this.userId = response.data.id;
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get('http://localhost:3000/api/posts')
      .then((response) => {
        this.posts = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    deletePost(postId) {
      const token = localStorage.getItem('acces_token');
      axios
        .delete(`http://localhost:3000/api/posts/${postId}/`, { headers: { 'Content-Type': 'application/json', Authorization: token } })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updatePost(postId) {
      console.log(postId);
    },

    sendComment(postId) {
      const token = localStorage.getItem('acces_token');
      const newComment = { content: this.content };
      axios
        .post(`http://localhost:3000/api/comments/${postId}/new/`, newComment, { headers: { 'Content-Type': 'application/json', Authorization: token } })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    signalePost(postId) {
      axios
        .put(`http://localhost:3000/api/posts/${postId}/signale/`)
        .then((response) => {
          console.log(response);
          alert('Ce Post va être vérifié par un administrateur. Merci de votre contribution.');
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style>
.v-sheet.v-card {
  border-radius: 8px;
}
.v-application a {
  color: #4b4949;
}
.Card {
  max-width: 700px;
  margin: 20px auto 10px auto;
  padding: 20px;
}
.PostHeader {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 0 0 15px 0;
}
.PostAvatar {
  display: flex;
  margin: auto 0 auto 0;
}
.PostAvatarSpace {
  padding: 0 0 0 10px;
}
.PostTitle {
  padding: 0 0 0 10px;
}
.PostContent {
  padding: 15px 30px 20px 30px;
}
.PostComment {
  padding: 0 20px 5px 0;
  text-align: right;
  color: black;
}
.Icon {
  display: flex;
  justify-content: space-around;
  padding: 15px 0 0 0;
}

.CommentBloc {
  margin: 10px 0 0 0;
  padding: 10px;
}
.CommentBody {
  padding: 10px 0 0 40px;
  min-height: 50px;
}
.CommentFieldBloc {
  display: flex;
  justify-content: space-around;
  padding: 15px 0 0 0;
}
.CommentField {
  width: 80%;
}
@media screen and (max-width: 640px) {
  .Card {
    margin: 20px 20px 10px 20px;
  }
}
</style>
