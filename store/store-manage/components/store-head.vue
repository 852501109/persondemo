<template>
  <div class="title fs-18 fw-400">
    <div>{{ title }}</div>
    <div class="line"></div>
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
    color: #303133;
    .line {
      width: 100%;
      height: 1px;
      border-top: 1px solid #DFE6EC;
      margin-top: 14px;
    }
  }
</style>
