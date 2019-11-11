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
          <Input v-model="formItem.order_no" placeholder="请输入订单编号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>车牌号：</span>
          <Input v-model="formItem.plate_num" placeholder="请输入车牌号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>用户查询：</span>
          <Input v-model="formItem.key" placeholder="请输入手机号、昵称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <div class="item-container" v-for="(item, index) in orderData" v-bind:key="index">
        <div class="item-header">
          <span>下单时间：2019-10-01 08:30:09</span>
          <span style="padding-left: 15px;">订单编号：{{item.order_no}}</span>
          <span style="padding-left: 15px;">司机：王大伟</span>
        </div>
        <div class="item-content">
          <div class="col-item info">
            <div>
              <img src="../../../../assets/logo.jpg" style="width: 130px; height: 88px;" />
            </div>
            <div>
              <div>{{item.plate_num}}</div>
              <div>{{item.model_name}}</div>
              <div>￥{{item.price_unit}}/日均</div>
            </div>
          </div>
          <div class="string"></div>
          <div class="col-item">
            <div>{{item.telephone}}</div>
            <div>微信：十八</div>
          </div>
          <div class="string"></div>
          <div class="col-item duration">
            <div class="start">
              <div>{{item.time_start.split(' ')[0]}}</div>
              <div>{{item.time_start.split(' ')[1]}}</div>
            </div>
            <div class="time">
              <div>{{item.days}}</div>
            </div>
            <div class="end">
              <div>{{item.time_end.split(' ')[0]}}</div>
              <div>{{item.time_end.split(' ')[1]}}</div>
            </div>
          </div>
          <div class="string"></div>
          <div class="col-item address">
            <div class="fetch">
              <span>{{item.store_pick_up_name}}</span>
              <div>取</div>
            </div>
            <div class="return">
              <span>{{item.store_drop_off_name}}</span>
              <div>还</div>
            </div>
          </div>
          <div class="string"></div>
          <div class="col-item">
            <div>共计：¥{{item.price_total}}</div>
          </div>
          <div class="string"></div>
          <div class="col-item">
            <div>
              <Tag color="warning">进行中</Tag>
            </div>
          </div>
          <div class="string"></div>
          <div class="col-item">
            <a @click="show(index)">订单详情</a>
          </div>
        </div>
      </div>
      <div class="page-container">
        <template>
          <Page
            :total="total"
            size="small"
            show-elevator
            show-sizer
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"
          />
        </template>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  name: 'MgOrder',
  data: function() {
    return {
      orderStatusCheck: '全部',
      orderStatusList: [
        '全部',
        '未支付',
        '待取车',
        '进行中',
        '已完成',
        '已取消'
      ],
      driverExistenceCheck: '全部',
      driverExistenceList: ['全部', '无', '有'],
      timeCheck: '今日',
      timeList: ['今日', '近7天', '近一个月', '近三个月', '自定义'],
      formItem: {
        order_no: '',
        plate_num: '',
        key: ''
      },
      orderData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      spinShow: true
    };
  },
  created() {
    console.log('MgOrder Index.vue created');
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/order/rental/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgOrder Index.vue created axios /order/rental success',
          res
        );
        if (res.data.code === 0) {
          this.orderData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'MgOrder Index.vue created axios /order/rental failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
        this.spinShow = false;
      }
    );
  },
  computed: {},
  methods: {
    // 查询
    handleSearch() {
      console.log('MgOrder index.vue handleSearch');
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/order/rental/page?order_no=' +
          this.formItem.order_no +
          '&plate_num=' +
          this.formItem.plate_num +
          '&key=' +
          this.formItem.key,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgOrder Index.vue created axios /order/rental success',
            res
          );
          if (res.data.code === 0) {
            this.orderData.length = 0;
            this.orderData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgOrder Index.vue created axios /order/rental failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
      this.orderStatusCheck = '全部';
      this.driverExistenceCheck = '全部';
      this.timeCheck = '今日';
    },
    // 车型详情
    show(index) {
      console.log('MgOrder Index.vue show', this.orderData[index]);
      this.$router.push('/home/orderDetail?order_no=' + this.orderData[index].order_no);
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MgOrder Index.vue handlePageChange', e);
      this.currentPageSize = e;
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MgOrder Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.order-container {
  margin: 20px;
  min-height: 260px;
  position: relative;
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
      .custom-time {
        display: inline-block;
      }
    }
    .form-container {
      padding: 10px 8px 0 8px;
    }
  }
  .content-container {
    margin-top: 15px;
    .item-container {
      margin-bottom: 10px;
      background-color: #fff;
      .item-header {
        border-bottom: 1px solid #e4e4e4;
        padding: 5px 28px 5px 28px;
      }
      .item-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 28px 5px 28px;
        .info {
          display: flex;
          align-items: center;
        }
        .duration {
          display: flex;
          align-items: center;
          .start {
            margin-right: 10px;
          }
          .time {
            div {
              border-bottom: 1px solid #e4e4e4;
              width: 50px;
              text-align: center;
              margin-bottom: 10px;
            }
          }
          .end {
            margin-left: 10px;
          }
        }
        .address {
          .fetch {
            display: flex;
            position: relative;
            align-items: center;
            &::before {
              content: '';
              width: 7px;
              height: 7px;
              border-radius: 3.5px;
              background-color: rgba(105, 189, 131, 1);
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto 0;
            }
            span {
              padding-left: 10px;
            }
            div {
              width: 16px;
              height: 16px;
              background-color: #fff;
              border-radius: 50%;
              border: 2px solid rgba(105, 189, 131, 1);
              line-height: 12px;
              text-align: center;
              color: rgba(105, 189, 131, 1);
              font-size: 9px;
              margin-left: 5px;
            }
          }
          .return {
            display: flex;
            position: relative;
            align-items: center;
            &::before {
              content: '';
              width: 7px;
              height: 7px;
              border-radius: 3.5px;
              background-color: rgba(105, 189, 131, 1);
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto 0;
            }
            span {
              padding-left: 10px;
            }
            div {
              width: 16px;
              height: 16px;
              background-color: #fff;
              border-radius: 50%;
              border: 2px solid rgba(104, 104, 104, 1);
              line-height: 12px;
              text-align: center;
              color: rgba(104, 104, 104, 1);
              font-size: 9px;
              margin-left: 5px;
            }
          }
        }
        .string {
          width: 1px;
          height: 20px;
          background-color: #e4e4e4;
        }
      }
    }
    .page-container {
      text-align: right;
      margin-top: 20px;
    }
  }
}
</style>
