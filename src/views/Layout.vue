<template>
  <div class="layout">
    <div class="nav">
      <div class="curuser">LiYajie<span @click="logout" class="logout">退出</span></div>
      <Nav/>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { logout } from '../common/utils'
import Nav from '../components/Nav'
export default {
  components: {
    Nav
  },
  methods: {
    logout() {
      // 发送一个退出请求
      logout()
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  .nav {
    width: 200px;
    height: 100%;
    background-color: #001529;
    .curuser {
      color: #fff;
      text-align: center;
    }
  }
  .content {
    flex: 1;
  }
}
</style>
