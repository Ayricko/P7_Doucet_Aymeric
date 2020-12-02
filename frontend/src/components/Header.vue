<template>
  <div class="header">
    <span class="iconL logo"><img class="ajust" src="../assets/logo.png"/></span>
    <span class="iconS logo"><img src="../assets/logoSeul.png"/></span>

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
.header {
  display: flex;
  background: #b2dfdb;
  height: 80px;
  margin: 0 0 30px 0;
  align-items: center;
  text-align: right;
}
.logo {
  width: 100%;
  text-align: right;
  padding: 0 20px 0 0;
}
@media screen and (max-width: 640px) {
  .iconL {
    display: none;
  }
}
@media screen and (min-width: 641px) {
  .iconS {
    display: none;
  }
}
</style>
