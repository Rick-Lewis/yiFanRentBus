<template>
  <div class="model-addition-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <Form :model="basicInfoForm" class="content">
        <FormItem style="margin-left: 0;">
          <span>车型名称：</span>
          <Input
            v-model="basicInfoForm.vehicleModelName"
            placeholder="请输入车型名称"
            style="width: 200px"
          />
        </FormItem>
        <FormItem>
          <span>车型图片：</span>
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
            :default-file-list="defaultList"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            name="image"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="uploadUrl"
            style="display: inline-block;width:58px;"
          >
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="View Image" v-model="visible">
            <img :src="this.imgUrl" v-if="visible" style="width: 100%" />
          </Modal>
        </FormItem>
        <FormItem>
          <span>车型品牌：</span>
          <RadioGroup v-model="fromBrandCheck">
            <Radio
              v-for="(item, index) in fromBrandList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <span>车辆类型：</span>
          <RadioGroup v-model="vehicleTypeCheck">
            <Radio
              v-for="(item, index) in vehicleTypeList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <span>能源类型：</span>
          <RadioGroup v-model="energyTypesCheck">
            <Radio v-for="(item, index) in energyTypesList" v-bind:key="index" v-bind:label="item"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <span>车辆状态：</span>
          <RadioGroup v-model="vehicleStatusCheck">
            <Radio
              v-for="(item, index) in vehicleStatusList"
              v-bind:key="index"
              v-bind:label="item.name"
            ></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </div>
    <div class="conf-info-container">
      <div class="header">配置信息</div>
      <Form class="content" :model="confInfoForm">
        <div class="left">
          <FormItem>
            <span style="padding-right: 14px;">发动机：</span>
            <Input v-model="confInfoForm.engine" placeholder="请输入发动机" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>汽油规格：</span>
            <Input v-model="confInfoForm.oil_type" placeholder="请输入汽油规格" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span style="padding-right: 14px;">座位数：</span>
            <Input v-model="confInfoForm.seat_count" placeholder="请输入座位数" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>前后雷达：</span>
            <CheckboxGroup v-model="confInfoForm.radar" style="display: inline;">
              <Checkbox
                v-for="(item, index) in radarList"
                v-bind:key="index"
                v-bind:label="item.name"
              ></Checkbox>
            </CheckboxGroup>
          </FormItem>
        </div>
        <div class="right">
          <FormItem>
            <span style="padding-right: 14px;">变速箱：</span>
            <Input v-model="confInfoForm.gearbox" placeholder="请输入变速箱" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>油箱容量：</span>
            <Input v-model="confInfoForm.oil_volume" placeholder="请输入油箱容量" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>综合油耗：</span>
            <Input v-model="confInfoForm.oil_litre" placeholder="请输入综合油耗" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>倒车影像：</span>
            <RadioGroup v-model="confInfoForm.backup_camera">
              <Radio
                v-for="(item, index) in backupCameraList"
                v-bind:key="index"
                v-bind:label="item.name"
              ></Radio>
            </RadioGroup>
          </FormItem>
        </div>
      </Form>
    </div>
    <div class="price-info-container">
      <div class="header">价格信息</div>
      <Form class="content" :model="priceInfoForm">
        <FormItem>
          <span>基础价格：</span>
          <Input v-model="priceInfoForm.price" placeholder="请输入基础价格" style="width: 200px" />
        </FormItem>
      </Form>
    </div>
    <div class="btn-container">
      <Button type="primary" @click="handleSubmit">提交</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  name: 'ModelAddition',
  data() {
    return {
      basicInfoForm: {
        vehicleModelName: ''
      },
      confInfoForm: {
        engine: '',
        oil_type: '',
        seat_count: '',
        radar: [],
        gearbox: '',
        oil_volume: '',
        oil_litre: '',
        backup_camera: '有'
      },
      priceInfoForm: {
        price: ''
      },
      defaultList: [
        {
          name:
            'vehicle_modelec843a7b-b59d-4ec9-bb73-cfa07bc9ef97_1573046594307.jpg',
          url:
            this.global_.path.baseUrl +
            '/images/vehicle_modelec843a7b-b59d-4ec9-bb73-cfa07bc9ef97_1573046594307.jpg'
        }
      ],
      imgName: '', // 放大图的名称
      imgUrl: '', // 放大图的地址
      visible: false,
      uploadList: [],
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=vehicle_model',
      fromBrandCheck: '全部',
      fromBrandList: [],
      vehicleTypeCheck: '全部',
      vehicleTypeList: [],
      energyTypesCheck: '其他',
      energyTypesList: ['其他', '汽油', '电动', '油电混合', '柴油'],
      vehicleStatusCheck: '全部',
      vehicleStatusList: [
        { name: '全部', state: -1 },
        { name: '已关停', state: 0 },
        { name: '已开启', state: 1 }
      ],
      radarList: [
        { en: 'radar_head', name: '前雷达' },
        { en: 'radar_tail', name: '后雷达' }
      ],
      backupCameraList: [{ name: '有', state: 1 }, { name: '无', state: 10 }],
      spinShow: true
    };
  },
  created() {
    console.log('ModelAddition Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicleCategory/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelAddition Index.vue created axios /vehicleCategory success',
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
          'ModelAddition Index.vue created axios /vehicleCategory success',
          err
        );
        this.$Message.error({
          content: '车辆类型请求失败'
        });
      }
    );
    let p2 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicleBrand/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelAddition Index.vue created axios /vehicleBrand success',
          res
        );
        if (res.data.code === 0) {
          this.fromBrandList.push(
            { id: -1, name: '全部' },
            ...res.data.data.dataSource
          );
        } else {
          this.$Message.error({
            content: '品牌数据请求失败'
          });
        }
      },
      err => {
        console.log(
          'ModelAddition Index.vue created axios /vehicleBrand success',
          err
        );
        this.$Message.error({
          content: '品牌数据请求失败'
        });
      }
    );
    Promise.all([p1, p2])
      .then(res => {
        console.log('ModelAddition Index.vue created Promise.all success', res);
        this.spinShow = false;
      })
      .catch(err => {
        console.log('ModelAddition Index.vue created Promise.all failure', err);
        this.spinShow = false;
      });
  },
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
      console.log('ModelAddition index.vue methods handleSuccess', res, file);
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
      this.uploadList.push({
        name: res.data,
        url: this.global_.path.baseUrl + res.data
      });
    },
    handleError(res, file, fileList) {
      console.log(
        'ModelAddition index.vue methods handleError',
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
      console.log('ModelAddition index.vue methods handleFormatError', file);
      this.$Notice.warning({
        title: '图片格式错误',
        desc: ''
      });
    },
    handleMaxSize(file) {
      console.log('ModelAddition index.vue methods handleMaxSize', file);
      this.$Notice.warning({
        title: '图片尺寸过大',
        desc: ''
      });
    },
    handleBeforeUpload(file) {
      console.log('ModelAddition index.vue methods handleBeforeUpload', file);
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '上传图片不能超过5张'
        });
      }
      return check;
    },
    handleModelBrandChange(param) {
      console.log(
        'ModelAddition index.vue methods handleModelBrandChange',
        param
      );
    },
    // 提交
    handleSubmit() {
      let tempIndex0 = this.vehicleStatusList.findIndex(
        item => item.name === this.vehicleStatusCheck
      );
      let tempIndex1 = this.fromBrandList.findIndex(
        item => item.name === this.fromBrandCheck
      );
      let tempIndex2 = this.fromBrandList.findIndex(
        item => item.name === this.fromBrandCheck
      );
      let temp = {
        name: this.basicInfoForm.vehicleModelName,
        state: this.vehicleStatusList[tempIndex0].state,
        gearbox: this.confInfoForm.gearbox,
        deposit: 5000.0,
        basic_insurance: 0.0,
        body_construction: '3厢',
        brand_id: this.fromBrandList[tempIndex1].id,
        category_id: this.vehicleTypeList[tempIndex2].id,
        door_count: 4,
        seat_count: this.confInfoForm.seat_count,
        let_litre: '2.0T',
        oil_litre: this.confInfoForm.oil_litre,
        oil_type: this.confInfoForm.oil_type,
        oil_volume: this.confInfoForm.oil_volume,
        radar_head: this.confInfoForm.radar.indexOf('前雷达') !== -1 ? 1 : 0,
        radar_tail: this.confInfoForm.radar.indexOf('后雷达') !== -1 ? 1 : 0,
        backup_camera: this.confInfoForm.backup_camera === '有' ? 1 : 0,
        standard_price: this.priceInfoForm.price,
        energy_type: '汽油',
        company_id: 1
      };
      console.log('ModelAddition index.vue methods handleSubmit', temp);
      this.axios({
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/model/saveData',
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelAddition Index.vue created axios /saveData success',
            res
          );
          if (res.data.code === 0) {
            this.$Message.success({
              content: '操作成功'
            });
          } else {
            this.$Message.error({
              content: '操作失败'
            });
          }
        },
        err => {
          console.log(
            'MgVehicleModel Index.vue created axios /saveData failure',
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
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>

<style lang='scss' scoped>
.model-addition-container {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  min-height: 260px;
  position: relative;
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
  .conf-info-container {
    .content {
      display: flex;
      //   justify-content: space-between;
      padding-top: 15px;
      padding-left: 55px;
      .left {
        margin-right: 200px;
      }
    }
  }
  .price-info-container {
    .content {
      padding-top: 15px;
      padding-left: 55px;
    }
  }
  .btn-container {
    padding-left: 55px;
  }
}
</style>
