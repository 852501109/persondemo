<template>
  <view>
    <view
      class="ship-to"
    >
      <view :class="[$bem('head')]">
        配送至
        <vieW
          :class="[$bem('head--close')]"
          @tap="close"
        >
          <u-icon
            name="close"
            color="#C9CDD4"
            size="15"
          />
        </vieW>
      </view>
      <view
        :class="[$bem('empty')]"
        v-if="false"
      >
        <view>请您授权位置信息，以便为您搜索附近门店</view>
        <view>授权</view>
      </view>
      <view :class="[$bem('position')]">
        <view class="d-flex align-items-center">
          <view>
            <image
              mode="heightFix"
              class="img-25"
              src="https://yilihuo-img.jsh.com/2022/11/22/9842176485e24b08ba3d6265b1895e17.png"
            />
          </view>
          <view class="fs-26">
            {{ shipToAddressFourLevel }}
          </view>
          <view>
            <u-icon
              name="arrow-right"
              color="#C9CDD4"
              size="13"
              @tap="close"
            />
          </view>
        </view>
        <view @tap="getLocation">
          重新定位
        </view>
      </view>
      <view :class="[$bem('content')]">
        <view v-if="harvestList.length === 0 && !isLoading">
          <image
            class="img-510-360"
            src="https://yilihuo-img.jsh.com/2022/11/10/6c4a4ac3d44e4fb09909fe2216b87ea2.png"
          />
          <view class="empty">
            暂无地址
          </view>
        </view>
        <scroll-view
          scroll-y="true"
          style="height:565rpx;"
        >
          <view
            v-for="(i, n) in harvestList"
            :key="n"
            @tap.stop="chooseDefault(i)"
            class="scroll"
          >
            <view>
              <view class="receiver-name">
                {{ i.receiverName | filterElipse }}
              </view><text v-if="i.defaultFlag === 1">
                默认
              </text>
            </view>
            <view>
              <view>{{ `${i.provinceName || ''}${i.cityName || ''}${i.districtName || ''}${i.streetName || ''}${i.fullAddress || ''}` }}</view>
              <view @tap.stop="toEditAddress(i, n)">
                <image
                  class="img-40-40"
                  src="https://yilihuo-img.jsh.com/2022/11/17/51f07707b5f646d19e35bbaea09b7b6c.png"
                />
              </view>
              <view
                @tap.stop="deleteAddress(i, n)"
              >
                <image
                  class="img-40-40"
                  src="https://yilihuo-img.jsh.com/2022/11/17/85c079b1de2a4f92b9c6448b31035bc0.png"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="ship-to_footer">
      <view
        @tap="toAddAddress"
        class="fs-28"
      >
        新增收货地址
      </view>
    </view>
  </view>
</template>

<script src="./ship-to.js"></script>

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
.img-510-360 {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 510rpx;
  height: 360rpx;
  margin-top: 58rpx;
}
.img-25 {
  position: relative;
  height: 26rpx !important;
  top: 3rpx;
}
.empty {
  width: 120rpx;
  height: 40px;
  font-size: 28rpx;
  font-weight: 400;
  color: #86909C;
  line-height: 40px;
  margin: 0 auto;
  text-align: center;
}
.img-40-40 {
  width: 40rpx;
  height: 40rpx;
}
.left-title {
  color: var(--text-color-1);
  font-size: 26rpx;
  font-weight: 600;
}
.overflow-hidden {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; // 默认不换行；
}
.overflow-hidden-two {
  overflow: hidden; //溢出内容隐藏
  text-overflow: ellipsis; //文本溢出部分用省略号表示
  display: -webkit-box; //特别显示模式
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical; //盒子中内容竖直排列
}
.overflow-hidden-one {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ship-to {
  height: 65vh;
  text-align: left!important;
  border-radius: 40rpx 40rpx 0px 0px;
  &_head {
    position: relative;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    color: var(--text-color-1);
    font-size: 32rpx;
    font-weight: 500;
    &--close {
      position: absolute;
      right: 8rpx;
      top: 34rpx;
    }
  }
  &_position {
    @include flex(row, space-between, center);
    padding: 28rpx 24rpx;
    background: #fff;
    > view:nth-child(1) {
      color: var(--text-color-1);
      font-size: 26rpx;
      > view:nth-child(2) {
        max-width: 312rpx;
        margin: 0 13rpx 0 21rpx;
        @extend .overflow-hidden;
      }
    }
    > view:nth-child(2) {
      color: var(--brand-color);
      font-size: 26rpx;
    }
  }
  &_empty {
    @include flex(row, space-between, center);
    padding: 26rpx 30rpx;
    background: var(--brand-secondary-color);
    view:nth-child(1) {
      color: var(--brand-color);
      font-size: 26rpx;
    }
    view:nth-child(2) {
      background: var(--brand-color);
      color: #fff;
      white-space: nowrap;
      text-align: center;
      padding: 10rpx 30rpx;
      border-radius: 40px;
      font-size: 28rpx;
    }
  }
  .receiver-name {
    display: inline-block;
  }
  &_content {
    height: 565rpx;
    background: #F7F8FA;
    // overflow-y: auto;
    padding: 0 24rpx;
    .scroll {
      box-sizing: border-box;
      padding: 24rpx;
      background: #ffffff;
      border-radius: 24rpx;
      margin-top: 16rpx;
      > view:nth-child(1) {
        color: var(--text-color-1);
        font-weight: 600;
        font-size: 28rpx;
        text {
          display: inline-block;
          background: var(--highlight-color);
          margin-left: 10rpx;
          color: #fff;
          border-radius: 16rpx;
          height: 32rpx;
          line-height: 32rpx;
          width: 64rpx;
          text-align: center;
          font-size: 24rpx;
        }
      }
      > view:nth-child(2) {
        @include flex(row, space-between, center);
        > view:nth-child(1) {
          width: 498rpx;
          color: var(--text-color-2);
          font-size: 26rpx;
          padding-top: 16rpx;
        }
        > view:nth-child(2) {
          margin-left: 24rpx;
        }
        > view:nth-child(3) {
          margin-left: 32rpx;
        }
      }
    }
  }
  &_footer {
    position: fixed;
    bottom: 0;
    height: 168rpx;
    width: 100vw;
    background: #fff;
    padding-top: 10rpx;
    view {
      width: 686rpx;
      font-weight: bold;
      padding: 22rpx 0;
      box-sizing: border-box;
      background: var(--brand-color);
      border-radius: 40rpx;
      color: #fff;
      margin: 0 auto;
      text-align: center;
    }
  }
}
</style>
