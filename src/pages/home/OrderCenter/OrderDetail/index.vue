<template>
  <div class="order-detail-container">
    <div class="basic-info-container">
      <div class="header">
        <span>单号：011909271202340076</span>
        <span>司机：王大伟（130 8888 8888）</span>
      </div>
      <div class="content">
        <div class="left">
          <div>
            <img src="../../../../assets/logo.jpg" style="width: 130px; height: 88px;" />
          </div>
          <div>
            <div>粤B12345</div>
            <div>2019款奥迪Q5L</div>
            <div>￥238/日均</div>
          </div>
        </div>
        <div class="center">
          <div class="top">实际取还时间：</div>
          <div class="bottom">
            <div class="start">
              <div>10-01</div>
              <div>08:00</div>
            </div>
            <div class="time">
              <div>7</div>
            </div>
            <div class="end">
              <div>10-07</div>
              <div>08:00</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="top">实际取还地点：</div>
          <div class="bottom">
            <div class="fetch">
              <span>古丈县政府店</span>
              <div>取</div>
            </div>
            <div class="return">
              <span>古丈县政府店</span>
              <div>还</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="reserve-info-container">
      <div class="header">预定信息</div>
    </div>
    <div class="user-info-container">
      <div class="header">用户信息</div>
    </div>
    <div class="order-info-container">
      <div class="header">订单操作</div>
    </div>
    <div class="cost-info-container">
      <div class="header">费用明细</div>
    </div>
    <div class="evaluate-info-container">
      <div class="header">用户评价</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  data: function() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>
