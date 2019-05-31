<template>
  <div class="nav-wrapper">
    <div class="nav-item" v-for="item in data.navs" :key="item.text">
      <router-link :to="item.url">{{item.text}}</router-link>
    </div>
  </div>
</template>

<script>
import navs from '../apollo/queries/navs.gql'
export default {
  data() {
    return {
      data: {
        navs: []
      }
    }
  },
  apollo: {
    data: {
      prefetch: true,
      query: navs
    }
  }
}
</script>

<style lang="less" scoped>
.nav-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
