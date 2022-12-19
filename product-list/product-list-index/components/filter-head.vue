<template>
  <u-navbar :placeholder="true">
    <view
      slot="left"
      @tap="filterGoBack"
    >
      <u-icon
        name="arrow-left"
        size="22"
        color="#1D2129"
      />
    </view>
    <view
      slot="center"
      class="filter-head"
    >
      <view class="filter-head_text fw-600">
        筛选
      </view>
    </view>
  </u-navbar>
</template>
<script>
export default {
  methods: {
    filterGoBack () {
      this.$emit('filterGoBack')
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../../static/utils.scss";
@mixin flex(
  $direction: row,
  $justify-content: flex-start,
  $align-items: flex-start
) {
  box-sizing: border-box;
  display: flex;
  flex-direction: $direction;
  justify-content: $justify-content;
  align-items: $align-items;
}
@mixin height-center($h) {
  height: #{$h}rpx;
  line-height: #{$h}rpx;
}
::v-deep .placeholder-class {
  font-size: 12rpx;
}
::v-deep.u-navbar__content {
  margin-top: -1px;
}
.filter-head {
  width: 100%;
  height: 50rpx;
  font-size: 28rpx;
  text-align: center;
  &_text {
    color: #323233;
    font-size: 34rpx;
    font-weight: 600;
  }
}
</style>
