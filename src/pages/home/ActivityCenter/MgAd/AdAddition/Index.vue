<template>
  <div class="ad-addtion-container">
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
          <FormItem label="标题" prop="title">
            <Input v-model="basicInfoForm.title" placeholder="请输入广告标题" style="width: 200px" />
          </FormItem>
          <FormItem label="图片" prop="upload_list" required>
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
                multiple
                type="drag"
                :action="uploadUrl"
                style="display:inline-block;"
                :style="basicInfoForm.upload_list.length === 0 ? null : {display: 'none'}"
              >
                <div style="width:353px; height:148px; line-height:148px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <span
                style="margin-left: 15px; vertical-align: text-bottom;"
              >请上传分辨率为355*150，png、jpg格式的图片，大小不超过500KB</span>
            </div>
            <Modal title="View Image" v-model="visible">
              <img :src="this.imgUrl" v-if="visible" style="width: 100%" />
            </Modal>
          </FormItem>
          <FormItem label="跳转链接" prop="url">
            <Input v-model="basicInfoForm.url" placeholder="请输入跳转链接" style="width: 250px">
              <Select v-model="basicInfoForm.preUrl" slot="prepend" style="width: 80px">
                <Option value="http://">http://</Option>
                <Option value="https://">https://</Option>
              </Select>
            </Input>
          </FormItem>
          <FormItem label="类型" required>
            <RadioGroup v-model="basicInfoForm.type_check">
              <Radio
                v-for="(item, index) in typeList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="立即上架" required>
            <RadioGroup v-model="basicInfoForm.status_check">
              <Radio
                v-for="(item, index) in statusList"
                v-bind:key="index"
                v-bind:label="item.name"
                border
              ></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div class="btn-container">
        <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
        <Button style="margin-left: 8px" @click="handleCancel()">取消</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data: function() {
    const validateUploadList = (rule, value, callback) => {
      if (this.errorText) {
        callback(new Error(this.errorText));
      } else {
        if (value.length === 0) {
          callback(new Error('图片不能为空'));
        }
        callback();
      }
    };
    return {
      basicInfoForm: {
        title: '',
        upload_list: [],
        type_check: '营销活动',
        status_check: '否',
        url: '',
        preUrl: 'http://'
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '标题不能超过20个字符',
            trigger: 'change'
          }
        ],
        upload_list: [
          // {
          //   required: true,
          //   type: 'array',
          //   min: 1,
          //   message: '图片不能为空',
          //   trigger: 'change'
          // }
          { validator: validateUploadList, trigger: 'change' }
        ]
      },
      imgUrl: '',
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=banner',
      spinShow: false,
      statusList: [{ name: '否', status: 2 }, { name: '是', status: 1 }],
      typeList: [
        { name: '营销活动', value: 0 },
        { name: '广告', value: 1 },
        { name: '其他', value: 2 }
      ],
      visible: false,
      errorText: ''
    };
  },
  created() {
    console.log('AdAddition Index.vue created', this.$route.query);
    if (this.$route.query.action === 'edit') {
      this.spinShow = true;
      this.axios({
        method: 'get',
        url:
          this.global_.path.baseUrl +
          '/rentalcars/banner/' +
          this.$route.query.id,
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log('AdAddition Index.vue created /banner/{id} success', res);
          if (res.data.code === 0) {
            let temp1 = this.typeList.find(
              item => item.value === res.data.data.type
            );
            let temp2 = this.statusList.find(
              item => item.status === res.data.data.status
            );
            let temp3 = res.data.data.url.match(new RegExp(/(http(s*)):\/\//));
            this.basicInfoForm = Object.assign({}, this.basicInfoForm, {
              title: res.data.data.title,
              type_check: temp1.name,
              status_check: temp2.name,
              url: temp3
                ? res.data.data.url.split(temp3[0])[1]
                : res.data.data.url,
              preUrl: temp3 ? temp3[0] : ''
            });
            if (res.data.data.pic) {
              this.basicInfoForm.upload_list.push({
                name: res.data.data.pic,
                url: this.global_.path.baseUrl + '/' + res.data.data.pic,
                status: 'finished'
              });
            }
          } else {
            this.$Message.error({
              content: res.data.data.message
            });
          }
          this.spinShow = false;
        },
        err => {
          console.log('AdAddition Index.vue created /banner/{id} failure', err);
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
        }
      );
    }
  },
  mounted() {
    this.basicInfoForm.upload_list = this.$refs.upload.fileList;
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
        'AdAddition index.vue methods handleSuccess',
        res,
        file,
        this.basicInfoForm.upload_list
      );
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
    },
    handleError(res, file, fileList) {
      console.log(
        'AdAddition index.vue methods handleError',
        res,
        file,
        fileList
      );
      this.$Message.error({
        title: '图片上传失败',
        desc: ''
      });
    },
    handleFormatError(file) {
      console.log('AdAddition index.vue methods handleFormatError', file);
      // this.$Message.warning({
      //   title: '图片格式错误',
      //   desc: ''
      // });
      this.errorText = '图片格式错误';
      this.$refs.formDynamic.validateField('upload_list');
    },
    handleMaxSize(file) {
      console.log('AdAddition index.vue methods handleMaxSize', file);
      // this.$Message.warning({
      //   title: '图片过大',
      //   desc: ''
      // });
      this.errorText = '图片过大';
      this.$refs.formDynamic.validateField('upload_list');
    },
    handleBeforeUpload(file) {
      console.log('AdAddition index.vue methods handleBeforeUpload', file);
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
      let tempIndex1 = this.typeList.findIndex(
        item => item.name === this.basicInfoForm.type_check
      );
      let tempIndex2 = this.statusList.findIndex(
        item => item.name === this.basicInfoForm.status_check
      );
      this.$refs[name].validate(valid => {
        if (valid) {
          let temp = {
            title: this.basicInfoForm.title,
            url: this.basicInfoForm.preUrl + this.basicInfoForm.url,
            pic: this.basicInfoForm.upload_list[0].name,
            type: this.typeList[tempIndex1].value,
            status: this.statusList[tempIndex2].status
          };
          if (this.$route.query.action === 'edit') {
            temp = Object.assign({}, temp, { id: this.$route.query.id });
          }
          console.log('AdAddition index.vue methods handleSubmit', temp);
          this.spinShow = true;
          this.axios({
            method: 'post',
            url: this.global_.path.baseUrl + '/rentalcars/banner/saveData',
            headers: { 'Content-Type': 'application/json' },
            data: temp
          }).then(
            res => {
              console.log(
                'AdAddition Index.vue created axios /banner/saveData success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success({
                  content: '操作成功'
                });
                this.$router.back();
              } else {
                this.$Message.error({
                  content: res.data.data.message
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'AdAddition Index.vue created axios /banner/saveData failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
              this.spinShow = false;
            }
          );
        } else {
          this.$Message.warning('有必填项未填写');
        }
      });
    },
    // 取消
    handleCancel() {
      console.log('AdAddition index.vue methods handleCancel');
      this.$router.back();
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
