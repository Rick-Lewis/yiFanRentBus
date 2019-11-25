<template>
  <div class="workspace-container">
    <div class="platform-mg">
      <div class="header">平台管理</div>
      <div class="content">
        <div class="card">
          <div class="img-container">
            <img src />
          </div>
          <div class="text">价格调整</div>
        </div>
        <div class="card">
          <div class="img-container">
            <img src />
          </div>
          <div class="text">新增车型</div>
        </div>
      </div>
    </div>
    <div class="shop-mg">
      <div class="header">门店管理</div>
      <div class="content">
        <div class="left">
          <Tabs :animated="false" style="padding:10px;">
            <TabPane :label="label">
              <div class="item-container" v-for="(item, index) in todayVehicleList" v-bind:key="index">
                <div class="item-header">
                  <span>下单时间：{{ item.time_create }}</span>
                  <span style="padding-left: 15px;">订单编号：{{ item.order_no }}</span>
                  <!-- <span style="padding-left: 15px;">司机：王大伟</span> -->
                </div>
                <div class="item-content">
                  <div class="col-item info">
                    <div>
                      <img
                        :src="global_.path.baseUrl + item.model_image"
                        style="width: 130px; height: 88px;"
                      />
                    </div>
                    <div style="padding-left: 10px;">
                      <div>{{ item.plate_num }}</div>
                      <div>{{ item.model_name }}</div>
                      <div>￥{{ item.price_unit }}/日均</div>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item" style="text-align: center;">
                    <div>{{ item.telephone }}</div>
                    <div>微信：{{ item.nick_name }}</div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item duration">
                    <div class="start">
                      <div>{{ item.time_start.split(' ')[0] }}</div>
                      <div>{{ item.time_start.split(' ')[1] }}</div>
                    </div>
                    <div class="time">
                      <div>{{ item.days }}</div>
                    </div>
                    <div class="end">
                      <div>{{ item.time_end.split(' ')[0] }}</div>
                      <div>{{ item.time_end.split(' ')[1] }}</div>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item">
                    <div>
                      <Tag color="warning">
                        <!-- {{
                        orderStatusList[haneleIndexByStatus(item.status)].name
                        }} -->
                      </Tag>
                    </div>
                  </div>
                  <div class="string"></div>
                  <div class="col-item" style="width: 170px; text-align:center;">
                    <a @click="handleOperate(index, 'refund')" v-if="item.status === 1">退款</a>
                    <a
                      @click="handleOperate(index)"
                      v-if="item.status === 1 || item.status === 3"
                    >{{ getOperateText(index) }}</a>
                    <a @click="show(index)">订单详情</a>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane label="今日还车">今日还车</TabPane>
          </Tabs>
        </div>
        <div class="right">
          <div class="header">快捷功能</div>
          <div class="content">
            <div class="card">
              <div class="img-container">
                <img src />
              </div>
              <div class="text">价格调整</div>
            </div>
            <div class="card">
              <div class="img-container">
                <img src />
              </div>
              <div class="text">新增车型</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vehicle-online">
      <div class="header">在租车辆</div>
      <div class="content"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Workspace',
  data: function() {
    return {
      label: h => {
        return h('div', [
          h('span', '今日取车'),
          h('Badge', {
            props: {
              count: 10
            }
          })
        ]);
      },
      todayVehicleList: [
        {
          days: 2,
          let_litre: '2.0',
          model_image:
            '/images/vehicle_model/6afbe672-8e3b-40fd-a4f1-8065c04f42b0_1573960512752.jpeg',
          model_name: '别克GL8',
          nick_name: 'Rick',
          order_no: '019111839000193',
          plate_num: '粤B123458',
          price_total: 0.03,
          price_unit: 0.01,
          seat_count: 7,
          status: -1,
          store_drop_off_name: '一帆租车旗舰店',
          store_pick_up_name: '一帆租车旗舰店',
          telephone: '15921833510',
          time_create: '2019-11-18 21:26:37',
          time_end: '2019-11-20 10:00:00',
          time_start: '2019-11-18 10:00:00'
        }
      ]
    };
  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
