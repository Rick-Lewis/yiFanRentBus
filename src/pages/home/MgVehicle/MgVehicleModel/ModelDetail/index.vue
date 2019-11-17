<template>
  <div class="model-detail-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="content">
        <div class="left">
          <img :src="global_.path.baseUrl + modelDetail.image" />
        </div>
        <div class="center">
          <div class="title">{{modelDetail.name}}</div>
          <div>车型品牌：{{modelDetail.brand_name}}</div>
          <div>车辆类型：{{modelDetail.category_name}}</div>
        </div>
        <div class="right">
          <div class="status">
            <div>状态</div>
            <div>{{modelDetail.state === 1 ? '已启用' : '已停用'}}</div>
          </div>
          <div class="price">
            <div>今日日均</div>
            <div>¥{{modelDetail.standard_price}}</div>
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
            <span>{{modelDetail.let_litre}}T</span>
          </div>
          <div>
            <span>汽油规格：</span>
            <span>{{modelDetail.oil_type}}#</span>
          </div>
          <div>
            <span>前后雷达：</span>
            <span>{{modelDetail.radar_head === 1 ? '前雷达' : ''}}</span>
            <span>{{modelDetail.radar_tail === 1 ? ' | 后雷达' : ''}}</span>
          </div>
        </div>
        <div class="center">
          <div>
            <span>变速箱：</span>
            <span>{{modelDetail.gearbox}}变速箱</span>
          </div>
          <div>
            <span>油箱容量：</span>
            <span>{{modelDetail.oil_volume}}L</span>
          </div>
          <div>
            <span>倒车影像：</span>
            <span>{{modelDetail.backup_camera === 1 ? '有' : '无'}}</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span>座位数：</span>
            <span>{{modelDetail.seat_count}}座</span>
          </div>
          <div>
            <span>综合油耗：</span>
            <span>{{modelDetail.oil_litre}} L/100km</span>
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
            <div>{{row.status}}</div>
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
          key: 'plate_num'
        },
        {
          title: '车牌识别代码',
          key: 'vin'
        },
        {
          title: '发动机号',
          key: 'engine_no'
        },
        {
          title: '颜色',
          key: 'color'
        },
        {
          title: '状态',
          slot: 'status',
          width: 150,
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
      currentPageSize: 10 // 当前每页条数
    };
  },
  created() {
    console.log('ModelDetail Index.vue created', this.$store, this.$route);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
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
            content: '操作失败'
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
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/detail/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize + '&model_id=' + this.$route.query.id,
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
            content: '车辆数据请求失败'
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
  computed: {},
  methods: {
    handlePlateDetail(index) {
      console.log('ModelDetail index.vue methods handlePlateDetail', index);
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
.model-detail-container {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  min-height: 260px;
  .header {
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 20px;
  }
  .basic-info-container {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 30px;
    .content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .left {
        img {
          width: 290px;
          height: 220px;
        }
      }
      .center {
        padding-bottom: 40px;
        div {
          margin-bottom: 10px;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          padding-bottom: 15px;
        }
      }
      .right {
        padding-bottom: 40px;
        display: flex;
        .status {
          text-align: right;
          padding-right: 150px;
          div {
            margin-bottom: 10px;
            position: relative;
            &:last-child {
              font-size: 18px;
              padding-left: 25px;
              &::before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                margin: auto 0;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                background-color: #f74d00;
              }
            }
          }
        }
        .price {
          text-align: right;
          padding-right: 60px;
          div {
            margin-bottom: 10px;
            &:last-child {
              font-size: 18px;
              color: #f74d00;
            }
          }
        }
      }
    }
  }
  .conf-info-container {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 20px;
    padding-right: 60px;
    .header {
      padding-top: 20px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      .left {
        div {
          margin-bottom: 10px;
        }
      }
      .center {
        div {
          margin-bottom: 10px;
        }
      }
      .right {
        div {
          margin-bottom: 10px;
        }
      }
    }
  }
  .vehicle-statistics-container {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 30px;
    .header {
      padding-top: 20px;
    }
    .content {
      display: flex;
      .card {
        width: 245px;
        height: 100px;
        border-radius: 3px;
        border: 1px solid #e4e4e4;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          width: 58px;
          height: 58px;
          background-color: #c1c1c1;
          border-radius: 58px;
        }
        .right {
          margin-left: 15px;
          line-height: 1;
          div:last-child {
            font-size: 30px;
          }
        }
      }
    }
  }
  .vehicle-info-container {
    .header {
      padding-top: 20px;
    }
    .content {
      .page-container {
        text-align: right;
        margin-top: 20px;
      }
    }
  }
}
</style>
