<template>
  <div class="order-container">
    <div class="filtrate-container">
      <div class="order-status">
        <span>订单状态：</span>
        <RadioGroup v-model="orderStatusCheck">
          <Radio
            v-for="(item, index) in orderStatusList"
            v-bind:key="index"
            v-bind:label="item.name"
          ></Radio>
        </RadioGroup>
      </div>
      <div class="driver-existence">
        <span>有无司机：</span>
        <RadioGroup v-model="driverExistenceCheck">
          <Radio
            v-for="(item, index) in driverExistenceList"
            v-bind:key="index"
            v-bind:label="item.name"
          ></Radio>
        </RadioGroup>
      </div>
      <div class="time">
        <span>时间查询：</span>
        <RadioGroup v-model="timeCheck" @on-change="handleCalDuration1">
          <Radio v-for="(item, index) in timeList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
        <div class="custom-time">
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            v-model="time_start"
            @on-change="handleCalDurationS"
            type="date"
            placeholder="开始时间"
            style="width: 200px"
          ></DatePicker>
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            v-model="time_end"
            @on-change="handleCalDurationE"
            type="date"
            placeholder="结束时间"
            style="width: 200px"
          ></DatePicker>
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
      <div v-if="orderData.length <= 0" style="text-align: center;">～ 没有更多了 ～</div>
      <div class="item-container" v-for="(item, index) in orderData" v-bind:key="index">
        <div class="item-header">
          <span>下单时间：{{item.time_create}}</span>
          <span style="padding-left: 15px;">订单编号：{{item.order_no}}</span>
          <!-- <span style="padding-left: 15px;">司机：王大伟</span> -->
        </div>
        <div class="item-content">
          <div class="col-item info">
            <div>
              <img
                :src="global_.path.baseUrl + item.model_image"
                style="width: 130px; height: 88px;"
              />
            </div>
            <div style="padding-left: 10px;">
              <div>{{item.plate_num}}</div>
              <div>{{item.model_name}}</div>
              <div>￥{{item.price_unit}}/日均</div>
            </div>
          </div>
          <div class="string"></div>
          <div class="col-item" style="text-align: center;">
            <div>{{item.telephone}}</div>
            <div>微信：{{item.nick_name}}</div>
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
              <Tag color="warning">{{orderStatusList[haneleIndexByStatus(item.status)].name}}</Tag>
            </div>
          </div>
          <div class="string"></div>
          <div class="col-item" style="width: 170px; text-align:center;">
            <a @click="handleOperate(index, 'refund')" v-if="item.status === 1">退款</a>
            <a
              @click="handleOperate(index)"
              v-if="item.status === 1 || item.status === 3"
            >{{getOperateText(index)}}</a>
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
            show-total
          />
        </template>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>
