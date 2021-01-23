<template>
  <div>
    <div v-for="post in posts" :key="post.postId">
      <v-card class="Card">
        <div class="PostHeader">
          <div class="PostAvatar">
            <v-avatar color="#53AFA7">
              <img v-if="post.User.avatar" :src="post.User.avatar" alt="image postée par utilisateur" />
              <v-icon v-else color="white">mdi-account</v-icon>
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
              <div v-if="post.UserId == userId" class="itemMenu" @click="dialogPostUpdate(post.id, post.content, post.title, post.imageUrl)">
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
        <div v-if="post.imageUrl" class="PostImage">
          <v-img class="photo" max-width="514" max-height="268" contain :src="post.imageUrl" alt="Photo du post"></v-img>
        </div>
        <div v-if="post.Comments.length > 1" class="PostComment text--secondary" @click="getComments(post.id)">{{ post.Comments.length }} commentaires</div>
        <div v-else-if="post.Comments.length == 1" class="PostComment text--secondary" @click="getComments(post.id)">{{ post.Comments.length }} commentaire</div>
        <hr />
        <div class="Icon">
          <v-btn text class="center" @click="dialogAlertDevellopement">
            <v-icon color="#53AFA7">
              mdi-thumb-up-outline
            </v-icon>
            <div>Liker</div>
          </v-btn>
          <v-btn text class="center" @click="getComments(post.id)">
            <v-icon color="#53AFA7">
              mdi-comment-outline
            </v-icon>
            <div>Commenter</div>
          </v-btn>
          <v-btn text class="center" @click="dialogAlertDevellopement">
            <v-icon color="#53AFA7">
              mdi-share-outline
            </v-icon>
            <div>Partager</div>
          </v-btn>
        </div>
        <div class="Comment" v-if="post.id == selectedPostId">
          <hr />
          <div class="CommentFieldBloc">
            <v-avatar color="#53AFA7">
              <img v-if="avatarUser" :src="avatarUser" alt="image postée par utilisateur" />
              <v-icon v-else color="white">mdi-account</v-icon>
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

          <div v-for="comment in comments" :key="comment.id">
            <div class="CommentArea">
              <v-avatar color="#53AFA7">
                <img v-if="comment.User.avatar" :src="comment.User.avatar" alt="image postée par utilisateur" />
                <v-icon v-else color="white">mdi-account</v-icon>
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
                      <div v-if="comment.UserId == userId" class="itemMenu" @click="dialogUpdateComment(comment.id, comment.content)">
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
            <v-icon color="#53AFA7" @click="closeAlert">mdi-close</v-icon>
          </div>
          <h2>Modifier votre Post</h2>
          <div class="InputBlocUpdate">
            <v-textarea placeholder="Titre" v-model="postUpdateTitle" rows="1" auto-grow></v-textarea>
            <v-textarea placeholder="Que vouliez-vous dire?" v-model="postUpdateContent" rows="1" auto-grow></v-textarea>
            <input
              style="display: none"
              @change="getImage"
              type="file"
              accept="image/png, image/jpeg,
                image/bmp, image/gif"
              ref="file"
            />
            <div class="imageInput">
              <span class="text--secondary">Modifier la photo de votre publication: </span>
              <v-avatar size="32" class="AvatarSpace" color="#53AFA7">
                <v-icon small color="white" @click="$refs.file.click()">mdi-image</v-icon>
              </v-avatar>
            </div>
            <div class="ImageInputName">
              <div>{{ postUpdateImageUrl.name }}</div>
              <v-icon v-if="postUpdateImageUrl.name" color="#53AFA7" @click="resetImage">mdi-close</v-icon>
            </div>
            <div class="DialogUpdateBouton">
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
            <v-icon color="#53AFA7" @click="closeAlert">mdi-close</v-icon>
          </div>
          <h2>Modifier votre commentaire</h2>
          <div class="InputBlocUpdate">
            <v-textarea placeholder="Que vouliez-vous dire?" v-model="commentUpdateContent" rows="1" auto-grow></v-textarea>
            <div class="DialogUpdateBouton">
              <v-btn @click="updateComment" color="#B2DFDB">
                Enregistrer
              </v-btn>
            </div>
          </div>
        </v-card>
      </template>
    </v-dialog>
    <!-- Alert -->
    <v-dialog v-model="alert" max-width="700">
      <template>
        <v-card>
          <div class="Cross">
            <v-icon color="#53AFA7" @click="closeAlert">mdi-close</v-icon>
          </div>
          <h3 class="TextUnderDev">{{ message }}</h3>
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
      userId: null,
      isAdmin: null,
      token: '',
      avatarUser: '',
      posts: [],
      comments: [],
      selectedPostId: '',
      postUpdateId: '',
      postUpdateTitle: '',
      postUpdateContent: '',
      postUpdateImageUrl: '',
      commentUpdateId: '',
      commentUpdateContent: '',
      commentContent: '',
      dialog: false,
      postUpdate: false,
      commentUpdate: false,
      message: '',
      alert: false,
    };
  },
  mounted() {
    this.token = localStorage.getItem('acces_token');
    axios
      .get('http://localhost:3000/api/users/profile', { headers: { Authorization: this.token } })
      .then((response) => {
        this.isAdmin = response.data.isAdmin;
        this.userId = response.data.id;
        this.avatarUser = response.data.avatar;
      })
      .catch((err) => {
        console.log(err);
        this.$router.push('/');
      });

    axios
      .get('http://localhost:3000/api/posts', { headers: { Authorization: this.token } })
      .then((response) => {
        this.posts = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    updatePost() {
      const formData = new FormData();
      formData.append('title', this.postUpdateTitle);
      formData.append('content', this.postUpdateContent);
      formData.append('image', this.postUpdateImageUrl);
      axios
        .put(`http://localhost:3000/api/posts/${this.postUpdateId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    signalePost(postId) {
      axios
        .put(`http://localhost:3000/api/posts/${postId}/signale/`, { signale: '1' }, { headers: { 'Content-Type': 'application/json', Authorization: this.token } })
        .then(() => {
          this.alert = true;
          this.message = 'Ce post va être vérifié par un administrateur. Merci de votre contribution.';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletePost(postId) {
      axios
        .delete(`http://localhost:3000/api/posts/${postId}/`, { headers: { Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getComments(postId) {
      (this.selectedPostId = postId),
        axios
          .get(`http://localhost:3000/api/comments/${postId}/byPost`, { headers: { Authorization: this.token } })
          .then((response) => {
            this.comments = response.data;
            console.log(this.comments);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    sendComment(postId) {
      const newComment = { content: this.commentContent };
      axios
        .post(`http://localhost:3000/api/comments/${postId}/new/`, newComment, { headers: { 'Content-Type': 'application/json', Authorization: this.token } })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateComment() {
      const updatedComment = { content: this.commentUpdateContent };
      axios
        .put(`http://localhost:3000/api/comments/${this.commentUpdateId}/`, updatedComment, { headers: { 'Content-Type': 'application/json', Authorization: this.token } })
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

    signaleComment(commentId) {
      axios
        .put(`http://localhost:3000/api/comments/${commentId}/signale/`, { signale: '1' }, { headers: { 'Content-Type': 'application/json', Authorization: this.token } })
        .then(() => {
          this.alert = true;
          this.message = 'Ce commentaire va être vérifié par un administrateur. Merci de votre contribution.';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    dialogPostUpdate(postId, postContent, postTitle, postImageUrl) {
      this.postUpdate = true;
      this.postUpdateId = postId;
      this.postUpdateContent = postContent;
      this.postUpdateTitle = postTitle;
      this.postUpdateImageUrl = postImageUrl;
    },
    dialogUpdateComment(commentId, commentContent) {
      this.commentUpdate = true;
      this.commentUpdateId = commentId;
      this.commentUpdateContent = commentContent;
    },
    dialogAlertDevellopement() {
      this.alert = true;
      this.message = 'Encore un peu de patience, cette fonctionnalitée est en cours de dévellopement!';
    },
    closeAlert() {
      this.alert = false;
      this.postUpdate = false;
      this.postUpdateTitle = '';
      this.postUpdateContent = '';
      this.postUpdateImageUrl = '';
      this.commentUpdate = false;
      this.commentUpdateContent = '';
    },
    getImage() {
      this.postUpdateImageUrl = this.$refs.file.files[0];
    },
    resetImage() {
      this.postUpdateImageUrl = '';
    },
  },
};
</script>
<style scoped>
.photo {
  margin: 10px auto 10px auto;
}
.v-sheet.v-card {
  border-radius: 8px;
}

.PostImage {
  text-align: center;
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
.Cross {
  text-align: right;
  padding: 10px 10px 0 0;
}
.InputBlocUpdate {
  padding: 30px;
}
.DialogUpdateBouton {
  display: flex;
  justify-content: space-around;
  padding: 30px 0 0 0;
}
.TextUnderDev {
  padding: 0 30px 30px 30px;
}
@media screen and (max-width: 640px) {
  .Card {
    margin: 20px 0 10px 0;
  }
}
</style>
