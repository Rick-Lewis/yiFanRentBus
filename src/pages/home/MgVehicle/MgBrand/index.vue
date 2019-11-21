<template>
  <div class="brand-container">
    <div class="filtrate-container">
      <Form :model="formItem" :label-width="85" inline>
        <FormItem label="品牌名称：">
          <Input v-model="formItem.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <Button type="primary" style="margin-bottom: 10px;" @click="add">+新增</Button>
      <Table border :columns="brandColumns" :data="brandData" stripe>
        <template v-slot:logo="{ row, index }">
          <div class="logo-container">
            <img :src="global_.path.baseUrl + row.logo" />
          </div>
        </template>
        <template v-slot:action="{ row, index }">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
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
  name: 'MgBrand',
  data() {
    return {
      formItem: {
        brandName: ''
      },
      brandColumns: [
        {
          title: 'Logo',
          slot: 'logo'
        },
        {
          title: '品牌名称',
          key: 'name'
        },
        {
          title: '车辆数',
          key: 'num'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      brandData: [],
      spinShow: true,
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10 // 当前每页条数
    };
  },
  created() {
    console.log('MgBrand Index.vue created');
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/brand/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgBrand Index.vue created axios /vehicleBrand success',
          res
        );
        if (res.data.code === 0) {
          this.brandData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '品牌数据请求失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'MgBrand Index.vue created axios /vehicleBrand success',
          err
        );
        this.$Message.error({
          content: '品牌数据请求失败'
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
    handleSearch() {
      console.log('MgBrand index.vue handleSearch', this.formItem.brandName);
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/brand/page?name=' +
          this.formItem.brandName +
          '&pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgBrand Index.vue created axios /vehicleBrand success',
            res
          );
          if (res.data.code === 0) {
            this.brandData.length = 0;
            this.brandData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '品牌数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgBrand Index.vue created axios /vehicleBrand success',
            err
          );
          this.$Message.error({
            content: '品牌数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
    },
    // 删除行
    remove(index) {
      console.log('MgBrand index.vue remove', index);
      this.$Modal.confirm({
        title: `确定删除${this.brandData[index].name}品牌吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/vehicle/brand/delete?ids=' +
              this.brandData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgBrand Index.vue created axios /vehicleBrand/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.brandData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgBrand Index.vue created axios /vehicleBrand/delete failure',
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
          console.log('MgBrand index.vue confirm onCancel');
        }
      });
    },
    // 编辑行
    edit(index) {
      this.$router.push(
        '/home/brandAddition?action=edit&id=' + this.brandData[index].id
      );
    },
    // 新增
    add() {
      this.$router.push('/home/brandAddition?action=add');
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MgBrand Index.vue handlePageChange', e);
      this.currentPage = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/brand/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgBrand Index.vue created axios /vehicleBrand success',
            res
          );
          if (res.data.code === 0) {
            this.brandData.length = 0;
            this.brandData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '品牌数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgBrand Index.vue created axios /vehicleBrand success',
            err
          );
          this.$Message.error({
            content: '品牌数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MgBrand Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/brand/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgBrand Index.vue created axios /vehicleBrand success',
            res
          );
          if (res.data.code === 0) {
            this.brandData.length = 0;
            this.brandData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '品牌数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgBrand Index.vue created axios /vehicleBrand success',
            err
          );
          this.$Message.error({
            content: '品牌数据请求失败'
          });
          this.spinShow = false;
        }
      );
    }
  }
};
</script>

<style lang='scss' scoped>
@import './Index.scss';
</style>
