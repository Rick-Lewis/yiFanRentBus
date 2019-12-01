<template>
  <div class="mg-store-container">
    <div class="filtrate-container">
      <Form :model="formItem" label-colon>
        <FormItem label="门店状态">
          <RadioGroup v-model="formItem.statusName">
            <Radio
              v-for="(item, index) in statusList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="门店名称">
            <Input v-model="formItem.name" placeholder="请输入门店名称" style="width: 200px;" />
          </FormItem>
          <FormItem style="margin-left: 15px;">
            <Button type="primary" @click="handleSearch">查询</Button>
            <Button style="margin-left: 8px" @click="handleReset">重置</Button>
          </FormItem>
        </div>
      </Form>
    </div>
    <div class="content-container">
      <Button type="primary" style="margin-bottom: 10px;" @click="add">+新增</Button>
      <Table border :columns="StoreColumns" :data="storeData" stripe>
        <template v-slot:duration="{ row }">
          <div>{{row.start_time + '-' + row.end_time}}</div>
        </template>
        <template v-slot:status="{ row }">
          <div :class="statusColor[row.status]">{{getStatusNameByValue(row.status)}}</div>
        </template>
        <template v-slot:action="{ row, index }">
          <Button v-if="row.status === 0" type="error" size="small" @click="remove(index)">删除</Button>
          <Button
            v-if="row.status === 0 || row.status === 2"
            type="error"
            size="small"
            @click="toggleStatus(index)"
          >上架</Button>
          <Button v-if="row.status === 1" type="error" size="small" @click="toggleStatus(index)">下架</Button>
          <Button type="primary" size="small" @click="edit(index)">编辑</Button>
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
            show-total
          />
        </template>
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
      statusList: [
        { name: '全部', status: -2 },
        { name: '未上架', status: 0 },
        { name: '运营', status: 1 },
        { name: '停运', status: 2 }
      ],
      formItem: {
        statusName: '全部',
        name: ''
      },
      StoreColumns: [
        {
          title: '门店名称',
          key: 'name'
        },
        {
          title: '门店地址',
          key: 'address'
        },
        {
          title: '门店电话',
          key: 'telephone',
          width: 190
        },
        {
          title: '营业时间',
          slot: 'duration'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width: 250,
          align: 'center'
        }
      ],
      storeData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      spinShow: true,
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
      url:
        this.global_.path.baseUrl +
        '/rentalcars/store/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log('MgStore Index.vue created axios /store/list success', res);
        if (res.data.code === 0) {
          this.storeData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '门店数据请求失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log('MgStore Index.vue created axios /store/list failure', err);
        this.$Message.error({
          content: '门店数据请求失败'
        });
        this.spinShow = false;
      }
    );
  },
  methods: {
    // 上下架
    toggleStatus(index) {
      this.spinShow = true;
      let urlTemp = '';
      if (this.storeData[index].status === 1) {
        urlTemp =
          this.global_.path.baseUrl +
          '/rentalcars/store/off?ids=' +
          this.storeData[index].id;
      } else {
        urlTemp =
          this.global_.path.baseUrl +
          '/rentalcars/store/on?ids=' +
          this.storeData[index].id;
      }
      this.axios({
        url: urlTemp,
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log('MgStore Index.vue created axios /store/{} success', res);
          if (res.data.code === 0) {
            this.$Message.info('操作成功');
            this.storeData[index].status =
              this.storeData[index].status !== 1 ? 1 : 2;
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log('MgAd Index.vue created axios /store/{} failure', err);
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 删除行
    remove(index) {
      console.log('MgStore index.vue remove', index);
      this.$Modal.confirm({
        title: `确定删除${this.storeData[index].name}门店吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/store/delete?ids=' +
              this.storeData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgStore Index.vue created axios /store/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.storeData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgStore Index.vue created axios /store/delete failure',
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
          console.log('MgStore index.vue confirm onCancel');
        }
      });
    },
    // 重置
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
      this.formItem.statusName = '全部';
    },
    getStatusNameByValue(status) {
      console.log(
        'MgStore index.vue getStatusNameByValue',
        status,
        this.statusList.slice()
      );

      let objTemp = this.statusList
        .slice()
        .find(item => item.status === status);
      let result = objTemp.name;
      return result;
    },
    // 新增
    add() {
      this.$router.push('/home/storeAddition?action=add');
    },
    // 编辑
    edit(index) {
      this.$router.push('/home/storeAddition?action=edit&id=' + this.storeData[index].id);
    },
    // 车型详情
    show(index) {
      this.$router.push('/home/storeDetail?id=' + this.storeData[index].id);
    },
    handleSelected(e, type) {
      console.log('MgStore index.vue handleRadioChange', e, type);
      let indexTemp = -1;
      switch (type) {
        case 'status':
          indexTemp = this.statusList.findIndex(item => item.name === e);
          break;
      }
      return indexTemp;
    },
    // 查询
    handleSearch() {
      let indexTemp = this.handleSelected(this.formItem.statusName, 'status');
      let statusTemp = this.statusList[indexTemp].status;
      let strTemp = '';
      if (this.formItem.name) {
        strTemp = strTemp + '&name=' + this.formItem.name;
      }
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/store/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgStore Index.vue created axios /store/page success',
            res
          );
          if (res.data.code === 0) {
            this.storeData.length = 0;
            this.storeData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '门店数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgStore Index.vue created axios /store/page failure',
            err
          );
          this.$Message.error({
            content: '门店数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MgStore Index.vue handlePageChange', e);
      this.currentPage = e;
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/store/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgStore Index.vue created axios /store/page success',
            res
          );
          if (res.data.code === 0) {
            this.storeData.length = 0;
            this.storeData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '门店数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgStore Index.vue created axios /store/page failure',
            err
          );
          this.$Message.error({
            content: '门店数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MgStore Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/store/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgStore Index.vue created axios /store/page success',
            res
          );
          if (res.data.code === 0) {
            this.storeData.length = 0;
            this.storeData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '门店数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgStore Index.vue created axios /store/page failure',
            err
          );
          this.$Message.error({
            content: '门店数据请求失败'
          });
          this.spinShow = false;
        }
      );
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
