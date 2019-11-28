<template>
  <div class="workspace-container">
    <div class="platform-mg">
      <div class="header">平台管理</div>
      <div class="content">
        <div class="card">
          <div class="img-container">
            <img src />
          </div>
          <div class="text">价格调整</div>
        </div>
        <div class="card">
          <div class="img-container">
            <img src />
          </div>
          <div class="text">新增车型</div>
        </div>
      </div>
    </div>
    <div class="shop-mg">
      <div class="header">
        <span>门店管理</span>
        <Select
          v-model="storeCheck"
          @on-change="handleStoreChange"
          style="width:200px;font-weight: 400;"
        >
          <Option
            v-for="(item, index) in storeList"
            :value="item.id"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select>
      </div>
      <div class="content">
        <div class="left">
          <div class="search-container">
            <Input
              search
              enter-button="搜索"
              placeholder="请输入用户手机号"
              v-model="telephone"
              @on-search="handleSearchByTel"
            />
          </div>
          <Tabs
            :animated="false"
            style="padding:10px;"
            @on-click="handleTabChange"
          >
            <TabPane
              :label="h => label(h, todayVehicle.fetch.total, 'fetch')"
              name="fetch"
            >
              <div
                v-if="todayVehicle.fetch.list.length <= 0"
                style="text-align: center;"
              >
                ～ 没有更多了 ～
              </div>
              <div
                class="item-container"
                v-for="(item, index) in todayVehicle.fetch.list"
                v-bind:key="index"
              >
                <div class="item-content">
                  <div class="col-item info">
                    <div>
                      <img
                        :src="global_.path.baseUrl + item.model_image"
                        style="width: 130px; height: 88px;"
                      />
                    </div>
                    <div style="padding-left: 10px;">
                      <div>{{ item.plate_num }}</div>
                      <div>{{ item.model_name }}</div>
                      <div>￥{{ item.price_unit }}/日均</div>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item" style="text-align: center;">
                    <div>{{ item.telephone }}</div>
                    <div>微信：{{ item.nick_name }}</div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item duration">
                    <div class="start">
                      <div>{{ item.time_start.split(' ')[0] }}</div>
                      <div>{{ item.time_start.split(' ')[1] }}</div>
                    </div>
                    <div class="time">
                      <div>{{ item.days }}</div>
                    </div>
                    <div class="end">
                      <div>{{ item.time_end.split(' ')[0] }}</div>
                      <div>{{ item.time_end.split(' ')[1] }}</div>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item">
                    <div>
                      <Tag color="warning">已付款</Tag>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item" style="text-align:center;">
                    <a @click="handleOperate(index, 'fetch')">
                      <Tag color="primary">取车</Tag>
                    </a>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane
              :label="h => label(h, todayVehicle.return.total, 'return')"
              name="return"
            >
              <div
                v-if="todayVehicle.return.list.length <= 0"
                style="text-align: center;"
              >
                ～ 没有更多了 ～
              </div>
              <div
                class="item-container"
                v-for="(item, index) in todayVehicle.return.list"
                v-bind:key="index"
              >
                <div class="item-content">
                  <div class="col-item info">
                    <div>
                      <img
                        :src="global_.path.baseUrl + item.model_image"
                        style="width: 130px; height: 88px;"
                      />
                    </div>
                    <div style="padding-left: 10px;">
                      <div>{{ item.plate_num }}</div>
                      <div>{{ item.model_name }}</div>
                      <div>￥{{ item.price_unit }}/日均</div>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item" style="text-align: center;">
                    <div>{{ item.telephone }}</div>
                    <div>微信：{{ item.nick_name }}</div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item duration">
                    <div class="start">
                      <div>{{ item.time_start.split(' ')[0] }}</div>
                      <div>{{ item.time_start.split(' ')[1] }}</div>
                    </div>
                    <div class="time">
                      <div>{{ item.days }}</div>
                    </div>
                    <div class="end">
                      <div>{{ item.time_end.split(' ')[0] }}</div>
                      <div>{{ item.time_end.split(' ')[1] }}</div>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item">
                    <div>
                      <Tag color="warning">进行中</Tag>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item" style="text-align:center;">
                    <a @click="handleOperate(index, 'return')">
                      <Tag color="primary">还车</Tag>
                    </a>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div class="right">
          <div class="header">快捷功能</div>
          <div class="content">
            <div class="card">
              <div class="img-container">
                <img src />
              </div>
              <div class="text">价格调整</div>
            </div>
            <div class="card">
              <div class="img-container">
                <img src />
              </div>
              <div class="text">新增车型</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vehicle-online">
      <div class="header">
        <span>在租车辆</span>
        <div class="search-container">
          <Input
            search
            enter-button="搜索"
            placeholder="请输入用户手机号"
            @on-search="handleSearchByTel1"
          />
        </div>
      </div>
      <div class="content">
        <div class="main-container">
          <div
            v-if="vehicleOnline.list.length <= 0"
            style="text-align: center;"
          >
            ～ 没有更多了 ～
          </div>
          <div
            class="item-container"
            v-for="(item, index) in vehicleOnline.list"
            v-bind:key="index"
          >
            <div class="item-header">
              <span>下单时间：{{ item.time_create }}</span>
              <span style="padding-left: 15px;"
                >订单编号：{{ item.order_no }}</span
              >
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
                  <div>{{ item.plate_num }}</div>
                  <div>{{ item.model_name }}</div>
                  <div>￥{{ item.price_unit }}/日均</div>
                </div>
              </div>
              <div class="string"></div>
              <div class="col-item" style="text-align: center;">
                <div>{{ item.telephone }}</div>
                <div>微信：{{ item.nick_name }}</div>
              </div>
              <div class="string"></div>
              <div class="col-item duration">
                <div class="start">
                  <div>{{ item.time_start.split(' ')[0] }}</div>
                  <div>{{ item.time_start.split(' ')[1] }}</div>
                </div>
                <div class="time">
                  <div>{{ item.days }}</div>
                </div>
                <div class="end">
                  <div>{{ item.time_end.split(' ')[0] }}</div>
                  <div>{{ item.time_end.split(' ')[1] }}</div>
                </div>
              </div>
              <div class="string"></div>
              <div class="col-item address">
                <div class="fetch">
                  <span>{{ item.store_pick_up_name }}</span>
                  <div>取</div>
                </div>
                <div class="return">
                  <span>{{ item.store_drop_off_name }}</span>
                  <div>还</div>
                </div>
              </div>
              <div class="string"></div>
              <div class="col-item">
                <div>共计：¥{{ item.price_total }}</div>
              </div>
              <div class="string"></div>
              <div class="col-item">
                <div>
                  <Tag color="warning">
                    {{ orderStatusList[haneleIndexByStatus(item.status)].name }}
                  </Tag>
                </div>
              </div>
              <div class="string"></div>
              <div class="col-item" style="width: 170px; text-align:center;">
                <a
                  @click="handleOperate(index, 'refund')"
                  v-if="item.status === 1"
                  >退款</a
                >
                <a
                  @click="handleOperate(index)"
                  v-if="item.status === 1 || item.status === 3"
                  >{{ getOperateText(index) }}</a
                >
                <a @click="show(index)">订单详情</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Workspace',
  data: function() {
    return {
      todayVehicle: {
        fetch: {
          list: [],
          total: 0
        },
        return: {
          list: [],
          total: 0
        }
      },
      activeTabName: 'fetch',
      vehicleOnline: {
        list: [],
        total: 0
      },
      orderStatusList: [],
      storeList: [],
      storeCheck: '',
      telephone: ''
    };
  },
  created() {
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/order/rental/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'Workspace Index.vue created axios /order/rental success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleOnline.list.push(...res.data.data.data);
          this.vehicleOnline.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
      },
      err => {
        console.log(
          'Workspace Index.vue created axios /order/rental failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
      }
    );
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/order',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'Workspace Index.vue created axios /status/order success',
          res
        );
        this.orderStatusList.push(...res.data);
      },
      err => {
        console.log(
          'Workspace Index.vue created axios /status/order failure',
          err
        );
        this.$Message.error({
          content: '订单状态数据请求失败'
        });
      }
    );
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/store/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'Workspace Index.vue created axios /store/page success',
          res
        );
        if (res.data.code === 0) {
          this.storeCheck = res.data.data.data[0].id;
          this.storeList.push(...res.data.data.data);

          let timeStartTemp = '';
          let timeEndTemp = this.$moment(new Date()).format(
            'YYYY-MM-DD 23:59:59'
          );
          let strTemp = '';
          if (this.activeTabName === 'fetch') {
            strTemp = strTemp + '?status=1';
          } else {
            strTemp = strTemp + '?status=3';
          }
          strTemp =
            strTemp +
            '&time_start=' +
            timeStartTemp +
            '&time_end=' +
            timeEndTemp;
          if (this.storeCheck) {
            strTemp = strTemp + '&store_id=' + this.storeCheck;
          }
          console.log('Workspace Index.vue created', strTemp);
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/order/rental/page' +
              strTemp,
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'Workspace Index.vue created axios /order/rental success',
                res
              );
              if (res.data.code === 0) {
                this.todayVehicle.fetch.list.push(...res.data.data.data);
                this.todayVehicle.fetch.total = res.data.data.total;
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
            },
            err => {
              console.log(
                'Workspace Index.vue created axios /order/rental failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
            }
          );
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
      },
      err => {
        console.log(
          'Workspace Index.vue created axios /store/page failure',
          err
        );
        this.$Message.error({
          content: '门店数据请求失败'
        });
      }
    );
  },
  methods: {
    handleSearchByTel1(val) {
      let temp = val ? '?telephone=' + val : '';
      this.axios({
        url: this.global_.path.baseUrl + '/rentalcars/order/rental/page' + temp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'Workspace Index.vue created axios /order/rental success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleOnline.list.length = 0;
            this.vehicleOnline.list.push(...res.data.data.data);
            this.vehicleOnline.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
        },
        err => {
          console.log(
            'Workspace Index.vue created axios /order/rental failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
        }
      );
    },
    handleSearchByTel(val) {
      console.log('Workspace Index.vue handleSearchByTel', val);
      let timeStartTemp = '';
      let timeEndTemp = this.$moment(new Date()).format('YYYY-MM-DD 23:59:59');
      let strTemp = '';
      if (this.activeTabName === 'fetch') {
        strTemp = strTemp + '?status=1';
      } else {
        strTemp = strTemp + '?status=3';
      }
      strTemp =
        strTemp + '&time_start=' + timeStartTemp + '&time_end=' + timeEndTemp;
      if (val) {
        strTemp = strTemp + '&telephone=' + val;
      }
      if (this.storeCheck) {
        strTemp = strTemp + '&store_id=' + this.storeCheck;
      }
      console.log('Workspace Index.vue created', strTemp);
      this.axios({
        url:
          this.global_.path.baseUrl + '/rentalcars/order/rental/page' + strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'Workspace Index.vue created axios /order/rental success',
            res
          );
          if (res.data.code === 0) {
            if (this.activeTabName === 'fetch') {
              this.todayVehicle.fetch.list.length = 0;
              this.todayVehicle.fetch.list.push(...res.data.data.data);
              this.todayVehicle.fetch.total = res.data.data.total;
            } else {
              this.todayVehicle.return.list.length = 0;
              this.todayVehicle.return.list.push(...res.data.data.data);
              this.todayVehicle.return.total = res.data.data.total;
            }
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
        },
        err => {
          console.log(
            'Workspace Index.vue created axios /order/rental failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
        }
      );
    },
    handleStoreChange(val) {
      let timeStartTemp = '';
      let timeEndTemp = this.$moment(new Date()).format('YYYY-MM-DD 23:59:59');
      let strTemp = '';
      if (this.activeTabName === 'fetch') {
        strTemp = strTemp + '?status=1';
      } else {
        strTemp = strTemp + '?status=3';
      }
      strTemp =
        strTemp + '&time_start=' + timeStartTemp + '&time_end=' + timeEndTemp;
      if (this.telephone) {
        strTemp = strTemp + '&telephone=' + this.telephone;
      }
      if (val) {
        strTemp = strTemp + '&store_id=' + val;
      }
      console.log('Workspace Index.vue handleStoreChange', val);
      this.axios({
        url:
          this.global_.path.baseUrl + '/rentalcars/order/rental/page' + strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'Workspace Index.vue created axios /order/rental success',
            res
          );
          if (res.data.code === 0) {
            if (this.activeTabName === 'fetch') {
              this.todayVehicle.fetch.list.length = 0;
              this.todayVehicle.fetch.list.push(...res.data.data.data);
              this.todayVehicle.fetch.total = res.data.data.total;
            } else {
              this.todayVehicle.return.list.length = 0;
              this.todayVehicle.return.list.push(...res.data.data.data);
              this.todayVehicle.return.total = res.data.data.total;
            }
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
        },
        err => {
          console.log(
            'Workspace Index.vue created axios /order/rental failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
        }
      );
    },
    // 订单详情
    show(index) {
      console.log('Workspace Index.vue show', this.vehicleOnline.list[index]);
      this.$router.push(
        '/home/orderDetail?order_no=' + this.vehicleOnline.list[index].order_no
      );
    },
    getOperateText(index) {
      let temp = '';
      switch (this.vehicleOnline.list[index].status) {
        case 1:
          temp = '取车';
          break;
        case 3:
          temp = '还车';
          break;
      }
      return temp;
    },
    haneleIndexByStatus(status) {
      let indexTemp = this.orderStatusList.findIndex(
        item => item.status === status
      );
      return indexTemp;
    },
    handleOperate(index, text = '') {
      let temp = null;
      switch (text) {
        case '':
          if (this.vehicleOnline.list[index].status === 1) {
            // 取车
            temp = {
              order_no: this.vehicleOnline.list[index].order_no
            };
            this.axios({
              url:
                this.global_.path.baseUrl + '/rentalcars/order/rental/pickup',
              method: 'post',
              data: this.$qs.stringify(temp),
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(
              res => {
                console.log(
                  'Workspace Index.vue handleOperate axios /rental/pickup success',
                  res
                );
                if (res.data.code === 0) {
                  this.$Message.info('操作成功');
                  this.vehicleOnline.list[index].status = 3;
                } else {
                  this.$Message.error({
                    content: '操作失败'
                  });
                }
                this.spinShow = false;
              },
              err => {
                console.log(
                  'Workspace Index.vue handleOperate axios /rental/pickup failure',
                  err
                );
                this.$Message.error({
                  content: '操作失败'
                });
                this.spinShow = false;
              }
            );
          } else if (this.vehicleOnline.list[index].status === 3) {
            // 还车
            temp = {
              order_no: this.vehicleOnline.list[index].order_no
            };
            this.axios({
              url:
                this.global_.path.baseUrl + '/rentalcars/order/rental/dropoff',
              method: 'post',
              data: this.$qs.stringify(temp),
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(
              res => {
                console.log(
                  'Workspace Index.vue handleOperate axios /rental/dropoff success',
                  res
                );
                if (res.data.code === 0) {
                  this.$Message.info('操作成功');
                  this.vehicleOnline.list[index].status = 4;
                } else {
                  this.$Message.error({
                    content: '操作失败'
                  });
                }
                this.spinShow = false;
              },
              err => {
                console.log(
                  'Workspace Index.vue handleOperate axios /rental/refund failure',
                  err
                );
                this.$Message.error({
                  content: '操作失败'
                });
                this.spinShow = false;
              }
            );
          }
          break;
        case 'refund':
          // 退款
          temp = {
            order_no: this.vehicleOnline.list[index].order_no,
            refund_fee: this.vehicleOnline.list[index].price_total
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
                    'Workspace Index.vue handleOperate axios /rental/refund success',
                    res
                  );
                  if (res.data.code === 0) {
                    this.$Message.info('操作成功');
                    this.vehicleOnline.list[index].status = 2;
                  } else {
                    this.$Message.error({
                      content: '操作失败'
                    });
                  }
                  this.spinShow = false;
                },
                err => {
                  console.log(
                    'Workspace Index.vue handleOperate axios /rental/refund failure',
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
              console.log('Workspace index.vue confirm onCancel');
            }
          });
          break;
        case 'fetch':
          // 取车
          temp = {
            order_no: this.todayVehicle.fetch.list[index].order_no
          };
          this.axios({
            url: this.global_.path.baseUrl + '/rentalcars/order/rental/pickup',
            method: 'post',
            data: this.$qs.stringify(temp),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(
            res => {
              console.log(
                'Workspace Index.vue handleOperate axios /rental/pickup success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.todayVehicle.fetch.list[index].status = 3;
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'Workspace Index.vue handleOperate axios /rental/pickup failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
              this.spinShow = false;
            }
          );
          break;
        case 'return':
          // 还车
          temp = {
            order_no: this.todayVehicle.return.list[index].order_no
          };
          this.axios({
            url: this.global_.path.baseUrl + '/rentalcars/order/rental/dropoff',
            method: 'post',
            data: this.$qs.stringify(temp),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(
            res => {
              console.log(
                'Workspace Index.vue handleOperate axios /rental/dropoff success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.todayVehicle.return.list[index].status = 4;
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'Workspace Index.vue handleOperate axios /rental/refund failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
              this.spinShow = false;
            }
          );
          break;
      }
    },
    label: (h, num, name) => {
      let temp = name === 'fetch' ? '今日取车' : '今日还车';
      if (num > 0) {
        return h('div', [
          h('span', temp),
          h('Badge', {
            props: {
              count: num
            }
          })
        ]);
      }
      return h('div', [h('span', temp)]);
    },
    handleTabChange: function(name) {
      console.log('Workspace methods handleTabChange', name);
      this.activeTabName = name;
      if (name === 'fetch' && this.todayVehicle.fetch.list.length === 0) {
        let timeStartTemp = '';
        let timeEndTemp = this.$moment(new Date()).format(
          'YYYY-MM-DD 23:59:59'
        );
        let strTemp = '?status=1';
        strTemp =
          strTemp + '&time_start=' + timeStartTemp + '&time_end=' + timeEndTemp;
        if (this.telephone) {
          strTemp = strTemp + '&telephone=' + this.telephone;
        }
        if (this.storeCheck) {
          strTemp = strTemp + '&store_id=' + this.storeCheck;
        }
        console.log('Workspace Index.vue handleTabChange', strTemp);
        this.axios({
          url:
            this.global_.path.baseUrl +
            '/rentalcars/order/rental/page' +
            strTemp,
          method: 'get',
          headers: { 'Content-Type': 'application/json' }
        }).then(
          res => {
            console.log(
              'Workspace Index.vue handleTabChange axios /order/rental success',
              res
            );
            if (res.data.code === 0) {
              this.todayVehicle.fetch.list.push(...res.data.data.data);
              this.todayVehicle.fetch.total = res.data.data.total;
            } else {
              this.$Message.error({
                content: '操作失败'
              });
            }
          },
          err => {
            console.log(
              'Workspace Index.vue handleTabChange axios /order/rental failure',
              err
            );
            this.$Message.error({
              content: '操作失败'
            });
          }
        );
      } else if (
        name === 'return' &&
        this.todayVehicle.return.list.length === 0
      ) {
        let timeStartTemp = '';
        let timeEndTemp = this.$moment(new Date()).format(
          'YYYY-MM-DD 23:59:59'
        );
        let strTemp = '?status=3';
        if (this.telephone) {
          strTemp = strTemp + '&telephone=' + this.telephone;
        }
        strTemp =
          strTemp + '&time_start=' + timeStartTemp + '&time_end=' + timeEndTemp;
        if (this.storeCheck) {
          strTemp = strTemp + '&store_id=' + this.storeCheck;
        }
        console.log('Workspace Index.vue handleTabChange', strTemp);
        this.axios({
          url:
            this.global_.path.baseUrl +
            '/rentalcars/order/rental/page' +
            strTemp,
          method: 'get',
          headers: { 'Content-Type': 'application/json' }
        }).then(
          res => {
            console.log(
              'Workspace Index.vue handleTabChange axios /order/rental success',
              res
            );
            if (res.data.code === 0) {
              this.todayVehicle.return.list.push(...res.data.data.data);
              this.todayVehicle.return.total = res.data.data.total;
            } else {
              this.$Message.error({
                content: '操作失败'
              });
            }
          },
          err => {
            console.log(
              'Workspace Index.vue handleTabChange axios /order/rental failure',
              err
            );
            this.$Message.error({
              content: '操作失败'
            });
          }
        );
      }
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
