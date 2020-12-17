<template>
  <div>
    <Header />
    <Post @updated="displayNewPost" />
    <div v-for="post in posts" :key="post.postId">
      <v-card class="cardPost">
        <v-card class="titleCardPost" color="#B2DFDB">
          <h3>{{ post.title }}</h3>
          <div class="signatureCardPost text--secondary">
            <div class="avatarBloc">
              <v-avatar color="#53AFA7">
                <span class="white--text headline">AD</span>
              </v-avatar>
              <div class="avatarSpace">{{ post.User.firstName }}</div>
            </div>
            <div class="centrage">
              {{ post.createdAt | moment('calendar') }}
            </div>
          </div>
        </v-card>
        <div class="postBloc">{{ post.content }}</div>
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
              <div class="colorLike">{{ post.like }}</div>
            </v-btn>
          </div>
          <div v-for="comment in post.comments" :key="comment.id">
            <div v-show="commentBloc">
              <v-card class="commentBloc" color="#53AFA7">
                <div class="text--secondary">{{ comment.user }} - {{ comment.date }}</div>
                <div class="bodyComment">
                  {{ comment.body }}
                </div>
              </v-card>
            </div>
          </div>
          <div class="commentFieldBloc">
            <div class="commentField">
              <v-text-field v-model="comment" label="Commentaire" placeholder="Commentaire"></v-text-field>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Header';
import Post from '../components/NewPost';
export default {
  components: { Post, Header },
  data() {
    return {
      commentBloc: false,
      posts: [],
      comment: [],
    };
  },
  created() {
    axios.get('http://localhost:3000/api/posts').then((response) => {
      this.posts = response.data;
      console.log(this.posts);
    });
  },

  methods: {
    like() {
      console.log('liké');
    },
    sendComment() {
      console.log(this.comment);
      this.comment = '';
    },
    displayNewPost(newPost) {
      this.posts.push(newPost);
    },
  },
};
</script>
<style>
.colorLike {
  color: white;
  margin: 0 0 0 5px;
}
.cardPost {
  max-width: 700px;
  margin: 20px auto 10px auto;
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
@media screen and (max-width: 640px) {
  .cardPost {
    margin: 20px 20px 10px 20px;
  }
}
</style>