<script>
// import myOrderStore from '../../../../store/home/OrderCenter/MyOrder/index';
export default {
  name: 'MgOrder',
  data: function() {
    return {
      orderStatusCheck: '全部',
      orderStatusList: [],
      driverExistenceCheck: '全部',
      driverExistenceList: [
        { name: '全部', value: -2 },
        { name: '无', value: 0 },
        { name: '有', value: 1 }
      ],
      timeCheck: '全部',
      timeList: ['全部', '今日', '近7天', '近一个月', '近三个月'],
      time_start: '',
      time_end: '',
      duration: null,
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
    console.log('MgOrder Index.vue created', this.$store);
    // this.$store.registerModule('myOrderStore', myOrderStore);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/order',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgOrder Index.vue created axios /status/order success',
          res
        );
        this.orderStatusList.push({ name: '全部', status: -2 }, ...res.data);
        this.$store.dispatch('myOrderStore/init', res.data);
      },
      err => {
        console.log(
          'MgOrder Index.vue created axios /status/order failure',
          err
        );
        this.$Message.error({
          content: '车辆状态数据请求失败'
        });
      }
    );
    let p2 = this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/order/rental/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
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
      },
      err => {
        console.log(
          'MgOrder Index.vue created axios /order/rental failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
      }
    );
    Promise.all([p1, p2])
      .then(res => {
        console.log('MgVehicle Index.vue created Promise.all success', res);
        this.spinShow = false;
      })
      .catch(err => {
        console.log('MgVehicle Index.vue created Promise.all failure', err);
        this.spinShow = false;
      });
    let that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        that.handleSearch();
      }
    };
  },
  destroyed() {
    console.log('MgVehicle Index.vue destroyed');
    // this.$store.unregisterModule('myOrderStore');
  },
  computed: {},
  methods: {
    getOperateText(index) {
      let temp = '';
      switch (this.orderData[index].status) {
        case 1:
          temp = '取车';
          break;
        case 3:
          temp = '还车';
          break;
      }
      return temp;
    },
    handleOperate(index, text = '') {
      if (text === 'refund') {
        // 退款
        let temp = {
          order_no: this.orderData[index].order_no,
          refund_fee: this.orderData[index].price_total
        };
        this.$Modal.confirm({
          title: '确定退款？',
          content: '',
          onOk: () => {
            this.spinShow = true;
            this.axios({
              url:
                this.global_.path.baseUrl + '/rentalcars/order/rental/refund',
              method: 'post',
              data: this.$qs.stringify(temp),
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(
              res => {
                console.log(
                  'MgVehicle Index.vue handleOperate axios /rental/refund success',
                  res
                );
                if (res.data.code === 0) {
                  this.$Message.info('操作成功');
                  this.orderData[index].status = 2;
                } else {
                  this.$Message.error({
                    content: '操作失败'
                  });
                }
                this.spinShow = false;
              },
              err => {
                console.log(
                  'MgVehicle Index.vue handleOperate axios /rental/refund failure',
                  err
                );
                this.$Message.error({
                  content: '操作失败'
                });
                this.spinShow = false;
              }
            );
          },
          onCancel: () => {
            console.log('MgVehicle index.vue confirm onCancel');
          }
        });
      } else if (this.orderData[index].status === 1) {
        // 取车
        let temp = {
          order_no: this.orderData[index].order_no
        };
        this.axios({
          url: this.global_.path.baseUrl + '/rentalcars/order/rental/pickup',
          method: 'post',
          data: this.$qs.stringify(temp),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(
          res => {
            console.log(
              'MgVehicle Index.vue handleOperate axios /rental/pickup success',
              res
            );
            if (res.data.code === 0) {
              this.$Message.info('操作成功');
              this.orderData[index].status = 3;
            } else {
              this.$Message.error({
                content: '操作失败'
              });
            }
            this.spinShow = false;
          },
          err => {
            console.log(
              'MgVehicle Index.vue handleOperate axios /rental/pickup failure',
              err
            );
            this.$Message.error({
              content: '操作失败'
            });
            this.spinShow = false;
          }
        );
      } else if (this.orderData[index].status === 3) {
        // 还车
        let temp = {
          order_no: this.orderData[index].order_no
        };
        this.axios({
          url: this.global_.path.baseUrl + '/rentalcars/order/rental/dropoff',
          method: 'post',
          data: this.$qs.stringify(temp),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(
          res => {
            console.log(
              'MgVehicle Index.vue handleOperate axios /rental/dropoff success',
              res
            );
            if (res.data.code === 0) {
              this.$Message.info('操作成功');
              this.orderData[index].status = 4;
            } else {
              this.$Message.error({
                content: '操作失败'
              });
            }
            this.spinShow = false;
          },
          err => {
            console.log(
              'MgVehicle Index.vue handleOperate axios /rental/refund failure',
              err
            );
            this.$Message.error({
              content: '操作失败'
            });
            this.spinShow = false;
          }
        );
      }
    },
    handleCalDuration1(val) {
      let nowDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let timeStartTemp = '';
      let timeEndTemp = '';
      this.time_start = '';
      this.time_end = '';
      switch (val) {
        case '今日':
          timeStartTemp = this.$moment(new Date()).format(
            'YYYY-MM-DD 00:00:00'
          );
          timeEndTemp = nowDate;
          break;
        case '近7天':
          timeStartTemp = this.$moment()
            .subtract('days', 6)
            .format('YYYY-MM-DD HH:mm:ss');
          timeEndTemp = nowDate;
          break;
        case '近一个月':
          timeStartTemp = this.$moment()
            .subtract('days', 29)
            .format('YYYY-MM-DD HH:mm:ss');
          timeEndTemp = nowDate;
          break;
        case '近三个月':
          timeStartTemp = this.$moment()
            .subtract('days', 89)
            .format('YYYY-MM-DD HH:mm:ss');
          timeEndTemp = nowDate;
          break;
      }
      console.log(
        'MyOrder Index.vue methods handleCalDuration1',
        nowDate,
        timeStartTemp,
        timeEndTemp,
        val
      );
      this.duration = Object.assign(
        {},
        { timeStart: timeStartTemp, timeEnd: timeEndTemp }
      );
    },
    handleCalDurationS(val) {
      let nowDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let timeStartTemp = '';
      let timeEndTemp = '';
      this.timeCheck = '全部';
      timeStartTemp = this.$moment(this.time_start).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      timeEndTemp = nowDate;
      console.log(
        'MyOrder Index.vue methods handleCalDurationS',
        nowDate,
        timeStartTemp,
        timeEndTemp,
        val
      );
      this.duration = Object.assign(
        {},
        { timeStart: timeStartTemp, timeEnd: timeEndTemp }
      );
    },
    handleCalDurationE(val) {
      let nowDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let timeStartTemp = '';
      let timeEndTemp = '';
      this.timeCheck = '全部';
      if (this.time_end) {
        timeStartTemp = nowDate;
        timeEndTemp = this.$moment(this.time_end).format('YYYY-MM-DD HH:mm:ss');
      }
      console.log(
        'MyOrder Index.vue methods handleCalDurationE',
        nowDate,
        timeStartTemp,
        timeEndTemp,
        val
      );
      this.duration = Object.assign(
        {},
        { timeStart: timeStartTemp, timeEnd: timeEndTemp }
      );
    },
    haneleIndexByStatus(status) {
      let indexTemp = this.orderStatusList.findIndex(
        item => item.status === status
      );
      return indexTemp;
    },
    handleSelected(e, type) {
      console.log('MgOrder index.vue handleSelected', e, type);
      let indexTemp = -1;
      switch (type) {
        case 'status':
          indexTemp = this.orderStatusList.findIndex(item => item.name === e);
          break;
        case 'with_driver':
          indexTemp = this.driverExistenceList.findIndex(
            item => item.name === e
          );
      }
      return indexTemp;
    },
    // 查询
    handleSearch() {
      let indexTemp = this.handleSelected(this.orderStatusCheck, 'status');
      let statusTemp = this.orderStatusList[indexTemp].status;
      indexTemp = this.handleSelected(this.driverExistenceCheck, 'with_driver');
      let withDriverTemp = this.driverExistenceList[indexTemp].value;
      let strTemp = '';
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      if (withDriverTemp !== -2) {
        strTemp = strTemp + '&with_driver=' + withDriverTemp;
      }
      if (this.duration) {
        strTemp =
          strTemp +
          '&time_start=' +
          this.duration.timeStart +
          '&time_end=' +
          this.duration.timeEnd;
      }
      console.log('MgOrder index.vue handleSearch');
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/order/rental/page?order_no=' +
          this.formItem.order_no +
          '&plate_num=' +
          this.formItem.plate_num +
          '&key=' +
          this.formItem.key +
          strTemp,
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
      this.$router.push(
        '/home/orderDetail?order_no=' + this.orderData[index].order_no
      );
    },
    // 页码改变
    handlePageChange(e) {
      let indexTemp = this.handleSelected(this.orderStatusCheck, 'status');
      let statusTemp = this.orderStatusList[indexTemp].status;
      indexTemp = this.handleSelected(this.driverExistenceCheck, 'with_driver');
      let withDriverTemp = this.driverExistenceList[indexTemp].value;
      let strTemp = '';
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      if (withDriverTemp !== -2) {
        strTemp = strTemp + '&with_driver=' + withDriverTemp;
      }
      if (this.duration) {
        strTemp =
          strTemp +
          '&time_start=' +
          this.duration.timeStart +
          '&time_end=' +
          this.duration.timeEnd;
      }
      console.log('MgOrder Index.vue handlePageChange', e);
      this.currentPage = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/order/rental/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          strTemp,
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
    // 每页条数改变
    handlePageSizeChange(e) {
      let indexTemp = this.handleSelected(this.orderStatusCheck, 'status');
      let statusTemp = this.orderStatusList[indexTemp].status;
      indexTemp = this.handleSelected(this.driverExistenceCheck, 'with_driver');
      let withDriverTemp = this.driverExistenceList[indexTemp].value;
      let strTemp = '';
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      if (withDriverTemp !== -2) {
        strTemp = strTemp + '&with_driver=' + withDriverTemp;
      }
      if (this.duration) {
        strTemp =
          strTemp +
          '&time_start=' +
          this.duration.timeStart +
          '&time_end=' +
          this.duration.timeEnd;
      }
      console.log('MgOrder Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/order/rental/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          strTemp,
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
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
@import './Index.scss';
</style>
