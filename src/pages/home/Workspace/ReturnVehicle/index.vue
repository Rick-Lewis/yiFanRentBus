<template>
  <div class="return-vehicle-container">
    <div class="basic-info-container">
      <div class="header">
        <span>单号：{{ orderDetail && orderDetail.order.order_no }}</span>
        <span>下单时间：{{ orderDetail && orderDetail.order.time_create }}</span>
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
          <div class="top">预计取还时间：</div>
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
            <div class="top">预计取还地点：</div>
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
        <div>
          <Form
            ref="formDynamic"
            :rules="ruleValidate"
            :model="formItem"
            :label-width="120"
            label-colon
          >
            <FormItem label="车辆里程" prop="mileage">
              <Input v-model="formItem.mileage" placeholder="请输入车辆仪表盘上的公里数" style="width: 300px">
                <div class="suffix" slot="suffix">Km</div>
              </Input>
            </FormItem>
            <FormItem label="剩余油量" prop="innage">
              <Input v-model="formItem.innage" placeholder="请输入车辆仪表盘上的剩余油量" style="width: 300px">
                <div class="suffix" slot="suffix">L</div>
              </Input>
            </FormItem>
            <FormItem label="问题记录" prop="issue_record">
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
            <FormItem label="操作意见" prop="opinion">
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
            <FormItem label="补付油费" prop="fee_oil">
              <Input v-model="formItem.fee_oil" placeholder="计算出用户应该补付油费" style="width: 300px">
                <div class="suffix" slot="suffix">元</div>
              </Input>
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
    </div>

    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  name: 'ReturnVehicle',
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
        ],
        fee_oil: [
          {
            required: true,
            message: '计算出用户应该补付油费',
            trigger: 'blur'
          }
        ]
      },
      formItem: {
        mileage: '',
        innage: '',
        issue_record: '',
        opinion: '',
        fee_oil: ''
      },
      orderDetail: null,
      spinShow: true,
      orderStatusList: []
    };
  },
  created() {
    console.log('ReturnVehicle Index.vue created');
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/order',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ReturnVehicle Index.vue created axios /status/order success',
          res
        );
        this.orderStatusList.push(...res.data);
      },
      err => {
        console.log(
          'ReturnVehicle Index.vue created axios /status/order failure',
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
          'ReturnVehicle Index.vue created axios /rental/detail/{order_no} success',
          res
        );
        if (res.data.code === 0) {
          this.orderDetail = res.data.data;
        } else {
          this.$Message.error({
            content: res.data.message
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'ReturnVehicle Index.vue created axios /rental/detail/{order_no} failure',
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
      console.log('ReturnVehicle index.vue methods handleCancel');
      this.$router.back();
    },
    // 提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let temp = {
            order_no: this.orderDetail.order.order_no,
            mileage: this.formItem.mileage,
            innage: this.formItem.innage,
            issue_record: this.formItem.issue_record,
            opinion: this.formItem.opinion,
            fee_oil: this.formItem.fee_oil
          };
          console.log('ReturnVehicle index.vue methods handleSubmit', temp);
          this.axios({
            method: 'post',
            url: this.global_.path.baseUrl + '/rentalcars/order/rental/dropoff',
            headers: { 'Content-Type': 'application/json' },
            data: temp
          }).then(
            res => {
              console.log(
                'ReturnVehicle Index.vue created axios /order/rental/dropoff success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success({
                  content: res.data.message
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
                'ReturnVehicle Index.vue created axios /order/rental/dropoff failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
            }
          );
        } else {
          this.$Message.warning('有必填项未填写');
        }
      });
    }
  },
  computed: {
    orderStatus() {
      let temp = null;
      if (this.orderDetail) {
        temp = this.orderStatusList.find(item => item.status === this.orderDetail.order.status);
      }
      return temp ? temp.name : '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
