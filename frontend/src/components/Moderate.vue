<template>
  <div v-if="isAdmin == true" class="background">
    <div class="home">
      <v-btn color="#53AFA7" @click="home">
        Home
      </v-btn>
    </div>
    <h2>Les posts signalés</h2>
    <div v-for="post in posts" :key="post.postId">
      <v-card v-if="post.signale == true" class="Card">
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
              <div class="itemMenu" @click="deletePost(post.id)">
                <v-icon class="iconMenu">mdi-delete</v-icon>
                Supprimer Post
              </div>
              <div class="itemMenu" @click="deleteSignale(post.id)">
                <v-icon class="iconMenu">mdi-alert-circle-outline</v-icon>
                Supprimer Signalement
              </div>
            </v-list>
          </v-menu>
        </div>
        <h3 class="PostTitle">{{ post.title }}</h3>
        <div class="PostContent">{{ post.content }}</div>
        <div v-if="post.imageUrl" class="PostImage">
          <v-img class="photo" max-width="514" max-height="268" contain :src="post.imageUrl" alt="Photo du post"></v-img>
        </div>
      </v-card>
    </div>
    <h2>Les commentaire signalés</h2>
    <div v-for="comment in comments" :key="comment.id">
      <v-card v-if="comment.signale == true" class="Card">
        <div class="PostHeader">
          <div class="PostAvatar">
            <v-avatar color="#53AFA7">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div class="PostAvatarSpace">
              <h3>{{ comment.User.firstName }}</h3>
              <div class="text--secondary">
                {{ comment.createdAt | moment('calendar') }}
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
              <div class="itemMenu" @click="deleteComment(comment.id)">
                <v-icon class="iconMenu">mdi-delete</v-icon>
                Supprimer Commentaire
              </div>
              <div class="itemMenu" @click="deleteSignaleComment(comment.id)">
                <v-icon class="iconMenu">mdi-alert-circle-outline</v-icon>
                Supprimer Signalement
              </div>
            </v-list>
          </v-menu>
        </div>
        <div class="PostContent">{{ comment.content }}</div>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Moderate',
  data() {
    return {
      userId: null,
      isAdmin: null,
      token: '',
      posts: [],
      comments: [],
    };
  },
  mounted() {
    this.token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { Authorization: this.token } })
      .then((response) => {
        this.isAdmin = response.data.isAdmin;
        this.userId = response.data.id;
      })
      .catch((err) => {
        console.log(err.response.data);
        this.$router.push('/');
      });

    axios
      .get('http://localhost:3000/api/posts/signaled/', { headers: { Authorization: this.token } })
      .then((response) => {
        this.posts = response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('http://localhost:3000/api/comments/signaled/', { headers: { Authorization: this.token } })
      .then((response) => {
        this.comments = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    deletePost(postId) {
      axios
        .delete(`http://localhost:3000/api/posts/${postId}/`, { headers: { Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    deleteSignale(postId) {
      axios
        .put(`http://localhost:3000/api/posts/${postId}/deleteSignale/`, { signale: '-1' }, { headers: { 'Content-Type': 'application/json', Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    deleteComment(commentId) {
      axios
        .delete(`http://localhost:3000/api/comments/${commentId}/`, { headers: { Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteSignaleComment(commentId) {
      axios
        .put(`http://localhost:3000/api/comments/${commentId}/deleteSignale/`, { signale: '-1' }, { headers: { 'Content-Type': 'application/json', Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    home() {
      this.$router.push('/home');
    },
  },
};
</script>
<style scoped>
.photo {
  margin: 10px auto 10px auto;
}
.home {
  display: flex;
  justify-content: center;
  margin: 20px;
}
h2 {
  text-align: center;
}
.v-sheet.v-card {
  border-radius: 8px;
}
.itemMenu {
  display: flex;
  padding: 15px 25px 15px 15px;
}
.iconMenu {
  padding: 0 20px 0 0;
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
  padding: 15px 30px 15px 30px;
}
.PostComment {
  padding: 0 20px 10px 0;
  text-align: right;
  color: black;
}
.Icon {
  display: flex;
  justify-content: space-around;
  padding: 15px 0 0 0;
}
.center {
  display: flex;
}
.center div {
  margin: 0 0 5px 5px;
}
.Comment {
  margin: 15px 0 0 0;
}
.CommentFieldBloc {
  display: flex;
  padding: 15px 0 0 0;
}
.CommentField {
  padding: 5px 0 0 10px;
  width: 100%;
}
.CommentArea {
  margin: 0 0 20px 0;
  display: flex;
}
.CommentArea .v-sheet.v-card {
  border-radius: 22px;
}
.CommentContent {
  margin: 0 0 0 10px;
  width: 100%;
  padding: 10px;
}
.CommentHeader {
  display: flex;
  justify-content: space-between;
  padding: 0 0 0 10px;
}
.CommentBody {
  padding: 10px 0 0 40px;
  min-height: 50px;
}
@media screen and (max-width: 640px) {
  .Card {
    margin: 20px 0px 10px 0px;
  }
}
</style>
