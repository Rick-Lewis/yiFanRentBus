<template>
  <div class="ad-container">
    <div class="filtrate-container">
      <Form :model="formItem">
        <FormItem label="状态：">
          <RadioGroup v-model="formItem.statusName">
            <Radio v-for="(item, index) in statusList" v-bind:key="index" v-bind:label="item.name"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="类型：">
          <RadioGroup v-model="formItem.typeName">
            <Radio v-for="(item, index) in typeList" v-bind:key="index" v-bind:label="item.name"></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="标题：">
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
        <template v-slot:image="{ row, index }">
          <div class="image-container">
            <img :src="global_.path.baseUrl + row.image" />
          </div>
        </template>
        <template v-slot:state="{ row }">
          <div :class="statusColor[row.state]">{{getStatusNameByValue(row.state)}}</div>
        </template>
        <template v-slot:action="{ row, index }">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="toggleStatus(index)"
          >上架</Button>
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
        { name: '已下架', status: -1 }
      ],
      typeList: [
        { name: '全部', value: -2 },
        { name: '营销活动', value: 0 },
        { name: '广告', value: 1 }
      ],
      adData: [
        {
          image: '',
          title: '国庆租车大礼包',
          url: 'https://www.baidu.com',
          type: '营销活动',
          state: 0,
          create_time: '2016-09-21  08:50:08'
        }
      ],
      adColumns: [
        {
          title: '图片',
          slot: 'image'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '跳转链接',
          key: 'url',
          width: 190
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '状态',
          slot: 'state'
        },
        {
          title: '新增时间',
          key: 'create_time',
          width: 170
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
        '2': 'reserve',
        '3': 'rent',
        '4': 'maintenance'
      },
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      spinShow: true
    };
  },
  created() {
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/banner/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
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
            content: '广告数据请求失败'
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
  methods: {
    getStatusNameByValue(status) {
      console.log(
        'MgAd index.vue getStatusNameByValue',
        status,
        this.statusList.slice()
      );
      let objTemp = this.statusList
        .slice()
        .find(item => item.status === status);
      return objTemp.name;
    },
    // 查询
    handleSearch() {},
    // 重置
    handleReset() {
      this.formItem.statusName = '全部';
      this.formItem.typeName = '广告';
      this.formItem.title = '';
    },
    // 删除行
    remove(index) {
      console.log('MgAd index.vue remove', index);
      this.$Modal.confirm({
        title: `确定删除${this.adData[index].name}广告吗？`,
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
                this.$Message.info('操作成功');
                this.adData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
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
    // 编辑行
    toggleStatus(index) {},
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
          this.currentPageSize,
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
              content: '广告数据请求失败'
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
          this.currentPageSize,
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
              content: '广告数据请求失败'
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
