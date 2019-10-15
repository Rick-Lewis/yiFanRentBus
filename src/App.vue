<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
// 自定义radio样式
.ivu-radio-group-item {
  padding: 5px 8px;
  background-color: #fff;
  border-radius: 3px;
  margin-right: 20px;
  line-height: 1.5;
  & > .ivu-radio {
    display: none;
  }
  &.ivu-radio-wrapper-checked {
    background-color: #2d8cf0;
    color: #fff;
  }
}
</style>
