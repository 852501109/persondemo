<template>
  <div class="title">
    <div>{{ title }}</div>
    <div class="title-line"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 18px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #303133;
    &-line {
      width: 100%;
      height: 1px;
      border-top: 1px solid #DFE6EC;
      margin-top: 14px;
    }
  }
</style>
