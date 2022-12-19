<template>
  <configProvider>
    <u-modal
      :show="clearShow"
      close-on-click-overlay
      show-cancel-button
      cancel-color="#1D2129"
      @confirm="clearHisSure"
      @cancel="closeModal"
      @close="closeModal"
      :confirm-color="brandColor"
      ref="uModal"
    >
      <template #default>
        <view class="text-center">
          请问是否删除所有搜索记录？
        </view>
      </template>
    </u-modal>
    <searhHead :from="from" />
    <view class="product-list-search">
      <view
        class="d-flex justify-content-between"
        v-if="hisList.length > 0"
      >
        <view class="d-flex">
          <image
            class="img-36-36"
            :src="
              imgUrl(
                'https://yilihuo-img.jsh.com/2022/12/07/522734a9f4b84481accfe65fd405c461.png'
              )
            "
          />
          <text class="fw-600 fs-28 ml-5">
            历史搜索
          </text>
        </view>
        <view
          class="d-flex"
          @tap="clearHis"
        >
          <image
            class="img-36-36"
            :src="
              imgUrl(
                'https://yilihuo-img.jsh.com/2022/12/07/28f8145bb6ea46c3a9a52e65d2a3a400.png'
              )
            "
          />
          <text class="fw-400 fs-26 ml-5 clear">
            清空
          </text>
        </view>
      </view>
      <view
        :class="[$bem('his')]"
        class="content-his d-flex flex-wrap-wrap"
      >
        <view
          v-for="i in hisList"
          :key="i"
          class="fs-26"
          @tap="toResult(i)"
        >
          {{ i }}
        </view>
      </view>
      <view :class="[$bem('hot')]">
        <view
          :class="[$bem('hot--title')]"
          class="fs-28 fw-600"
        >
          热销商品
        </view>
        <view>
          <view
            class="item"
            v-for="(i, n) in hotList"
            :key="i"
            @tap="toDetail(i)"
          >
            <view class="index">
              {{ n + 1 }}
            </view>
            <view class="image">
              <image
                :src="i.pictureUrl"
                class="img-100-100"
                mode="widthFix"
              />
            </view>
            <view class="detail">
              <view class="fs-26 color-1D2129">
                {{ i.itemName }}
              </view>
              <view class="fs-24 color-86909C">
                人气值{{ i.popularity }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </configProvider>
</template>

<script src="./product-list-search.js"></script>

<style scoped lang="scss">
@import "../../../static/utils.scss";

@mixin flex(
  $direction: row,
  $justify-content: flex-start,
  $align-items: flex-start,
  $wrap: nowrap
) {
  box-sizing: border-box;
  display: flex;
  flex-direction: $direction;
  justify-content: $justify-content;
  align-items: $align-items;
  flex-wrap: $wrap;
}
.overflow-hidden {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; // 默认不换行；
}

.img-36-36 {
  width: 36rpx;
  height: 36rpx;
}
.img-100-100 {
  width: 100rpx !important;
  height: 100rpx !important;
  border-radius: 8rpx;
}
.product-list-search {

  background: #fff;
  padding: 0 16rpx;
  > view {
    width: 100%;
  }
  .clear {
    color: var(--text-color-2);
  }
  &_hot {
    position: relative;
    box-sizing: border-box;
    background-image: url(https://yilihuo-img.jsh.com/2022/11/22/33d11534d120408f88abcf4920c3a98c.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
    border-radius: 24rpx 24rpx 0px 0px;
    padding: 32rpx 24rpx;
    margin-top: 40rpx;
    &--title {
      margin-bottom: 24rpx;
      color: var(--text-color-1);
    }
    .item:nth-child(1) {
      .index {
        color: #e02020;
      }
    }
    .item:nth-child(2) {
      .index {
        color: #fa6400;
      }
    }
    .item:nth-child(3) {
      .index {
        color: #f7b500;
      }
    }
    .item {
      @include flex(row, flex-start, center);
      margin-bottom: 34rpx;
      .image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 8rpx;
        margin-right: 17rpx;
      }
      .index {
        margin-right: 17rpx;
        font-size: 26rpx;
      }
      .detail {
        height: 85rpx;
        @include flex(column, space-between, flex-start);
        > view:nth-child(1) {
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; // 默认不换行；
          width: 520rpx;
        }
      }
    }
  }
  padding: 34rpx 32rpx 0 32rpx;
  &_his {
    margin-top: 32rpx;
    > view {
      max-width: 200rpx;
      margin-right: 20rpx;
      margin-bottom: 15rpx;
      background: var(--background-color);
      border-radius: 30rpx;
      padding: 11rpx 28rpx;
      font-size: 26rpx;
      color: var(--text-color-2);
      @extend .overflow-hidden;
    }
  }
}
</style>
