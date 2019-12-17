<template>
  <div class="maintenance-detail-container">
    <div class="basic-info-container">
      <div class="header">
        <span
          >工单编号：{{ maintenanceDetail && maintenanceDetail.serialno }}</span
        >
      </div>
      <div class="content">
        <div class="left">
          <span>
            <span>填单人：</span>
            <span>{{
              maintenanceDetail && maintenanceDetail.creator_name
            }}</span>
          </span>
          <span>
            <span>填单时间：</span>
            <span>{{
              maintenanceDetail && maintenanceDetail.time_create
            }}</span>
          </span>
        </div>
        <div class="right">
          <div>
            <div>类型</div>
            <div>{{ maintenanceDetail && maintenanceDetail.service_name }}</div>
          </div>
          <div>
            <div>状态</div>
            <div>
              {{
                maintenanceDetail &&
                  getStatusNameByValue(maintenanceDetail.status)
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="other-container">
      <div class="maintenance-info-container">
        <div class="header">维保信息</div>
        <div class="content">
          <div class="left">
            <div class="image-container">
              <img :src="maintenanceDetail && (this.global_.path.baseUrl + maintenanceDetail.model_image)" />
            </div>
            <div class="text-container">
              <div>
                <span>车牌：</span>
                <span>{{
                  maintenanceDetail && maintenanceDetail.plate_num
                }}</span>
              </div>
              <div>
                <span>车型：</span>
                <span>{{
                  maintenanceDetail && maintenanceDetail.model_name
                }}</span>
              </div>
              <div>
                <span>颜色：</span>
                <span>{{ maintenanceDetail && maintenanceDetail.color }}</span>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="one">
              <div>
                <span>供应商：</span>
                <span>{{
                  maintenanceDetail && maintenanceDetail.provider_name
                }}</span>
              </div>
              <div>
                <span>价格：</span>
                <span
                  >{{
                    maintenanceDetail && maintenanceDetail.price_items
                  }}元</span
                >
              </div>
              <div>
                <span>项目：</span>
                <span>{{
                  maintenanceDetail && maintenanceDetail.service_name
                }}</span>
              </div>
            </div>
            <div class="two">
              <div>
                <span>预计返回时间：</span>
                <span>{{
                  maintenanceDetail && maintenanceDetail.time_end
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="check-info-container">
        <template v-if="maintenanceDetail.status === 2">
          <div class="header">验收信息</div>
          <div class="content">
            <div class="left">
              <div>
                <span>验收人：</span>
                <span>{{maintenanceDetail && maintenanceDetail.operator_name}}</span>
              </div>
              <div>
                <span>验收意见：</span>
                <span>{{maintenanceDetail && maintenanceDetail.note}}</span>
              </div>
            </div>
            <div class="right">
              <div>
                <span>实际返回时间：</span>
                <span>{{maintenanceDetail && maintenanceDetail.time_operate}}</span>
              </div>
              <div>
                <span>验收时间：</span>
                <span>{{maintenanceDetail && maintenanceDetail.time_operate}}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-if="maintenanceDetail.status === 1">
          <div class="header">验收</div>
          <Form
            ref="formDynamic"
            :model="formItem"
            :rules="ruleValidate"
            class="form-container"
            :label-width="120"
            label-colon
          >
            <!-- <FormItem label="返回时间" prop="time_end">
              <DatePicker
                v-model="formItem.time_end"
                type="datetime"
                placeholder="请选择返回时间"
                style="width: 200px"
              ></DatePicker>
            </FormItem> -->
            <FormItem label="价格" prop="price">
              <Input
                v-model="formItem.price"
                placeholder="请输入价格"
                style="width: 200px;"
              />
            </FormItem>
            <FormItem label="验收意见" prop="guide">
              <Input
                v-model="formItem.guide"
                maxlength="200"
                show-word-limit
                type="textarea"
                placeholder="请输入验收意见"
                style="width: 350px;"
                :rows="6"
              />
            </FormItem>
            <FormItem label="验收人" prop="author">
              <!-- <Input
                v-model="formItem.author"
                placeholder="请输入验收人"
                style="width: 200px"
                disabled
              ></Input> -->
              <div>{{ formItem.author }}</div>
            </FormItem>
            <div class="btn-container">
              <Button type="primary" @click="handleSubmit('formDynamic')"
                >提交</Button
              >
              <Button style="margin-left: 8px" @click="handleCancel()"
                >取消</Button
              >
            </div>
          </Form>
        </template>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  name: 'MaintenanceDetail',
  data: function() {
    return {
      statusList: [
        { name: '准备中', value: 0 },
        { name: '进行中', value: 1 },
        { name: '已完成', value: 2 }
      ],
      formItem: {
        // time_end: '',
        price: '0',
        guide: '',
        author: ''
      },
      ruleValidate: {
        // time_end: [
        //   {
        //     required: true,
        //     type: 'date',
        //     message: '请选择返回时间',
        //     trigger: 'change'
        //   }
        // ],
        price: [
          {
            required: true,
            message: '请输入价格',
            trigger: 'blur'
          }
        ],
        guide: [
          {
            required: true,
            message: '请输入验收意见',
            trigger: 'blur'
          }
        ]
      },
      maintenanceDetail: null,
      spinShow: true
    };
  },
  created() {
    this.axios({
      url:
        this.global_.path.baseUrl +
        '/rentalcars/ticket/detail/' +
        this.$route.query.id,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(
      res => {
        console.log(
          'MaintenanceDetail Index.vue created axios /ticket/detail/{id} success',
          res
        );
        if (res.data.code === 0) {
          this.$Message.success('操作成功');
          this.maintenanceDetail = res.data.data;
        } else {
          this.$Message.error({
            content: '操作失败'
          });
        }
        this.spinShow = false;
      },
      err => {
        console.log(
          'MaintenanceDetail Index.vue created axios /ticket/detail/{id} failure',
          err
        );
        this.$Message.error({
          content: '操作失败'
        });
        this.spinShow = false;
      }
    );
    this.formItem.author = this.$store.state.homeStore.userInfo.username;
  },
  mounted() {},
  computed: {},
  methods: {
    // 取消
    handleCancel() {
      console.log('MaintenanceDetail index.vue methods handleCancel');
      this.$router.back();
    },
    // 提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let temp = {
            id: this.maintenanceDetail.id,
            note: this.formItem.guide,
            // author: this.formItem.author,
            price: this.formItem.price
          };
          console.log('MaintenanceDetail index.vue methods handleSubmit', temp);
          this.axios({
            method: 'post',
            url: this.global_.path.baseUrl + '/rentalcars/ticket/check',
            headers: { 'Content-Type': 'application/json' },
            data: temp
          }).then(
            res => {
              console.log(
                'MaintenanceDetail Index.vue created axios /ticket/check success',
                res
              );
              if (res.data.code === 0) {
                this.$Message.success({
                  content: '操作成功'
                });
                this.maintenanceDetail = Object.assign({}, this.maintenanceDetail, res.data.data);
                // this.$router.back();
              } else {
                this.$Message.error({
                  content: '操作失败'
                });
              }
            },
            err => {
              console.log(
                'MaintenanceDetail Index.vue created axios /ticket/check failure',
                err
              );
              this.$Message.error({
                content: '操作失败'
              });
            }
          );
        } else {
          this.$Message.warning('有必填项未填写');
        }
      });
    },
    getStatusNameByValue(status) {
      let objTemp = this.statusList.slice().find(item => item.value === status);
      return objTemp.name;
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
