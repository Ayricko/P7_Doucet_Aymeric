<template>
  <div>
    <Header />
    <Message />
    <Post />
    <br />
  </div>
</template>
<script>
import Header from '../components/Header';
import Message from '../components/NewMessage';
import Post from '../components/Post';
export default {
  components: {
    Message,
    Header,
    Post,
  },
  name: 'PostsView',
  props: [],
  mounted() {},
  data: () => {
    return {};
  },
  methods: {},
  computed: {},
};
</script>
<style scoped lang="css"></style>
