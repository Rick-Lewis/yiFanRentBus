<template>
  <div class="vehicle-detail-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="content">
        <div class="left">
          <div>粤B 12345</div>
          <div>车型信息：2019款奥迪Q5L</div>
          <div>发动机号：K018354</div>
          <div>出厂时间：2019-08-08</div>
          <div>购买时间：2019-09-09</div>
        </div>
        <div class="center">
          <div class="status">
            <div>状态</div>
            <div>就绪</div>
          </div>
          <div>车辆识别代码：LXVJ2GEC0KA0163363</div>
          <div>车辆颜色：蓝色</div>
          <div>购买价格：389,000元</div>
        </div>
        <div class="right">
          <img src="../../../../../assets/logo.jpg" />
        </div>
      </div>
    </div>
    <div class="lease-record-container">
      <div class="header">租用记录</div>
      <div class="content">
        <Table border :columns="columns12" :data="data6" stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="show(index)">详情</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden;">
          <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
    <div class="maintenance-record-container">
      <div class="header">维保记录</div>
      <div class="content">
        <Table border :columns="columns22" :data="data7" stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="show(index)">详情</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden;">
          <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
    <div class="insurance-record-container">
      <div class="header">保险记录</div>
      <div class="content">
        <Table border :columns="columns32" :data="data8" stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="show(index)">详情</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden;">
          <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
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
      columns12: [
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
      data6: [
        {
          leaseTime: '2019-10-01至2019-10-07（7天）',
          leaseUser: '13006617634',
          userUnit: '私人会员',
          cost: '2,344.00',
          mileageRecord: '24,567km'
        },
        {
          leaseTime: '2019-10-01至2019-10-07（7天）',
          leaseUser: '13006617634',
          userUnit: '私人会员',
          cost: '2,344.00',
          mileageRecord: '24,567km'
        },
        {
          leaseTime: '2019-10-01至2019-10-07（7天）',
          leaseUser: '13006617634',
          userUnit: '私人会员',
          cost: '2,344.00',
          mileageRecord: '24,567km'
        },
        {
          leaseTime: '2019-10-01至2019-10-07（7天）',
          leaseUser: '13006617634',
          userUnit: '私人会员',
          cost: '2,344.00',
          mileageRecord: '24,567km'
        }
      ],
      columns22: [
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
      data7: [
        {
          maintenanceDate: '2019-10-01至2019-10-07（7天）',
          type: '清洁',
          serviceUnit: '湖南小凤凰车服公司',
          cost: '20.00',
          head: '隔壁老王'
        },
        {
          maintenanceDate: '2019-10-01至2019-10-07（7天）',
          type: '清洁',
          serviceUnit: '湖南小凤凰车服公司',
          cost: '20.00',
          head: '隔壁老王'
        },
        {
          maintenanceDate: '2019-10-01至2019-10-07（7天）',
          type: '清洁',
          serviceUnit: '湖南小凤凰车服公司',
          cost: '20.00',
          head: '隔壁老王'
        },
        {
          maintenanceDate: '2019-10-01至2019-10-07（7天）',
          type: '清洁',
          serviceUnit: '湖南小凤凰车服公司',
          cost: '20.00',
          head: '隔壁老王'
        }
      ],
      columns32: [
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
      data8: [
        {
          dateOfInsurance: '2019-10-01至2019-10-07',
          insuredDate: '2019-10-01',
          type: '交强险',
          serviceUnit: '平安财产险',
          cost: '920.00',
          insurancePolicyNo: '008975439'
        },
        {
          dateOfInsurance: '2019-10-01至2019-10-07',
          insuredDate: '2019-10-01',
          type: '交强险',
          serviceUnit: '平安财产险',
          cost: '920.00',
          insurancePolicyNo: '008975439'
        },
        {
          dateOfInsurance: '2019-10-01至2019-10-07',
          insuredDate: '2019-10-01',
          type: '交强险',
          serviceUnit: '平安财产险',
          cost: '920.00',
          insurancePolicyNo: '008975439'
        },
        {
          dateOfInsurance: '2019-10-01至2019-10-07',
          insuredDate: '2019-10-01',
          type: '交强险',
          serviceUnit: '平安财产险',
          cost: '920.00',
          insurancePolicyNo: '008975439'
        }
      ]
    };
  },
  created() {
    console.log('VehicleDetail Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
  },
  computed: {},
  methods: {
    // 详情
    show(index) {
      console.log('VehicleDetail index.vue methods show');
    },
    // 翻页
    changePage() {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      console.log('VehicleDetail Index.vue methods changePage');
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.vehicle-detail-container {
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
      .left {
        div {
          margin-bottom: 20px;
        }
        div:first-child {
          width: 168px;
          height: 52px;
          border-radius: 3px;
          background-color: #2878ef;
          color: #fff;
          text-align: center;
          line-height: 52px;
          font-size: 18px;
          font-weight: bold;
        }
      }
      .center {
        margin-left: 200px;
        div {
          margin-bottom: 20px;
        }
        .status {
          padding-right: 150px;
          div {
            margin-bottom: 10px;
            position: relative;
            padding-left: 25px;
            &:last-child {
              font-size: 18px;
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
      }
      .right {
        margin-left: 100px;
        img {
          width: 290px;
          height: 220px;
        }
      }
    }
  }
  .lease-record-container {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 20px;
    padding-right: 60px;
    .header {
      padding-top: 20px;
    }
  }
  .maintenance-record-container {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 20px;
    padding-right: 60px;
    .header {
      padding-top: 20px;
    }
  }
  .insurance-record-container {
    padding-right: 60px;
    .header {
      padding-top: 20px;
    }
  }
}
</style>
