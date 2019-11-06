<template>
  <div class="vehicle-container">
    <div class="filtrate-container">
      <div class="vehicle-status">
        <span>车辆状态：</span>
        <RadioGroup v-model="vehicleStatusCheck">
          <Radio v-for="(item, index) in vehicleStatusList" v-bind:key="index" v-bind:label="item"></Radio>
        </RadioGroup>
      </div>
      <Form :model="formItem" inline class="form-container">
        <FormItem>
          <span>车牌号：</span>
          <Input v-model="formItem.licensePlateNum" placeholder="请输入车牌号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>车辆识别代码：</span>
          <Input v-model="formItem.licensePlateCode" placeholder="请输入车辆识别代码" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>发动机号：</span>
          <Input v-model="formItem.engineNo" placeholder="请输入发动机号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <div class="btn-container">
        <Button type="primary" @click="add">+新增</Button>
        <Button type="primary" @click="maintain">送维保</Button>
      </div>
      <Table border :columns="vehicleColumns" :data="vehicleData" stripe>
        <template v-slot:state="{ row }">
          <div :class="statusColor[row.state]">{{row.state}}</div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
          <Button type="primary" size="small" @click="remove(index)">检查</Button>
          <Button type="primary" size="small" @click="show(index)">详情</Button>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden;">
        <div style="float: right;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  name: 'MyVehicle',
  data: function() {
    return {
      vehicleStatusCheck: '全部',
      vehicleStatusList: ['全部', '入库', '就绪', '租用', '维保'],
      statusColor: {
        入库: 'storage',
        就绪: 'ready',
        租用: 'rent',
        维保: 'maintenance'
      },
      formItem: {
        licensePlateNum: '',
        licensePlateCode: '',
        engineNo: ''
      },
      vehicleColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '车牌号',
          key: 'plate_num'
        },
        {
          title: '车辆识别代码',
          key: 'vin'
        },
        {
          title: '发动机号',
          key: 'engine_no'
        },
        {
          title: '颜色',
          key: 'color'
        },
        {
          title: '车型',
          key: 'model_id'
        },
        {
          title: '状态',
          slot: 'state'
        },
        {
          title: '操作',
          slot: 'action',
          width: 250,
          align: 'center'
        }
      ],
      vehicleData: [],
      spinShow: true
    };
  },
  created() {
    console.log('MgVehicle Index.vue created');
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicleDetail/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicle Index.vue created axios /vehicleDetail success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleData.push(...res.data.data.data);
        } else {
          this.$Message.error({
            content: '车辆数据请求失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'MgVehicle Index.vue created axios /vehicleDetail success',
          err
        );
        this.$Message.error({
          content: '车辆数据请求失败'
        });
        this.spinShow = false;
      }
    );
  },
  computed: {},
  methods: {
    // 查询
    handleSearch() {
      console.log('MgVehicle index.vue handleSearch');
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
    },
    // 编辑
    edit(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    },
    // 删除
    remove(index) {
      this.data6.splice(index, 1);
    },
    // 详情
    show(index) {
      this.$router.push('/home/vehicleDetail');
    },
    // 翻页
    changePage() {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      console.log('MyVehicle Index.vue methods changePage');
    },
    // 新增
    add() {
      this.$router.push('/home/vehicleAddition');
    },
    // 维保
    maintain() {
      this.$router.push('/home/modelAddition');
    }
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.vehicle-container {
  margin: 20px;
  min-height: 260px;
  position: relative;
  .filtrate-container {
    background-color: #fff;
    padding: 20px 20px 0 20px;
    .vehicle-status {
      padding: 10px 8px;
    }
    .form-container {
      padding: 10px 8px 0 8px;
    }
  }
  .content-container {
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
    .btn-container {
      margin-bottom: 10px;
      & > button:last-child {
        margin-left: 25px;
      }
    }
    $status: 'storage', 'ready', 'rent', 'maintenance';
    @each $item in $status {
      .#{$item} {
        position: relative;
        padding-left: 15px;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          margin: auto 0;
          width: 10px;
          height: 10px;
          border-radius: 10px;
          @if $item == 'storage' {
            background-color: #b2b2b2;
          } @else if $item == 'ready' {
            background-color: #249b31;
          } @else if $item == 'rent' {
            background-color: #1563c9;
          } @else {
            background-color: #e42726;
          }
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
