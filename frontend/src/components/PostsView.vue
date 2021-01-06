<template>
  <div>
    <div v-for="post in posts" :key="post.postId">
      <v-card if class="Card">
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
              <div v-if="post.UserId == userId || isAdmin == true" class="itemMenu" @click="dialogPostUpdate(post.id, post.content, post.title)">
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
        <div @click="showComment = !showComment">
          <div v-if="post.Comments.length > 1" class="PostComment text--secondary">{{ post.Comments.length }} commentaires</div>
          <div v-else-if="post.Comments.length <= 1" class="PostComment text--secondary">{{ post.Comments.length }} commentaire</div>
        </div>
        <hr />
        <div class="Icon">
          <v-btn text class="center">
            <v-icon color="#53AFA7">
              mdi-thumb-up-outline
            </v-icon>
            <div>Liker</div>
          </v-btn>
          <v-btn text class="center" @click="showComment = !showComment">
            <v-icon color="#53AFA7">
              mdi-comment-outline
            </v-icon>
            <div>Commenter</div>
          </v-btn>
          <v-btn text class="center">
            <v-icon color="#53AFA7">
              mdi-share-outline
            </v-icon>
            <div>Partager</div>
          </v-btn>
        </div>
        <div class="Comment" v-if="showComment">
          <hr />
          <div class="CommentFieldBloc">
            <v-avatar color="#53AFA7">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div class="CommentField">
              <v-text-field v-model="commentContent" placeholder="Ecrivez un commentaire..." filled rounded dense>
                <template v-slot:append>
                  <v-icon color="#53AFA7" @click="sendComment(post.id)">
                    mdi-send
                  </v-icon>
                </template>
              </v-text-field>
            </div>
          </div>
          <div v-for="comment in post.Comments" :key="comment.id">
            <div class="CommentArea">
              <v-avatar color="#53AFA7">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
              <v-card class="CommentContent" color="#f1f4f0">
                <div class="CommentHeader">
                  <div class="text--secondary">{{ comment.User.firstName }} - {{ comment.createdAt | moment('calendar') }}</div>
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
                      <div v-if="comment.UserId == userId || isAdmin == true" class="itemMenu" @click="dialogUpdateComment(comment.id, comment.content)">
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
        </div>
      </v-card>
    </div>
    <!-- Update post -->
    <v-dialog v-model="postUpdate" max-width="700">
      <template>
        <v-card>
          <div class="Cross">
            <v-icon color="#53AFA7" @click="closeDialogPostUpdate">mdi-close</v-icon>
          </div>
          <h2 class="CardNewPostTitle">Modifier votre Post</h2>
          <div class="InputBloc">
            <v-textarea placeholder="Titre" v-model="postUpdateTitle" rows="1" auto-grow></v-textarea>
            <v-textarea placeholder="Que vouliez-vous dire?" v-model="postUpdateContent" rows="1" auto-grow></v-textarea>
            <div class="CardNewPostBouton">
              <v-btn @click="updatePost" color="#B2DFDB">
                Enregistrer
              </v-btn>
            </div>
          </div>
        </v-card>
      </template>
    </v-dialog>
    <!-- Update Comment -->
    <v-dialog v-model="commentUpdate" max-width="700">
      <template>
        <v-card>
          <div class="Cross">
            <v-icon color="#53AFA7" @click="closeDialogCommentUpdate">mdi-close</v-icon>
          </div>
          <h2 class="CardNewPostTitle">Modifier votre commentaire</h2>
          <div class="InputBloc">
            <v-textarea placeholder="Que vouliez-vous dire?" v-model="commentUpdateContent" rows="1" auto-grow></v-textarea>
            <div class="CardNewPostBouton">
              <v-btn @click="updateComment" color="#B2DFDB">
                Enregistrer
              </v-btn>
            </div>
          </div>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'PostsView',
  data() {
    return {
      showComment: false,
      userId: null,
      isAdmin: null,
      posts: [],
      postUpdateId: '',
      postUpdateTitle: '',
      postUpdateContent: '',
      commentUpdateId: '',
      commentUpdateContent: '',
      commentContent: '',
      dialog: false,
      postUpdate: false,
      commentUpdate: false,
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
        console.log(this.posts);
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

    dialogPostUpdate(postId, postContent, postTitle) {
      this.postUpdate = true;
      this.postUpdateId = postId;
      this.postUpdateContent = postContent;
      this.postUpdateTitle = postTitle;
    },

    closeDialogPostUpdate() {
      this.postUpdate = false;
      this.postUpdateTitle = '';
      this.postUpdateContent = '';
    },

    updatePost() {
      const token = localStorage.getItem('acces_token');
      const newPost = { title: this.postUpdateTitle, content: this.postUpdateContent };
      axios
        .put(`http://localhost:3000/api/posts/${this.postUpdateId}/`, newPost, { headers: { 'Content-Type': 'application/json', Authorization: token } })
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

    sendComment(postId) {
      const token = localStorage.getItem('acces_token');
      const newComment = { content: this.commentContent };
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

    dialogUpdateComment(commentId, commentContent) {
      this.commentUpdate = true;
      this.commentUpdateId = commentId;
      this.commentUpdateContent = commentContent;
    },

    closeDialogCommentUpdate() {
      this.commentUpdate = false;
      this.commentUpdateContent = '';
    },

    updateComment() {
      const token = localStorage.getItem('acces_token');
      const updatedComment = { content: this.commentUpdateContent };
      axios
        .put(`http://localhost:3000/api/comments/${this.commentUpdateId}/`, updatedComment, { headers: { 'Content-Type': 'application/json', Authorization: token } })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
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
    margin: 20px 20px 10px 20px;
  }
}
</style>
