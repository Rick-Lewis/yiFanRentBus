<template>
  <div class="brand-addition-container">
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
            :style="uploadList.length === 0 ? {} : {visibility: 'hidden'}"
          >
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="View Image" v-model="visible">
            <img :src="this.imgUrl" v-if="visible" style="width: 100%" />
          </Modal>
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
  name: 'BrandAddition',
  data: function() {
    return {
      basicInfoForm: {
        vehicleModelName: ''
      },
      defaultList: [],
      imgName: '', // 放大图的名称
      imgUrl: '', // 放大图的地址
      visible: false,
      uploadList: [],
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=brand',
      spinShow: false
    };
  },
  created() {
    console.log('BrandAddition Index.vue created', this.$route.query);
    this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    if (this.$route.query.action === 'edit') {
      this.axios({
        method: 'get',
        url:
          this.global_.path.baseUrl +
          '/rentalcars/vehicle/brand/detail/' +
          this.$route.query.id,
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'BrandAddition Index.vue created /brand/detail/{id} success',
            res
          );
          if (res.data.code === 0) {
            this.basicInfoForm = {
              vehicleModelName: res.data.data.name
            };
            if (res.data.data.logo) {
              this.uploadList.push({
                name: res.data.data.logo,
                url: this.global_.path.baseUrl + '/' + res.data.data.logo,
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
            'BrandAddition Index.vue created /brand/detail/{id} failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
        }
      );
    }
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
        'BrandAddition index.vue methods handleSuccess',
        res,
        file,
        this.uploadList
      );
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
    },
    handleError(res, file, fileList) {
      console.log(
        'BrandAddition index.vue methods handleError',
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
      console.log('BrandAddition index.vue methods handleFormatError', file);
      this.$Notice.warning({
        title: '图片格式错误',
        desc: ''
      });
    },
    handleMaxSize(file) {
      console.log('BrandAddition index.vue methods handleMaxSize', file);
      this.$Notice.warning({
        title: '图片尺寸过大',
        desc: ''
      });
    },
    handleBeforeUpload(file) {
      console.log('BrandAddition index.vue methods handleBeforeUpload', file);
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
        'BrandAddition index.vue methods handleModelBrandChange',
        param
      );
    },
    // 提交
    handleSubmit() {
      let temp = {
        name: this.basicInfoForm.vehicleModelName,
        logo: this.uploadList[0].name
      };
      if (this.$route.query.action === 'edit') {
        temp = Object.assign({}, temp, { id: this.$route.query.id });
      }
      console.log('BrandAddition index.vue methods handleSubmit', temp);
      this.axios({
        method: 'post',
        url: this.global_.path.baseUrl + '/rentalcars/vehicle/brand/saveData',
        headers: { 'Content-Type': 'application/json' },
        data: temp
      }).then(
        res => {
          console.log(
            'BrandAddition Index.vue created axios /saveData success',
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
      console.log('BrandAddition index.vue methods handleCancel');
      this.$router.back();
    }
  },
  computed: {},
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
<style lang="scss" scoped>
.brand-addition-container {
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
  .btn-container {
    padding-left: 55px;
  }
}
</style>
