<template>
  <div class="ad-container">
    <div class="filtrate-container">
      <Form :model="formItem" @submit.native.prevent label-colon>
        <FormItem label="状态">
          <RadioGroup v-model="formItem.statusName" @on-change="handleSearch">
            <Radio
              v-for="(item, index) in statusList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="类型">
          <RadioGroup v-model="formItem.typeName" @on-change="handleSearch">
            <Radio
              v-for="(item, index) in typeList"
              v-bind:key="index"
              v-bind:label="item.name"
              border
            ></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="标题">
            <Input v-model="formItem.title" placeholder="请输入标题" style="width: 200px;" />
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
      <Table border :columns="adColumns" :data="adData" stripe>
        <template v-slot:pic="{ row, index }">
          <div class="image-container" @click="handlePicPreview(row)">
            <img :src="global_.path.baseUrl + row.pic" />
          </div>
        </template>
        <template v-slot:url="{ row }">
          <a :href="row.url" target="_blank">{{row.url}}</a>
        </template>
        <template v-slot:type="{ row }">
          <div>{{getTypeNameByValue(row.type)}}</div>
        </template>
        <template v-slot:status="{ row }">
          <div :class="statusColor[row.status]">{{getStatusNameByValue(row.status, 'status')}}</div>
        </template>
        <template v-slot:action="{ row, index }">
          <a
            style="margin-right: 5px"
            @click="toggleStatus(index)"
          >{{getStatusNameByValue(row.status, 'action')}}</a>
          <a v-if="row.status === 0" @click="remove(index)">删除</a>
          <a @click="edit(index)">编辑</a>
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
      <Modal v-model="picDetail.modal" title="图片预览">
        <p>
          <img :src="picDetail.src" style="width: 100%;" />
        </p>
      </Modal>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MgAd',
  data: function() {
    return {
      formItem: {
        statusName: '全部',
        typeName: '全部',
        title: ''
      },
      statusList: [
        { name: '全部', status: -2 },
        { name: '未上架', status: 0 },
        { name: '已上架', status: 1 },
        { name: '已下架', status: 2 }
      ],
      typeList: [
        { name: '全部', value: -2 },
        { name: '营销活动', value: 0 },
        { name: '广告', value: 1 }
      ],
      adData: [],
      adColumns: [
        {
          title: '图片',
          slot: 'pic',
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          width: 250,
          align: 'center'
        },
        {
          title: '跳转链接',
          slot: 'url',
          width: 200,
          align: 'center'
        },
        {
          title: '类型',
          slot: 'type',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '新增时间',
          key: 'time_create',
          width: 170,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      statusColor: {
        '-1': 'invalid',
        '0': 'storage',
        '1': 'ready',
        '2': 'storage',
        '3': 'rent',
        '4': 'maintenance'
      },
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      spinShow: true,
      picDetail: {
        modal: false,
        src: ''
      }
    };
  },
  created() {
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/banner/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize +
        '&sortField=time_create&sortOrder=desc',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log('MgAd Index.vue created axios /banner success', res);
        if (res.data.code === 0) {
          this.adData.length = 0;
          this.adData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: res.data.message
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log('MgAd Index.vue created axios /banner success', err);
        this.$Message.error({
          content: '广告数据请求失败'
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
    handlePicPreview(row) {
      this.picDetail = Object.assign({}, this.picDetail, {
        modal: true,
        src: this.global_.path.baseUrl + row.pic
      });
    },
    edit(index) {
      this.$router.push(
        '/home/adAddition?action=edit&id=' + this.adData[index].id
      );
    },
    getTypeNameByValue(type) {
      let objTemp = this.typeList.slice().find(item => item.value === type);
      return objTemp.name;
    },
    getStatusNameByValue(status, type = '') {
      console.log(
        'MgAd index.vue getStatusNameByValue',
        status,
        this.statusList.slice()
      );

      let objTemp = this.statusList
        .slice()
        .find(item => item.status === status);
      let result = objTemp.name;
      if (type === 'action') {
        let temp = status === 1 ? 2 : 1;
        objTemp = this.statusList.slice().find(item => item.status === temp);
        result = objTemp.name.substr(1);
      }
      return result;
    },
    handleSelected(e, type) {
      console.log('MgAd index.vue handleRadioChange', e, type);
      let indexTemp = -1;
      switch (type) {
        case 'status':
          indexTemp = this.statusList.findIndex(item => item.name === e);
          break;
        case 'type':
          indexTemp = this.typeList.findIndex(item => item.name === e);
          break;
      }
      return indexTemp;
    },
    // 查询
    handleSearch() {
      let indexTemp = this.handleSelected(this.formItem.typeName, 'type');
      let statusTemp = this.typeList[indexTemp].value;
      let strTemp = '';
      if (this.formItem.title) {
        strTemp = '&title=' + this.formItem.title;
      }
      if (statusTemp !== -2) {
        strTemp = strTemp + '&type=' + statusTemp;
      }
      indexTemp = this.handleSelected(this.formItem.statusName, 'status');
      statusTemp = this.statusList[indexTemp].status;
      if (statusTemp !== -2) {
        strTemp = strTemp + '&status=' + statusTemp;
      }
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/banner/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          strTemp +
          '&sortField=time_create&sortOrder=desc',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log('MgAd Index.vue created axios /banner success', res);
          if (res.data.code === 0) {
            this.adData.length = 0;
            this.adData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log('MgAd Index.vue created axios /banner success', err);
          this.$Message.error({
            content: '广告数据请求失败'
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
      this.formItem.statusName = '全部';
      this.formItem.typeName = '全部';
    },
    // 删除行
    remove(index) {
      console.log('MgAd index.vue remove', index);
      this.$Modal.confirm({
        title: `确定删除${this.adData[index].title}广告吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/banner/delete?ids=' +
              this.adData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgAd Index.vue created axios /banner/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success(res.data.message);
                this.adData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: res.data.message
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgAd Index.vue created axios /banner/delete failure',
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
          console.log('MgAd index.vue confirm onCancel');
        }
      });
    },
    // 上下架
    toggleStatus(index) {
      let tempText = '';
      let urlTemp = '';
      if (this.adData[index].status === 1) {
        urlTemp =
          this.global_.path.baseUrl +
          '/rentalcars/banner/off?ids=' +
          this.adData[index].id;
        tempText = '下架';
      } else {
        urlTemp =
          this.global_.path.baseUrl +
          '/rentalcars/banner/on?ids=' +
          this.adData[index].id;
        tempText = '上架';
      }
      this.$Modal.confirm({
        title: `确定${tempText + this.adData[index].title}广告吗？`,
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
                'MgAd Index.vue created axios /banner/{} success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success(res.data.message);
                this.adData[index].status =
                  this.adData[index].status === 1 ? 2 : 1;
              } else {
                this.$Message.error({
                  content: res.data.message
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgAd Index.vue created axios /banner/{} failure',
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
          console.log('MgAd index.vue confirm onCancel');
        }
      });
    },
    // 新增
    add() {
      this.$router.push('/home/adAddition?action=add');
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MgAd Index.vue handlePageChange', e);
      this.currentPage = e;
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/banner/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          '&sortField=time_create&sortOrder=desc',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log('MgAd Index.vue created axios /banner success', res);
          if (res.data.code === 0) {
            this.adData.length = 0;
            this.adData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log('MgAd Index.vue created axios /banner success', err);
          this.$Message.error({
            content: '广告数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MgAd Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/banner/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          '&sortField=time_create&sortOrder=desc',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log('MgAd Index.vue created axios /banner success', res);
          if (res.data.code === 0) {
            this.adData.length = 0;
            this.adData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log('MgAd Index.vue created axios /banner success', err);
          this.$Message.error({
            content: '广告数据请求失败'
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
