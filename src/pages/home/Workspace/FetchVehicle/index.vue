<template>
  <div class="fetch-vehicle-container">
    <div class="basic-info-container">
      <div class="header">
        <span>单号：{{ orderDetail && orderDetail.order.order_no }}</span>
        <span>下单时间：{{ orderDetail && orderDetail.order.time_create }}</span>
        <!-- <span>司机：王大伟（130 8888 8888）</span> -->
      </div>
      <div class="content">
        <div class="left">
          <div>
            <img
              :src="
                orderDetail && global_.path.baseUrl + orderDetail.model.image
              "
              style="width: 130px; height: 88px;"
            />
          </div>
          <div>
            <div>{{ orderDetail && orderDetail.order.plate_num }}</div>
            <div>{{ orderDetail && orderDetail.model.name }}</div>
            <div>￥{{ orderDetail && orderDetail.order.price_unit }}/日均</div>
          </div>
        </div>
        <div class="string"></div>
        <div class="center">
          <div class="top">实际取还时间：</div>
          <div class="bottom">
            <div class="start">
              <div>{{ orderDetail && orderDetail.order.time_start.split(' ')[0] }}</div>
              <div>{{ orderDetail && orderDetail.order.time_start.split(' ')[1] }}</div>
            </div>
            <div class="time">
              <div>{{ orderDetail && orderDetail.order.days }}</div>
            </div>
            <div class="end">
              <div>{{ orderDetail && orderDetail.order.time_end.split(' ')[0] }}</div>
              <div>{{ orderDetail && orderDetail.order.time_end.split(' ')[1] }}</div>
            </div>
          </div>
        </div>
        <div class="string"></div>
        <div class="right">
          <div>
            <div class="top">实际取还地点：</div>
            <div class="bottom">
              <div class="fetch">
                <span>
                  {{
                  orderDetail && orderDetail.order.store_pick_up_name
                  }}
                </span>
                <div>取</div>
              </div>
              <div class="return">
                <span>
                  {{
                  orderDetail && orderDetail.order.store_drop_off_name
                  }}
                </span>
                <div>还</div>
              </div>
            </div>
          </div>
          <div>
            <div style="margin-right: 60px;">
              <div>状态</div>
              <div>{{ orderStatus }}</div>
            </div>
            <div>
              <div>实付金额</div>
              <div>{{ orderDetail && orderDetail.order.price_total }}元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fetch-form-container">
      <div class="header">取车操作</div>
      <div class="form-container">
        <Form
          ref="formDynamic"
          :rules="ruleValidate"
          :model="formItem"
          :label-width="120"
          label-colon
        >
          <FormItem label="车辆里程">
            <Input v-model="formItem.mileage" placeholder="请输入车辆仪表盘上的公里数" style="width: 300px">
              <div class="suffix" slot="suffix">Km</div>
            </Input>
          </FormItem>
          <FormItem label="剩余油量">
            <Input v-model="formItem.innage" placeholder="请输入车辆仪表盘上的剩余油量" style="width: 300px">
              <div class="suffix" slot="suffix">L</div>
            </Input>
          </FormItem>
          <FormItem label="问题记录">
            <Input
              v-model="formItem.issue_record"
              maxlength="200"
              show-word-limit
              type="textarea"
              placeholder="请输入取车时的问题记录（如车辆剐蹭、配件信息等）"
              style="width: 350px;"
              :rows="4"
            />
          </FormItem>
          <FormItem label="操作意见">
            <Input
              v-model="formItem.opinion"
              maxlength="200"
              show-word-limit
              type="textarea"
              placeholder="信息核对无误，可以取取车"
              style="width: 350px;"
              :rows="4"
            />
          </FormItem>
          <FormItem label="操作人">
            <div>{{ formItem.author }}</div>
          </FormItem>
        </Form>
        <div class="btn-container">
          <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
          <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
        </div>
      </div>
    </div>

    <!-- <div class="other-container">
      <div class="reserve-info-container">
        <div class="header">预定信息</div>
        <div class="content">
          <div class="fetch">
            <div>
              取车时间：
              {{ orderDetail && orderDetail.order.time_start }}
            </div>
            <div style="margin-top: 15px;">
              取车门店：
              {{ orderDetail && orderDetail.order.store_pick_up_name }}
            </div>
          </div>
          <div class="return">
            <div>
              还车时间：
              {{ orderDetail && orderDetail.order.time_end }}
            </div>
            <div style="margin-top: 15px;">
              还车门店：
              {{ orderDetail && orderDetail.order.store_drop_off_name }}
            </div>
          </div>
          <div class="duration">
            <div>
              预计租车时长：
              {{ orderDetail && orderDetail.order.days }} 天
            </div>
          </div>
        </div>
      </div>
      <div class="user-info-container">
        <div class="header">用户信息</div>
        <div class="content">
          <div>
            昵称：
            {{ orderDetail && orderDetail.order.nick_name }}
          </div>
          <div>
            手机号：
            {{ orderDetail && orderDetail.order.telephone }}
          </div>
          <div style="opacity: 0;"></div>
        </div>
      </div>
      <div class="order-info-container">
        <div class="header">订单操作</div>
        <div class="content">
          <Table border :columns="optColumns" :data="optData" stripe>
          </Table>
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
    </div>-->
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  name: 'FetchVehicle',
  data: function() {
    return {
      ruleValidate: {
        mileage: [
          {
            required: true,
            message: '请输入车辆仪表盘上的公里数',
            trigger: 'blur'
          }
        ],
        innage: [
          {
            required: true,
            message: '请输入车辆仪表盘上的剩余油量',
            trigger: 'blur'
          }
        ],
        issue_record: [
          {
            required: true,
            message: '请输入取车时的问题记录（如车辆剐蹭、配件信息等）',
            trigger: 'blur'
          }
        ],
        opinion: [
          {
            required: true,
            message: '信息核对无误，可以取取车',
            trigger: 'blur'
          }
        ]
      },
      formItem: {
        mileage: '',
        innage: '',
        issue_record: '',
        opinion: ''
      },
      optColumns: [
        {
          title: '操作类型',
          key: 'action',
          align: 'center'
        },
        {
          title: '操作时间',
          key: 'operate_time',
          align: 'center'
        },
        {
          title: '操作人',
          key: 'operator_name',
          align: 'center'
        },
        {
          title: '备注',
          key: 'describe',
          align: 'center'
        }
      ],
      optData: [],
      costColumns: [
        {
          title: '费用项目',
          key: 'costItem',
          align: 'center'
        },
        {
          title: '金额（元）',
          key: 'sum',
          align: 'center'
        },
        {
          title: '子订单编号',
          key: 'oderNo',
          align: 'center'
        }
      ],
      costData: [],
      evalColumns: [
        {
          title: '星级',
          key: 'level',
          align: 'center'
        },
        {
          title: '评价内容',
          key: 'content',
          align: 'center'
        },
        {
          title: '评价时间',
          key: 'time',
          align: 'center'
        }
      ],
      evalData: [],
      orderDetail: null,
      spinShow: true,
      orderStatusList: []
    };
  },
  created() {
    console.log('FetchVehicle Index.vue created');
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/order',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'FetchVehicle Index.vue created axios /status/order success',
          res
        );
        this.orderStatusList.push(...res.data);
      },
      err => {
        console.log(
          'FetchVehicle Index.vue created axios /status/order failure',
          err
        );
        this.$Message.error({
          content: '车辆状态数据请求失败'
        });
      }
    );
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
          'FetchVehicle Index.vue created axios /rental/detail/{order_no} success',
          res
        );
        if (res.data.code === 0) {
          this.orderDetail = res.data.data;
          this.optData.push(...this.orderDetail.order.orderOperations);
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'FetchVehicle Index.vue created axios /rental/detail/{order_no} failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
        this.spinShow = false;
      }
    );
    this.formItem.author = this.$store.state.homeStore.userInfo.username;
  },
  methods: {
    // 取消
    handleCancel() {
      console.log('FetchVehicle index.vue methods handleCancel');
      this.$router.back();
    },
    // 提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let temp = {
            order_no: '019102532000167',
            mileage: this.formItem.mileage,
            innage: this.formItem.innage,
            issue_record: this.formItem.issue_record,
            opinion: this.formItem.opinion
          };
          console.log('FetchVehicle index.vue methods handleSubmit', temp);
          this.axios({
            method: 'post',
            url: this.global_.path.baseUrl + '/rentalcars/order/rental/pickup',
            headers: { 'Content-Type': 'application/json' },
            data: temp
          }).then(
            res => {
              console.log(
                'FetchVehicle Index.vue created axios /order/rental/pickup success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success({
                  content: '操作成功'
                });
                this.$router.back();
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
            },
            err => {
              console.log(
                'MaintenanceDetail Index.vue created axios /order/rental/pickup failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
            }
          );
        } else {
          this.$Message.error('有必填项未填写');
        }
      });
    }
  },
  computed: {
    orderStatus() {
      let temp = this.orderDetail
        ? this.orderStatusList.find(item => item.status === this.orderDetail.order.status)
        : null;
      return temp ? temp.name : '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
