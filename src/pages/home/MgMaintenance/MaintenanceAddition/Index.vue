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
            <Input
              v-model="basicInfoForm.plate_num"
              placeholder="请输入车牌号"
              style="width: 200px"
            />
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
            <Select v-model="basicInfoForm.service" style="width:200px">
              <Option
                v-for="(item, index) in serviceList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="项目">
            <CheckboxGroup
              v-model="basicInfoForm.item"
              style="display: inline;"
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
            >
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
      basicInfoForm: {
        plate_num: '',
        type_check: '',
        service: '',
        item: '',
        price: '',
        back_time: ''
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  components: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
