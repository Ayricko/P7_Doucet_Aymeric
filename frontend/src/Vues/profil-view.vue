<template>
  <div>
    <Header />
    <Profil />
  </div>
</template>
<script>
import Header from '../components/header';
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
