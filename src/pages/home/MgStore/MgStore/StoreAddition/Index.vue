<template>
  <div class="store-addition-container">
    <div class="basic-info-container">
      <div class="header">基础信息</div>
      <div class="form-container">
        <Form
          ref="formDynamic"
          :model="basicInfoForm"
          class="content"
          :rules="ruleValidate"
          :label-width="100"
          label-colon
        >
          <FormItem label="门店名称" prop="name">
            <Input v-model="basicInfoForm.name" placeholder="请输入门店名称" style="width: 475px" />
          </FormItem>
          <FormItem label="门店图片" prop="upload_list">
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
                :style="
                  basicInfoForm.upload_list.length < 5
                    ? null
                    : { display: 'none' }
                "
              >
                <div style="width:98px; height:98px; line-height:98px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <div style="margin-left: 15px;">请上传100×100，png、jpg格式的图片，大小不超过500KB</div>
            </div>
            <Modal title="View Image" v-model="visible">
              <img :src="this.imgUrl" v-if="visible" style="width: 100%" />
            </Modal>
          </FormItem>
          <FormItem label="门店电话" prop="telephone">
            <Input v-model="basicInfoForm.telephone" type="number" maxlength="12" placeholder="请输入门店电话" style="width: 475px" />
          </FormItem>
          <FormItem label="营业时间" class="time">
            <TimePicker
              format="HH:mm"
              type="timerange"
              placement="bottom-end"
              placeholder="请选择营业时间"
              style="width: 475px"
              v-model="basicInfoForm.time"
            ></TimePicker>
          </FormItem>
          <FormItem label="默认状态">
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
    </div>
    <div class="pos-info-container">
      <div class="header">位置信息</div>
      <div class="form-container">
        <Form :model="posInfoForm" :label-width="120" label-colon>
          <FormItem label="所在城市">
            <Cascader
              :data="addressData"
              v-model="posInfoForm.currentAddress"
              :load-data="loadData"
              style="width: 475px;"
              change-on-select
              not-found-text="没有数据"
              @on-change="handleAddressChange"
            ></Cascader>
          </FormItem>
          <FormItem label="门店地址" prop="address">
            <Input v-model="posInfoForm.address" @on-change="e => handleDetailAddressChange(posInfoForm.address)" placeholder="请输入门店地址" style="width: 475px;" />
          </FormItem>
          <div style="display: flex;">
            <FormItem label="经度">
              <Input v-model="posInfoForm.latitude" type="number" placeholder="请输入门店经度" style="width: 150px;" />
            </FormItem>
            <FormItem label="纬度">
              <Input v-model="posInfoForm.longitude" type="number" placeholder="请输入门店纬度" style="width: 150px;" />
            </FormItem>
          </div>
          <FormItem label="步行指引" prop="guide">
            <Input
              v-model="posInfoForm.guide"
              maxlength="200"
              show-word-limit
              type="textarea"
              placeholder="请用文字描述步行到店路线，可以指出地标（如：麦当劳对面）"
              style="width: 350px;"
              :rows="6"
            />
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="btn-container">
      <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  name: 'StoreAddition',
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
      editData: {}, // 编辑时修改的值
      count: 0,
      basicInfoForm: {
        name: '',
        upload_list: [],
        telephone: '',
        status_check: '停运',
        time: ''
      },
      posInfoForm: {
        address: '',
        guide: '',
        currentAddress: [],
        latitude: '',
        longitude: ''
      },
      imgUrl: '',
      uploadUrl:
        this.global_.path.baseUrl +
        '/rentalcars/upload/image?image&folderName=store',
      visible: false,
      statusList: [
        { name: '停运', status: 2 },
        { name: '运营', status: 1 }
      ],
      addressData: [],
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入门店名称',
            trigger: 'blur'
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
        ],
        telephone: [
          {
            required: true,
            message: '请输入门店电话',
            trigger: 'blur'
          }
        ]
      },
      spinShow: false,
      errorText: ''
    };
  },
  created() {
    console.log('StoreAddition Index.vue created', this.$route.query);
    this.spinShow = true;
    if (this.$route.query.action === 'edit') {
      this.axios({
        method: 'get',
        url:
          this.global_.path.baseUrl +
          '/rentalcars/store/detail/' +
          this.$route.query.id,
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'StoreAddition Index.vue created /store/{id} success',
            res
          );
          if (res.data.code === 0) {
            // let temp1 = this.typeList.find(
            //   item => item.value === res.data.data.type
            // );
            let temp = this.statusList.find(
              item => item.status === res.data.data.status
            );
            this.basicInfoForm = Object.assign({}, this.basicInfoForm, {
              name: res.data.data.name,
              telephone: res.data.data.telephone,
              status_check: temp.name,
              time: [res.data.data.start_time, res.data.data.end_time]
            });
            if (res.data.data.province) {
              this.axios({
                method: 'get',
                url:
                  this.global_.path.baseUrl + '/rentalcars/district/provinces',
                headers: { 'Content-Type': 'application/json' }
              }).then(
                res1 => {
                  console.log(
                    'StoreAddition Index.vue created /district/provinces success',
                    res1
                  );
                  if (res1.data.length !== 0) {
                    let temp1 = res1.data;
                    temp1 = temp1.map(obj => {
                      let ite = {
                        value: obj.code,
                        label: obj.name,
                        level: obj.level,
                        children: [],
                        loading: false
                      };
                      return ite;
                    });
                    this.addressData.push(...temp1);
                    if (res.data.data.city) {
                      this.axios({
                        method: 'get',
                        url:
                          this.global_.path.baseUrl +
                          '/rentalcars/district/children?parent=' +
                          res.data.data.province +
                          '&level=2',
                        headers: { 'Content-Type': 'application/json' }
                      }).then(
                        res2 => {
                          console.log(
                            'StoreAddition Index.vue created /district/children city success',
                            res2
                          );
                          if (res2.data.length !== 0) {
                            let temp2 = res2.data;
                            // temp2.shift();
                            temp2 = temp2.map(obj => {
                              let ite = {
                                value: obj.code,
                                label: obj.name,
                                level: obj.level,
                                parent: obj.parent
                              };
                              if (obj.level < 3) {
                                ite = Object.assign({}, ite, {
                                  children: [],
                                  loading: false
                                });
                              }
                              return ite;
                            });
                            let itemTemp = this.addressData.find(
                              item => item.value === res.data.data.province
                            );
                            itemTemp.children.push(...temp2);
                            if (res.data.data.county) {
                              this.axios({
                                method: 'get',
                                url:
                                  this.global_.path.baseUrl +
                                  '/rentalcars/district/children?parent=' +
                                  res.data.data.city +
                                  '&level=3',
                                headers: { 'Content-Type': 'application/json' }
                              }).then(
                                res3 => {
                                  console.log(
                                    'StoreAddition Index.vue created /district/children county success',
                                    res3
                                  );
                                  let temp3 = res3.data;
                                  if (temp3.length !== 0) {
                                    // temp3.shift();
                                    temp3 = temp3.map(obj => {
                                      let ite = {
                                        value: obj.code,
                                        label: obj.name,
                                        level: obj.level,
                                        parent: obj.parent
                                      };
                                      // if (obj.level < 3) {
                                      //   ite = Object.assign({}, ite, {
                                      //     children: [],
                                      //     loading: false
                                      //   });
                                      // }
                                      return ite;
                                    });
                                  } else {
                                    temp3 = {
                                      value: '',
                                      label: '市区',
                                      level: 3,
                                      parent: res.data.data.city
                                    };
                                  }
                                  let provinceTemp = this.addressData.find(
                                    item =>
                                      item.value === res.data.data.province
                                  );
                                  let cityTemp = provinceTemp.children.find(
                                    item => item.value === res.data.data.city
                                  );
                                  cityTemp.children.push(...temp3);
                                  this.spinShow = false;
                                },
                                err3 => {
                                  console.log(
                                    'StoreAddition Index.vue created /district/children county failure',
                                    err3
                                  );
                                  this.$Message.error({
                                    content: '操作失败'
                                  });
                                  this.spinShow = false;
                                }
                              );
                            } else {
                              this.spinShow = false;
                            }
                          }
                        },
                        err2 => {
                          console.log(
                            'StoreAddition Index.vue created /district/children county failure',
                            err2
                          );
                          this.$Message.error({
                            content: '操作失败'
                          });
                          this.spinShow = false;
                        }
                      );
                    } else {
                      this.spinShow = false;
                    }
                  }
                },
                err1 => {
                  console.log(
                    'StoreAddition Index.vue created /district/provinces failure',
                    err1
                  );
                  this.$Message.error({
                    content: '操作失败'
                  });
                  this.spinShow = false;
                }
              );
            } else {
              this.spinShow = false;
            }
            this.posInfoForm = Object.assign({}, this.posInfoForm, {
              address: res.data.data.address,
              guide: res.data.data.guide,
              currentAddress: [
                res.data.data.province,
                res.data.data.city,
                res.data.data.county
              ],
              latitude: res.data.data.latitude,
              longitude: res.data.data.longitude
            });
            console.log('dfasdfsd', this.posInfoForm.currentAddress);
            if (res.data.data.image) {
              let listTemp = res.data.data.image.split(',');
              this.basicInfoForm.upload_list.push(
                ...listTemp.map(item => ({
                  name: item,
                  url: this.global_.path.baseUrl + '/' + item,
                  status: 'finished'
                }))
              );
            }
          } else {
            this.$Message.error({
              content: res.data.message
            });
            this.spinShow = false;
          }
        },
        err => {
          console.log(
            'StoreAddition Index.vue created /store/{id} failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
          this.spinShow = false;
        }
      );
    } else {
      this.axios({
        method: 'get',
        url: this.global_.path.baseUrl + '/rentalcars/district/provinces',
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'StoreAddition Index.vue created /district/provinces success',
            res
          );
          let temp = res.data;
          temp = temp.map(item => {
            let ite = {
              value: item.code,
              label: item.name,
              level: item.level,
              children: [],
              loading: false
            };
            return ite;
          });
          this.addressData.push(...temp);
          this.spinShow = false;
        },
        err => {
          console.log(
            'StoreAddition Index.vue created /district/provinces failure',
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
  mounted() {
    this.basicInfoForm.upload_list = this.$refs.upload.fileList;
  },
  methods: {
    handleDetailAddressChange(val) {
      console.log(
        'StoreAddition methods handleDetailAddressChange',
        val
      );
      this.editData = Object.assign({}, this.editData, {
        address: val
      });
    },
    handleAddressChange(value, selectedData) {
      console.log(
        'StoreAddition methods handleAddressChange',
        value,
        selectedData
      );
      this.editData = Object.assign({}, this.editData, {
        province: value[0],
        city: value[1],
        county: value[2]
      });
    },
    loadData(item, callback) {
      console.log('StoreAddition methods loadData', this);
      if (this.spinShow) {
        return;
      }
      item.loading = true;
      this.axios({
        method: 'get',
        url:
          this.global_.path.baseUrl +
          '/rentalcars/district/children?parent=' +
          item.value +
          '&level=' +
          (item.level + 1),
        headers: { 'Content-Type': 'application/json' }
      }).then(
        res => {
          console.log(
            'StoreAddition Index.vue created /district/children success',
            res
          );
          if (res.data.length !== 0) {
            let temp = res.data;
            temp = res.data.map(obj => {
              let ite = {
                value: obj.code,
                label: obj.name,
                level: obj.level
              };
              if (obj.level < 3) {
                ite = Object.assign({}, ite, {
                  children: [],
                  loading: false
                });
              }
              return ite;
            });
            item.children.push(...temp);
          } else {
            item.children.push({
              value: '',
              label: '市区',
              level: 3
            });
          }
          item.loading = false;
          callback();
        },
        err => {
          console.log(
            'StoreAddition Index.vue created /district/children failure',
            err
          );
          this.$Message.error({
            content: '操作失败'
          });
          item.loading = false;
          callback();
        }
      );
    },
    // 提交
    handleSubmit(name) {
      this.errorText = '';
      let tempIndex2 = this.statusList.findIndex(
        item => item.name === this.basicInfoForm.status_check
      );
      this.$refs[name].validate(valid => {
        if (valid) {
          let listTemp = this.basicInfoForm.upload_list.map(item => item.name);
          let temp = {
            name: this.basicInfoForm.name,
            telephone: this.basicInfoForm.telephone,
            image: listTemp.join(','),
            start_time: this.basicInfoForm.time[0],
            end_time: this.basicInfoForm.time[1],
            status: this.statusList[tempIndex2].status,

            guide: this.posInfoForm.guide,
            latitude: this.posInfoForm.latitude,
            longitude: this.posInfoForm.longitude
          };
          if (this.$route.query.action === 'edit') {
            temp = Object.assign({}, temp, { id: this.$route.query.id });
            if (JSON.stringify(this.editData) !== '{}') {
              temp = Object.assign({}, temp, this.editData);
            }
          } else {
            temp = Object.assign({}, temp, {
              province: this.posInfoForm.currentAddress[0]
                ? this.posInfoForm.currentAddress[0]
                : '',
              city: this.posInfoForm.currentAddress[1]
                ? this.posInfoForm.currentAddress[1]
                : '',
              county: this.posInfoForm.currentAddress[2]
                ? this.posInfoForm.currentAddress[2]
                : '',
              address: this.posInfoForm.address
            });
          }
          console.log(
            'StoreAddition index.vue methods handleSubmit',
            temp,
            this.basicInfoForm,
            this.posInfoForm
          );
          this.spinShow = true;
          this.axios({
            method: 'post',
            url: this.global_.path.baseUrl + '/rentalcars/store/saveData',
            headers: { 'Content-Type': 'application/json' },
            data: temp
          }).then(
            res => {
              console.log(
                'StoreAddition Index.vue created axios /store/saveData success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success({
                  content: res.data.message
                });
                this.$router.back();
              } else {
                this.$Message.error({
                  content: res.data.message
                });
              }
              this.spinShow = false;
            },
            err => {
              console.log(
                'StoreAddition Index.vue created axios /store/saveData failure',
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
      console.log('StoreAddition index.vue methods handleCancel');
      this.$router.back();
    },
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
        'StoreAddition index.vue methods handleSuccess',
        res,
        file,
        this.basicInfoForm.upload_list
      );
      file.name = res.data;
      file.url = this.global_.path.baseUrl + res.data;
    },
    handleError(res, file, fileList) {
      console.log(
        'StoreAddition index.vue methods handleError',
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
      console.log('StoreAddition index.vue methods handleFormatError', file);
      // this.$Message.warning({
      //   title: '图片格式错误',
      //   desc: ''
      // });
      this.errorText = '图片格式错误';
      this.$refs.formDynamic.validateField('upload_list');
    },
    handleMaxSize(file) {
      console.log('StoreAddition index.vue methods handleMaxSize', file);
      // this.$Message.warning({
      //   title: '图片过大',
      //   desc: ''
      // });
      this.errorText = '图片过大';
      this.$refs.formDynamic.validateField('upload_list');
    },
    handleBeforeUpload(file) {
      console.log('StoreAddition index.vue methods handleBeforeUpload', file);
      const check = this.basicInfoForm.upload_list.length < 5;
      if (!check) {
        this.$Message.warning({
          title: '上传图片不能超过5张'
        });
      }
      return check;
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
