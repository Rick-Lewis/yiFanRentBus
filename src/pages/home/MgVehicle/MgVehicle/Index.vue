<template>
  <div class="vehicle-container">
    <div class="filtrate-container">
      <Form :model="formItem" label-colon @submit.native.prevent>
        <FormItem label="车辆状态" class="vehicle-status">
          <!-- <span>车辆状态：</span> -->
          <RadioGroup v-model="formItem.vehicle_status_check" @on-change="handleSearch">
            <Radio
              v-for="(item, index) in vehicleStatusList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="车牌号">
            <!-- <span>车牌号：</span> -->
            <Input v-model="formItem.plate_num" placeholder="请输入车牌号" style="width: 200px" />
          </FormItem>
          <FormItem label="品牌名称">
            <!-- <span>车辆识别代码：</span> -->
            <Input
              v-model="formItem.brand_name"
              @on-enter="handleSearch"
              placeholder="请输入品牌名称"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="车型名称">
            <!-- <span>发动机号：</span> -->
            <Input
              v-model="formItem.model_name"
              @on-enter="handleSearch"
              placeholder="请输入车型名称"
              style="width: 200px"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSearch">查询</Button>
            <Button style="margin-left: 8px" @click="handleReset">重置</Button>
          </FormItem>
        </div>
      </Form>
    </div>
    <div class="content-container">
      <div class="btn-container">
        <Button type="primary" @click="add">+新增</Button>
      </div>
      <Table border :columns="vehicleColumns" :data="vehicleData" stripe>
        <template v-slot:state="{ row }">
          <div :class="statusColor[row.state]">{{getStatusNameByValue(row.state).name}}</div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a style="margin-right: 5px" @click="edit(index)">编辑</a>
          <a @click="remove(index)">删除</a>
          <a @click="check(index)">{{getStatusNameByValue(row.state).nextName}}</a>
          <a @click="show(index)">详情</a>
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
            show-total
          />
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyVehicle',
  data: function() {
    return {
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
        vehicle_status_check: '全部',
        plate_num: '',
        brand_name: '',
        model_name: ''
      },
      vehicleColumns: [
        {
          title: '车牌号',
          key: 'plate_num',
          align: 'center'
        },
        // {
        //   title: '车辆识别代码',
        //   width: 180,
        //   key: 'vin',
        //   align: 'center'
        // },
        // {
        //   title: '发动机号',
        //   key: 'engine_no',
        //   align: 'center'
        // },
        {
          title: '颜色',
          key: 'color',
          align: 'center'
        },
        {
          title: '品牌',
          key: 'brand_name',
          align: 'center'
        },
        {
          title: '车型',
          key: 'model_name',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'state',
          width: 100,
          align: 'center'
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
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
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
        this.vehicleStatusList.push({ name: '全部', status: -2 }, ...res.data);
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
        this.currentPageSize +
        '&sortField=createTime&sortOrder=desc',
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
            content: res.data.message
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
    let that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        that.handleSearch();
      }
    };
  },
  computed: {},
  methods: {
    getStatusNameByValue(status) {
      console.log(
        'MgVehicleModel index.vue getStatusNameByValue',
        status,
        this.vehicleStatusList.slice()
      );
      let indexTemp = this.vehicleStatusList
        .slice()
        .findIndex(item => item.status === status);
      return {
        name: indexTemp === -1 ? '' : this.vehicleStatusList[indexTemp].name,
        nextName: indexTemp === -1 ? '' : this.vehicleStatusList[indexTemp + 1].name
      };
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
      let indexTemp = this.handleSelected(
        this.formItem.vehicle_status_check,
        'status'
      );
      let statusTemp = this.vehicleStatusList[indexTemp].status;
      let strTemp = '';
      if (this.formItem.plate_num) {
        strTemp = strTemp + '&plate_num=' + this.formItem.plate_num;
      }
      if (this.formItem.brand_name) {
        strTemp = strTemp + '&brand_name=' + this.formItem.brand_name;
      }
      if (this.formItem.model_name) {
        strTemp = strTemp + '&model_name=' + this.formItem.model_name;
      }
      if (statusTemp !== -2) {
        strTemp = strTemp + '&state=' + statusTemp;
      }
      console.log('MgVehicle index.vue handleSearch');
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/detail/page' +
          '?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          strTemp +
          '&sortField=createTime&sortOrder=desc',
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
              content: res.data.message
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
      this.formItem.vehicle_status_check = '全部';
    },
    // 编辑
    edit(index) {
      this.$router.push(
        '/home/vehicleAddition?action=edit&id=' + this.vehicleData[index].id
      );
    },
    // 检查
    check(index) {
      let temp = {
        plate_nums: this.vehicleData[index].plate_num,
        state: this.vehicleData[index].state + 1
      };
      // let temp =
      //   'plate_nums=' +
      //   this.vehicleData[index].plate_num +
      //   '&status=' +
      //   this.vehicleData[index].state +
      //   1;
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/detail/status',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(temp)
      }).then(
        res => {
          console.log(
            'MgVehicle Index.vue created axios /vehilce/detail/status success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleData[index].state = this.vehicleData[index].state + 1;
            this.$Message.success({
              content: res.data.message
            });
            // this.$router.back();
          } else {
            this.$Message.error({
              content: res.data.message
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
        title: `确定删除${this.vehicleData[index].plate_num}车辆吗？`,
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
                this.$Message.success(res.data.message);
                this.vehicleData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: res.data.message
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
          this.currentPageSize +
          '&sortField=createTime&sortOrder=desc',
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
              content: res.data.message
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
          this.currentPageSize +
          '&sortField=createTime&sortOrder=desc',
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
              content: res.data.message
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
@import './Index.scss';
</style>
