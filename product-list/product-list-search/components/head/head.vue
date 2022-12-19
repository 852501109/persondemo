<template>
  <u-navbar :placeholder="true">
    <view slot="left" />
    <view
      slot="center"
      class="product-list-search-head"
    >
      <view
        :class="[$bem('search')]"
        class="d-flex align-items-center"
      >
        <view @tap.stop="goBack">
          <u-icon
            name="arrow-left"
            size="22"
            color="#1D2129"
          />
        </view>
        <view
          :class="[$bem('search', 'right')]"
          :style="{ height: btnHeight }"
        >
          <u-input
            border="surround"
            v-model="searchInput"
            placeholder="请输入商品名称"
            placeholder-style="font-size: 24rpx"
            color="#1D2129"
            confirm-type="search"
            @confirm="searchBack"
            :prefix-icon-style="{ fontSize: '48rpx' }"
          >
            <template slot="prefix">
              <image
                class="img-36-36"
                src="https://yilihuo-img.jsh.com/2022/12/07/93e8c23bc0eb4de084f58d7da806d947.png"
              />
            </template>
            <template slot="suffix">
              <text
                class="fs-28 fw-400"
                @tap="searchBack"
              >
                搜索
              </text>
            </template>
          </u-input>
        </view>
      </view>
    </view>
  </u-navbar>
</template>

<script src="./head.js"></script>
<style scoped lang="scss">
@import "../../../../../static/utils.scss";
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
$white: #fff;
.img-36-36 {
  position: relative;
  top: 5rpx;
  width: 36rpx;
  height: 36rpx;
}
.product-list-search-head {
  width: 100%;
  background: $white;
  box-sizing: border-box;
  color: var(--text-color-1);
  background: $white;
  margin-left: 35rpx;
  &_search {
    &--right {
      @include flex(row, space-between, center);
      position: relative;
      width: 440rpx;
      background: var(--background-color);
      border-radius: 34rpx;
      margin-left: 18rpx;
      ::v-deep input {
        font-size: 24rpx !important;
      }
      text {
        color: var(--brand-color);
      }
    }
  }
}
</style>
