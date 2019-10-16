<template>
  <div class="vehicle-addition-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <Form :model="basicInfoForm" class="content">
        <FormItem style="margin-left: 0;">
          <span>车牌号：</span>
          <Input v-model="basicInfoForm.licensePlateNum" placeholder="请输入车牌号" style="width: 200px" />
        </FormItem>
        <FormItem>
          <span>选择车型：</span>
          <Select label-in-value v-model="type" @on-change="handleTypeChange" style="width:200px">
            <Option
              v-for="item in vehicleTypeList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>车辆识别代码：</span>
          <Input
            v-model="basicInfoForm.licensePlateCode"
            placeholder="请输入车辆识别代码"
            style="width: 200px"
          />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>发动机号：</span>
          <Input
            v-model="basicInfoForm.vehicleModelName"
            placeholder="请输入发动机号"
            style="width: 200px"
          />
        </FormItem>
        <FormItem>
          <span>车辆图片：</span>
          <div class="upload-list" v-for="(item, index) in uploadList" v-bind:key="index">
            <template v-if="item.status === 'finished'">
              <img :src="item.url" />
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
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
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :on-error="handleError"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            style="display: inline-block;width:58px;"
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
          <RadioGroup v-model="vehicleColorCheck">
            <Radio v-for="(item, index) in vehicleColorList" v-bind:key="index" v-bind:label="item"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>出厂时间：</span>
          <Input v-model="basicInfoForm.deliveryTime" placeholder="请输入出厂时间" style="width: 200px" />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>购买日期：</span>
          <Input v-model="basicInfoForm.purchaseDate" placeholder="请输入购买日期" style="width: 200px" />
        </FormItem>
        <FormItem style="margin-left: 0;">
          <span>购买价格：</span>
          <Input v-model="basicInfoForm.price" placeholder="请输入购买价格" style="width: 200px" />
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
        licensePlateCode: '',
        vehicleModelName: '',
        deliveryTime: '',
        purchaseDate: '',
        price: ''
      },
      defaultList: [
        {
          name: 'a42bdcc1178e62b4694c830f028db5c0',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
          name: 'bc7521e033abdd1e92222d733590f104',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      vehicleTypeCheck: '舒适型轿车',
      vehicleTypeList: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '紧凑型轿车',
          label: '紧凑型轿车'
        },
        {
          value: '舒适型轿车',
          label: '舒适型轿车'
        },
        {
          value: '商务轿车',
          label: '商务轿车'
        },
        {
          value: '豪华轿车',
          label: '豪华轿车'
        },
        {
          value: '紧凑型SUV',
          label: '紧凑型SUV'
        },
        {
          value: '中型5座SUV',
          label: '中型5座SUV'
        },
        {
          value: '中型座SUV',
          label: '中型座SUV'
        }
      ],
      vehicleColorCheck: '有',
      vehicleColorList: ['有', '无']
    };
  },
  created() {
    console.log('VehicleAddition Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
  },
  computed: {},
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      console.log('VehicleAddition index.vue methods handleSuccess', res, file);
      file.url =
        'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
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
    // 选择类型
    handleTypeChange(param) {
      console.log('VehicleAddition index.vue methods handleTypeChange', param);
    },
    // 提交
    handleSubmit() {
      console.log('ModelAddition index.vue methods handleSubmit');
    },
    // 取消
    handleCancel() {
      console.log('ModelAddition index.vue methods handleCancel');
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
