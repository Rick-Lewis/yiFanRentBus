<template>
  <div class="order-detail-container">
    <div class="basic-info-container">
      <div class="header">
        <span>单号：{{orderDetail && orderDetail.order.order_no}}</span>
        <span>下单时间：{{orderDetail && orderDetail.order.time_create}}</span>
        <!-- <span>司机：王大伟（130 8888 8888）</span> -->
      </div>
      <div class="content">
        <div class="left">
          <div>
            <img
              :src="orderDetail && (global_.path.baseUrl + orderDetail.model.image)"
              style="width: 130px; height: 88px;"
            />
          </div>
          <div>
            <div>{{orderDetail && orderDetail.order.plate_num}}</div>
            <div>{{orderDetail && orderDetail.model.name}}</div>
            <div>￥{{orderDetail && orderDetail.order.price_unit}}/日均</div>
          </div>
        </div>
        <div class="string"></div>
        <div class="center">
          <div class="top">实际取还时间：</div>
          <div class="bottom">
            <div class="start">
              <div>{{orderDetail && orderDetail.order.time_start.split(' ')[0]}}</div>
              <div>{{orderDetail && orderDetail.order.time_start.split(' ')[1]}}</div>
            </div>
            <div class="time">
              <div>{{orderDetail && orderDetail.order.days}}</div>
            </div>
            <div class="end">
              <div>{{orderDetail && orderDetail.order.time_end.split(' ')[0]}}</div>
              <div>{{orderDetail && orderDetail.order.time_end.split(' ')[1]}}</div>
            </div>
          </div>
        </div>
        <div class="string"></div>
        <div class="right">
          <div>
            <div class="top">实际取还地点：</div>
            <div class="bottom">
              <div class="fetch">
                <span>{{orderDetail && orderDetail.order.store_pick_up_name}}</span>
                <div>取</div>
              </div>
              <div class="return">
                <span>{{orderDetail && orderDetail.order.store_drop_off_name}}</span>
                <div>还</div>
              </div>
            </div>
          </div>
          <div>
            <div style="margin-right: 60px;">
              <div>状态</div>
              <div>{{orderStatus}}</div>
            </div>
            <div>
              <div>实付金额</div>
              <div>{{orderDetail && orderDetail.order.price_total}}元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="other-container">
      <div class="reserve-info-container">
        <div class="header">预定信息</div>
        <div class="content">
          <div class="fetch">
            <div>
              取车时间：
              {{orderDetail && orderDetail.order.time_start}}
            </div>
            <div style="margin-top: 15px;">
              取车门店：
              {{orderDetail && orderDetail.order.store_pick_up_name}}
            </div>
          </div>
          <div class="return">
            <div>
              还车时间：
              {{orderDetail && orderDetail.order.time_end}}
            </div>
            <div style="margin-top: 15px;">
              还车门店：
              {{orderDetail && orderDetail.order.store_drop_off_name}}
            </div>
          </div>
          <div class="duration">
            <div>
              预计租车时长：
              {{orderDetail && orderDetail.order.days}} 天
            </div>
          </div>
        </div>
      </div>
      <div class="user-info-container">
        <div class="header">用户信息</div>
        <div class="content">
          <div>
            昵称：
            {{orderDetail && orderDetail.order.nick_name}}
          </div>
          <div>
            手机号：
            {{orderDetail && orderDetail.order.telephone}}
          </div>
          <div style="opacity: 0;"></div>
        </div>
      </div>
      <div class="order-info-container">
        <div class="header">订单操作</div>
        <div class="content">
          <Table border :columns="optColumns" :data="optData" stripe></Table>
        </div>
      </div>
      <div class="cost-info-container">
        <div class="header">费用明细</div>
        <div class="content">
          <Table border :columns="costColumns" :data="costData" stripe></Table>
        </div>
      </div>
      <div class="evaluate-info-container">
        <div class="header">用户评价</div>
        <div class="content">
          <Table border :columns="evalColumns" :data="evalData" stripe></Table>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  data: function() {
    return {
      optColumns: [
        {
          title: '操作类型',
          key: 'type'
        },
        {
          title: '操作时间',
          key: 'time'
        },
        {
          title: '备注',
          key: 'remark'
        }
      ],
      optData: [],
      costColumns: [
        {
          title: '费用项目',
          key: 'costItem'
        },
        {
          title: '金额（元）',
          key: 'sum'
        },
        {
          title: '子订单编号',
          key: 'oderNo'
        }
      ],
      costData: [],
      evalColumns: [
        {
          title: '星级',
          key: 'level'
        },
        {
          title: '评价内容',
          key: 'content'
        },
        {
          title: '评价时间',
          key: 'time'
        }
      ],
      evalData: [],
      orderDetail: null,
      spinShow: true
    };
  },
  created() {
    console.log('OrderDetail Index.vue created');
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/order/rental/detail/' +
        this.$route.query.order_no,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'OrderDetail Index.vue created axios /rental/detail/{order_no} success',
          res
        );
        if (res.data.code === 0) {
          this.orderDetail = res.data.data;
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'OrderDetail Index.vue created axios /rental/detail/{order_no} failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
        this.spinShow = false;
      }
    );
  },
  computed: {
    orderStatus() {
      let temp = this.$store.state.myOrderStore.orderStatusList.find(
        item => item.status === this.orderDetail.order.status
      );
      return temp ? temp.name : '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
