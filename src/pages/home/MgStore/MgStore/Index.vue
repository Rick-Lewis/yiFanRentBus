<template>
  <div class="mg-store-container">
    <div class="filtrate-container">
      <Form :model="formItem" label-colon @submit.native.prevent>
        <FormItem label="门店状态">
          <RadioGroup v-model="formItem.statusName" @on-change="handleSearch">
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
      <!-- <Button type="primary" style="margin-bottom: 10px;" @click="relateTo">关联车型</Button> -->
      <Table ref="selection" border :columns="storeColumns" :data="storeData">
        <template v-slot:duration="{ row }">
          <div>{{row.start_time + '-' + row.end_time}}</div>
        </template>
        <template v-slot:status="{ row }">
          <div :class="statusColor[row.status]">{{getStatusNameByValue(row.status)}}</div>
        </template>
        <template v-slot:action="{ row, index }">
          <a v-if="row.status === 0" @click="remove(index)">删除</a>
          <a v-if="row.status === 0 || row.status === 2" @click="toggleStatus(index)">上架</a>
          <a v-if="row.status === 1" @click="toggleStatus(index)">下架</a>
          <a @click="edit(index)">编辑</a>
          <a @click="show(index)">详情</a>
          <a @click="relateTo(index)">关联车型</a>
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
// import storeStore from '@/store/home/MgStore/index';
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
      storeColumns: [
        {
          title: '门店名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '门店地址',
          key: 'address',
          align: 'center'
        },
        {
          title: '门店电话',
          key: 'telephone',
          width: 190,
          align: 'center'
        },
        {
          title: '营业时间',
          slot: 'duration',
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
          width: 250,
          align: 'center'
        }
      ],
      storeData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 500, // 当前每页条数
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
    // this.$store.registerModule('storeStore', storeStore);
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/store/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize +
        '&sortField=create_time&sortOrder=desc',
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
    let that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        that.handleSearch();
      }
    };
  },
  methods: {
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    // 上下架
    toggleStatus(index) {
      let tempText = '';
      let urlTemp = '';
      if (this.storeData[index].status === 1) {
        urlTemp =
          this.global_.path.baseUrl +
          '/rentalcars/store/off?ids=' +
          this.storeData[index].id;
        tempText = '下架';
      } else {
        urlTemp =
          this.global_.path.baseUrl +
          '/rentalcars/store/on?ids=' +
          this.storeData[index].id;
        tempText = '上架';
      }
      this.$Modal.confirm({
        title: `确定${tempText + this.storeData[index].name}门店吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;

          this.axios({
            url: urlTemp,
            method: 'post',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgStore Index.vue created axios /store/{} success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success('操作成功');
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
              console.log(
                'MgAd Index.vue created axios /store/{} failure',
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
                this.$Message.success('操作成功');
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
    relateTo(index) {
      this.$router.push(
        '/home/modelAssociated?store_id=' + this.storeData[index].id
      );
    },
    // 编辑
    edit(index) {
      this.$router.push(
        '/home/storeAddition?action=edit&id=' + this.storeData[index].id
      );
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
          strTemp +
          '&sortField=create_time&sortOrder=desc',
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
