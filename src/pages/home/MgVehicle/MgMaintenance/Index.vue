<template>
  <div class="mg-maintenance-container">
    <div class="filtrate-container">
      <Form :model="formItem" label-colon @submit.native.prevent>
        <FormItem label="工单类型">
          <RadioGroup v-model="formItem.service_name" @on-change="handleSearch">
            <Radio
              v-for="(item, index) in serviceList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="工单状态">
          <RadioGroup v-model="formItem.status_check" @on-change="handleSearch">
            <Radio
              v-for="(item, index) in statusList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="工单编号">
            <Input v-model="formItem.serialno" placeholder="请输入工单编号" style="width: 200px" />
          </FormItem>
          <FormItem label="车牌号">
            <Input
              v-model="formItem.plate_num"
              @on-enter="handleSearch"
              placeholder="请输入车牌号"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="填单人">
            <Input
              v-model="formItem.key"
              @on-enter="handleSearch"
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
        <template v-slot:service="{ row }">
          <div>{{getServiceNameById(row.service_id)}}</div>
        </template>
        <template v-slot:status="{ row }">
          <div :class="statusColor[row.status]">{{ getStatusNameByValue(row.status) }}</div>
        </template>
        <template v-slot:duration="{ row }">
          <div>{{ row.time_start + '-' + row.time_end }}</div>
        </template>
        <template v-slot:action="{ row, index }">
          <a style="margin-right: 5px" @click="edit(index)">编辑</a>
          <a @click="remove(index)">删除</a>
          <!-- <Button v-if="row.status === 1" type="primary" size="small" @click="check(index)"
            >验收</Button
          >-->
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
  name: 'MgMaintenance',
  data: function() {
    return {
      statusList: [
        { name: '全部', value: -2 },
        { name: '准备中', value: 0 },
        { name: '进行中', value: 1 },
        { name: '已完成', value: 2 }
      ],
      serviceList: [],
      formItem: {
        service_name: '全部',
        status_check: '全部',
        serialno: '',
        plate_num: '',
        key: ''
      },
      mOrderColumns: [
        {
          title: '工单编号',
          width: 200,
          key: 'serialno',
          align: 'center'
        },
        {
          title: '工单类型',
          slot: 'service',
          align: 'center'
        },
        {
          title: '车牌号',
          key: 'plate_num',
          align: 'center'
        },

        {
          title: '填单时间',
          width: 310,
          slot: 'duration',
          align: 'center'
        },
        {
          title: '填单人',
          key: 'operator_name',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
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
        '2': 'storage',
        '3': 'rent',
        '4': 'maintenance'
      }
    };
  },
  created() {
    this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/service/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgMaintenance Index.vue created axios /service/page success',
          res
        );
        if (res.data.code === 0) {
          this.serviceList.push(
            { name: '全部', id: -2 },
            ...res.data.data.data
          );
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/ticket/page?pageIndex=' +
              this.currentPage +
              '&pageSize=' +
              this.currentPageSize +
              '&sortField=create_time&sortOrder=desc',
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgMaintenance Index.vue created axios /ticket success',
                res
              );
              if (res.data.code === 0) {
                this.mOrderData.push(...res.data.data.data);
                this.total = res.data.data.total;
              } else {
                this.$Message.error({
                  content: '维保数据请求失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgMaintenance Index.vue created axios /ticket/page success',
                err
              );
              this.$Message.error({
                content: '维保数据请求失败'
              });
              this.spinShow = false;
            }
          );
        } else {
          this.$Message.error({
            content: '服务类型数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgMaintenance Index.vue created axios /service/page failure',
          err
        );
        this.$Message.error({
          content: '服务类型数据请求失败'
        });
      }
    );
    let that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        that.handleSearch();
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {
    getServiceNameById(id) {
      let objTemp = this.serviceList.slice().find(item => item.id === id);
      return objTemp.name;
    },
    getStatusNameByValue(status) {
      console.log(
        'MaintenanceOrder index.vue getStatusNameByValue',
        status,
        this.statusList.slice()
      );
      let objTemp = this.statusList.slice().find(item => item.value === status);
      return objTemp.name;
    },
    // 检查
    // check(index) {
    //   let temp = {
    //     id: this.mOrderData[index].id,
    //     status: this.mOrderData[index].status + 1
    //   };
    //   this.axios({
    //     method: 'post',
    //     url: this.global_.path.baseUrl + '/rentalcars/ticket/check',
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //     data: this.$qs.stringify(temp)
    //   }).then(
    //     res => {
    //       console.log(
    //         'MaintenanceOrder Index.vue created axios /ticket/check success',
    //         res
    //       );
    //       if (res.data.code === 0) {
    //         this.mOrderData[index].status = this.mOrderData[index].status + 1;
    //         this.$Message.success({
    //           content: '操作成功'
    //         });
    //         // this.$router.back();
    //       } else {
    //         this.$Message.error({
    //           content: '操作失败'
    //         });
    //       }
    //     },
    //     err => {
    //       console.log(
    //         'MaintenanceOrder Index.vue created axios /ticket/status failure',
    //         err
    //       );
    //       this.$Message.error({
    //         content: '操作失败'
    //       });
    //     }
    //   );
    // },
    // 删除
    remove(index) {
      this.$Modal.confirm({
        title: `确定删除${this.mOrderData[index].serialno}工单吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/ticket/delete?ids=' +
              this.mOrderData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MaintenanceOrder Index.vue created axios /ticket/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success('操作成功');
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
                'MaintenanceOrder Index.vue created axios /ticket/delete failure',
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
      this.$router.push(
        '/home/maintenanceDetail?id=' + this.mOrderData[index].id
      );
    },
    // 编辑
    edit(index) {
      this.$router.push(
        '/home/maintenanceAddition?action=edit&id=' + this.mOrderData[index].id
      );
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MaintenanceOrder Index.vue handlePageChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/ticket/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          '&sortField=create_time&sortOrder=desc',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MaintenanceOrder Index.vue created axios /ticket/page success',
            res
          );
          if (res.data.code === 0) {
            this.mOrderData.length = 0;
            this.mOrderData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '工单数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MaintenanceOrder Index.vue created axios /ticket/page success',
            err
          );
          this.$Message.error({
            content: '工单数据请求失败'
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
          '/rentalcars/ticket/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          '&sortField=create_time&sortOrder=desc',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MaintenanceOrder Index.vue created axios /ticket/page success',
            res
          );
          if (res.data.code === 0) {
            this.mOrderData.length = 0;
            this.mOrderData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '工单数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MaintenanceOrder Index.vue created axios /ticket/page success',
            err
          );
          this.$Message.error({
            content: '工单数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 新增
    add() {
      this.$router.push('/home/maintenanceAddition?action=add');
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
      this.formItem.service_name = '全部';
    },
    // 查询
    handleSearch() {
      let indexTemp = this.serviceList.findIndex(
        item => item.name === this.formItem.service_name
      );
      let indexTemp1 = this.statusList.findIndex(
        item => item.name === this.formItem.status_check
      );
      let strTemp = '';
      if (this.serviceList[indexTemp].id !== -2) {
        strTemp = strTemp + '&service_id=' + this.serviceList[indexTemp].id;
      }
      if (this.statusList[indexTemp1].value !== -2) {
        strTemp = strTemp + '&status=' + this.statusList[indexTemp1].value;
      }
      if (this.formItem.serialno) {
        strTemp = strTemp + '&serialno=' + this.formItem.serialno;
      }
      if (this.formItem.plate_num) {
        strTemp = strTemp + '&plate_num=' + this.formItem.plate_num;
      }
      if (this.formItem.key) {
        strTemp = strTemp + '&operator_name=' + this.formItem.key;
      }
      strTemp =
        strTemp +
        '&pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize +
        '&sortField=create_time&sortOrder=desc';
      if (strTemp) {
        strTemp = '?' + strTemp.substr(1);
      }
      console.log('MaintenanceOrder index.vue handleSearch', strTemp);
      this.spinShow = true;
      this.axios({
        url: this.global_.path.baseUrl + '/rentalcars/ticket/page' + strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MaintenanceOrder Index.vue created axios /ticket success',
            res
          );
          if (res.data.code === 0) {
            this.mOrderData.length = 0;
            this.mOrderData.push(...res.data.data.data);
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
            'MaintenanceOrder Index.vue created axios /ticket failure',
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
