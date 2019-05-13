<template>
  <div class="layout">
    <div class="nav">
      <div>当前用户</div>
      <Nav/>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from '../components/Nav'
export default {
  components: {
    Nav
  }
}
</script>


<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  color: hsla(0,0%,100%,.65);
  .nav {
    width: 200px;
    height: 100%;
    background-color: #001529;
  }
  .content {
    flex: 1;
  }
}
</style>
