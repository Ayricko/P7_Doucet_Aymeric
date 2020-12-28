<template>
  <div class="background">
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
<style>
.background {
  width: 100%;
  height: 100%;
  background-color: #f1f4f0;
}
</style>
