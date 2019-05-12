<template>
  <div class="left-wrapper">
    <a-menu
      @click="handleClick"
      theme="dark"
      mode="vertical"
    >
      <a-menu-item
        :selected-keys="[current]"
        v-for="item in menus"
        :key="item.url"
      >
        <router-link :to="item.url">
          <a-icon type="mail" />{{ item.text }}</router-link>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        {
          url: "/manager/index",
          text: "博客管理"
        },
        {
          url: "/manager/menu",
          text: "菜单管理"
        },
        {
          url: "/manager/user",
          text: "用户管理"
        },
        {
          url: "/manager/pic",
          text: "图片管理"
        }
      ],
      current: ""
    };
  },
  methods: {
    handleClick(e) {
      this.current = e.key;
    }
  }
};
</script>


<style lang="less" scoped>
.left-wrapper {
  width: 200px;
  height: 100%;
  background-color: #314659;
  color: #fff;
}
</style>