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
          <span>车型品牌：</span>
          <Select
            label-in-value
            v-model="modelBrand"
            @on-change="handleModelBrandChange"
            style="width:200px"
          >
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <span>车辆类型：</span>
          <RadioGroup v-model="vehicleTypeCheck">
            <Radio v-for="(item, index) in vehicleTypeList" v-bind:key="index" v-bind:label="item"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <span>车辆类型：</span>
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
              v-bind:label="item"
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
            <Input v-model="confInfoForm.engine" placeholder="请输入汽油规格" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span style="padding-right: 14px;">座位数：</span>
            <Input v-model="confInfoForm.engine" placeholder="请输入座位数" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>前后雷达：</span>
            <CheckboxGroup v-model="confInfoForm.radar" style="display: inline;">
              <Checkbox label="前雷达"></Checkbox>
              <Checkbox label="后雷达"></Checkbox>
            </CheckboxGroup>
          </FormItem>
        </div>
        <div class="right">
          <FormItem>
            <span style="padding-right: 14px;">变速箱：</span>
            <Input v-model="confInfoForm.engine" placeholder="请输入变速箱" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>油箱容量：</span>
            <Input v-model="confInfoForm.engine" placeholder="请输入油箱容量" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>综合油耗：</span>
            <Input v-model="confInfoForm.engine" placeholder="请输入综合油耗" style="width: 200px" />
          </FormItem>
          <FormItem>
            <span>倒车影像：</span>
            <RadioGroup v-model="reversingImageCheck">
              <Radio
                v-for="(item, index) in reversingImageList"
                v-bind:key="index"
                v-bind:label="item"
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
        engine: ''
      },
      priceInfoForm: {
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
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      modelBrand: '',
      vehicleTypeCheck: '舒适型轿车',
      vehicleTypeList: [
        '全部',
        '紧凑型轿车',
        '舒适型轿车',
        '商务轿车',
        '豪华轿车',
        '紧凑型SUV',
        '中型5座SUV',
        '中型座SUV'
      ],
      energyTypesCheck: '',
      energyTypesList: ['汽油', '电动', '油电混合', '柴油'],
      vehicleStatusCheck: '全部',
      vehicleStatusList: ['全部', '已关停', '已开启'],
      reversingImageCheck: '',
      reversingImageList: ['有', '无']
    };
  },
  created() {
    console.log('ModelAddition Index.vue created', this.$store);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
  },
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
      console.log('ModelAddition index.vue methods handleSuccess', res, file);
      file.url =
        'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
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
    handleBeforeUpload() {
      console.log('ModelAddition index.vue methods handleBeforeUpload');
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
      console.log('ModelAddition index.vue methods handleSubmit');
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
  .btn-container{
      padding-left: 55px;
  }
}
</style>
