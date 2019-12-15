<template>
  <div class="vehicle-addition-container">
    <div>
      <div class="basic-info-container">
        <div class="header">基础信息</div>
        <Form :model="basicInfoForm" class="content" :label-width="120" label-colon>
          <FormItem label="车牌号" style="margin-left: 0;">
            <!-- <span>车牌号：</span> -->
            <Input v-model="basicInfoForm.plate_num" placeholder="请输入车牌号" style="width: 200px" />
          </FormItem>
          <FormItem label="所属车型">
            <!-- <span>车型名称：</span> -->
            <RadioGroup v-model="basicInfoForm.vehicleModelCheck">
              <Radio
                v-for="(item, index) in vehicleModelList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="车辆识别代码" style="margin-left: 0;">
            <!-- <span>车辆识别代码：</span> -->
            <Input v-model="basicInfoForm.vin" placeholder="请输入车辆识别代码" style="width: 200px" />
          </FormItem>
          <FormItem label="发动机号" style="margin-left: 0;">
            <!-- <span>发动机号：</span> -->
            <Input v-model="basicInfoForm.engine_no" placeholder="请输入发动机号" style="width: 200px" />
          </FormItem>
          <FormItem label="车辆图片">
            <!-- <span>车辆图片：</span> -->
            <div>
              <div
                class="upload-list"
                v-for="(item, index) in basicInfoForm.upload_list"
                v-bind:key="index"
              >
                <template v-if="item.status === 'finished'">
                  <img :src="item.url" />
                  <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="500"
                name="image"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                :action="uploadUrl"
                style="display: inline-block;"
                :style="basicInfoForm.upload_list.length === 0 ? null : {display: 'none'}"
              >
                <div style="width:198px; height:98px; line-height: 98px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <span style="margin-left: 15px;">请上传分辨率为200*100，png、jpg格式的图片，大小不超过500KB</span>
            </div>
            <Modal title="View Image" v-model="visible">
              <img
                :src="
                  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                "
                v-if="visible"
                style="width: 100%"
              />
            </Modal>
          </FormItem>
          <FormItem label="颜色">
            <!-- <span>颜色：</span> -->
            <Input v-model="basicInfoForm.color" placeholder="请输入颜色" style="width: 200px" />
          </FormItem>
          <FormItem label="出厂日期" style="margin-left: 0;">
            <!-- <span>出厂时间：</span> -->
            <!-- <Input v-model="basicInfoForm.product_date" placeholder="请输入出厂日期" style="width: 200px" /> -->
            <DatePicker
              v-model="basicInfoForm.product_date"
              type="date"
              placeholder="请选择出厂日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="购买日期" style="margin-left: 0;">
            <!-- <span>购买日期：</span> -->
            <!-- <Input
              v-model="basicInfoForm.purchase_date"
              placeholder="请输入购买日期"
              style="width: 200px"
            />-->
            <DatePicker
              v-model="basicInfoForm.purchase_date"
              type="date"
              placeholder="请选择购买日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="购买价格" style="margin-left: 0;">
            <!-- <span>购买价格：</span> -->
            <Input
              v-model="basicInfoForm.purchase_price"
              placeholder="请输入购买价格"
              style="width: 200px"
            >
              <div class="suffix" slot="suffix">元</div>
            </Input>
          </FormItem>
          <FormItem label="所属门店">
            <!-- <span>所属门店：</span> -->
            <Select v-model="basicInfoForm.shopCheck" filterable style="width: 200px;">
              <Option
                v-for="(item, index) in shopList"
                :value="item.name"
                :key="index"
                placeholder="请输入所属门店"
              >{{ item.name }}</Option>
            </Select>
            <!-- <RadioGroup v-model="basicInfoForm.shopCheck">
              <Radio
                v-for="(item, index) in shopList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>-->
          </FormItem>
        </Form>
      </div>
      <div class="btn-container">
        <Button type="primary" @click="handleSubmit">提交</Button>
        <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VehicleAddition',
  data: function() {
    return {
      type: '',
      basicInfoForm: {
        plate_num: '',
        vin: '',
        engine_no: '',
        color: '',
        product_date: '',
        purchase_date: '',
        purchase_price: '',
        upload_list: [],
        vehicleModelCheck: '其他',
        shopCheck: '其他'
      },
      imgName: '',
      visible: false,
      // uploadList: [],
      vehicleModelList: [],
      shopList: [],
      vehicleColor: '',
      spinShow: false,
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=vehicle'
    };
  },
  created() {
    console.log('VehicleAddition Index.vue created', this.$store);
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.spinShow = true;
    let p1 = this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/store/page?pageIndex=1&pageSize=500',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'VehicleAddition Index.vue created axios /store/page success',
          res
        );
        if (res.data.code === 0) {
          this.shopList.push(...res.data.data.data);
          this.basicInfoForm.shopCheck = this.shopList[0].name;
        } else {
          this.$Message.error({
            content: '门店获取失败'
          });
        }
      },
      err => {
        console.log(
          'VehicleAddition Index.vue created axios /store/page failure',
          err
        );
        this.$Message.error({
          content: '门店获取失败'
        });
      }
    );
    let p2 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicle/model/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'VehicleAddition Index.vue created axios /vehicle/model success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleModelList.push(...res.data.data.data);
          this.basicInfoForm.vehicleModelCheck = res.data.data.data[0].name;
          if (this.$route.query.action === 'edit') {
            this.axios({
              url:
                this.global_.path.baseUrl +
                '/rentalcars/vehicle/detail/' +
                this.$route.query.id,
              method: 'get',
              headers: { 'Content-Type': 'application/json' }
            }).then(
              res => {
                console.log(
                  'VehicleAddition Index.vue created axios /vehicle/detail/{id} success',
                  res
                );
                if (res.data.code === 0) {
                  this.basicInfoForm = Object.assign({}, this.basicInfoForm, {
                    plate_num: res.data.data.vehicleDetail.plate_num,
                    vin: res.data.data.vehicleDetail.vin,
                    engine_no: res.data.data.vehicleDetail.engine_no,
                    color: res.data.data.vehicleDetail.color,
                    product_date: res.data.data.vehicleDetail.product_date,
                    purchase_date: res.data.data.vehicleDetail.purchase_date,
                    purchase_price: res.data.data.vehicleDetail.purchase_price
                  });
                  this.basicInfoForm.vehicleModelCheck =
                    res.data.data.vehicleDetail.model_name;
                  let indexTmep = this.shopList.findIndex(
                    item => item.id === res.data.data.vehicleDetail.store_id
                  );
                  if (indexTmep !== -1) {
                    this.basicInfoForm.shopCheck = this.shopList[indexTmep].name;
                  } else {
                    this.basicInfoForm.shopCheck = this.shopList[0].name;
                  }
                  if (res.data.data.vehicleDetail.image) {
                    this.basicInfoForm.upload_list.push({
                      name: res.data.data.vehicleDetail.image,
                      url:
                        this.global_.path.baseUrl +
                        '/' +
                        res.data.data.vehicleDetail.image,
                      status: 'finished'
                    });
                  }
                } else {
                  this.$Message.error({
                    content: '操作失败'
                  });
                }
              },
              err => {
                console.log(
                  'VehicleAddition Index.vue created axios /vehicle/detail/{id} failure',
                  err
                );
                this.$Message.error({
                  content: '操作失败'
                });
              }
            );
          }
        } else {
          this.$Message.error({
            content: '车辆类型请求失败'
          });
        }
      },
      err => {
        console.log(
          'VehicleAddition Index.vue created axios /vehicleCategory success',
          err
        );
        this.$Message.error({
          content: '车辆类型请求失败'
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
  },
  computed: {},
  methods: {
    handleView(item) {
      this.imgName = item.name;
      this.imgUrl = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      console.log('VehicleAddition index.vue methods handleSuccess', res, file);
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
    },
    handleError(res, file, fileList) {
      console.log(
        'VehicleAddition index.vue methods handleError',
        res,
        file,
        fileList
      );
      this.$Notice.error({
        title: '图片上传失败',
        desc: ''
      });
    },
    handleFormatError(file) {
      console.log('VehicleAddition index.vue methods handleFormatError', file);
      this.$Notice.warning({
        title: '图片格式错误',
        desc: ''
      });
    },
    handleMaxSize(file) {
      console.log('VehicleAddition index.vue methods handleMaxSize', file);
      this.$Notice.warning({
        title: '图片过大',
        desc: ''
      });
    },
    handleBeforeUpload() {
      console.log('VehicleAddition index.vue methods handleBeforeUpload');
      const check = this.basicInfoForm.upload_list.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '上传图片不能超过5张'
        });
      }
      return check;
    },
    // 提交
    handleSubmit() {
      let tempIndex1 = this.shopList.findIndex(
        item => item.name === this.basicInfoForm.shopCheck
      );
      let tempIndex2 = this.vehicleModelList.findIndex(
        item => item.name === this.basicInfoForm.vehicleModelCheck
      );
      let temp = {
        image: this.basicInfoForm.upload_list[0].name,
        plate_num: this.basicInfoForm.plate_num,
        engine_no: this.basicInfoForm.engine_no,
        vin: this.basicInfoForm.vin,
        color: this.basicInfoForm.color,
        state: this.basicInfoForm.state,
        product_date: this.$moment(this.basicInfoForm.product_date).format(
          'YYYY-MM-DD'
        ),
        purchase_date: this.$moment(this.basicInfoForm.purchase_date).format(
          'YYYY-MM-DD'
        ),
        purchase_price: this.basicInfoForm.purchase_price,
        model_id: this.vehicleModelList[tempIndex2].id,
        store_id: this.shopList[tempIndex1].id
      };
      if (this.$route.query.action === 'edit') {
        temp = Object.assign({}, temp, { id: this.$route.query.id });
      }
      console.log('VehicleAddition index.vue methods handleSubmit', temp);
      this.spinShow = true;
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/detail/saveData',
        headers: { 'Content-Type': 'application/json' },
        data: temp
      }).then(
        res => {
          console.log(
            'VehicleAddition Index.vue created axios /saveData success',
            res
          );
          if (res.data.code === 0) {
            this.$Message.success({
              content: '操作成功'
            });
            this.$router.back();
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log(
            'VehicleAddition Index.vue created axios /saveData failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
        }
      );
    },
    // 取消
    handleCancel() {
      console.log('ModelAddition index.vue methods handleCancel');
      this.$router.back();
    }
  },
  mounted() {
    this.basicInfoForm.upload_list = this.$refs.upload.fileList;
  },
  components: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
