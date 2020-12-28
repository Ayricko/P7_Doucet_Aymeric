<template>
  <div class="background">
    <Header />
    <NewPost />
    <PostsView />
  </div>
</template>

<script>
import Header from '../components/Header';
import NewPost from '../components/NewPost';
import PostsView from '../components/PostsView';
export default {
  components: { NewPost, Header, PostsView },
  data() {
    return {};
  },
};
</script>
<style>
.background {
  width: 100%;
  height: 100%;
  background-color: #f1f4f0;
}
</style>
