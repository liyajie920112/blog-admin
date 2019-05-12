<template>
  <div class="form">
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
      <input v-model="model.logincode" type="text" placeholder="请输入登录码" autocomplete="off">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {
        return {
          username: '',
          password: '',
          logincode: ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  color: #333;
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
</style>