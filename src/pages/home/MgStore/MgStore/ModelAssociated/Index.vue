<template>
  <div class="model-associated-container">
    <div class="display-container">
      <span>已选门店：</span>
      <Tag size="large">{{storeDetail && storeDetail.name}}</Tag>
    </div>
    <div class="content-container">
      <Button type="primary" style="margin-bottom: 10px;" @click="add">新增车型</Button>
      <Button type="primary" style="margin-bottom: 10px;" @click="remove">删除车型</Button>
      <Table
        border
        ref="selection"
        :columns="vehicleModelColumns1"
        :data="vehicleModelData1"
        stripe
        @on-selection-change="sel => handleTableChange(sel, 'someModal')"
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
      </Table>
      <div class="page-container">
        <template>
          <Page
            :total="total1"
            size="small"
            show-elevator
            show-sizer
            @on-change="handlePageChange1"
            @on-page-size-change="handlePageSizeChange1"
            show-total
          />
        </template>
        <Spin size="large" fix v-if="spinShow1"></Spin>
      </div>
    </div>
    <Modal v-model="addVehicleShow" width="85%" :styles="{top: '50px'}" title="新增车型" @on-ok="ok">
      <div class="filtrate-container">
        <Form :model="formItem" label-colon @submit.native.prevent>
          <FormItem label="所属品牌" class="from-brand">
            <RadioGroup v-model="formItem.from_brand_check" @on-change="handleSearch">
              <Radio
                v-for="(item, index) in fromBrandList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="车型类型" class="vehicle-type">
            <RadioGroup v-model="formItem.vehicle_type_check" @on-change="handleSearch">
              <Radio
                v-for="(item, index) in vehicleTypeList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="车型状态" class="vehicle-status">
            <RadioGroup v-model="formItem.vehicle_model_status_check" @on-change="handleSearch">
              <Radio
                v-for="(item, index) in vehicleModelStatusList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <div class="input-container">
            <FormItem label="车型名称">
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
        <Table
          border
          ref="selection"
          :columns="vehicleModelColumns"
          :data="vehicleModelData"
          stripe
          @on-selection-change="sel => handleTableChange(sel, 'allModal')"
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
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'ModelAssociated',
  data() {
    return {
      vehicleModelColumns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '车型名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '所属品牌',
          slot: 'brand_name',
          align: 'center'
        },
        {
          title: '车型类型',
          key: 'category_name',
          align: 'center'
        },
        {
          title: '今日价格',
          key: 'standard_price',
          align: 'center'
        },
        {
          title: '车型状态',
          slot: 'state',
          width: 150,
          align: 'center'
        }
      ],
      vehicleModelData1: [],
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
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '车型名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '所属品牌',
          slot: 'brand_name',
          align: 'center'
        },
        {
          title: '车型类型',
          key: 'category_name',
          align: 'center'
        },
        {
          title: '今日价格',
          key: 'standard_price',
          align: 'center'
        },
        {
          title: '车型状态',
          slot: 'state',
          width: 150,
          align: 'center'
        }
      ],
      vehicleModelData: [],
      total1: 0, // 数据总条数
      total: 0, // 数据总条数
      currentPage1: 1, // 当前页码
      currentPage: 1, // 当前页码
      currentPageSize1: 500, // 当前每页条数
      currentPageSize: 500, // 当前每页条数
      spinShow1: true,
      spinShow: true,
      idSelection1: [],
      idSelection: [],
      addVehicleShow: false,
      storeDetail: null
    };
  },
  created() {
    console.log('ModelAssociated index.vue created', this.$store);
    let p1 = this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/store/detail/' +
        this.$route.query.store_id,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelAssociated Index.vue created axios /store/detail/{id} success',
          res
        );
        if (res.data.code === 0) {
          this.storeDetail = res.data.data;
        } else {
          this.$Message.error({
            content: res.data.data.message
          });
        }
      },
      err => {
        console.log(
          'ModelAssociated Index.vue created axios /store/detail/{id} failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
      }
    );
    let p2 = this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/vehicle/model/page?pageIndex=' +
        this.currentPage1 +
        '&pageSize=' +
        this.currentPageSize1 +
        '&sortField=create_time&sortOrder=desc&store_id=' +
        this.$route.query.store_id,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelAssociated Index.vue created axios /model success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleModelData1.push(...res.data.data.data);
          this.total1 = res.data.data.total;
        } else {
          this.$Message.error({
            content: res.data.data.message
          });
        }
      },
      err => {
        console.log(
          'ModelAssociated Index.vue created axios /model failure',
          err
        );
        this.$Message.error({
          content: '车型数据请求失败'
        });
      }
    );
    Promise.all([p1, p2])
      .then(res => {
        console.log(
          'ModelAssociated Index.vue created Promise.all success',
          res
        );
        this.spinShow1 = false;
      })
      .catch(err => {
        console.log(
          'ModelAssociated Index.vue created Promise.all failure',
          err
        );
        this.spinShow1 = false;
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
    ok() {
      if (this.idSelection.length !== 0) {
        this.handleSubmit();
      }
    },
    remove() {
      this.$Modal.confirm({
        title: `确定删除所选车型吗？`,
        content: '',
        onOk: () => {
          this.spinShow = true;
          let dataTemp = {
            stores: this.$route.query.store_id,
            models: this.idSelection1.join(',')
          };
          this.axios({
            url: this.global_.path.baseUrl + '/rentalcars/store/model/delete',
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            data: dataTemp
          }).then(
            res => {
              console.log(
                'ModelAssociated Index.vue created axios /model/delete success',
                res
              );
              if (res.data.code === 0) {
                this.axios({
                  url:
                    this.global_.path.baseUrl +
                    '/rentalcars/vehicle/model/page?pageIndex=' +
                    this.currentPage +
                    '&pageSize=' +
                    this.currentPageSize +
                    '&sortField=create_time&sortOrder=desc&store_id=' +
                    this.$route.query.store_id,
                  method: 'get',
                  headers: { 'Content-Type': 'application/json' }
                }).then(
                  res => {
                    console.log(
                      'ModelAssociated Index.vue created axios /model success',
                      res
                    );
                    if (res.data.code === 0) {
                      this.vehicleModelData1.length = 0;
                      this.vehicleModelData1.push(...res.data.data.data);
                    } else {
                      this.$Message.error({
                        content: res.data.data.message
                      });
                    }
                  },
                  err => {
                    console.log(
                      'ModelAssociated Index.vue created axios /model/delete failure',
                      err
                    );
                    this.$Message.error({
                      content: '车型数据请求失败'
                    });
                  }
                );
              } else {
                this.$Message.error({
                  content: res.data.data.message
                });
              }
            },
            err => {
              console.log(
                'ModelAssociated Index.vue created axios /model/delete failure',
                err
              );
              this.$Message.error({
                content: '车型数据删除失败'
              });
            }
          );
        },
        onCancel: () => {
          console.log('ModelAssociated index.vue remove onCancel');
        }
      });
    },
    add() {
      console.log('ModelAssociated index.vue add');
      this.addVehicleShow = true;
      let p1 = this.axios({
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/category/page',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /vehicleCategory success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleTypeList.length = 0;
            this.vehicleTypeList.push(
              { id: -1, name: '全部' },
              ...res.data.data.data
            );
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /vehicleCategory failure',
            err
          );
          this.$Message.error({
            content: '车辆类型请求失败'
          });
        }
      );
      let p2 = this.axios({
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/brand/list',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /brand/list success',
            res
          );
          this.fromBrandList.length = 0;
          this.fromBrandList.push({ id: -1, name: '全部' }, ...res.data);
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /brand/list failure',
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
          this.currentPageSize +
          '&sortField=create_time&sortOrder=desc',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /model failure',
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
            'ModelAssociated Index.vue created Promise.all success',
            res
          );
          this.spinShow = false;
        })
        .catch(err => {
          console.log(
            'ModelAssociated Index.vue created Promise.all failure',
            err
          );
          this.spinShow = false;
        });
    },
    handleTableChange(selection, type) {
      console.log('ModelAssociated index.vue handleTableChange', selection);
      switch (type) {
        case 'someModal':
          this.idSelection1 = selection.map(item => item.id);
          break;
        case 'allModal':
          this.idSelection = selection.map(item => item.id);
          break;
      }
    },
    handleSubmit() {
      let temp = {
        stores: this.$route.query.store_id,
        models: this.idSelection.join(',')
      };
      console.log('ModelAssociated index.vue handleSubmit', temp);
      this.spinShow = true;
      this.axios({
        url: this.global_.path.baseUrl + '/rentalcars/store/model/saveData',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: temp
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /store/model/saveData success',
            res
          );
          if (res.data.code === 0) {
            this.$Message.success({
              content: '操作成功'
            });
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
          this.spinShow = false;
          // this.$router.back();
          this.axios({
            url:
              this.global_.path.baseUrl +
              '/rentalcars/vehicle/model/page?pageIndex=' +
              this.currentPage +
              '&pageSize=' +
              this.currentPageSize +
              '&sortField=create_time&sortOrder=desc&store_id=' +
              this.$route.query.store_id,
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
          }).then(
            res => {
              console.log(
                'ModelAssociated Index.vue created axios /model success',
                res
              );
              if (res.data.code === 0) {
                this.vehicleModelData1.length = 0;
                this.vehicleModelData1.push(...res.data.data.data);
              } else {
                this.$Message.error({
                  content: res.data.data.message
                });
              }
            },
            err => {
              console.log(
                'ModelAssociated Index.vue created axios /model failure',
                err
              );
              this.$Message.error({
                content: '车型数据请求失败'
              });
            }
          );
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /store/model/saveData failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
          // this.$router.back();
        }
      );
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    handleSelected(e, type) {
      console.log('ModelAssociated index.vue handleSelected', e, type);
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
      if (this.formItem.vehicle_model_name) {
        strTemp = strTemp + '&name=' + this.formItem.vehicle_model_name;
      }
      if (brandId !== -1) {
        strTemp = strTemp + '&brand_id=' + brandId;
      }
      if (categoryId !== -1) {
        strTemp = strTemp + '&category_id=' + categoryId;
      }
      if (state !== -1) {
        strTemp = strTemp + '&state=' + state;
      }
      console.log('ModelAssociated index.vue handleSearch', strTemp);
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
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
            'ModelAssociated Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /model failure',
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
    // 页码改变
    handlePageChange1(e) {
      console.log('ModelAssociated Index.vue handlePageChange', e);
      this.currentPage = e;
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage1 +
          '&pageSize=' +
          this.currentPageSize1 +
          '&sortField=create_time&sortOrder=desc&store_id=' +
          this.$route.query.store_id,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData1.length = 0;
            this.vehicleModelData1.push(...res.data.data.data);
            this.total1 = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /model failure',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 每页条数改变
    handlePageSizeChange1(e) {
      console.log('ModelAssociated Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage1 +
          '&pageSize=' +
          this.currentPageSize1 +
          '&sortField=create_time&sortOrder=desc&store_id=' +
          this.$route.query.store_id,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData1.length = 0;
            this.vehicleModelData1.push(...res.data.data.data);
            this.total1 = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /model failure',
            err
          );
          this.$Message.error({
            content: '车型数据请求失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 页码改变
    handlePageChange(e) {
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
      if (this.formItem.vehicle_model_name) {
        strTemp = strTemp + '&name=' + this.formItem.vehicle_model_name;
      }
      if (brandId !== -1) {
        strTemp = strTemp + '&brand_id=' + brandId;
      }
      if (categoryId !== -1) {
        strTemp = strTemp + '&category_id=' + categoryId;
      }
      if (state !== -1) {
        strTemp = strTemp + '&state=' + state;
      }
      console.log('ModelAssociated Index.vue handlePageChange', e);
      this.currentPage = e;
      this.spinShow = true;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          '&sortField=create_time&sortOrder=desc' +
          strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /model failure',
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
      if (this.formItem.vehicle_model_name) {
        strTemp = strTemp + '&name=' + this.formItem.vehicle_model_name;
      }
      if (brandId !== -1) {
        strTemp = strTemp + '&brand_id=' + brandId;
      }
      if (categoryId !== -1) {
        strTemp = strTemp + '&category_id=' + categoryId;
      }
      if (state !== -1) {
        strTemp = strTemp + '&state=' + state;
      }
      console.log('ModelAssociated Index.vue handlePageSizeChange', e);
      this.currentPageSize = e;
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/page?pageIndex=' +
          this.currentPage +
          '&pageSize=' +
          this.currentPageSize +
          '&sortField=create_time&sortOrder=desc' +
          strTemp,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAssociated Index.vue created axios /model success',
            res
          );
          if (res.data.code === 0) {
            this.vehicleModelData.length = 0;
            this.vehicleModelData.push(...res.data.data.data);
            this.total = res.data.data.total;
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
        },
        err => {
          console.log(
            'ModelAssociated Index.vue created axios /model failure',
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
