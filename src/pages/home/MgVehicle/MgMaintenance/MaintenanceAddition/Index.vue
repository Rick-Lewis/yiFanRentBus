<template>
  <div class="maintenance-addition-container">
    <div>
      <div class="basic-info-container">
        <div class="header">基础信息</div>
        <Form
          ref="formDynamic"
          :model="basicInfoForm"
          class="content"
          :rules="ruleValidate"
          :label-width="120"
          label-colon
        >
          <FormItem label="选择车辆" prop="plate_num">
            <Select
              v-model="basicInfoForm.plate_num"
              filterable
              style="width: 300px"
            >
              <Option
                v-for="(item, index) in vehicleData"
                :value="item.plate_num"
                :key="index"
                placeholder="请输入车牌号"
                >{{
                  item.plate_num + ' ' + item.model_name + ' - ' + item.color
                }}</Option
              >
            </Select>
            <!-- <Input v-model="basicInfoForm.plate_num" placeholder="请输入车牌号" style="width: 200px" /> -->
          </FormItem>
          <FormItem label="工单类型" required>
            <RadioGroup v-model="basicInfoForm.service_name">
              <Radio
                v-for="(item, index) in serviceList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="服务供应商">
            <Select v-model="basicInfoForm.provider_name" style="width:200px">
              <Option
                v-for="(item, index) in providerList"
                :value="item.name"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="项目">
            <CheckboxGroup
              v-model="basicInfoForm.item_names"
              style="display: inline;"
              @on-change="handleItemChange"
            >
              <Checkbox
                v-for="(item, index) in itemList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="价格">
            <Input
              v-model="basicInfoForm.price"
              placeholder="请输入价格"
              style="width: 200px"
              disabled
            >
              <div class="suffix" slot="suffix">元</div>
            </Input>
          </FormItem>
          <FormItem label="预计返回时间">
            <DatePicker
              v-model="basicInfoForm.time_end"
              type="datetime"
              placeholder="请选择预计返回时间"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div class="btn-container">
        <Button type="primary" @click="handleSubmit('formDynamic')"
          >提交</Button
        >
        <Button style="margin-left: 8px" @click="handleCancel()">取消</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MaintenanceAddition',
  data: function() {
    return {
      providerList: [],
      itemList: [],
      serviceList: [],
      basicInfoForm: {
        plate_num: '',
        service_name: '清洁',
        provider_name: '',
        item_names: [],
        price: '0',
        time_end: ''
      },
      ruleValidate: {},
      vehicleData: [],
      spinShow: false
    };
  },
  created() {
    if (this.$route.query.action === 'edit') {
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/ticket/detail/' +
          this.$route.query.id,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MaintenanceAddition Index.vue created axios /ticket/detail/{id} success',
            res
          );
          if (res.data.code === 0) {
            this.basicInfoForm = Object.assign({}, this.basicInfoForm, {
              plate_num: res.data.data.plate_num,
              service_name: res.data.data.service_name,
              provider_name: res.data.data.provider_name,
              item_names: res.data.data.item_names.split(','),
              price: res.data.data.price_items,
              time_end: res.data.data.time_end
            });
          } else {
            this.$Message.error({
              content: '工单数据请求失败'
            });
          }
        },
        err => {
          console.log(
            'MaintenanceAddition Index.vue created axios /ticket/detail/{id} failure',
            err
          );
          this.$Message.error({
            content: '工单数据请求失败'
          });
        }
      );
    }
    this.spinShow = true;
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/service/item/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MaintenanceAddition Index.vue created axios /service/item/page success',
          res
        );
        if (res.data.code === 0) {
          this.itemList.push(...res.data.data.data);
        } else {
          this.$Message.error({
            content: '服务项目数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MaintenanceAddition Index.vue created axios /service/item/page failure',
          err
        );
        this.$Message.error({
          content: '服务项目数据请求失败'
        });
      }
    );
    let p2 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/service/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MaintenanceAddition Index.vue created axios /service/page success',
          res
        );
        if (res.data.code === 0) {
          this.serviceList.push(...res.data.data.data);
        } else {
          this.$Message.error({
            content: '服务类型数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MaintenanceAddition Index.vue created axios /service/page failure',
          err
        );
        this.$Message.error({
          content: '服务类型数据请求失败'
        });
      }
    );
    let p3 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/provider/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MaintenanceAddition Index.vue created axios /provider/page success',
          res
        );
        if (res.data.code === 0) {
          this.providerList.push(...res.data.data.data);
        } else {
          this.$Message.error({
            content: '服务商数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MaintenanceAddition Index.vue created axios /provider/page failure',
          err
        );
        this.$Message.error({
          content: '服务商数据请求失败'
        });
      }
    );
    let p4 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicle/detail/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MaintenanceAddition Index.vue created axios /vehicle/detail/page success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleData.push(...res.data.data.data);
        } else {
          this.$Message.error({
            content: '车辆数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MaintenanceAddition Index.vue created axios /vehicle/detail/page failure',
          err
        );
        this.$Message.error({
          content: '车辆数据请求失败'
        });
      }
    );
    Promise.all([p1, p2, p3, p4])
      .then(res => {
        console.log(
          'MaintenanceAddition Index.vue created Promise.all success',
          res
        );
        this.spinShow = false;
      })
      .catch(err => {
        console.log(
          'MaintenanceAddition Index.vue created Promise.all failure',
          err
        );
        this.spinShow = false;
      });
  },
  mounted() {},
  computed: {},
  methods: {
    // 取消
    handleCancel() {
      console.log('MaintenanceAddition index.vue methods handleCancel');
      this.$router.back();
    },
    // 选择项目
    handleItemChange(val) {
      console.log(
        'MaintenanceAddition Index.vue methods handleItemChange',
        val
      );
      let tempPrice = 0;
      val.map(item => {
        let temp = this.itemList.find(ite => ite.name === item);
        tempPrice = tempPrice + parseInt(temp.price);
      });
      this.basicInfoForm.price = tempPrice;
    },
    // 提交
    handleSubmit() {
      let tempList = [];
      this.basicInfoForm.item_names.map(item => {
        let temp = this.itemList.find(ite => ite.name === item);
        tempList.push(temp.id);
      });

      let tempIndex2 = this.serviceList.findIndex(
        item => item.name === this.basicInfoForm.service_name
      );
      let tempIndex3 = this.providerList.findIndex(
        item => item.name === this.basicInfoForm.provider_name
      );
      let temp = {
        plate_num: this.basicInfoForm.plate_num,
        service_id: this.serviceList[tempIndex2].id,
        item_ids: tempList.join(','),
        provider_id: this.providerList[tempIndex3].id,
        time_start: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        time_end: this.$moment(this.basicInfoForm.time_end).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        // price: this.basicInfoForm.price
      };
      if (this.$route.query.action === 'edit') {
        temp = Object.assign({}, temp, { id: this.$route.query.id });
      }
      console.log('MaintenanceAddition index.vue methods handleSubmit', temp);
      this.spinShow = true;
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/ticket/saveData',
        headers: { 'Content-Type': 'application/json' },
        data: temp
      }).then(
        res => {
          console.log(
            'MaintenanceAddition Index.vue created axios /ticket/saveData success',
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
          this.spinShow = false;
        },
        err => {
          console.log(
            'MaintenanceAddition Index.vue created axios /ticket/saveData failure',
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
<style lang="scss" scoped>
@import './Index.scss';
</style>
