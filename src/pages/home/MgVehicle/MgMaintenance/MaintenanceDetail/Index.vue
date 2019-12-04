<template>
  <div class="maintenance-detail-container">
    <div class="basic-info-container">
      <div class="header">
        <span>工单编号：{{ orderDetail && orderDetail.order.order_no }}</span>
      </div>
      <div class="content">
        <div class="left">
          <span>
            <span>填单人：</span>
            <span>曲丽丽</span>
          </span>
          <span>
            <span>填单时间：</span>
            <span>2017-01-10 10:00:00</span>
          </span>
        </div>
        <div class="right">
          <div>
            <div>类型</div>
            <div>清洁</div>
          </div>
          <div>
            <div>状态</div>
            <div>进行中</div>
          </div>
        </div>
      </div>
    </div>
    <div class="other-container">
      <div class="maintenance-info-container">
        <div class="header">维保信息</div>
        <div class="content">
          <div class="left">
            <div class="image-container"><img src="" /></div>
          </div>
          <div class="right">
            <div>
              <div><span>供应商：</span><span></span></div>
              <div><span>价格：</span><span></span></div>
              <div><span>项目：</span><span></span></div>
            </div>
            <div>
              <div><span>预计返回时间：</span><span></span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="check-info-container">
        <template>
          <div class="header">验收信息</div>
          <div class="content">
            <div class="left">
              <div><span>验收人：</span><span></span></div>
              <div><span>验收意见：</span><span></span></div>
            </div>
            <div class="right">
              <div><span>实际返回时间：</span><span></span></div>
              <div><span>验收时间：</span><span></span></div>
            </div>
          </div>
        </template>
        <template>
          <div class="header">验收</div>
          <Form
            ref="formDynamic"
            :model="formItem"
            class="content"
            :rules="ruleValidate"
            :label-width="120"
            label-colon
          >
            <FormItem label="返回时间">
              <DatePicker
                v-model="basicInfoForm.time_end"
                type="datetime"
                placeholder="请选择返回时间"
                style="width: 200px"
              ></DatePicker>
            </FormItem>
            <FormItem label="验收意见" prop="guide">
              <Input
                v-model="posInfoForm.guide"
                maxlength="200"
                show-word-limit
                type="textarea"
                placeholder="请输入验收意见"
                style="width: 350px;"
                :rows="6"
              />
            </FormItem>
            <FormItem label="验收人">
              <Input
                v-model="basicInfoForm.author"
                placeholder="请输入验收人"
                style="width: 200px"
                disabled
              >
              </Input>
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
          this.$Message.info('操作成功');
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
  },
  mounted() {},
  computed: {},
  methods: {},
  components: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
