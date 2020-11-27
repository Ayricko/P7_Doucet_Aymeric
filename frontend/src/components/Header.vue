<template>
  <header class="entete">
    <nav>
      <ul>
        <li>
          <router-link to="/news"> <span class="itemNav">News</span> </router-link>
        </li>
        <li>
          <router-link to="/profil"><span class="itemNav">Pofile</span></router-link>
        </li>
        <li>
          <router-link to="/"><span class="itemNav">Logout</span></router-link>
        </li>
      </ul>
    </nav>
    <img src="../assets/test2.png" class="logo" />
  </header>
</template>
<script>
export default {
  name: 'Header',
};
</script>
<style lang="css" scoped>
.entete {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #b2dfdb;
  color: white;
  height: 80px;
  margin: 0 0 30px 0;
  padding: 0 15px 0 15px;
}
ul {
  display: flex;
  align-items: center;
}
li {
  margin: 10px;
}
.itemNav {
  color: white;
  text-decoration: none;
}
</style>
