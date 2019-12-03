<template>
  <div class="maintenance-detail-container">
    <div class="basic-info-container">
      <div class="header">
        <span>工单编号：{{orderDetail && orderDetail.order.order_no}}</span>
      </div>
      <div class="content">
        <div class="left">
          <span>
            <span>填单人：</span>
            <span>曲丽丽</span>
          </span>
          <span>
            <span>填单时间：</span>
            <span>2017-01-10 10:00:00</span>
          </span>
        </div>
        <div class="right">
          <div>
            <div>类型</div>
            <div>清洁</div>
          </div>
          <div>
            <div>状态</div>
            <div>进行中</div>
          </div>
        </div>
      </div>
    </div>
    <div class="other-container">
      <div class="reserve-info-container">
        <div class="header">维保信息</div>
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
        <div class="header">验收信息</div>
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
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  name: 'MaintenanceDetail',
  data: function() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  components: {}
};
</script>
<style lang='scss' scoped>
@import './Index.scss';
</style>
