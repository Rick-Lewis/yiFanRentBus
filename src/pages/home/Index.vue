<template>
  <div class="layout">
    <Layout class="container">
      <Header>
        <!-- <img class="layout-logo" src="../../assets/logo.jpg" /> -->
        <div class="layout-logo"></div>
      </Header>
      <Layout>
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <Menu
            :active-name="activeMenuItem"
            theme="dark"
            width="auto"
            @on-select="handleSelect"
          >
            <MenuItem name="1-1">
              <Icon type="ios-navigate"></Icon>
              <span>Option 1</span>
            </MenuItem>
            <MenuItem name="1-2">
              <Icon type="ios-search"></Icon>
              <span>Option 2</span>
            </MenuItem>
            <MenuItem name="1-3">
              <Icon type="ios-settings"></Icon>
              <span>Option 3</span>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout>
          <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
            <router-view />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import homeStore from '../../store/home/index';
export default {
  name: 'home',
  data: function() {
    return {
      isCollapsed: false
    };
  },
  created() {
    console.log('home Index.vue created', this.$store);
    this.$store.registerModule('homeStore', homeStore);
    let urlTemp = 'http://www.baidu.com';
    this.axios.get(urlTemp).then(
      res => {
        console.log('home Index.vue created axios /login success', res);
      },
      err => {
        console.log('home Index.vue created axios /login success', err);
      }
    );
  },
  computed: {
    // rotateIcon() {
    //   return ['menu-icon', this.isCollapsed ? 'rotate-icon' : ''];
    // },
    // menuitemClasses() {
    //   return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
    // },
    activeMenuItem() {
      let result = '1-1';
      if (window.location.href.indexOf('/home/long') !== -1) {
        result = '1-2';
      } else if (window.location.href.indexOf('/home/wang') !== -1) {
        result = '1-3';
      }
      return result;
    }
  },
  methods: {
    // collapsedSider () {
    //   this.$refs.side1.toggleCollapse()
    // },
    handleSelect(name) {
      console.log('home Index.vue methods handleSelect', name, this.$router);
      switch (name) {
        case '1-1':
          if (window.location.href.indexOf('/home/li') === -1) {
            this.$router.push('/home/li');
          }
          break;
        case '1-2':
          if (window.location.href.indexOf('/home/long') === -1) {
            this.$router.push('/home/long');
          }
          break;
        case '1-3':
          if (window.location.href.indexOf('/home/wang') === -1) {
            this.$router.push('/home/wang');
          }
          break;
      }
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .container {
    height: 100vh;
    img.layout-logo {
      width: 60px;
      height: 60px;
      border-radius: 3px;
      position: relative;
      top: 2px;
      left: 20px;
    }
    div.layout-logo {
      width: 100px;
      height: 30px;
      background: #5b6270;
      border-radius: 3px;
      float: left;
      position: relative;
      top: 15px;
      left: 20px;
    }
  }
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
