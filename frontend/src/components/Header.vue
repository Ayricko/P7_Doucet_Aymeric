<template>
  <div class="entete">
    <div class="logo">
      <img class="ajust" src="../assets/test2.png" />
    </div>
    <Burger />
  </div>
</template>
<script>
import Burger from '../components/Burger';
export default {
  name: 'Header',
  components: {
    Burger,
  },
};
</script>
<style>
.entete {
  align-items: center;
  background: #b2dfdb;
  height: 80px;
  margin: 0 0 30px 0;
}
.logo {
  width: 100%;
  text-align: center;
  padding: 0 20px 0 0;
}
.ajust {
  margin: 5px 0 0 0;
}
</style>
