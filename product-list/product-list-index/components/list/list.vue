<template>
  <view>
    <view v-if="isEmpty">
      <image
        class="img-510-360"
        src="https://yilihuo-img.jsh.com/2022/11/10/6c4a4ac3d44e4fb09909fe2216b87ea2.png"
      />
      <view class="empty-text">
        当前定位暂无商品，请到筛选重新定位
      </view>
    </view>
    <single-list
      @toDetail="toDetail"
      @scrolltolower="scrolltolower"
      v-if="status === 1 && list.length > 0"
      :list="list"
      :total="total"
      :is-loading="isLoading"
    />
    <waterfall
      @toDetail="toDetail"
      @scrolltolower="scrolltolower"
      v-if="status === 2 && list.length > 0"
      :list="list"
      :total="total"
      :is-loading="isLoading"
    />
  </view>
</template>
<script src="./list.js"></script>
<style scoped lang="scss">
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
.img-510-360 {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 510rpx;
  height: 360rpx;
  margin-top: 58rpx;
}
.loading {
  margin-top: 30vh;
}
.empty-text {
  width: 750rpx;
  height: 40px;
  font-size: 28rpx;
  font-weight: 400;
  color: #86909C;
  line-height: 40px;
  text-align: center;
}
.empty {
    @include flex(flex, center, center);
    position: absolute;
    left: 21rpx;
    top: 21rpx;
    width: 307rpx;
    line-height: 100%;
    text-align: center;
    color: #fff;
    font-size: 25rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 12rpx;
    image {
      width: 161rpx;
    }
  }
.ceil {

  > view:nth-child(1) {
    color: #323233;
    font-weight: 600;
    font-size: 36rpx;
    margin-top: 34rpx;
  }
  > view:nth-child(2) {
    color: #646566;
    margin-top: 20rpx;
    font-size: 22rpx;
  }
  > view:nth-child(3) {
    @include flex(row, flex-start, center);
    color: var(--highlight-color);
    margin-top: 54rpx;
    font-size: 36rpx;
    line-height: 37rpx;
  }
}
</style>
