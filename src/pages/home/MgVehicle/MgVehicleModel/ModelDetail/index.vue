<template>
  <div class="model-detail-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="content">
        <div class="left">
          <img :src="modelDetail && (global_.path.baseUrl + modelDetail.image)" />
        </div>
        <div class="center">
          <div class="title">{{modelDetail && modelDetail.name}}</div>
          <div>车型品牌：{{modelDetail && modelDetail.brand_name}}</div>
          <div>车辆类型：{{modelDetail && modelDetail.category_name}}</div>
        </div>
        <div class="right">
          <div class="status">
            <div>状态</div>
            <div>{{modelDetail && modelDetail.state === 1 ? '已启用' : '已停用'}}</div>
          </div>
          <div class="price">
            <div>今日日均</div>
            <div>¥{{modelDetail && modelDetail.standard_price}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="conf-info-container">
      <div class="header">配置信息</div>
      <div class="content">
        <div class="left">
          <div>
            <span>发动机：</span>
            <span>{{modelDetail && modelDetail.let_litre}}T</span>
          </div>
          <div>
            <span>汽油规格：</span>
            <span>{{modelDetail && modelDetail.oil_type}}#</span>
          </div>
          <div>
            <span>前后雷达：</span>
            <span>{{modelDetail && modelDetail.radar_head === 1 ? '前雷达' : ''}}</span>
            <span>{{modelDetail && modelDetail.radar_tail === 1 ? ' | 后雷达' : ''}}</span>
          </div>
        </div>
        <div class="center">
          <div>
            <span>变速箱：</span>
            <span>{{modelDetail && modelDetail.gearbox}}变速箱</span>
          </div>
          <div>
            <span>油箱容量：</span>
            <span>{{modelDetail && modelDetail.oil_volume}}L</span>
          </div>
          <div>
            <span>倒车影像：</span>
            <span>{{modelDetail && modelDetail.backup_camera === 1 ? '有' : '无'}}</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span>座位数：</span>
            <span>{{modelDetail && modelDetail.seat_count}}座</span>
          </div>
          <div>
            <span>综合油耗：</span>
            <span>{{modelDetail && modelDetail.oil_litre}} L/100km</span>
          </div>
        </div>
      </div>
    </div>
    <div class="vehicle-statistics-container">
      <div class="header">车辆统计</div>
      <div class="content">
        <div class="card">
          <div class="left"></div>
          <div class="right">
            <div>入库（辆）</div>
            <div>8</div>
          </div>
        </div>
        <div class="card">
          <div class="left"></div>
          <div class="right">
            <div>就绪（辆）</div>
            <div>36</div>
          </div>
        </div>
        <div class="card">
          <div class="left"></div>
          <div class="right">
            <div>租用（辆）</div>
            <div>10</div>
          </div>
        </div>
        <div class="card">
          <div class="left"></div>
          <div class="right">
            <div>入库（辆）</div>
            <div>6</div>
          </div>
        </div>
      </div>
    </div>
    <div class="vehicle-info-container">
      <div class="header">车辆信息</div>
      <div class="content">
        <Table border :columns="vehicleColumns" :data="vehicleData" stripe>
          <template v-slot:status="{ row }">
            <div>{{getNameByStatus(row.state)}}</div>
          </template>
          <template v-slot:action="{ row, index }">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="handlePlateDetail(index)"
            >查看详情</Button>
          </template>
        </Table>
        <div class="page-container">
          <Page
            :total="total"
            size="small"
            show-elevator
            show-sizer
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  name: 'ModelDetail',
  data: function() {
    return {
      modelDetail: null,
      vehicleColumns: [
        {
          title: '车牌号',
          key: 'plate_num',
          align: 'center'
        },
        {
          title: '车牌识别代码',
          key: 'vin',
          align: 'center'
        },
        {
          title: '发动机号',
          key: 'engine_no',
          align: 'center'
        },
        {
          title: '颜色',
          key: 'color',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      vehicleData: [],
      spinShow: true,
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      vehicleStatusList: []
    };
  },
  created() {
    console.log('ModelDetail Index.vue created', this.$store, this.$route);
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/model/' +
        this.$route.query.id,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelDetail Index.vue created axios /vehicleCategory/{id} success',
          res
        );
        if (res.data.code === 0) {
          this.modelDetail = res.data.data;
        } else {
          this.$Message.error({
            content: res.data.message
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'ModelDetail Index.vue created axios /vehicleCategory/{id} failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
        this.spinShow = false;
      }
    );
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/vehicle',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelDetail Index.vue created axios /status/vehicle success',
          res
        );
        this.vehicleStatusList.push(...res.data);
        this.axios({
          url:
            this.global_.path.baseUrl +
            '/rentalcars/vehicle/detail/page?pageIndex=' +
            this.currentPage +
            '&pageSize=' +
            this.currentPageSize +
            '&model_id=' +
            this.$route.query.id,
          method: 'get',
          headers: { 'Content-Type': 'application/json' }
        }).then(
          res => {
            console.log(
              'ModelDetail Index.vue created axios /vehicleDetail success',
              res
            );
            if (res.data.code === 0) {
              this.vehicleData.length = 0;
              this.vehicleData.push(...res.data.data.data);
              this.total = res.data.data.total;
            } else {
              this.$Message.error({
                content: res.data.message
              });
            }
            this.spinShow = false;
          },
          err => {
            console.log(
              'ModelDetail Index.vue created axios /vehicleDetail success',
              err
            );
            this.$Message.error({
              content: '车辆数据请求失败'
            });
            this.spinShow = false;
          }
        );
      },
      err => {
        console.log(
          'ModelDetail Index.vue created axios /status/vehicle failure',
          err
        );
        this.$Message.error({
          content: '车辆状态数据请求失败'
        });
      }
    );
  },
  computed: {},
  methods: {
    getNameByStatus(status) {
      let temp = this.vehicleStatusList.find(item => item.status === status);
      return temp.name;
    },
    handlePlateDetail(index) {
      console.log('ModelDetail index.vue methods handlePlateDetail', index);
      this.$router.push('/home/vehicleDetail?id=' + this.vehicleData[index].id);
    },
    // 页码改变
    handlePageChange(e) {
      console.log('ModelDetail Index.vue handlePageChange', e);
      this.currentPageSize = e;
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('ModelDetail Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
@import './Index.scss';
</style>
