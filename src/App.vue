<template>
  <div id="app">
    <div class="nav">
      <Nav/>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from './components/Nav'
export default {
  components: {
    Nav
  }
}
</script>


<style lang="less" scoped>
#app {
  display: flex;
  height: 100vh;
  .nav {
    width: 200px;
  }
  .content {
    flex: 1;
  }
}
</style>
