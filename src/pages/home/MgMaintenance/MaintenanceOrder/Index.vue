<template>
  <div class="maintenance-order-container">
    <div class="filtrate-container">
      <Form :model="formItem" label-colon>
        <FormItem label="工单类型">
          <RadioGroup v-model="formItem.type">
            <Radio
              v-for="(item, index) in typeList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="工单编号">
            <Input
              v-model="formItem.order_no"
              placeholder="请输入工单编号"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="车牌号">
            <Input
              v-model="formItem.plate_num"
              placeholder="请输入车牌号"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="填单人">
            <Input
              v-model="formItem.key"
              placeholder="请输入填单人"
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
      <Table border :columns="mOrderColumns" :data="mOrderData" stripe>
        <template v-slot:state="{ row }">
          <div :class="statusColor[row.state]">
            {{ getStatusNameByValue(row.state) }}
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="edit(index)"
            >编辑</Button
          >
          <Button type="error" size="small" @click="remove(index)">删除</Button>
          <Button type="primary" size="small" @click="check(index)"
            >验收</Button
          >
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
  name: '',
  data: function() {
    return {
      formItem: {
        type_check: '全部',
        order_no: '',
        plate_num: '',
        key: ''
      },
      mOrderColumns: [
        {
          title: '工单编号',
          width: 180,
          key: 'vin'
        },
        {
          title: '工单类型',
          key: 'engine_no'
        },
        {
          title: '车牌号',
          key: 'plate_num'
        },

        {
          title: '填单时间',
          key: 'color'
        },
        {
          title: '填单人',
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
      mOrderData: [],
      spinShow: true,
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      statusColor: {
        '-1': 'invalid',
        '0': 'storage',
        '1': 'ready',
        '2': 'reserve',
        '3': 'rent',
        '4': 'maintenance'
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    getStatusNameByValue(status) {
      console.log(
        'MaintenanceOrder index.vue getStatusNameByValue',
        status,
        this.vehicleStatusList.slice()
      );
      let objTemp = this.vehicleStatusList
        .slice()
        .find(item => item.status === status);
      return objTemp.name;
    },
    // 检查
    check(index) {
      let temp = {
        plate_nums: this.mOrderData[index].plate_num,
        state: this.mOrderData[index].state + 1
      };
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/detail/status',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(temp)
      }).then(
        res => {
          console.log(
            'MaintenanceOrder Index.vue created axios /vehilce/detail/status success',
            res
          );
          if (res.data.code === 0) {
            this.mOrderData[index].state = this.mOrderData[index].state + 1;
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
            'MaintenanceOrder Index.vue created axios /vehilce/detail/status failure',
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
        title: `确定删除${this.mOrderData[index].plate_num}车辆吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/vehicle/detail/delete?ids=' +
              this.mOrderData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MaintenanceOrder Index.vue created axios /vehicle/detail/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.mOrderData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MaintenanceOrder Index.vue created axios /vehicle/detail/delete failure',
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
          console.log('MaintenanceOrder index.vue confirm onCancel');
        }
      });
    },
    // 详情
    show(index) {
      this.$router.push('/home/vehicleDetail?id=' + this.mOrderData[index].id);
    },
    // 编辑
    edit(index) {
      this.$router.push(
        '/home/vehicleAddition?action=edit&id=' + this.mOrderData[index].id
      );
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MaintenanceOrder Index.vue handlePageChange', e);
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
            'MaintenanceOrder Index.vue created axios /vehicleDetail success',
            res
          );
          if (res.data.code === 0) {
            this.mOrderData.length = 0;
            this.mOrderData.push(...res.data.data.data);
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
            'MaintenanceOrder Index.vue created axios /vehicleDetail success',
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
      console.log('MaintenanceOrder Index.vue handlePageSizeChange', e);
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
            'MaintenanceOrder Index.vue created axios /vehicleDetail success',
            res
          );
          if (res.data.code === 0) {
            this.mOrderData.length = 0;
            this.mOrderData.push(...res.data.data.data);
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
            'MaintenanceOrder Index.vue created axios /vehicleDetail success',
            err
          );
          this.$Message.error({
            content: '车辆数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 新增
    add() {
      this.$router.push('/home/mOrderAddition?action=add');
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
      this.formItem.type_check = '全部';
    },
    // 查询
    handleSearch() {
      let indexTemp = this.handleSelected(
        this.formItem.order_status_check,
        'status'
      );
      let statusTemp = this.orderStatusList[indexTemp].status;
      indexTemp = this.handleSelected(
        this.formItem.driver_existence_check,
        'with_driver'
      );
      let withDriverTemp = this.driverExistenceList[indexTemp].value;
      let strTemp = '';
      if (this.formItem.order_no) {
        strTemp = strTemp + '&order_no=' + this.formItem.order_no;
      }
      if (this.formItem.plate_num) {
        strTemp = strTemp + '&plate_num=' + this.formItem.plate_num;
      }
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      if (withDriverTemp !== -2) {
        strTemp = strTemp + '&with_driver=' + withDriverTemp;
      }
      if (this.duration) {
        strTemp =
          strTemp +
          '&time_start=' +
          this.duration.timeStart +
          '&time_end=' +
          this.duration.timeEnd;
      }
      if (this.formItem.key) {
        strTemp = strTemp + '&telephone=' + this.formItem.key;
      }
      if (strTemp) {
        strTemp = '?' + strTemp.substr(1);
      }
      console.log('MaintenanceOrder index.vue handleSearch');
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl + '/rentalcars/order/rental/page' + strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MaintenanceOrder Index.vue created axios /order/rental success',
            res
          );
          if (res.data.code === 0) {
            this.orderData.length = 0;
            this.orderData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MaintenanceOrder Index.vue created axios /order/rental failure',
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
