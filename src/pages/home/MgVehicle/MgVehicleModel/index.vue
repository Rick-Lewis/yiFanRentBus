<template>
  <div class="vehicle-model-container">
    <div class="filtrate-container">
      <div class="from-brand">
        <span>所属品牌：</span>
        <RadioGroup v-model="fromBrandCheck">
          <Radio v-for="(item, index) in fromBrandList" v-bind:key="index" v-bind:label="item.name"></Radio>
        </RadioGroup>
      </div>
      <div class="vehicle-type">
        <span>车辆类型：</span>
        <RadioGroup v-model="vehicleTypeCheck">
          <Radio
            v-for="(item, index) in vehicleTypeList"
            v-bind:key="index"
            v-bind:label="item.name"
          ></Radio>
        </RadioGroup>
      </div>
      <div class="vehicle-status">
        <span>车辆状态：</span>
        <RadioGroup v-model="vehicleStatusCheck">
          <Radio
            v-for="(item, index) in vehicleStatusList"
            v-bind:key="index"
            v-bind:label="item.name"
          ></Radio>
        </RadioGroup>
      </div>
      <Form :model="formItem" inline class="form-container">
        <FormItem>
          <span>车型名称：</span>
          <Input v-model="formItem.vehicleModelName" placeholder="请输入车型名称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <Button type="primary" style="margin-bottom: 10px;" @click="add">+新增</Button>
      <Table border :columns="vehicleModelColumns" :data="vehicleModelData" stripe>
        <template v-slot:brand_name="{ row }">
          <span>{{row.brand_name}}</span>
        </template>
        <template v-slot:vehicleNum="{ row }">
          <Progress :percent="row.vehicleNum" />
        </template>
        <template v-slot:state="{ row }">
          <Switch :value="row.state == '0' ? false : true" :disabled="true">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
        </template>
        <template v-slot:action="{ row, index }">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
          <Button type="primary" size="small" @click="show(index)">详情</Button>
        </template>
      </Table>
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
// import homeStore from '../../../../store/home/index';
export default {
  name: 'MgVehicleModel',
  data() {
    return {
      fromBrandCheck: '全部',
      fromBrandList: [],
      vehicleTypeCheck: '全部',
      vehicleTypeList: [],
      vehicleStatusCheck: '全部',
      vehicleStatusList: [
        { name: '全部', state: -1 },
        { name: '已关停', state: 0 },
        { name: '已开启', state: 1 }
      ],
      formItem: {
        vehicleModelName: ''
      },
      vehicleModelColumns: [
        {
          title: '所属品牌',
          slot: 'brand_name'
        },
        {
          title: '车辆类型',
          key: 'category_name'
        },
        {
          title: '车辆数',
          slot: 'vehicleNum'
        },
        {
          title: '今日价格',
          key: 'standard_price'
        },
        {
          title: '车辆状态',
          slot: 'state',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      vehicleModelData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      spinShow: true
    };
  },
  created() {
    console.log('MgVehicleModel index.vue created');
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicleCategory/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleCategory success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleTypeList.push(
            { id: -1, name: '全部' },
            ...res.data.data.data
          );
        } else {
          this.$Message.error({
            content: '车辆类型请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleCategory success',
          err
        );
        this.$Message.error({
          content: '车辆类型请求失败'
        });
      }
    );
    let p2 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicleBrand/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleBrand success',
          res
        );
        if (res.data.code === 0) {
          this.fromBrandList.push(
            { id: -1, name: '全部' },
            ...res.data.data.dataSource
          );
        } else {
          this.$Message.error({
            content: '品牌数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleBrand success',
          err
        );
        this.$Message.error({
          content: '品牌数据请求失败'
        });
      }
    );
    let p3 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicleModel/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleModel success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleModelData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleModel success',
          err
        );
        this.$Message.error({
          content: '车型数据请求失败'
        });
      }
    );
    Promise.all([p1, p2, p3])
      .then(res => {
        console.log(
          'MgVehicleModel Index.vue created Promise.all success',
          res
        );
        this.spinShow = false;
      })
      .catch(err => {
        console.log(
          'MgVehicleModel Index.vue created Promise.all failure',
          err
        );
        this.spinShow = false;
      });
  },
  methods: {
    handleSelected(e, type) {
      console.log('MgVehicleModel index.vue handleRadioChange', e, type);
      let indexTemp = -1;
      switch (type) {
        case 'brand':
          indexTemp = this.fromBrandList.findIndex(item => item.name === e);
          break;
        case 'type':
          indexTemp = this.vehicleTypeList.findIndex(item => item.name === e);
          break;
        case 'status':
          indexTemp = this.vehicleStatusList.findIndex(item => item.name === e);
          break;
      }
      return indexTemp;
    },
    // 查询
    handleSearch() {
      let brandId = this.fromBrandList[this.handleSelected(this.fromBrandCheck, 'brand')].id;
      let categoryId = this.vehicleTypeList[this.handleSelected(this.vehicleTypeCheck, 'type')].id;
      let state = this.vehicleStatusList[this.handleSelected(this.vehicleStatusCheck, 'status')].state;
      let strTemp = '';
      if (brandId !== -1) {
        strTemp = strTemp + '&brand_id=' + brandId;
      }
      if (categoryId !== -1) {
        strTemp = strTemp + '&category_id=' + categoryId;
      }
      if (state !== -1) {
        strTemp = strTemp + '&state=' + state;
      }
      console.log(
        'MgVehicleModel index.vue handleSearch',
        this.$data,
        brandId,
        categoryId,
        state,
        strTemp
      );
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicleModel/page?name=' +
          this.formItem.vehicleModelName +
          strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicleModel Index.vue created axios /vehicleModel success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '车型数据请求失败'
            });
          }
        },
        err => {
          console.log(
            'MgVehicleModel Index.vue created axios /vehicleModel success',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      );
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
      this.vehicleStatusCheck = '全部';
      this.vehicleTypeCheck = '全部';
      this.fromBrandCheck = '全部';
    },
    // 删除行
    remove(index) {
      this.$Modal.confirm({
        title: '确定删除整行？',
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/vehicleCategory/delete?ids=' +
              this.vehicleModelData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgVehicleModel Index.vue created axios /vehicleCategory/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.vehicleModelData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgVehicleModel Index.vue created axios /vehicleCategory/delete failure',
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
          console.log('MgVehicleModel index.vue confirm onCancel');
        }
      });
    },
    // 编辑行
    edit(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    },
    // 新增
    add() {
      this.$router.push('/home/modelAddition');
    },
    // 车型详情
    show(index) {
      this.$router.push('/home/modelDetail?id=' + this.vehicleModelData[index].id);
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MgVehicleModel Index.vue handlePageChange', e);
      this.currentPageSize = e;
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MgVehicleModel Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
    }
  }
};
</script>

<style lang='scss' scoped>
.vehicle-model-container {
  margin: 20px;
  min-height: 260px;
  position: relative;
  .filtrate-container {
    background-color: #fff;
    padding: 20px 20px 0 20px;
    .from-brand {
      padding: 10px 8px;
    }
    .vehicle-type {
      padding: 10px 8px;
    }
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
    .page-container {
      text-align: right;
      margin-top: 20px;
    }
  }
}
</style>
