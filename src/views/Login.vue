<template>
  <div class="login-wrapper">
    <div class="form">
      <div class="form-item-header">
        <img src="http://img0.imgtn.bdimg.com/it/u=3848288054,531111080&fm=26&gp=0.jpg" alt="">
      </div>
      <div class="form-item">
        <label>用户名</label>
        <input v-model="model.username" type="text" placeholder="请输入用户名" autocomplete="off">
      </div>
      <div class="form-item">
        <label>密码</label>
        <input v-model="model.password" type="password" placeholder="请输入密码" autocomplete="off">
      </div>
      <div class="form-item">
        <label>登录码</label>
        <input v-model="model.logincode" type="password" placeholder="请输入登录码" autocomplete="off">
      </div>
      <div class="form-item-bottom">
        <a-button @click="login" type="primary" block>登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import login from '../apollo/queries/login.gql'
export default {
  data: () => ({
    model: {
      type: Object,
      default: () => {
        return {
          username: '',
          password: '',
          logincode: ''
        }
      }
    },
    user: {
    }
  }),
  methods: {
    async login() {
      const { data } = await this.$apollo.query({
        query: login,
        variables: {
          username: this.model.username,
          password: this.model.password,
          logincode: this.model.logincode
        }
      })

      if (data.userlogin.code === 0) {
        window.localStorage.setItem('user_token', data.userlogin.data.token)
        this.$router.push('/manager/blogs')
      } else {
        console.log(data.userlogin.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrapper {
  display: flex;
  height: 100vh;
  background: linear-gradient(to left, #0094ff, #f00);
  align-items: center;
  .form {
    width: 320px;
    color: #333;
    margin: 0 auto;
    padding: 15px;
    background-color: rgba(0,0,0,0.4);
    border-radius: 4px;
    .form-item-header {
      text-align: center;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    .form-item {
      display: flex;
      height: 35px;
      line-height: 35px;
      align-items: center;
      border-radius: 2px;
      background-color: #fbfbfb;
      overflow: hidden;
      margin-bottom: 10px;
      label {
        display: inline-block;
        width: 80px;
        height: 100%;
        text-align: center;
        border-right: 1px solid #eee;
      }
      input {
        flex: 1;
        height: 100%;
        border: none;
        padding: 10px;
        outline: none;
        font-size: 14px;
      }
    }
  }
}
</style>
