<template>
  <div class="backgroundHV">
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
  name: 'home-view',
  components: { NewPost, Header, PostsView },
};
</script>
<style>
.backgroundHV {
  width: 100%;
  height: 100%;
  background-color: #f1f4f0;
}
</style>
