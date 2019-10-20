<template>
  <div class="order-container">
    <div class="filtrate-container">
      <div class="order-status">
        <span>订单状态：</span>
        <RadioGroup v-model="orderStatusCheck">
          <Radio v-for="(item, index) in orderStatusList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
      </div>
      <div class="driver-existence">
        <span>有无司机：</span>
        <RadioGroup v-model="driverExistenceCheck">
          <Radio
            v-for="(item, index) in driverExistenceList"
            v-bind:key="index"
            v-bind:label="item"
          ></Radio>
        </RadioGroup>
      </div>
      <div class="time">
        <span>时间查询：</span>
        <RadioGroup v-model="timeCheck">
          <Radio v-for="(item, index) in timeList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
        <div class="custom-time">
          <DatePicker type="date" placeholder="开始时间" style="width: 200px"></DatePicker>
          <DatePicker type="date" placeholder="结束时间" style="width: 200px"></DatePicker>
        </div>
      </div>
      <Form :model="formItem" inline class="form-container">
        <FormItem>
          <span>订单编号：</span>
          <Input v-model="formItem.orderNo" placeholder="请输入订单编号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>车牌号：</span>
          <Input v-model="formItem.licensePlateNum" placeholder="请输入车牌号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>用户查询：</span>
          <Input v-model="formItem.username" placeholder="请输入手机号、昵称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <div class="item-container">
        <div class="item-header">
          <span>下单时间：2019-10-01 08:30:09</span>
          <span>订单编号：011909271202340076</span>
          <span>司机：王大伟</span>
        </div>
        <div class="item-content">
          <div class="col-item">
            <img src="../../../../../assets/logo.jpg" style="width: 150px; height: 88px;" />
            <div>粤B12345</div>
            <div>2019款奥迪Q5L</div>
            <div>￥238/日均</div>
          </div>
          <div class="col-item"></div>
          <div class="col-item"></div>
          <div class="col-item"></div>
          <div class="col-item"></div>
          <div class="col-item"></div>
          <div class="col-item"></div>
        </div>
      </div>
    </div>
  </div>
</template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MgOrder',
  data: function() {
    return {
      orderStatusCheck: '待取车',
      orderStatusList: [
        '全部',
        '未支付',
        '待取车',
        '进行中',
        '已完成',
        '已取消'
      ],
      driverExistenceCheck: '有',
      driverExistenceList: ['全部', '无', '有'],
      timeCheck: '今日',
      timeList: ['今日', '近7天', '近一个月', '近三个月', '自定义'],
      formItem: {
        orderNo: '',
        licensePlateNum: '',
        username: ''
      }
    };
  },
  computed: {},
  methods: {
    // 查询
    handleSearch() {
      console.log('MgOrder index.vue handleSearch');
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.order-container {
  .filtrate-container {
    background-color: #fff;
    padding: 20px 20px 0 20px;
    .order-status {
      padding: 10px 8px;
    }
    .driver-existence {
      padding: 10px 8px;
    }
    .time {
      padding: 10px 8px;
      .custom-time{
        display: inline-block;
      }
    }
    .form-container {
      padding: 10px 8px 0 8px;
    }
  }
}
</style>
