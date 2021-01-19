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
};
</script>
<style>
.backgroundPV {
  width: 100%;
  height: 100%;
  background-color: #f1f4f0;
}
</style>
