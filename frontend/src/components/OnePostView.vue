<template>
  <div>
    <UpdatePost />
    <v-card class="Card">
      <div class="PostHeader">
        <div class="PostAvatar">
          <v-avatar color="#53AFA7">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          <div class="PostAvatarSpace">
            <h3>{{ firstName }}</h3>
            <div class="text--secondary">
              {{ post.createdAt | moment('calendar') }}
            </div>
          </div>
        </div>
        <div>
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
      </div>
      <div class="PostTitle">
        <h3>{{ post.title }}</h3>
      </div>
      <div class="PostContent">{{ post.content }}</div>
      <hr />
      <div class="CommentFieldBloc">
        <v-text-field v-model="content" placeholder="Commentaire" filled rounded dense>
          <template v-slot:append>
            <v-icon color="#53AFA7" @click="sendComment(post.id)">
              mdi-send
            </v-icon>
          </template>
        </v-text-field>
      </div>
      <div v-for="comment in comments" :key="comment.id">
        <div class="CommentArea">
          <v-avatar color="#53AFA7">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          <v-card class="CommentContent" color="#f1f4f0">
            <div class="test">
              <div class="CommentTitle text--secondary">{{ comment.User.firstName }} - {{ comment.createdAt | moment('calendar') }}</div>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="#53AFA7" v-bind="attrs" v-on="on">
                    mdi-dots-vertical
                  </v-icon>
                </template>
                <v-list>
                  <div v-if="comment.UserId == userId || isAdmin == true" class="itemMenu" @click="deleteComment(comment.id)">
                    <v-icon class="iconMenu">mdi-delete</v-icon>
                    Supprimer
                  </div>
                  <div v-if="comment.UserId == userId || isAdmin == true" class="itemMenu" @click="updateComment(comment.id)">
                    <v-icon class="iconMenu">mdi-pencil</v-icon>
                    Modifier
                  </div>
                  <div v-if="comment.UserId !== userId" class="itemMenu" @click="signaleComment(comment.id)">
                    <v-icon class="iconMenu">mdi-alert-circle-outline</v-icon>
                    Signaler
                  </div>
                </v-list>
              </v-menu>
            </div>
            <div class="CommentBody">
              {{ comment.content }}
            </div>
          </v-card>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import UpdatePost from './UpdatePost.vue';
export default {
  name: 'OnePostView',
  component: { UpdatePost },
  data() {
    return {
      userId: null,
      isAdmin: null,
      commentBloc: false,
      post: [],
      firstName: null,
      date: '',
      content: '',
      comments: [],
    };
  },
  mounted() {
    const token = localStorage.getItem('acces_token');
    const postId = this.$route.params.id;
    // Get User Profile
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${token}` } })
      .then((response) => {
        this.isAdmin = response.data.isAdmin;
        this.userId = response.data.id;
      })
      .catch((err) => {
        console.log(err);
      });
    // Get One Post
    axios
      .get(`http://localhost:3000/api/posts/${postId}`)
      .then((response) => {
        this.firstName = response.data.User.firstName;
        this.post = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
    // Get comments of this Post
    axios
      .get(`http://localhost:3000/api/comments/${postId}/`)
      .then((response) => {
        this.comments = response.data;
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
          this.$router.push('/home');
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
      if (token) {
        axios
          .post(`http://localhost:3000/api/comments/${postId}/new/`, newComment, { headers: { 'Content-Type': 'application/json', Authorization: token } })
          .then((response) => {
            console.log(response);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert('Session terminée veuillez vous reconnecter');
        this.$router.push('/');
      }
    },

    updateComment(commentId) {
      console.log(commentId);
    },

    deleteComment(commentId) {
      const token = localStorage.getItem('acces_token');
      axios
        .delete(`http://localhost:3000/api/comments/${commentId}/`, { headers: { 'Content-Type': 'application/json', Authorization: token } })
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
    signaleComment(commentId) {
      axios
        .put(`http://localhost:3000/api/comments/${commentId}/signale/`)
        .then((response) => {
          console.log(response);
          alert('Ce commentaire va être vérifié par un administrateur. Merci de votre contribution.');
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
.itemMenu {
  display: flex;
  padding: 15px 25px 15px 15px;
}
.iconMenu {
  padding: 0 20px 0 0;
}
.v-sheet.v-card {
  border-radius: 8px;
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
.CommentArea {
  margin: 0 0 20px 0;
  display: flex;
}
.test {
  display: flex;
  justify-content: space-between;
}
.CommentContent {
  margin: 0 0 0 10px;
  width: 100%;
  padding: 10px;
}
.commentTitle {
  padding: 0 0 0 10px;
}
.CommentBody {
  padding: 10px 30px 0 30px;
}
.CommentFieldBloc {
  display: flex;
  justify-content: space-around;
  padding: 15px 0 0 0;
}

@media screen and (max-width: 640px) {
  .Card {
    margin: 20px 20px 10px 20px;
  }
}
</style>
