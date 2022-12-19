<template>
  <u-navbar :placeholder="true">
    <view slot="left" />
    <view
      slot="center"
      class="product-list-index-head"
    >
      <view
        :class="[$bem('search')]"
        class="d-flex align-items-center"
        @tap.stop="goBack"
      >
        <view :class="[$bem('search', 'left')]">
          <u-icon
            name="arrow-left"
            size="22"
            color="#1D2129"
          />
        </view>
        <view
          :class="[$bem('search', 'right')]"
          @tap.stop="toSearch"
          :style="{ height: btnHeight }"
        >
          <view class="item-name">
            <image
              class="img-36 custom-search"
              src="https://yilihuo-img.jsh.com/2022/12/07/93e8c23bc0eb4de084f58d7da806d947.png"
            />
            <text
              v-if="itemName"
              class="item-text"
            >
              {{ itemName }}
            </text>
            <text
              v-if="!itemName"
              class="item-placeholder"
            >
              请输入商品名称查询
            </text>
          </view>
          <view class="search-text">
            <text class="fs-28 fw-400">
              搜索
            </text>
          </view>
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
.overflow-hidden-one {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.img-36-36 {
  position: relative;
  top: 0rpx;
  width: 36rpx;
  height: 36rpx;
}
.h-12 {
  height: 12rpx;
}

.img-36 {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}
.custom-search {
  margin-top: 0rpx !important;
}
.img-25-12 {
  width: 29rpx;
  height: 12rpx;
}
::v-deep .u-input__conten {
  background: #f00 !important;
}
.product-list-index-head {
  width: 100vw;
  background: #fff;
  &_search {
    box-sizing: border-box;
    color: var(--text-color-1);
    background: #fff;
    margin-left: 12rpx;
    &--right {
      @include flex(row, space-between, center);
      width: 440rpx;
      background: var(--background-color);
      border-radius: 34rpx;
      margin-left: 18rpx;
      color: var(--text-color-1);
      font-size: 28rpx;
      padding: 0 16rpx 0 19rpx;
      .item-name {
        @include flex(row, flex-start, center);
        .item-text {
          display: inline-block;
          width: 263rpx;
          color: var(--text-color-1);
          margin-left: 20rpx;
          @extend .overflow-hidden-one;
        }
        .item-placeholder {
          color: var(--text-color-4);
          margin-left: 20rpx;
        }
      }
      .search-text {
        text {
          color: var(--brand-color);
        }
      }
    }
  }
}
</style>
