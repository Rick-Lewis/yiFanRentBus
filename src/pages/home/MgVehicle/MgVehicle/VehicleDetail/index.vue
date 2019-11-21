<template>
  <div class="vehicle-detail-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="content">
        <div class="left">
          <div>{{vehicleDetail && vehicleDetail.vehicleDetail.plate_num}}</div>
          <div>车型信息：{{vehicleDetail && vehicleDetail.vehicleDetail.model_name}}</div>
          <div>发动机号：{{vehicleDetail && vehicleDetail.vehicleDetail.engine_no}}</div>
          <div>出厂时间：{{vehicleDetail && vehicleDetail.vehicleDetail.product_date}}</div>
          <div>购买时间：{{vehicleDetail && vehicleDetail.vehicleDetail.purchase_date}}</div>
        </div>
        <div class="center">
          <div class="status">
            <div>状态</div>
            <div>{{vehicleDetail && getStatusNameByValue(vehicleDetail.vehicleDetail.state)}}</div>
          </div>
          <div>车辆识别代码：{{vehicleDetail && vehicleDetail.vehicleDetail.vin}}</div>
          <div>车辆颜色：{{vehicleDetail && vehicleDetail.vehicleDetail.color}}</div>
          <div>购买价格：{{vehicleDetail && vehicleDetail.vehicleDetail.purchase_price}}元</div>
        </div>
        <div class="right">
          <img :src="vehicleDetail && (global_.path.baseUrl + vehicleDetail.vehicleDetail.image)" />
        </div>
      </div>
    </div>
    <div class="lease-record-container">
      <div class="header">租用记录</div>
      <div class="content">
        <Table border :columns="rtColumns" :data="rtData" stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="show(index)">详情</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden;">
          <div style="float: right;">
            <template>
              <Page
                :total="rtTotal"
                size="small"
                show-elevator
                show-sizer
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="maintenance-record-container">
      <div class="header">维保记录</div>
      <div class="content">
        <Table border :columns="mtColumns" :data="mtData" stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="show(index)">详情</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden;">
          <div style="float: right;">
            <template>
              <Page
                :total="mtTotal"
                size="small"
                show-elevator
                show-sizer
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="insurance-record-container">
      <div class="header">保险记录</div>
      <div class="content">
        <Table border :columns="irColumns" :data="irData" stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="show(index)">详情</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden;">
          <div style="float: right;">
            <template>
              <Page
                :total="irTotal"
                size="small"
                show-elevator
                show-sizer
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VehicleDetail',
  data: function() {
    return {
      rtColumns: [
        {
          title: '租用时间',
          key: 'leaseTime'
        },
        {
          title: '租用用户',
          key: 'leaseUser'
        },
        {
          title: '用户单位',
          key: 'userUnit'
        },
        {
          title: '租用费用（元）',
          key: 'cost'
        },
        {
          title: '里程数记录',
          key: 'mileageRecord'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      rtData: [],
      mtColumns: [
        {
          title: '维保日期',
          key: 'maintenanceDate'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '服务单位',
          key: 'serviceUnit'
        },
        {
          title: '费用（元）',
          key: 'cost'
        },
        {
          title: '负责人',
          key: 'head'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      mtData: [],
      irColumns: [
        {
          title: '保险日期',
          key: 'dateOfInsurance'
        },
        {
          title: '投保日期',
          key: 'insuredDate'
        },
        {
          title: '保险类型',
          key: 'type'
        },
        {
          title: '服务单位',
          key: 'serviceUnit'
        },
        {
          title: '费用（元）',
          key: 'cost'
        },
        {
          title: '保单号',
          key: 'insurancePolicyNo'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      irData: [],
      vehicleDetail: null,
      rtTotal: 0, // 数据总条数
      rtCurrentPage: 1, // 当前页码
      rtCurrentPageSize: 10, // 当前每页条数
      mtTotal: 0, // 数据总条数
      mtCurrentPage: 1, // 当前页码
      mtCurrentPageSize: 10, // 当前每页条数
      irTotal: 0, // 数据总条数
      irCurrentPage: 1, // 当前页码
      irCurrentPageSize: 10, // 当前每页条数
      vehicleStatusList: []
    };
  },
  created() {
    console.log('VehicleDetail Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/vehicle',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'VehicleDetail Index.vue created axios /status/vehicle success',
          res
        );
        this.vehicleStatusList.push({ name: '全部', status: -2 }, ...res.data);
      },
      err => {
        console.log(
          'VehicleDetail Index.vue created axios /status/vehicle failure',
          err
        );
        this.$Message.error({
          content: '车辆状态数据请求失败'
        });
      }
    );
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/detail/' +
        this.$route.query.id,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'VehicleDetail Index.vue created axios /vehicleDetail success',
          res
        );
        if (res.data.code === 0) {
          this.$Message.info('操作成功');
          this.vehicleDetail = res.data.data;
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
      },
      err => {
        console.log(
          'VehicleDetail Index.vue created axios /vehicleDetail success',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
      }
    );
  },
  computed: {},
  methods: {
    getStatusNameByValue(status) {
      console.log(
        'MgVehicleModel index.vue getStatusNameByValue',
        status,
        this.vehicleStatusList.slice()
      );
      let objTemp = this.vehicleStatusList
        .slice()
        .find(item => item.status === status);
      return objTemp.name;
    },
    // 详情
    show(index) {
      console.log('VehicleDetail index.vue methods show');
    },
    // 页码改变
    handlePageChange(e) {
      console.log('VehicleDetail Index.vue handlePageChange', e);
      this.currentPageSize = e;
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('VehicleDetail Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
@import './Index.scss';
</style>
