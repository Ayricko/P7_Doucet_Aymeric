<template>
  <div>
    <Header />
    <Profil />
  </div>
</template>
<script>
import Header from '../components/Header';
import Profil from '../components/Profil';
export default {
  components: {
    Header,
    Profil,
  },
  name: 'ProfilView',
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
