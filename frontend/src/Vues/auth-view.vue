<template>
  <div>
    <div class="essai">
      <img src="../assets/test2.png" />
    </div>
    <div>
      <Login />
    </div>
  </div>
</template>
<script>
import Login from '../components/Login';

export default {
  components: {
    Login,
  },
  name: 'AuthView',
  props: [],
  mounted() {},
  data: () => {
    return {};
  },
  methods: {},
  computed: {},
};
</script>
<style>
.essai {
  padding: 30px 0 0 0;
  text-align: center;
}
</style>
