<template>
  <div class="store-detail-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="content">
        <div class="left">
          <img :src="storeDetail && (global_.path.baseUrl + storeDetail.image)" />
        </div>
        <div class="center">
          <div class="title">{{storeDetail && storeDetail.name}}</div>
          <div>门店电话：{{storeDetail && storeDetail.telephone}}</div>
          <div>营业时间：{{storeDetail && storeDetail.start_time + '-' + storeDetail.end_time}}</div>
        </div>
        <div class="right">
          <div class="status">
            <div>状态</div>
            <div>{{storeDetail && storeDetail.status === 1 ? '已启用' : '已停用'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pos-info-container">
      <div class="header">位置信息</div>
      <div class="content">
        <div class="left">
          <img src />
        </div>
        <div class="right">
          <div>
            <span>所在城市：</span>
            <span>{{storeDetail && (storeDetail.province_name + '-' + storeDetail.city_name + '-' + storeDetail.county_name)}}</span>
          </div>
          <div>
            <span>门店地址：</span>
            <span>{{storeDetail && storeDetail.address}}</span>
          </div>
          <div>
            <span>步行指引：</span>
            <span>{{storeDetail && storeDetail.guide}}</span>
          </div>
          <div>
            <span>经度：</span>
            <span>{{storeDetail && storeDetail.latitude}}</span>
          </div>
          <div>
            <span>纬度：</span>
            <span>{{storeDetail && storeDetail.longitude}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="vehicle-model-container">
      <div class="header">车型列表</div>
      <Table border :columns="vehicleModelColumns" :data="vehicleModelData" stripe>
        <template v-slot:brand_name="{ row }">
          <span>{{ row.brand_name }}</span>
        </template>
        <template v-slot:state="{ row }">
          <Switch :value="row.state == '0' ? false : true" :disabled="true">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
        </template>
        <template v-slot:action="{ row, index }">
          <Button type="primary" size="small" @click="show(index)">详情</Button>
        </template>
      </Table>
      <div class="page-container">
        <template>
          <Page
            :total="total"
            size="small"
            show-elevator
            show-sizer
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"
            show-total
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StoreDetail',
  data: function() {
    return {
      storeDetail: null,
      vehicleModelColumns: [
        {
          title: '车型名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '所属品牌',
          slot: 'brand_name',
          align: 'center'
        },
        {
          title: '车型类型',
          key: 'category_name',
          align: 'center'
        },
        {
          title: '今日价格',
          key: 'standard_price',
          align: 'center'
        },
        {
          title: '车型状态',
          slot: 'state',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      vehicleModelData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10 // 当前每页条数
    };
  },
  created() {
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/store/detail/' +
        this.$route.query.id,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'StoreDetail Index.vue created axios /store/detail/{id} success',
          res
        );
        if (res.data.code === 0) {
          this.storeDetail = res.data.data;
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'StoreDetail Index.vue created axios /store/detail/{id} failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
        this.spinShow = false;
      }
    );
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/model/page?store_id=' +
        this.$route.query.id +
        '&pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log('StoreDetail Index.vue created axios /model success', res);
        if (res.data.code === 0) {
          this.vehicleModelData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      },
      err => {
        console.log('StoreDetail Index.vue created axios /model failure', err);
        this.$Message.error({
          content: '车型数据请求失败'
        });
      }
    );
  },
  mounted() {},
  methods: {
    // 页码改变
    handlePageChange(e) {
      console.log('StoreDetail Index.vue handlePageChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'StoreDetail Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '车型数据请求失败'
            });
          }
        },
        err => {
          console.log(
            'StoreDetail Index.vue created axios /model failure',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      );
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('StoreDetail Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'StoreDetail Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '车型数据请求失败'
            });
          }
        },
        err => {
          console.log(
            'StoreDetail Index.vue created axios /model failure',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      );
    },
    // 车型详情
    show(index) {
      this.$router.push(
        '/home/modelDetail?id=' + this.vehicleModelData[index].id
      );
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
