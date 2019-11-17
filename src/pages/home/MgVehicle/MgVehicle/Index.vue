<template>
  <div class="vehicle-container">
    <div class="filtrate-container">
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
          <span>车牌号：</span>
          <Input v-model="formItem.plate_num" placeholder="请输入车牌号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>车辆识别代码：</span>
          <Input v-model="formItem.vin" placeholder="请输入车辆识别代码" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>发动机号：</span>
          <Input v-model="formItem.engine_no" placeholder="请输入发动机号" style="width: 200px" />
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
          <div :class="statusColor[row.state]">{{getStatusNameByValue(row.state)}}</div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
          <Button
            type="primary"
            size="small"
            @click="check(index)"
          >{{getStatusNameByValue(row.state + 1)}}</Button>
          <Button type="primary" size="small" @click="show(index)">详情</Button>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden;">
        <div style="float: right;">
          <Page
            :total="total"
            size="small"
            show-elevator
            show-sizer
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"
          />
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
      vehicleStatusList: [],
      statusColor: {
        '-1': 'invalid',
        '0': 'storage',
        '1': 'ready',
        '2': 'reserve',
        '3': 'rent',
        '4': 'maintenance'
      },
      formItem: {
        plate_num: '',
        vin: '',
        engine_no: ''
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
          width: 180,
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
          key: 'model_name'
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
      spinShow: true,
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10 // 当前每页条数
    };
  },
  created() {
    console.log('MgVehicle Index.vue created');
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/status/vehicle',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicle Index.vue created axios /status/vehicle success',
          res
        );
        // if (res.data.code === 0) {
        // let obj = [];
        // let temp = JSON.stringify(res.data);
        this.vehicleStatusList.push({ name: '全部', status: -2 }, ...res.data);
        // } else {
        //   this.$Message.error({
        //     content: '车辆状态数据请求失败'
        //   });
        // }
      },
      err => {
        console.log(
          'MgVehicle Index.vue created axios /status/vehicle failure',
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
        '/rentalcars/vehicle/detail/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
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
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '车辆数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicle Index.vue created axios /vehicleDetail success',
          err
        );
        this.$Message.error({
          content: '车辆数据请求失败'
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
  },
  computed: {},
  methods: {
    getStatusNameByValue(status) {
      console.log(
        'MgVehicleModel index.vue getStatusNameByValue',
        status,
        this.vehicleStatusList.slice()
      );
      let objTemp = this.vehicleStatusList
        .slice()
        .find(item => item.status === status);
      return objTemp.name;
    },
    handleSelected(e, type) {
      console.log('MgVehicleModel index.vue handleRadioChange', e, type);
      let indexTemp = -1;
      switch (type) {
        case 'status':
          indexTemp = this.vehicleStatusList.findIndex(item => item.name === e);
          break;
      }
      return indexTemp;
    },
    // 查询
    handleSearch() {
      let indexTemp = this.handleSelected(this.vehicleStatusCheck, 'status');
      let statusTemp = this.vehicleStatusList[indexTemp].status;
      let strTemp =
        '?plate_num=' +
        this.formItem.plate_num +
        '&vin=' +
        this.formItem.vin +
        '&engine_no=' +
        this.formItem.engine_no;
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      console.log('MgVehicle index.vue handleSearch');
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/detail/page' +
          strTemp +
          'pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicle Index.vue created axios /vehicleDetail success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleData.length = 0;
            this.vehicleData.push(...res.data.data.data);
          } else {
            this.$Message.error({
              content: '操作失败'
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
      this.vehicleStatusCheck = '全部';
    },
    // 编辑
    edit(index) {
      this.$router.push(
        '/home/vehicleAddition?action=edit&id=' + this.vehicleData[index].id
      );
    },
    // 编辑
    check(index) {
      // let temp = {
      //   plate_nums: this.vehicleData[index].plate_num,
      //   state: this.vehicleData[index].state + 1
      // };
      let temp =
        'plate_nums=' +
        this.vehicleData[index].plate_num +
        '&status=' +
        this.vehicleData[index].state +
        1;
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/detail/status',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: temp
      }).then(
        res => {
          console.log(
            'MgVehicle Index.vue created axios /vehilce/detail/status success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleData[index].state = this.vehicleData[index].state + 1;
            this.$Message.success({
              content: '操作成功'
            });
            // this.$router.back();
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
        },
        err => {
          console.log(
            'MgVehicle Index.vue created axios /vehilce/detail/status failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
        }
      );
    },
    // 删除
    remove(index) {
      this.$Modal.confirm({
        title: '确定删除整行？',
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/vehicle/detail/delete?ids=' +
              this.vehicleData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgVehicle Index.vue created axios /vehicle/detail/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.vehicleData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgVehicle Index.vue created axios /vehicle/detail/delete failure',
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
    },
    // 详情
    show(index) {
      this.$router.push('/home/vehicleDetail?id=' + this.vehicleData[index].id);
    },
    // 翻页
    changePage() {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      console.log('MyVehicle Index.vue methods changePage');
    },
    // 新增
    add() {
      this.$router.push('/home/vehicleAddition?action=add');
    },
    // 维保
    maintain() {
      this.$router.push('/home/modelAddition');
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MyVehicle Index.vue handlePageChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/detail/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicle Index.vue created axios /vehicleDetail success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleData.length = 0;
            this.vehicleData.push(...res.data.data.data);
            this.total = res.data.data.total;
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
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MyVehicle Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/detail/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicle Index.vue created axios /vehicleDetail success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleData.length = 0;
            this.vehicleData.push(...res.data.data.data);
            this.total = res.data.data.total;
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
