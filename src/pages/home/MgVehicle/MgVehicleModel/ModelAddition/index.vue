<template>
  <div class="model-addition-container">
    <div>
      <div class="basic-info-container">
        <div class="header">基础信息</div>
        <Form :model="basicInfoForm" class="content" :label-width="120" label-colon>
          <FormItem label="车型名称">
            <!-- <span>车型名称：</span> -->
            <Input v-model="basicInfoForm.name" placeholder="请输入车型名称" style="width: 200px" />
          </FormItem>
          <FormItem label="车型图片">
            <!-- <span>车型图片：</span> -->
            <div style="line-height: 1;">
              <div
                class="upload-list"
                v-for="(item, index) in basicInfoForm.upload_list"
                v-bind:key="index"
              >
                <template v-if="item.status === 'finished'">
                  <img :src="item.url" />
                  <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
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
                <div style="width:198px; height:108px; line-height:108px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <span style="margin-left: 15px;">请上传分辨率为200*110，png、jpg格式的图片，大小不超过500KB</span>
            </div>
            <Modal title="View Image" v-model="visible">
              <img :src="this.imgUrl" v-if="visible" style="width: 100%" />
            </Modal>
          </FormItem>
          <FormItem label="车型品牌">
            <!-- <span>车型品牌：</span> -->
            <Select v-model="basicInfoForm.from_brand_check" filterable style="width: 200px;">
              <Option
                v-for="(item, index) in fromBrandList"
                :value="item.name"
                :key="index"
                placeholder="请输入品牌"
              >{{ item.name }}</Option>
            </Select>
            <!-- <RadioGroup v-model="basicInfoForm.from_brand_check">
              <Radio
                v-for="(item, index) in fromBrandList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>-->
          </FormItem>
          <FormItem label="车辆类型">
            <!-- <span>车辆类型：</span> -->
            <RadioGroup v-model="basicInfoForm.vehicle_type_check">
              <Radio
                v-for="(item, index) in vehicleTypeList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="能源类型">
            <!-- <span>能源类型：</span> -->
            <RadioGroup v-model="basicInfoForm.energy_types_check">
              <Radio
                v-for="(item, index) in energyTypesList"
                v-bind:key="index"
                v-bind:label="item"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="车辆状态">
            <!-- <span>车辆状态：</span> -->
            <RadioGroup v-model="basicInfoForm.vehicle_status_check">
              <Radio
                v-for="(item, index) in vehicleStatusList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div class="conf-info-container">
        <div class="header">配置信息</div>
        <Form class="content" :model="confInfoForm" :label-width="120" label-colon>
          <div class="left">
            <FormItem label="发动机">
              <!-- <span style="padding-right: 14px;">发动机：</span> -->
              <Input v-model="confInfoForm.let_litre" placeholder="请输入发动机" style="width: 200px">
                <div class="suffix" slot="suffix">T</div>
              </Input>
            </FormItem>
            <FormItem label="汽油规格">
              <!-- <span>汽油规格：</span> -->
              <Input v-model="confInfoForm.oil_type" placeholder="请输入汽油规格" style="width: 200px">
                <div class="suffix" slot="suffix">#</div>
              </Input>
            </FormItem>
            <FormItem label="座位数">
              <!-- <span style="padding-right: 14px;">座位数：</span> -->
              <Input v-model="confInfoForm.seat_count" placeholder="请输入座位数" style="width: 200px">
                <div class="suffix" slot="suffix">座</div>
              </Input>
            </FormItem>
            <FormItem label="车门数">
              <!-- <span style="padding-right: 14px;">车门数：</span> -->
              <Input v-model="confInfoForm.door_count" placeholder="请输入车门数" style="width: 200px">
                <div class="suffix" slot="suffix">门</div>
              </Input>
            </FormItem>
            <FormItem label="前后雷达">
              <!-- <span>前后雷达：</span> -->
              <CheckboxGroup v-model="confInfoForm.radar" style="display: inline;">
                <Checkbox
                  v-for="(item, index) in radarList"
                  v-bind:key="index"
                  v-bind:label="item.name"
                  border
                ></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
          <div class="right">
            <FormItem label="变速箱">
              <!-- <span style="padding-right: 14px;">变速箱：</span> -->
              <Input v-model="confInfoForm.gearbox" placeholder="请输入变速箱" style="width: 200px" />
            </FormItem>
            <FormItem label="油箱容量">
              <!-- <span>油箱容量：</span> -->
              <Input v-model="confInfoForm.oil_volume" placeholder="请输入油箱容量" style="width: 200px">
                <div class="suffix" slot="suffix">L</div>
              </Input>
            </FormItem>
            <FormItem label="综合油耗">
              <!-- <span>综合油耗：</span> -->
              <Input v-model="confInfoForm.oil_litre" placeholder="请输入综合油耗" style="width: 200px">
                <div class="suffix" slot="suffix" style="padding-right: 30px;">L/100km</div>
              </Input>
            </FormItem>
            <FormItem label="车厢">
              <!-- <span>车厢：</span> -->
              <Input
                v-model="confInfoForm.body_construction"
                placeholder="请输入几厢车"
                style="width: 200px"
              >
                <div class="suffix" slot="suffix">厢</div>
              </Input>
            </FormItem>
            <FormItem label="倒车影像">
              <!-- <span>倒车影像：</span> -->
              <RadioGroup v-model="confInfoForm.backup_camera">
                <Radio
                  v-for="(item, index) in backupCameraList"
                  v-bind:key="index"
                  v-bind:label="item.name"
                  border
                ></Radio>
              </RadioGroup>
            </FormItem>
          </div>
        </Form>
      </div>
      <div class="price-info-container">
        <div class="header">价格信息</div>
        <Form class="content" :model="priceInfoForm" :label-width="120" label-colon>
          <FormItem label="押金">
            <!-- <span>押金：</span> -->
            <Input
              type="number"
              v-model="priceInfoForm.deposit"
              placeholder="请输入押金"
              style="width: 200px"
            >
              <div class="suffix" slot="suffix">元</div>
            </Input>
          </FormItem>
          <FormItem label="基础险">
            <!-- <span>基础险：</span> -->
            <Input
              type="number"
              v-model="priceInfoForm.basic_insurance"
              placeholder="请输入基础险"
              style="width: 200px"
            >
              <div class="suffix" slot="suffix">元</div>
            </Input>
          </FormItem>
          <FormItem label="基础价格" class="base-price">
            <!-- <span>基础价格：</span> -->
            <Input
              type="number"
              v-model="priceInfoForm.price"
              placeholder="请输入基础价格"
              style="width: 200px"
            >
              <div class="suffix" slot="suffix">元/日</div>
            </Input>
          </FormItem>
        </Form>
      </div>
      <div class="btn-container">
        <Button type="primary" @click="handleSubmit">提交</Button>
        <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelAddition',
  data() {
    return {
      basicInfoForm: {
        from_brand_check: '全部',
        vehicle_type_check: '其他',
        energy_types_check: '其他',
        vehicle_status_check: '已关停',
        name: '',
        upload_list: []
      },
      confInfoForm: {
        oil_type: '',
        seat_count: '',
        radar: [],
        gearbox: '',
        oil_volume: '',
        oil_litre: '',
        backup_camera: '有',
        door_count: '',
        let_litre: '',
        body_construction: ''
      },
      priceInfoForm: {
        price: ''
      },
      imgName: '', // 放大图的名称
      imgUrl: '', // 放大图的地址
      visible: false,
      // uploadList: [],
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=vehicle_model',
      fromBrandList: [],
      vehicleTypeList: [],
      energyTypesList: ['汽油', '电动', '油电混合', '柴油', '其他'],
      vehicleStatusList: [
        { name: '已关停', state: 0 },
        { name: '已开启', state: 1 }
      ],
      radarList: [
        { en: 'radar_head', name: '前雷达' },
        { en: 'radar_tail', name: '后雷达' }
      ],
      backupCameraList: [{ name: '有', state: 1 }, { name: '无', state: 0 }],
      spinShow: false
    };
  },
  created() {
    console.log('ModelAddition Index.vue created', this.$store);
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    if (this.$route.query.action === 'edit') {
      this.axios({
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/model/' +
          this.$route.query.id,
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'ModelDetail Index.vue created axios /vehicleCategory/{id} success',
            res
          );
          if (res.data.code === 0) {
            this.basicInfoForm = Object.assign({}, this.basicInfoForm, {
              name: res.data.data.name
            });
            this.confInfoForm = Object.assign({}, this.confInfoForm, {
              oil_type: res.data.data.oil_type,
              seat_count: res.data.data.seat_count,
              radar: [
                res.data.data.radar_head === 1 ? '前雷达' : '',
                res.data.data.radar_tail === 1 ? '后雷达' : ''
              ],
              gearbox: res.data.data.gearbox,
              oil_volume: res.data.data.oil_volume,
              oil_litre: res.data.data.oil_litre,
              backup_camera: res.data.data.backup_camera === 1 ? '有' : '无',
              door_count: res.data.data.door_count,
              let_litre: res.data.data.let_litre,
              body_construction: res.data.data.body_construction
            });
            this.priceInfoForm = Object.assign({}, this.priceInfoForm, {
              price: res.data.data.standard_price,
              deposit: res.data.data.deposit,
              basic_insurance: res.data.data.basic_insurance
            });
            this.basicInfoForm.from_brand_check = res.data.data.brand_name;
            this.basicInfoForm.vehicle_type_check = res.data.data.category_name;
            this.basicInfoForm.energy_types_check = res.data.data.energy_type;
            this.basicInfoForm.vehicle_status_check =
              res.data.data.state === 1 ? '已开启' : '已关停';
            if (res.data.data.image) {
              this.basicInfoForm.upload_list.push({
                name: res.data.data.image,
                url: this.global_.path.baseUrl + '/' + res.data.data.image,
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
            'ModelDetail Index.vue created axios /vehicleCategory/{id} failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
        }
      );
    }
    this.spinShow = true;
    let p1 = this.axios({
      url: this.global_.path.baseUrl + '/rentalcars/vehicle/category/page',
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'ModelAddition Index.vue created axios /vehicleCategory success',
          res
        );
        if (res.data.code === 0) {
          this.vehicleTypeList.push(...res.data.data.data);
        } else {
          this.$Message.error({
            content: '车辆类型请求失败'
          });
        }
      },
      err => {
        console.log(
          'ModelAddition Index.vue created axios /vehicleCategory failure',
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
          'ModelAddition Index.vue created axios /vehicle/brand/list success',
          res
        );
        this.fromBrandList.push(...res.data);
      },
      err => {
        console.log(
          'ModelAddition Index.vue created axios /vehicle/brand/list failure',
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
      console.log(
        'ModelAddition index.vue methods handleSuccess',
        res,
        file,
        this.basicInfoForm.upload_list
      );
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
      // this.uploadList.push({
      //   name: res.data,
      //   url: this.global_.path.baseUrl + res.data
      // });
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
        title: '图片过大',
        desc: ''
      });
    },
    handleBeforeUpload(file) {
      console.log('ModelAddition index.vue methods handleBeforeUpload', file);
      const check = this.basicInfoForm.upload_list.length < 5;
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
        item => item.name === this.basicInfoForm.vehicle_status_check
      );
      let tempIndex1 = this.fromBrandList.findIndex(
        item => item.name === this.basicInfoForm.from_brand_check
      );
      let tempIndex2 = this.vehicleTypeList.findIndex(
        item => item.name === this.basicInfoForm.vehicle_type_check
      );
      let tempIndex3 = this.energyTypesList.findIndex(
        item => item === this.basicInfoForm.energy_types_check
      );
      let temp = {
        image: this.basicInfoForm.upload_list[0].name,
        name: this.basicInfoForm.name,
        state: this.vehicleStatusList[tempIndex0].state,
        gearbox: this.confInfoForm.gearbox,
        deposit: this.priceInfoForm.deposit,
        basic_insurance: this.priceInfoForm.basic_insurance,
        body_construction: this.confInfoForm.body_construction,
        brand_id: this.fromBrandList[tempIndex1].id,
        category_id: this.vehicleTypeList[tempIndex2].id,
        door_count: this.confInfoForm.door_count,
        seat_count: this.confInfoForm.seat_count,
        let_litre: this.confInfoForm.let_litre,
        oil_litre: this.confInfoForm.oil_litre,
        oil_type: this.confInfoForm.oil_type,
        oil_volume: this.confInfoForm.oil_volume,
        radar_head: this.confInfoForm.radar.indexOf('前雷达') !== -1 ? 1 : 0,
        radar_tail: this.confInfoForm.radar.indexOf('后雷达') !== -1 ? 1 : 0,
        backup_camera: this.confInfoForm.backup_camera === '有' ? 1 : 0,
        standard_price: this.priceInfoForm.price,
        energy_type: this.energyTypesList[tempIndex3]
      };
      if (this.$route.query.action === 'edit') {
        temp = Object.assign({}, temp, { id: this.$route.query.id });
      }
      console.log('ModelAddition index.vue methods handleSubmit', temp);
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/model/saveData',
        headers: { 'Content-Type': 'application/json' },
        data: temp
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
            this.$router.back();
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
      this.$router.back();
    }
  },
  mounted() {
    this.basicInfoForm.upload_list = this.$refs.upload.fileList;
  }
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
