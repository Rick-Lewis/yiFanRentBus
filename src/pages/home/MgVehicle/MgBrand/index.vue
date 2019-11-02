<template>
  <div class="brand-container">
    <div class="filtrate-container">
      <Form :model="formItem" :label-width="85" inline>
        <FormItem label="品牌名称：">
          <Input v-model="formItem.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content-container">
      <Button type="primary" style="margin-bottom: 10px;">+新增</Button>
      <Table border :columns="columns12" :data="data6" stripe>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
        </template>
      </Table>
      <div class="page-container">
        <template>
          <Page :total="100" />
        </template>
      </div>
    </div>
  </div>
</template>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      formItem: {
        brandName: ''
      },
      columns12: [
        {
          title: 'Logo',
          key: 'logo'
        },
        {
          title: '品牌名称',
          key: 'name'
        },
        {
          title: '车辆数',
          key: 'vehicleNum'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data6: [
        {
          logo: '',
          name: 'John Brown',
          vehicleNum: 18
        },
        {
          logo: '',
          name: 'John Brown',
          vehicleNum: 18
        },
        {
          logo: '',
          name: 'John Brown',
          vehicleNum: 18
        },
        {
          logo: '',
          name: 'John Brown',
          vehicleNum: 18
        }
      ]
    };
  },
  methods: {
    handleSearch() {
      console.log('MgBrand index.vue handleSearch');
    },
    handleReset() {
      for (let item in this.formItem) {
        this.formItem[item] = '';
      }
    },
    // 删除行
    remove(index) {
      this.data6.splice(index, 1);
    },
    // 编辑行
    edit(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.brand-container {
  margin: 20px;
  min-height: 260px;
  .filtrate-container {
    background-color: #fff;
    padding: 20px 20px 0 20px;
  }
  .content-container {
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
    .page-container {
      text-align: right;
      margin-top: 20px;
    }
  }
}
</style>
