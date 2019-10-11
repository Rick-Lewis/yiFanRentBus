<template>
  <div class="vehicle-model-container">
    <div class="filtrate-container">
      <div class="from-brand">
        <span>所属品牌：</span>
        <RadioGroup v-model="fromBrandCheck">
          <Radio v-for="(item, index) in fromBrandList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
      </div>
      <div class="vehicle-type">
        <span>车辆类型：</span>
        <RadioGroup v-model="vehicleTypeCheck">
          <Radio v-for="(item, index) in vehicleTypeList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
      </div>
      <div class="vehicle-status">
        <span>车辆状态：</span>
        <RadioGroup v-model="vehicleStatusCheck">
          <Radio v-for="(item, index) in vehicleStatusList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
      </div>
      <Form :model="formItem" :label-width="80" inline style="padding-top: 10px;">
        <FormItem label="车型名称：">
          <Input v-model="formItem.vehicleModelName" placeholder="请输入车型名称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSerch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <Switch>
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
      <Button type="primary" style="margin-bottom: 10px;">+新增</Button>
      <Table border :columns="columns12" :data="data6" stripe>
        <template slot="vehicleStatus">
          <Switch>
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
        </template>
      </Table>
      <div class="page-container">
        <template>
          <Page :total="100" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MgVehicleModel',
  data() {
    return {
      fromBrandCheck: '丰田',
      fromBrandList: [
        '全部',
        '大众',
        '丰田',
        '凯迪拉克',
        '别克',
        '宝马',
        '奔驰',
        '奥迪'
      ],
      vehicleTypeCheck: '舒适型轿车',
      vehicleTypeList: [
        '全部',
        '紧凑型轿车',
        '舒适型轿车',
        '商务轿车',
        '豪华轿车',
        '紧凑型SUV',
        '中型5座SUV',
        '中型座SUV'
      ],
      vehicleStatusCheck: '全部',
      vehicleStatusList: ['全部', '已关停', '已开启'],
      formItem: {
        vehicleModelName: ''
      },
      columns12: [
        {
          title: '所属品牌',
          key: 'fromBrand'
        },
        {
          title: '车辆类型',
          key: 'vehicleType'
        },
        {
          title: '车辆数',
          key: 'vehicleNum'
        },
        {
          title: '今日价格',
          key: 'price'
        },
        {
          title: '车辆状态',
          slot: 'vehicleStatus',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data6: [
        {
          fromBrand: '2019款奥迪Q5',
          vehicleType: '中型SUV',
          vehicleNum: 18,
          price: '¥189.00',
          vehicleStatus: 0
        },
        {
          fromBrand: '2019款奥迪Q5',
          vehicleType: '中型SUV',
          vehicleNum: 18,
          price: '¥189.00',
          vehicleStatus: 0
        },
        {
          fromBrand: '2019款奥迪Q5',
          vehicleType: '中型SUV',
          vehicleNum: 18,
          price: '¥189.00',
          vehicleStatus: 0
        },
        {
          fromBrand: '2019款奥迪Q5',
          vehicleType: '中型SUV',
          vehicleNum: 18,
          price: '¥189.00',
          vehicleStatus: 0
        }
      ]
    };
  },
  methods: {
    handleSerch() {
      console.log('MgVehicleModel index.vue handleSerch');
    },
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
    },
    // 删除行
    remove(index) {
      this.data6.splice(index, 1);
    },
    // 编辑行
    edit(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.vehicle-model-container {
  .filtrate-container {
    .from-brand {
      padding: 10px 8px;
    }
    .vehicle-type {
      padding: 10px 8px;
    }
    .vehicle-status {
      padding: 10px 8px;
    }
  }
  .content-container {
    .page-container {
      text-align: right;
      margin-top: 20px;
    }
  }
}
</style>
