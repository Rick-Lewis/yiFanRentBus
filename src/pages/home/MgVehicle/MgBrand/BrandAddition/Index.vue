<template>
  <div class="brand-addition-container">
    <div>
      <div class="basic-info-container">
        <div class="header">基础信息</div>
        <Form
          ref="formDynamic"
          :model="basicInfoForm"
          class="content"
          :rules="ruleValidate"
          :label-width="120"
          label-colon
        >
          <FormItem label="品牌名称" prop="brand_name">
            <!-- <span>品牌名称：</span> -->
            <Input
              v-model="basicInfoForm.brand_name"
              placeholder="请输入品牌名称"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="英文名称" prop="brand_en">
            <!-- <span>英文名称：</span> -->
            <Input
              v-model="basicInfoForm.brand_en"
              placeholder="请输入英文名称"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="品牌LOGO" prop="upload_list" required>
            <!-- <span>品牌LOGO：</span> -->
            <div>
              <div
              class="upload-list"
              v-for="(item, index) in basicInfoForm.upload_list"
              v-bind:key="index"
            >
              <template v-if="item.status === 'finished'">
                <img :src="item.url" />
                <div class="upload-list-cover">
                  <Icon
                    type="ios-eye-outline"
                    @click.native="handleView(item)"
                  ></Icon>
                  <Icon
                    type="ios-trash-outline"
                    @click.native="handleRemove(item)"
                  ></Icon>
                </div>
              </template>
              <template v-else>
                <Progress
                  v-if="item.showProgress"
                  :percent="item.percentage"
                  hide-info
                ></Progress>
              </template>
            </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :default-file-list="defaultList"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="500"
                name="image"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="uploadUrl"
                style="display: inline-block;width:58px;"
                v-if="basicInfoForm.upload_list.length === 0"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <span style="margin-left: 10px; vertical-align: text-bottom;"
                >支持格式png、jpg，分辨率100*100的图片，大小不超过500k</span
              >
            </div>
            <Modal title="View Image" v-model="visible">
              <img :src="this.imgUrl" v-if="visible" style="width: 100%" />
            </Modal>
          </FormItem>
        </Form>
      </div>
      <div class="btn-container">
        <Button type="primary" @click="handleSubmit('formDynamic')"
          >提交</Button
        >
        <Button style="margin-left: 8px" @click="handleCancel()">取消</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BrandAddition',
  data: function() {
    const validateUploadList = (rule, value, callback) => {
      if (this.errorText) {
        callback(new Error(this.errorText));
      } else {
        if (value.length === 0) {
          callback(new Error('品牌LOGO不能为空'));
        }
        callback();
      }
    };
    return {
      basicInfoForm: {
        brand_name: '',
        brand_en: '',
        upload_list: []
      },
      ruleValidate: {
        brand_name: [
          {
            required: true,
            message: '品牌名称不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 10,
            message: '支持汉字和字母，长度不超过10',
            trigger: 'blur'
          }
        ],
        brand_en: [
          {
            required: true,
            message: '英文名称不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 20,
            message: '支持字母，长度不超过20',
            trigger: 'blur'
          }
        ],
        upload_list: [
          // {
          //   required: true,
          //   type: 'array',
          //   min: 1,
          //   message: '品牌LOGO不能为空',
          //   trigger: 'change'
          // },
          { validator: validateUploadList, trigger: 'change' }
        ]
      },
      defaultList: [],
      imgName: '', // 放大图的名称
      imgUrl: '', // 放大图的地址
      visible: false,
      // uploadList: [],
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=brand',
      spinShow: false,
      errorText: ''
    };
  },
  created() {
    console.log('BrandAddition Index.vue created', this.$route.query);
    // this.$store.dispatch('homeStore/initBreadcrumbList', window.location.href);
    if (this.$route.query.action === 'edit') {
      this.spinShow = true;
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
            this.basicInfoForm = Object.assign({}, this.basicInfoForm, {
              brand_name: res.data.data.name,
              brand_en: res.data.data.name_en
            });
            if (res.data.data.logo) {
              this.basicInfoForm.upload_list.push({
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
          this.spinShow = false;
        },
        err => {
          console.log(
            'BrandAddition Index.vue created /brand/detail/{id} failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
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
        this.basicInfoForm.upload_list
      );
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
      this.errorText = '';
    },
    handleError(res, file, fileList) {
      console.log(
        'BrandAddition index.vue methods handleError',
        res,
        file,
        fileList
      );
      this.$Message.error({
        title: '图片上传失败'
      });
    },
    handleFormatError(file) {
      console.log('BrandAddition index.vue methods handleFormatError', file);
      // this.$Message.warning({
      //   title: '图片格式错误',
      //   desc: ''
      // });
      this.errorText = '图片格式错误';
      this.$refs.formDynamic.validateField('upload_list');
    },
    handleMaxSize(file) {
      console.log('BrandAddition index.vue methods handleMaxSize', file);
      // this.$Message.warning({
      //   title: '图片过大',
      //   desc: ''
      // });
      this.errorText = '图片过大';
      this.$refs.formDynamic.validateField('upload_list');
    },
    handleBeforeUpload(file) {
      console.log('BrandAddition index.vue methods handleBeforeUpload', file);
      const check = this.basicInfoForm.upload_list.length < 5;
      if (!check) {
        this.$Message.warning({
          title: '上传图片不能超过5张'
        });
      }
      return check;
    },
    // 提交
    handleSubmit(name) {
      this.errorText = '';
      this.$refs[name].validate(valid => {
        if (valid) {
          let temp = {
            name: this.basicInfoForm.brand_name,
            name_en: this.basicInfoForm.brand_en,
            logo: this.basicInfoForm.upload_list[0].name
          };
          if (this.$route.query.action === 'edit') {
            temp = Object.assign({}, temp, { id: this.$route.query.id });
          }
          console.log('BrandAddition index.vue methods handleSubmit', temp);
          this.spinShow = true;
          this.axios({
            method: 'post',
            url:
              this.global_.path.baseUrl + '/rentalcars/vehicle/brand/saveData',
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
              this.spinShow = false;
            },
            err => {
              console.log(
                'MgVehicleModel Index.vue created axios /saveData failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
              this.spinShow = false;
            }
          );
        } else {
          this.$Message.error('有必填项未填写');
        }
      });
    },
    // 取消
    handleCancel() {
      console.log('BrandAddition index.vue methods handleCancel');
      this.$router.back();
    }
  },
  computed: {},
  mounted() {
    this.basicInfoForm.upload_list = this.$refs.upload.fileList;
  }
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
