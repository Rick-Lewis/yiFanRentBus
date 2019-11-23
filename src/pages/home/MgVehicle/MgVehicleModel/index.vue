<template>
  <div class="vehicle-model-container">
    <div class="filtrate-container">
      <Form :model="formItem">
        <FormItem label="所属品牌：" class="from-brand">
          <!-- <span>所属品牌：</span> -->
          <RadioGroup v-model="formItem.from_brand_check">
            <Radio
              v-for="(item, index) in fromBrandList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="车型类型：" class="vehicle-type">
          <!-- <span>车型类型：</span> -->
          <RadioGroup v-model="formItem.vehicle_type_check">
            <Radio
              v-for="(item, index) in vehicleTypeList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="车型状态：" class="vehicle-status">
          <!-- <span>车型状态：</span> -->
          <RadioGroup v-model="formItem.vehicle_model_status_check">
            <Radio
              v-for="(item, index) in vehicleModelStatusList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
        <div class="input-container">
          <FormItem label="车型名称：">
            <!-- <span>车型名称：</span> -->
            <Input
              v-model="formItem.vehicle_model_name"
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
      <Button type="primary" style="margin-bottom: 10px;" @click="add"
        >+新增</Button
      >
      <Table
        border
        :columns="vehicleModelColumns"
        :data="vehicleModelData"
        stripe
      >
        <template v-slot:brand_name="{ row }">
          <span>{{ row.brand_name }}</span>
        </template>
        <template v-slot:state="{ row }">
          <Switch :value="row.state == '0' ? false : true" :disabled="true">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
        </template>
        <template v-slot:action="{ row, index }">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="edit(index)"
            >编辑</Button
          >
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
  name: 'MgVehicleModel',
  data() {
    return {
      fromBrandList: [],
      vehicleTypeList: [],
      vehicleModelStatusList: [
        { name: '全部', state: -1 },
        { name: '已关停', state: 0 },
        { name: '已开启', state: 1 }
      ],
      formItem: {
        from_brand_check: '全部',
        vehicle_type_check: '全部',
        vehicle_model_status_check: '全部',
        vehicle_model_name: ''
      },
      vehicleModelColumns: [
        {
          title: '车型名称',
          key: 'name'
        },
        {
          title: '所属品牌',
          slot: 'brand_name'
        },
        {
          title: '车型类型',
          key: 'category_name'
        },
        {
          title: '今日价格',
          key: 'standard_price'
        },
        {
          title: '车型状态',
          slot: 'state',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      vehicleModelData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页码
      currentPageSize: 10, // 当前每页条数
      spinShow: true
    };
  },
  created() {
    console.log('MgVehicleModel index.vue created');
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicle/category/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleCategory success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleTypeList.push(
            { id: -1, name: '全部' },
            ...res.data.data.data
          );
        } else {
          this.$Message.error({
            content: '车辆类型请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleCategory success',
          err
        );
        this.$Message.error({
          content: '车辆类型请求失败'
        });
      }
    );
    let p2 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicle/brand/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleBrand success',
          res
        );
        if (res.data.code === 0) {
          this.fromBrandList.push(
            { id: -1, name: '全部' },
            ...res.data.data.data
          );
        } else {
          this.$Message.error({
            content: '品牌数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicleModel Index.vue created axios /vehicleBrand success',
          err
        );
        this.$Message.error({
          content: '品牌数据请求失败'
        });
      }
    );
    let p3 = this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/model/page?pageIndex=' +
        this.currentPage +
        '&pageSize=' +
        this.currentPageSize,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MgVehicleModel Index.vue created axios /model success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleModelData.push(...res.data.data.data);
          this.total = res.data.data.total;
        } else {
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'MgVehicleModel Index.vue created axios /model failure',
          err
        );
        this.$Message.error({
          content: '车型数据请求失败'
        });
      }
    );
    Promise.all([p1, p2, p3])
      .then(res => {
        console.log(
          'MgVehicleModel Index.vue created Promise.all success',
          res
        );
        this.spinShow = false;
      })
      .catch(err => {
        console.log(
          'MgVehicleModel Index.vue created Promise.all failure',
          err
        );
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
  methods: {
    handleSelected(e, type) {
      console.log('MgVehicleModel index.vue handleSelected', e, type);
      let indexTemp = -1;
      switch (type) {
        case 'brand':
          indexTemp = this.fromBrandList.findIndex(item => item.name === e);
          break;
        case 'type':
          indexTemp = this.vehicleTypeList.findIndex(item => item.name === e);
          break;
        case 'status':
          indexTemp = this.vehicleModelStatusList.findIndex(
            item => item.name === e
          );
          break;
      }
      return indexTemp;
    },
    // 查询
    handleSearch() {
      let indexTemp = this.handleSelected(
        this.formItem.from_brand_check,
        'brand'
      );
      let brandId = this.fromBrandList[indexTemp].id;
      indexTemp = this.handleSelected(this.formItem.vehicle_type_check, 'type');
      let categoryId = this.vehicleTypeList[indexTemp].id;
      indexTemp = this.handleSelected(
        this.formItem.vehicle_model_status_check,
        'status'
      );
      let state = this.vehicleModelStatusList[indexTemp].state;
      let strTemp = '';
      if (brandId !== -1) {
        strTemp = strTemp + '&brand_id=' + brandId;
      }
      if (categoryId !== -1) {
        strTemp = strTemp + '&category_id=' + categoryId;
      }
      if (state !== -1) {
        strTemp = strTemp + '&state=' + state;
      }
      console.log(
        'MgVehicleModel index.vue handleSearch',
        this.$data,
        brandId,
        categoryId,
        state,
        strTemp
      );
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?name=' +
          this.formItem.vehicle_model_name +
          strTemp +
          '&pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicleModel Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '车型数据请求失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'MgVehicleModel Index.vue created axios /model success',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
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
      this.formItem.vehicle_model_status_check = '全部';
      this.formItem.vehicle_type_check = '全部';
      this.formItem.from_brand_check = '全部';
    },
    // 删除行
    remove(index) {
      this.$Modal.confirm({
        title: `确定删除${this.vehicleModelData[index].name}车型吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/vehicle/model/delete?ids=' +
              this.vehicleModelData[index].id,
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'MgVehicleModel Index.vue created axios /vehicleCategory/delete success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.info('操作成功');
                this.vehicleModelData.splice(index, 1);
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgVehicleModel Index.vue created axios /vehicleCategory/delete failure',
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
          console.log('MgVehicleModel index.vue confirm onCancel');
        }
      });
    },
    // 编辑行
    edit(index) {
      this.$router.push(
        '/home/modelAddition?action=edit&id=' + this.vehicleModelData[index].id
      );
    },
    // 新增
    add() {
      this.$router.push('/home/modelAddition?action=add');
    },
    // 车型详情
    show(index) {
      this.$router.push(
        '/home/modelDetail?id=' + this.vehicleModelData[index].id
      );
    },
    // 页码改变
    handlePageChange(e) {
      console.log('MgVehicleModel Index.vue handlePageChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicleModel Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '车型数据请求失败'
            });
          }
        },
        err => {
          console.log(
            'MgVehicleModel Index.vue created axios /model failure',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      );
    },
    // 每页条数改变
    handlePageSizeChange(e) {
      console.log('MgVehicleModel Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'MgVehicleModel Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: '车型数据请求失败'
            });
          }
        },
        err => {
          console.log(
            'MgVehicleModel Index.vue created axios /model failure',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
