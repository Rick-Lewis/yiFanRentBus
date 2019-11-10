<template>
  <div class="vehicle-addition-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <Form :model="basicInfoForm" class="content">
        <FormItem style="margin-left: 0;">
          <span>车牌号：</span>
          <Input v-model="basicInfoForm.plate_num" placeholder="请输入车牌号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>车型名称：</span>
          <RadioGroup v-model="vehicleModelCheck">
            <Radio
              v-for="(item, index) in vehicleModelList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>车辆识别代码：</span>
          <Input v-model="basicInfoForm.vin" placeholder="请输入车辆识别代码" style="width: 200px" />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>发动机号：</span>
          <Input v-model="basicInfoForm.engine_no" placeholder="请输入发动机号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>车辆图片：</span>
          <div class="upload-list" v-for="(item, index) in uploadList" v-bind:key="index">
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
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            name="image"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            type="drag"
            :action="uploadUrl"
            style="display: inline-block;width:58px;"
            :style="uploadList.length === 0 ? {} : {visibility: 'hidden'}"
          >
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="View Image" v-model="visible">
            <img
              :src="'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'"
              v-if="visible"
              style="width: 100%"
            />
          </Modal>
        </FormItem>
        <FormItem>
          <span>颜色：</span>
          <Input v-model="basicInfoForm.color" placeholder="请输入颜色" style="width: 200px" />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>出厂时间：</span>
          <Input v-model="basicInfoForm.product_date" placeholder="请输入出厂时间" style="width: 200px" />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>购买日期：</span>
          <Input v-model="basicInfoForm.purchase_date" placeholder="请输入购买日期" style="width: 200px" />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>购买价格：</span>
          <Input v-model="basicInfoForm.purchase_price" placeholder="请输入购买价格" style="width: 200px" />
        </FormItem>
      </Form>
    </div>
    <div class="btn-container">
      <Button type="primary" @click="handleSubmit">提交</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
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
        purchase_price: ''
      },
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      vehicleModelCheck: '其他',
      vehicleModelList: [],
      vehicleColor: '',
      spinShow: true,
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=vehicle'
    };
  },
  created() {
    console.log('VehicleAddition Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    this.axios({
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
          this.vehicleModelList.push(
            { id: -1, name: '其他' },
            ...res.data.data.data
          );
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
                  this.basicInfoForm = {
                    plate_num: res.data.data.plate_num,
                    vin: res.data.data.vin,
                    engine_no: res.data.data.engine_no,
                    color: res.data.data.color,
                    product_date: res.data.data.product_date,
                    purchase_date: res.data.data.purchase_date,
                    purchase_price: res.data.data.purchase_price
                  };
                  let tempIndex = this.vehicleModelList.findIndex(
                    item => item.id === res.data.data.model_id
                  );
                  if (tempIndex !== -1) {
                    this.vehicleModelCheck = this.vehicleModelList[tempIndex].name;
                  }

                  if (res.data.data.image) {
                    this.uploadList.push({
                      name: res.data.data.image,
                      url:
                        this.global_.path.baseUrl + '/' + res.data.data.image,
                      status: 'finished'
                    });
                  }
                } else {
                  this.$Message.error({
                    content: '操作失败'
                  });
                }
                this.spinShow = false;
              },
              err => {
                console.log(
                  'VehicleAddition Index.vue created axios /vehicle/detail/{id} failure',
                  err
                );
                this.$Message.error({
                  content: '操作失败'
                });
                this.spinShow = false;
              }
            );
          }
        } else {
          this.$Message.error({
            content: '车辆类型请求失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'VehicleAddition Index.vue created axios /vehicleCategory success',
          err
        );
        this.$Message.error({
          content: '车辆类型请求失败'
        });
        this.spinShow = false;
      }
    );
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
        title: '图片尺寸过大',
        desc: ''
      });
    },
    handleBeforeUpload() {
      console.log('VehicleAddition index.vue methods handleBeforeUpload');
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '上传图片不能超过5张'
        });
      }
      return check;
    },
    // 提交
    handleSubmit() {
      let tempIndex2 = this.vehicleModelList.findIndex(
        item => item.name === this.vehicleModelCheck
      );
      let temp = {
        image: this.uploadList[0].name,
        plate_num: this.basicInfoForm.plate_num,
        engine_no: this.basicInfoForm.engine_no,
        vin: this.basicInfoForm.vin,
        color: this.basicInfoForm.color,
        state: this.basicInfoForm.state,
        product_date: this.basicInfoForm.product_date,
        purchase_date: this.basicInfoForm.purchase_date,
        purchase_price: this.basicInfoForm.purchase_price,
        model_id: this.vehicleModelList[tempIndex2].id
      };
      if (this.$route.query.action === 'edit') {
        temp = Object.assign({}, temp, { id: this.$route.query.id });
      }
      console.log('VehicleAddition index.vue methods handleSubmit', temp);
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
        },
        err => {
          console.log(
            'VehicleAddition Index.vue created axios /saveData failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
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
    this.uploadList = this.$refs.upload.fileList;
  },
  components: {}
};
</script>
<style lang='scss' scoped>
.vehicle-addition-container {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  min-height: 260px;
  .header {
    font-size: 18px;
    font-weight: bold;
  }
  .basic-info-container {
    .content {
      padding-top: 15px;
      padding-left: 55px;
    }
    .upload-list {
      display: inline-block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      margin-right: 4px;
    }
    .upload-list img {
      width: 100%;
      height: 100%;
    }
    .upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .upload-list:hover .upload-list-cover {
      display: block;
    }
    .upload-list-cover i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
  }
  .btn-container {
    padding-left: 55px;
  }
}
</style>
