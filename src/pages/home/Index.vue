<template>
  <div class="layout">
    <Layout class="container">
      <Sider ref="side1" collapsible :collapsed-width="78" v-model="isCollapsed">
        <Header :class="headerClasses">
          <!-- <img class="layout-logo" src="../../assets/logo.jpg" /> -->
          <div class="layout-logo"></div>
        </Header>
        <Menu
          :active-name="activeMenuItem"
          :open-names="[activeMenu]"
          theme="dark"
          width="auto"
          @on-select="handleSelect"
          :class="menuitemClasses"
        >
          <Submenu name="vehicle">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>车辆管理
            </template>
            <MenuItem name="mg-brand">
              <Icon type="ios-navigate"></Icon>
              <span>品牌管理</span>
            </MenuItem>
            <MenuItem name="mg-vehicle-model">
              <Icon type="ios-navigate"></Icon>
              <span>车型管理</span>
            </MenuItem>
            <MenuItem name="mg-vehicle">
              <Icon type="ios-navigate"></Icon>
              <span>车辆管理</span>
            </MenuItem>
          </Submenu>
          <Submenu name="order">
            <template slot="title">
              <Icon type="ios-search"></Icon>订单管理
            </template>
            <MenuItem name="mg-order">
              <Icon type="ios-search"></Icon>
              <span>订单管理</span>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: ['0 20px']}" class="layout-header-bar">
          <Breadcrumb>
            <BreadcrumbItem v-for="(item, index) in breadcrumbList" v-bind:key="index">{{item.text}}</BreadcrumbItem>
          </Breadcrumb>
        </Header>
        <Content :style="{margin: '20px', minHeight: '260px'}">
          <router-view />
        </Content>
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
      // BREADCRUMB: {
      //   'mg-brand': [
      //     {
      //       path: '',
      //       text: '车辆管理'
      //     },
      //     {
      //       path: '/home/brand',
      //       text: '品牌管理'
      //     }
      //   ],
      //   'mg-vehicle-model': [
      //     {
      //       path: '',
      //       text: '车辆管理'
      //     },
      //     {
      //       path: '/home/vehicleModel',
      //       text: '车型管理'
      //     }
      //   ],
      //   'mg-vehicle': [
      //     {
      //       path: '',
      //       text: '车辆管理'
      //     },
      //     {
      //       path: '/home/vehicle',
      //       text: '车辆管理'
      //     }
      //   ]
      // },
      // breadcrumbList: []
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
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    console.log('home Index.vue destroyed');
    this.$store.unregisterModule('homeStore');
  },
  computed: {
    headerClasses() {
      return ['header', this.isCollapsed ? 'collapsed-header' : ''];
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
    },
    activeMenu() {
      let result = 'vehicle';
      if (
        this.matchUrl(window.location.href, '/home/vehicle') ||
        this.matchUrl(window.location.href, '/home/vehicleModel')
      ) {
        result = 'vehicle';
      }
      return result;
    },
    activeMenuItem() {
      let result = 'mg-brand';
      if (
        this.matchUrl(window.location.href, '/home/vehicle') ||
        this.matchUrl(window.location.href, '/home/vehicleAddition') ||
        this.matchUrl(window.location.href, '/home/vehicleDetail')
      ) {
        result = 'mg-vehicle';
      } else if (
        this.matchUrl(window.location.href, '/home/vehicleModel') ||
        this.matchUrl(window.location.href, '/home/modelAddition') ||
        this.matchUrl(window.location.href, '/home/modelDetail')
      ) {
        result = 'mg-vehicle-model';
      }
      return result;
    },
    breadcrumbList: {
      // getter
      get: function() {
        console.log(
          'home index.vue computed breadcrumbList',
          this.$store.state.homeStore.breadcrumbList
        );
        return this.$store.state.homeStore.breadcrumbList;
      }
      // setter
      // set: function(newValue) {
      //   this.breadcrumbList = newValue;
      // }
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    handleSelect(name) {
      console.log('home Index.vue methods handleSelect', name, this.$router);
      switch (name) {
        case 'mg-brand':
          if (!this.matchUrl(window.location.href, '/home/brand')) {
            this.$router.push('/home/brand');
          }
          break;
        case 'mg-vehicle-model':
          if (!this.matchUrl(window.location.href, '/home/vehicleModel')) {
            this.$router.push('/home/vehicleModel');
          }
          break;
        case 'mg-vehicle':
          if (!this.matchUrl(window.location.href, '/home/vehicle')) {
            this.$router.push('/home/vehicle');
          }
          break;
        case 'mg-order':
          if (!this.matchUrl(window.location.href, '/home/mgOrder')) {
            this.$router.push('/home/mgOrder');
          }
          break;
      }
      this.$store.dispatch(
        'homeStore/initBreadcrumbList',
        window.location.href
      );
    },
    matchUrl(url, targetStr) {
      let temp = url.split('/');
      let strTemp = '/' + temp.slice(temp.length - 2, temp.length).join('/');
      return strTemp === targetStr;
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
      width: 155px;
      height: 30px;
      background: #5b6270;
      border-radius: 3px;
      float: left;
      position: relative;
      top: 15px;
      left: 20px;
      transition: width 0.3s ease;
    }
    div.header {
      padding: 0;
    }
    div.collapsed-header {
      & > div {
        width: 40px;
      }
    }
    .layout-header-bar {
      background-color: #fff;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
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
