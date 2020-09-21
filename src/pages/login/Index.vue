<template>
  <div class="login-container">
    <div class="bg-container"></div>
    <div class="cover-container">
      <div class="header-container">
        <img src="@/assets/logo.jpg" />
        <span>一帆租车企业管理平台</span>
      </div>
      <div class="content-container">
        <div class="left-container"></div>
        <div class="right-container">
          <div class="form-container">
            <div class="header">欢迎使用</div>
            <div class="main">
              <Input v-model="username" type="text" placeholder="账号" style="width: 300px" />
              <Input
                v-model="password"
                type="password"
                placeholder="密码"
                style="width: 300px; margin-top: 20px;"
              />
            </div>
            <div class="other">
              <Checkbox v-model="isRemember" @on-change="handleRemember">记住账号密码</Checkbox>
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
  </div>
</template>
<script>
export default {
  name: 'login',
  data: function() {
    return {
      username: '',
      password: '',
      isRemember: ''
    };
  },
  created() {
    let isRememberTemp = window.localStorage.getItem('isRemember') === 'true';
    console.log('login index.vue created', isRememberTemp);
    this.isRemember = isRememberTemp;
    if (isRememberTemp) {
      this.username = window.localStorage.getItem('username');
      this.password = window.localStorage.getItem('password');
    }
    let that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        that.handleLogin();
      }
    };
  },
  methods: {
    // 登录回调
    handleLogin: function() {
      console.log('login index.vue handleLogin', this);
      // userAdmin admin123
      if (this.username && this.password) {
        this.axios({
          url: this.global_.path.baseUrl + '/rentalcars/login',
          method: 'post',
          data: {
            username: this.username,
            password: this.password
          },
          headers: { 'Content-Type': 'application/json' }
        }).then(
          res => {
            console.log(
              'login Index.vue handleLogin axios /login success',
              res
            );
            if (res.data.code === 0) {
              window.localStorage.setItem('username', this.username);
              window.localStorage.setItem('password', this.password);
              // if (this.isRemember) {
              //   window.localStorage.setItem('username', this.username);
              //   window.localStorage.setItem('password', this.password);
              // } else {
              //   window.localStorage.removeItem('username');
              //   window.localStorage.removeItem('password');
              // }
              this.$router.push('/home/workspace');
            } else {
              this.$Message.error({
                content: res.data.message
              });
            }
          },
          err => {
            console.log(
              'login Index.vue handleLogin axios /login failure',
              err
            );
            this.$Message.error({
              content: '账号或密码错误'
            });
          }
        );
      } else {
        this.$Message.warning({
          content: '账号或密码不能为空'
        });
      }
    },
    handleRemember(val) {
      console.log('login index.vue methods handleRemember', val);
      window.localStorage.setItem('isRemember', val);
      if (val) {
        window.localStorage.setItem('username', this.username);
        window.localStorage.setItem('password', this.password);
      } else {
        window.localStorage.setItem('username', '');
        window.localStorage.setItem('password', '');
      }
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
@import './Index.scss';
</style>
