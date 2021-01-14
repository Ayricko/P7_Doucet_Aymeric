<template>
  <div class="backgroundAV">
    <div class="logoAuth">
      <img src="../assets/logo.png" />
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
};
</script>
<style>
.logoAuth {
  padding: 30px 0 0 0;
  text-align: center;
}
.backgroundAV {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}
</style>
