<template>
  <div class="layout">
    <Layout class="container">
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
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
          <MenuItem name="workspace">
            <Icon type="ios-albums" style="margin-right: 8px;" />
            <span>工作台</span>
          </MenuItem>
          <Submenu name="activity-center">
            <template slot="title">
              <Icon type="ios-paper" />
              <span>活动中心</span>
            </template>
            <MenuItem name="mg-ad">
              <Icon type="ios-paper" />
              <span>首页广告</span>
            </MenuItem>
          </Submenu>
          <Submenu name="vehicle">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              <span>车辆管理</span>
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
            <MenuItem name="mg-maintenance">
              <Icon type="ios-navigate"></Icon>
              <span>维修管理</span>
            </MenuItem>
          </Submenu>
          <Submenu name="order">
            <template slot="title">
              <Icon type="ios-search"></Icon>
              <span>订单管理</span>
            </template>
            <MenuItem name="mg-order">
              <Icon type="ios-search"></Icon>
              <span>订单管理</span>
            </MenuItem>
          </Submenu>
          <Submenu name="store">
            <template slot="title">
              <Icon type="ios-search"></Icon>
              <span>门店管理</span>
            </template>
            <MenuItem name="mg-store">
              <Icon type="ios-search"></Icon>
              <span>门店列表</span>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header class="layout-header-bar">
          <div class="left">
            <Icon
              @click.native="collapsedSider"
              :class="rotateIcon"
              :style="{ margin: '0 20px 0 0' }"
              type="md-menu"
              size="24"
            ></Icon>
            <Breadcrumb>
              <BreadcrumbItem
                v-for="(item, index) in breadcrumbList"
                v-bind:key="index"
                :to="item.path + (!item.query ? '' : item.query)"
              >{{ item.text }}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div class="right">
            <Avatar icon="ios-person" />
            <Dropdown @on-click="handleDropdown" placement="top">
              <span style="padding-left: 10px">
                {{userInfo && userInfo.username}}
                <Icon type="ios-arrow-down"></Icon>
              </span>
              <DropdownMenu slot="list">
                <DropdownItem name="logout">退出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <router-view />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
// import homeStore from '../../store/home/index';
import myOrderStore from '../../store/home/OrderCenter/MyOrder/index';
export default {
  name: 'home',
  data: function() {
    return {
      isCollapsed: false,
      userInfo: null
    };
  },
  created() {
    console.log('home Index.vue created', this.$store);
    // this.$store.registerModule('homeStore', homeStore);
    this.$store.registerModule('myOrderStore', myOrderStore);
    // let urlTemp = '';
    // this.axios.get(urlTemp).then(
    //   res => {
    //     console.log('home Index.vue created axios /login success', res);
    //   },
    //   err => {
    //     console.log('home Index.vue created axios /login success', err);
    //   }
    // );
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.userInfo = {
      username: window.localStorage.getItem('username')
    };
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    console.log('home Index.vue destroyed');
    // this.$store.unregisterModule('homeStore');
    this.$store.unregisterModule('myOrderStore');
  },
  computed: {
    rotateIcon() {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : ''];
    },
    headerClasses() {
      return ['header', this.isCollapsed ? 'collapsed-header' : ''];
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
    },
    activeMenu() {
      let temp = this.$route.matched[1].meta.breadcrumb;
      let result = temp[temp.length - 1].submenuName;
      return result;
    },
    activeMenuItem() {
      let temp = this.$route.matched[1].meta.breadcrumb;
      let result = temp[temp.length - 1].menuItemName;
      return result;
    },
    breadcrumbList: {
      get() {
        return this.$route.matched[1].meta.breadcrumb;
      }
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
        case 'mg-ad':
          if (!this.matchUrl(window.location.href, '/home/ad')) {
            this.$router.push('/home/ad');
          }
          break;
        case 'workspace':
          if (!this.matchUrl(window.location.href, '/home/workspace')) {
            this.$router.push('/home/workspace');
          }
          break;
        case 'mg-store':
          if (!this.matchUrl(window.location.href, '/home/mgStore')) {
            this.$router.push('/home/mgStore');
          }
          break;
        case 'mg-maintenance':
          if (!this.matchUrl(window.location.href, '/home/mgMaintenance')) {
            this.$router.push('/home/mgMaintenance');
          }
          break;
      }
      // this.$store.dispatch(
      //   'homeStore/initBreadcrumbList',
      //   window.location.href
      // );
    },
    matchUrl(url, targetStr) {
      let temp = url.split('?')[0].split('/');
      let strTemp = '/' + temp.slice(temp.length - 2, temp.length).join('/');
      return strTemp === targetStr;
    },
    handleDropdown(name) {
      console.log('home Index.vue handleDropdown name', name);
      this.$Modal.confirm({
        title: '提示',
        content: '确定退出吗',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          console.log('home Index.vue handleDropdown onOk');
          this.axios({
            url: this.global_.path.baseUrl + '/rentalcars/logout',
            method: 'post',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'home Index.vue handleDropdown axios /logout success',
                res
              );
              if (res.data.code === 0) {
                this.$router.push('/login');
              } else {
                this.$Message.error({
                  content: '退出失败'
                });
              }
            },
            err => {
              console.log(
                'home Index.vue handleDropdown axios /logout failure',
                err
              );
              this.$Message.error({
                content: '退出失败'
              });
            }
          );
        },
        onCancel: () => {
          console.log('home Index.vue handleDropdown onCancel');
        }
      });
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
