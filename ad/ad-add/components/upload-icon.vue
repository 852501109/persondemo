<template>
  <div class="upload-icon d-flex justify-content-center align-items-center cursor-pointer" @click="click">
    <i class="el-icon-plus fs-24 color-909"></i>
  </div>
</template>

<script>
export default {
  name: 'UploadIcon',
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-icon {
  width: 100px;
  height: 100px;
  background: #FCFDFF;
  border-radius: 6px;
  border: 1px dashed #DCDFE6;
  &:hover {
    border-color: #409EFF;
  }
}
</style>
