<template>
  <div class="login-container">
    <div class="header-container">
      <img src="../../assets/logo.jpg" />
      <span>一帆租车企业管理平台</span>
    </div>
    <div class="content-container">
      <div class="left-container"></div>
      <div class="right-container">
        <div class="form-container">
          <div class="header">欢迎使用</div>
          <div class="main">
            <Input v-model="account" type="text" placeholder="账号" style="width: 300px" />
            <Input
              v-model="password"
              type="password"
              placeholder="密码"
              style="width: 300px; margin-top: 20px;"
            />
          </div>
          <div class="other">
            <Checkbox v-model="isRemember">记住账号密码</Checkbox>
          </div>
          <div class="btn-container">
            <Button type="warning" @click="handleLogin" long>登录</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-container">
      <span>copyright 2019 云帆科技出品</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data: function() {
    return {
      account: '',
      password: '',
      isRemember: ''
    };
  },
  methods: {
    // 登录回调
    handleLogin: function() {
      console.log('login index.vue handleLogin');
      this.$router.push('/home/vehicle');
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #a8a8ac;
  .header-container {
    padding: 40px;
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
      border-radius: 3px;
    }
    span {
      font-size: 30px;
      font-weight: bold;
      margin-left: 20px;
      color: #333;
    }
  }
  .content-container {
    display: flex;
    justify-content: space-between;
    margin-top: 100px;
    .right-container {
      margin-right: 100px;
      .form-container {
        width: 465px;
        height: 400px;
        background-color: #fff;
        border-radius: 10px;
        .header {
          font-size: 30px;
          font-weight: bold;
          color: #333;
          padding: 60px 0 20px 0;
          text-align: center;
        }
        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .other {
          margin-top: 20px;
          padding: 0 82.5px;
        }
        .btn-container {
          margin-top: 20px;
          padding: 0 82.5px;
        }
      }
    }
  }
  .footer-container {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    color: #333;
  }
}
</style>
