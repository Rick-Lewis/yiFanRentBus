<template>
  <div class="model-detail-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="content">
        <div class="left">
          <img src="../../../../../assets/logo.jpg" />
        </div>
        <div class="center">
          <div class="title">2019款奥迪Q5</div>
          <div>车型品牌：奥迪</div>
          <div>车辆类型：中型SUV</div>
        </div>
        <div class="right">
          <div class="status">
            <div>状态</div>
            <div>已启用</div>
          </div>
          <div class="price">
            <div>今日日均</div>
            <div>¥568.00</div>
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
            <span>2.0T 涡轮增加</span>
          </div>
          <div>
            <span>汽油规格：</span>
            <span>95# | 98#</span>
          </div>
          <div>
            <span>前后雷达：</span>
            <span>前雷达 | 后雷达</span>
          </div>
        </div>
        <div class="center">
          <div>
            <span>变速箱：</span>
            <span>自动变速箱（8AT）</span>
          </div>
          <div>
            <span>油箱容量：</span>
            <span>55L</span>
          </div>
          <div>
            <span>倒车影像：</span>
            <span>有</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span>座位数：</span>
            <span>5座</span>
          </div>
          <div>
            <span>综合油耗：</span>
            <span>9.0 L/100km</span>
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
        <Table border :columns="columns12" :data="data6" stripe>
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
          <template>
            <Page :total="100" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ModelDetail',
  data: function() {
    return {
      columns12: [
        {
          title: '车牌号',
          key: 'licensePlateNum'
        },
        {
          title: '车牌识别代码',
          key: 'licensePlateCode'
        },
        {
          title: '发动机号',
          key: 'EngineNo'
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
      data6: [
        {
          licensePlateNum: '粤B 12345',
          licensePlateCode: 'LXVJ2GEC0KA0163363',
          EngineNo: 'K018354',
          color: '蓝色',
          status: '入库'
        },
        {
          licensePlateNum: '粤B 12345',
          licensePlateCode: 'LXVJ2GEC0KA0163363',
          EngineNo: 'K018354',
          color: '蓝色',
          status: '入库'
        },
        {
          licensePlateNum: '粤B 12345',
          licensePlateCode: 'LXVJ2GEC0KA0163363',
          EngineNo: 'K018354',
          color: '蓝色',
          status: '入库'
        },
        {
          licensePlateNum: '粤B 12345',
          licensePlateCode: 'LXVJ2GEC0KA0163363',
          EngineNo: 'K018354',
          color: '蓝色',
          status: '入库'
        }
      ]
    };
  },
  created() {
    console.log('ModelDetail Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
  },
  computed: {},
  methods: {
    handlePlateDetail(index) {
      console.log('ModelDetail index.vue methods handlePlateDetail', index);
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
