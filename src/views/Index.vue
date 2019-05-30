<template>
  <div class="nav-wrapper">
    <div class="nav-item">
      <router-link to="/blogs">博客管理</router-link>
    </div>
    <div class="nav-item">
      <router-link to="/users">用户管理</router-link>
    </div>
  </div>
</template>

<style lang="less" scoped>
.nav-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
