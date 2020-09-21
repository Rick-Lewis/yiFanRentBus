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
    <Modal
      v-model="checkModalShow"
      title="检查"
      ok-text="提交"
      cancel-text="取消"
      @on-ok="handleOk">
      <Form :model="checkForm" label-colon @submit.native.prevent>
        <FormItem label="检查结果">
          <RadioGroup v-model="checkForm.result">
            <Radio
              v-for="(item, index) in checkList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="检查意见">
          <i-input v-model="checkForm.opinion" type="textarea" :rows="4" placeholder="请输入检查意见"></i-input>
        </FormItem>
        <FormItem label="操作人">
          <div>{{checkForm.operator}}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'MyVehicle',
  data: function() {
    return {
      currentIndex: -1, // 当前操作的数据的索引
      checkModalShow: false,
      checkList: [{
        name: '合格',
        status: '1'
      },
      {
        name: '进行维保',
        status: '4'
      },
      {
        name: '退役',
        status: '-1'
      }],
      checkForm: {
        result: '合格',
        opinion: '',
        operator: window.localStorage.getItem('username')
      },
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
    handleOk() {
      let tempItem = this.checkList.find(item => item.name === this.checkForm.result);
      let temp = {
        plate_nums: this.vehicleData[this.currentIndex].plate_num,
        state: tempItem.status
      };
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
            this.vehicleData[this.currentIndex].state = tempItem.status;
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
    getStatusNameByValue(status) {
      console.log(
        'MgVehicleModel index.vue getStatusNameByValue',
        status,
        this.vehicleStatusList.slice()
      );
      let result = {
        status: status,
        name: '',
        nextStatus: '',
        nextName: ''
      };
      let indexTemp = this.vehicleStatusList
        .slice()
        .findIndex(item => item.status === parseInt(status));
      result.name = indexTemp !== -1 ? '已' + this.vehicleStatusList[indexTemp].name : '';
      switch (parseInt(status)) {
        case 0:
          result.nextStatus = -10;
          indexTemp = this.vehicleStatusList
            .slice()
            .findIndex(item => item.status === result.nextStatus);
          result.nextName = indexTemp !== -1 ? this.vehicleStatusList[indexTemp].name : '检查';
          break;
        case 1:
          result.nextStatus = 3;
          indexTemp = this.vehicleStatusList
            .slice()
            .findIndex(item => item.status === result.nextStatus);
          result.nextName = indexTemp !== -1 ? this.vehicleStatusList[indexTemp].name : '';
          break;
        case 2:
          break;
        case 3: break;
        case 4:
          result.name = indexTemp !== -1 ? this.vehicleStatusList[indexTemp].name + '中' : '';
          result.nextStatus = 0;
          indexTemp = this.vehicleStatusList
            .slice()
            .findIndex(item => item.status === result.nextStatus);
          result.nextName = indexTemp !== -1 ? this.vehicleStatusList[indexTemp].name : '';
          break;
      }
      return result;
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
      this.currentIndex = index;
      if (this.vehicleData[index].state === 0) { // 入库状态
        this.checkModalShow = true;
        return;
      }
      if (this.vehicleData[index].state === 4) { // 维保状态
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定维保是否已经完成，维保完成车辆可进入"入库"状态',
          onOk: () => {
            let temp = {
              plate_nums: this.vehicleData[index].plate_num,
              state: this.getStatusNameByValue(this.vehicleData[index].state).nextStatus
            };
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
                  this.vehicleData[index].state = this.getStatusNameByValue(this.vehicleData[index].state).nextStatus;
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
          }
        });
        return;
      }
      let temp = {
        plate_nums: this.vehicleData[index].plate_num,
        state: this.getStatusNameByValue(this.vehicleData[index].state).nextStatus
      };
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
            this.vehicleData[index].state = this.getStatusNameByValue(this.vehicleData[index].state).nextStatus;
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
      this.currentIndex = index;
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
      this.currentIndex = index;
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
      this.currentPage = e;
      let config = {
        pageIndex: this.currentPage,
        pageSize: this.currentPageSize,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/detail/page',
        method: 'get',
        params: config,
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
      let config = {
        pageIndex: this.currentPage,
        pageSize: this.currentPageSize,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/detail/page',
        method: 'get',
        params: config,
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
