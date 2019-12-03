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
            <Select v-model="basicInfoForm.plate_num" filterable style="width: 300px">
              <Option
                v-for="(item, index) in vehicleData"
                :value="item.plate_num"
                :key="index"
                placeholder="请输入车牌号"
              >{{ item.plate_num + ' ' + item.model_name + ' - ' + item.color }}</Option>
            </Select>
            <!-- <Input v-model="basicInfoForm.plate_num" placeholder="请输入车牌号" style="width: 200px" /> -->
          </FormItem>
          <FormItem label="工单类型" required>
            <RadioGroup v-model="basicInfoForm.type_check">
              <Radio
                v-for="(item, index) in typeList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="服务供应商">
            <Select v-model="basicInfoForm.service_check" style="width:200px">
              <Option
                v-for="(item, index) in serviceList"
                :value="item.value"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="项目">
            <CheckboxGroup v-model="basicInfoForm.item_check" style="display: inline;">
              <Checkbox
                v-for="(item, index) in itemList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="价格">
            <Input v-model="basicInfoForm.price" placeholder="请输入价格" style="width: 200px">
              <div class="suffix" slot="suffix">元</div>
            </Input>
          </FormItem>
          <FormItem label="预计返回时间">
            <DatePicker
              v-model="basicInfoForm.back_time"
              type="datetime"
              placeholder="请选择预计返回时间"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div class="btn-container">
        <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
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
      serviceList: [],
      itemList: [
        { name: '外观清洁', value: 1 },
        { name: '内饰清洁', value: 2 },
        { name: '车内消毒', value: 3 },
        { name: '添加玻璃清洁液', value: 4 }
      ],
      typeList: [
        { name: '清洁', value: 1 },
        { name: '保养', value: 2 },
        { name: '维修', value: 3 }
      ],
      basicInfoForm: {
        plate_num: '',
        type_check: '清洁',
        service_check: '',
        item_check: [],
        price: '',
        back_time: ''
      },
      ruleValidate: {},
      vehicleData: [],
      spinShow: false
    };
  },
  created() {
    this.axios({
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
          'MaintenanceAddition Index.vue created axios /vehicle/detail/page success',
          err
        );
        this.$Message.error({
          content: '车辆数据请求失败'
        });
      }
    );
  },
  mounted() {},
  computed: {},
  methods: {
    // 提交
    handleSubmit() {
      let tempList = [];
      this.basicInfoForm.item_check.map(item => {
        let temp = this.itemList.find(ite => ite.name === item);
        tempList.push(temp.value);
      });

      let tempIndex2 = this.typeList.findIndex(
        item => item.name === this.basicInfoForm.type_check
      );
      let temp = {
        plate_num: this.basicInfoForm.plate_num,
        service_id: this.typeList[tempIndex2].value,
        item_ids: tempList.join(','),
        provider_id: 1,
        time_start: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        time_end: this.$moment(this.basicInfoForm.back_time).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        // price: this.basicInfoForm.price
      };
      if (this.$route.query.action === 'edit') {
        temp = Object.assign({}, temp, { id: this.$route.query.id });
      }
      console.log('MaintenanceAddition index.vue methods handleSubmit', temp);
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
        },
        err => {
          console.log(
            'MaintenanceAddition Index.vue created axios /ticket/saveData failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
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
