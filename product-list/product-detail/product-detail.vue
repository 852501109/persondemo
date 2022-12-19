<template>
  <configProvider>
    <view class="product-detail">
      <!-- banner -->
      <view :class="[$bem('banner')]">
        <swiper
          :class="[$bem('banner--swiper')]"
          @change="swiperChange"
        >
          <!-- 视频 -->
          <swiper-item
            v-for="item in detailData.videoList"
            :key="item"
          >
            <video-player
              v-if="mainPictureUrl"
              width="100%"
              height="100%"
              :show-fullscreen-btn="false"
              :enable-progress-gesture="false"
              enable-play-gesture
              :cover="mainPictureUrl"
              :video-id="item.videoCode"
              :source="item.videoUrl"
              ref="videoPlayerInBannerRef"
            />
          </swiper-item>
          <!-- 图片 -->
          <swiper-item
            v-for="item in detailData.pictureList"
            :key="item"
          >
            <image
              @tap.stop="previewBanner(detailData.pictureList)"
              :src="imgUrl(item.pictureUrl)"
              mode="widthFix"
            />
          </swiper-item>
        </swiper>
        <view :class="[$bem('banner--tips')]">
          <view class="ft-30 fw-600">
            <image
              class="img-48-48"
              src="https://yilihuo-img.jsh.com/2022/11/22/41f65cbb1fc64715aab47f5cfcfa33de.png"
            />
            官方正品
          </view>
          <view />
          <view class="ft-30 fw-600">
            <image
              class="img-48-48"
              src="https://yilihuo-img.jsh.com/2022/11/22/f88bbadc190a40028046c33663d7baf3.png"
            />
            送装同步
          </view>
          <view />
          <view class="ft-30 fw-600">
            <image
              class="img-48-48"
              src="https://yilihuo-img.jsh.com/2022/11/22/30203bf98bbb4615a7376d13dbe68bc9.png"
            />
            全国联保
          </view>
        </view>
      </view>
      <!-- 价格优惠等信息 -->
      <view :class="[$bem('content')]">
        <!--   优惠券领券     -->
        <get-coupon
          :product-code="detailData.productCode"
          :item-name="detailData.itemName"
        />
        <view :class="[$bem('content--price')]">
          <view class="fw-600">
            <view class="fs-28">
              ￥
            </view>
            <view>{{ (detailData.retailPrice || 0) | money(2, '', false, true) }}</view>
          </view>
          <view class="d-flex">
            <view>销量：{{ detailData.salesVolume }}</view>
            <view class="d-flex">
              <view
                @tap="collect(true)"
                v-if="!detailData.starStatus"
              >
                <image
                  class="img-36-36"
                  src="https://yilihuo-img.jsh.com/2022/11/22/6e260b17a5424001a78b89a61643c381.png"
                />
              </view>
              <view
                @tap="collect(false)"
                v-if="detailData.starStatus"
              >
                <image
                  class="img-36-36"
                  src="https://yilihuo-img.jsh.com/2022/11/22/70b86df6433c428197456fa9cbf0454e.png"
                />
              </view>
              <view :class="[detailData.starStatus ? 'collect-active' : '']">
                收藏
              </view>
            </view>
          </view>
        </view>
        <view
          :class="[$bem('content--info')]"
          class="fw-600"
        >
          {{ detailData.itemName }}
        </view>
        <view
          :class="[$bem('content--characteristic')]"
          v-if="detailData && detailData.itemSellingPoint.length > 0"
        >
          <view>{{ detailData.itemSellingPoint.join(" | ") }}</view>
        </view>
      </view>
      <!-- 权益 -->
      <right-detail
        :product-code="detailData.productCode"
        :product-price="detailData.retailPrice"
        :item-name="detailData.itemName"
      />
      <!-- 送至 -->
      <view
        :class="[$bem('to')]"
        @tap="openShipTo"
      >
        <view class="left">
          <view>送至</view>
          <view>
            <view class="d-flex">
              <view>
                <image
                  v-if="shipToAddress.address.fullAddress !== '请选择地址'"
                  mode="heightFix"
                  class="img-36 mr-8"
                  src="https://yilihuo-img.jsh.com/2022/11/22/9842176485e24b08ba3d6265b1895e17.png"
                />
              </view>

              <view class="overflow-hidden-two">
                {{
                  shipToAddressFourLevel
                }}
              </view>
            </view>
            <view v-if="(shipToAddress.address.fullAddress !== '请选择地址' && isInStock !== null)">
              <text
                v-if="isInStock"
                class="has"
              >
                现货
              </text>
              <text
                v-if="!isInStock"
                class="no"
              >
                无货
              </text>
              <text v-if="isInStock">
                {{ shipToPromiseMsg }}
              </text>
            </view>
          </view>
        </view>
        <view>
          <u-icon
            name="arrow-right"
            color="#C9CDD4"
            size="13"
          />
        </view>
      </view>
      <!-- 运费 -->
      <view :class="[$bem('freight')]">
        <view :class="[$bem('freight--line')]" />
        <view :class="[$bem('freight--mode')]">
          <view class="fs-28">
            运费
          </view>
          <view class="fs-28">
            包邮
          </view>
        </view>
      </view>
      <!-- 附近门店 -->
      <view
        :class="[$bem('nearby')]"
        v-if="shipToAddress.address.fullAddress !== '请选择地址'"
        class="d-flex"
      >
        <view>附近门店</view>
        <view
          @tap="toNearByStores"
          class="d-flex"
        >
          <text>去附近门店看实物</text>
          <u-icon
            name="arrow-right"
            color="#C9CDD4"
            size="13"
          />
        </view>
      </view>
      <!-- 详情售后 -->
      <view :class="[$bem('detail')]">
        <view
          :class="{'is-fixed': isFixed}"
          id="scrollId"
        >
          <u-tabs
            :list="tabList"
            @tap="changeItemDescribe"
            line-width="50"
            :line-color="primarySecondaryColor"
            @change="detailReport"
          />
        </view>
        <view :class="[$bem('detail--images')]">
          <p
            v-if="itemDescribe === 1"
            v-html="formatRichText"
          />
          <view
            v-if="itemDescribe === 2"
            class="attributes-info"
          >
            <view
              v-for="(i, n) in attributesInfo"
              :key="n"
            >
              <view>{{ i[0] }}</view>
              <view>{{ i[1] }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部操作栏 -->
      <shop-fixed-bar background="#fff">
        <view
          :class="[$bem('footer')]"
          v-if="(detailData.itemName && shipToAddressFourLevel && isInStock !== null)"
          class="d-flex align-items-end"
        >
          <view class="d-flex align-items-end">
            <view
              class="fs-20 text-center position-relative"
              @tap="reportShare"
            >
              <image
                class="img-44-44"
                src="https://yilihuo-img.jsh.com/2022/11/15/5f20c4b3dd9549919a36e2ee6232a6c9.png"
              />
              <view>分享</view>
              <button
                open-type="share"
                class="share-button position-absolute"
              />
            </view>
            <!-- 客服ui先保留，用到此UI直接解开注释 -->
            <!-- <view>
              <image
                class="img-44-44"
                src="https://yilihuo-img.jsh.com/2022/11/17/65beb89a75584669843a37be7a199ebe.png"
              />
              <view>客服</view>
            </view> -->
            <view
              @tap="toShopingCart"
              class="cart text-center"
            >
              <image
                class="img-44-44"
                src="https://yilihuo-img.jsh.com/2022/11/15/3a615caa61964d59a5ede6f5cc56af77.png"
              />
              <view>购物车</view>
              <detail-badge
                :value="cartProductNum"
                type="highlight"
                horizontal="left"
                :offset="[-3, 22]"
              />
            </view>
          </view>
          <view :class="[$bem('footer--right')]">
            <view
              v-if="immediatelyLogin"
              :class="[$bem('footer--right_login')]"
              @tap="login"
            >
              <view>立即登录</view>
            </view>
            <view
              v-else-if="shipToAddress.address.fullAddress === '请选择地址' || (isInStock && goodsIsSelling)"
              :class="[$bem('footer--right_user')]"
            >
              <view
                @tap="addToCart"
                class="fs-28"
              >
                加入购物车
              </view>
              <view
                @tap="toSettlement"
                class="fs-28"
              >
                立即购买
              </view>
            </view>

            <!-- 统仓获取无货 -->
            <view
              v-else-if="!isInStock && goodsIsSelling"
              :class="[$bem('footer--right_nostock')]"
            >
              <view>无货</view>
            </view>
            <!-- 商品已下架 -->
            <view
              v-else-if="!goodsIsSelling"
              :class="[$bem('footer--right_nostock')]"
            >
              <view>商品已下架</view>
            </view>
          </view>
        </view>
      </shop-fixed-bar>
    </view>
    <!-- 送至详情弹框 -->
    <u-action-sheet
      :show="isShipToShow"
      :round="10"
      mode="bottom"
      @close="shipToClose"
      @touchmove.stop
    >
      <shipTo
        v-if="isShipToShow"
        @close="shipToClose"
        @chooseAddress="chooseAddress"
        @delHarvest="delHarvest"
        :ship-to-address="shipToAddress"
        :harvest-list="harvestList"
      />
    </u-action-sheet>
  </configProvider>
</template>

<script src="./product-detail.js"></script>

<style scoped lang="scss">
@import "../../../static/utils.scss";
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
.overflow-hidden-two {
  overflow: hidden; //溢出内容隐藏
  text-overflow: ellipsis; //文本溢出部分用省略号表示
  display: -webkit-box; //特别显示模式
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical; //盒子中内容竖直排列
  word-break: break-all;
}
.img-44-44 {
  position: relative;
  width: 44rpx !important;
  height: 44rpx !important;
}
.img-48-48 {
  position: relative;
  width: 48rpx !important;
  height: 48rpx !important;
}
.img-36-36 {
  position: relative;
  width: 36rpx !important;
  height: 36rpx !important;
}
::v-deep .rich-text-image {
  width: 750rpx !important;
}
.img-36 {
  position: relative;
  top: 5rpx;
  width: 36rpx !important;
  height: 36rpx !important;
}
.item {
  @include flex(row, space-between, center);
  padding: 34rpx 32rpx;
  background: #fff;
  margin-top: 16rpx;
  font-size: 30rpx;
}
::v-deep .u-tabs__wrapper__nav__item__text {
  font-size: 30rpx !important;
}
.attributes-info {
  padding: 30rpx 20rpx 0 120rpx;
  font-size: 30rpx;
  > view {
    @include flex(row, flex-start, center);
    margin-bottom: 30rpx;
    > view:nth-child(1) {
      width: 300rpx;
      text-align: left;
      color: var(--text-color-3);
    }
    > view:nth-child(2) {
      width: 290rpx;
      @include flex(row, flex-start);
      margin-left: 40rpx;
      color: var(--text-color-1);
      word-break: break-all;
    }
  }
}
.share-button {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  opacity: 0;
}
// ::v-deep .uicon-arrow-right,
// ::v-deep .uicon-star,
// ::v-deep .uicon-star-fill {
//   font-size: 23rpx !important;
//   top: 2rpx !important;
// }
.collect-active {
  color: var(--brand-color);
}
.product-detail {
  background: var(--background-color);
  overflow-x: hidden;
  // padding-bottom: 168rpx;
  &_banner {
    position: relative;
    .play-bth {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100rpx;
    }
    &--tips {
      @include flex(row, space-between, center);
      color: #fff;
      height: 87rpx;
      background: #323233;
      padding: 0 30rpx;
      view {
        @include flex(row, space-between, center);
        image {
          margin-right: 14rpx;
        }
      }
      > view:nth-child(2) {
        height: 50rpx;
        opacity: 0.6;
        border-left: 1rpx solid #ffffff;
      }
      > view:nth-child(4) {
        height: 50rpx;
        opacity: 0.6;
        border-left: 1rpx solid #ffffff;
      }
    }
    &--swiper {
      height: 712rpx;
      image {
        width: 100vw;
        height: 100%!important;
      }
      video {
        width: 100vw;
        height: 100%!important;
      }
    }
    width: 100vw;

  }
  &_content {
    padding: 24rpx 32rpx 32rpx 32rpx;
    background: #fff;
    &--price {
      @include flex(row, space-between, center);
      font-size: 28rpx;
      margin-top: 12rpx;
      > view:nth-child(1) {
        @include flex(row, space-between, baseline);
        color: var(--highlight-color);
        font-size: 48rpx;
        >view:nth-child(1) {
          position: relative;
          bottom: 2rpx;
        }
      }
      > view:nth-child(2) {
        font-size: 26rpx;
        color: var(--text-color-3);
        > view:nth-child(1) {
          margin-right: 51rpx;
        }
        > view:nth-child(2) {
          image {
            margin-right: 8rpx;
          }
        }
      }
    }
    &--info {
      color: var(--text-color-1);
      font-size: 34rpx;
      margin-top: 16rpx;
    }
    &--characteristic {
      display: inline-block;
      background: var(--primary-thirdly-color);
      color: var(--primary-color);
      font-size: 24rpx;
      margin-top: 22rpx;
      padding: 14rpx 16rpx;
      border-radius: 4px;
      view {
        display: inline-block
      }
    }
  }
  &_to {
    @extend .item;
    .left {
      @include flex(row, flex-start, flex-start);
      > view:nth-child(1) {
        font-size: 30rpx;
        width: 89rpx;
      }
      > view:nth-child(2) {
        > view:nth-child(1) {
          font-size: 28rpx;
          color: var(--text-color-1);
          width: 540rpx;
        }
        margin-left: 29rpx;
        > view:nth-child(2) {
          margin-top: 20rpx;
          font-size: 24rpx;
          color: var(--text-color-3);
          text.has {
            color: #c6925c;
            margin-right: 16rpx;
          }
          text.no {
            color: #191919;
          }
        }
      }
    }
  }
  &_freight {
    padding-bottom: 30rpx;
    background: #fff;
    &--line {
      width: 686rpx;
      margin: 0 auto;
      height: 1rpx;
      background: #ebedf0;
    }
    &--mode {
      @include flex(row, flex-start, flex-start);
      color: var(--text-color-1);
      padding: 28rpx 0 0 32rpx;
      > view:nth-child(1) {
        margin-right: 36rpx;
      }
    }
  }
  &_nearby {
    @extend .item;
    background: #fff;
    text {
      margin-right: 15rpx;
      color: var(--text-color-2);
      font-size: 28rpx;
    }
  }
  &_detail {
    background: #fff;
    margin-top: 16rpx;
    ::v-deep .u-tabs__wrapper__nav__item {
      box-sizing: border-box;
      width: 50%;
    }
    &--images {
      padding-bottom: 150rpx;
      // > view {
      //   width: 686rpx;
      //   height: 275rpx;
      //   border: 1px solid;
      //   margin: 0 auto;
      // }
      rich-text img {
        width: 100% !important;
        object-fit: contain;
      }
      rich-text image {
        width: 100%important;
        object-fit: contain;
      }
    }
  }
  &_footer {
    width: 100vw;
    padding: 0 30rpx;
    padding-bottom: 15rpx;
    .cart {
      position: relative;
      .num {
        position: absolute;
        right: 0rpx;
        top: 0rpx;
        text-align: center;
        padding: 5rpx;
        background: var(--highlight-color);
        color: #fff;
        border-radius: 14px;
        font-size: 18rpx;
      }
    }
    @include flex(row, space-between, center);
    > view:nth-child(1) {
      width: 264rpx;
      padding-top: 4rpx;
      font-size: 20rpx;

      > view:nth-child(2) {
        margin-left: 50rpx;
      }
      > view:nth-child(3) {
        position: relative;
        margin-left: 50rpx;
        > view:nth-child(3) {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 18rpx;
          background: var(--highlight-color);
          color: #fff;
          border-radius: 14rpx;
          padding: 1rpx 5rpx;
        }
      }
    }
    &--right {
      @include flex(row, flex-start, flex-end);
      height: 90rpx;
      &_user {
        @include flex(row, flex-start, flex-start);
        width: 400rpx;
        > view {
          box-sizing: border-box;
          @include flex(row, center, center);
          width: 200rpx;
          height: 80rpx;
          text-align: center;
        }
        > view:nth-child(1) {
          border-radius: 40rpx 0px 0px 40rpx;
          border: 0.5rpx solid #d09d69;
          color: var(--primary-color);
        }
        > view:nth-child(2) {
          background: linear-gradient(90deg, #d09d69 0%, #e0c1a1 100%);
          border-radius: 0px 40px 40px 0px;
          color: #fff;
        }
      }
      &_login {
        box-sizing: border-box;
        @include flex(row, center, center);
        width: 400rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #d09d69 0%, #e0c1a1 100%);
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #fff;
      }
      &_nostock {
        box-sizing: border-box;
        @include flex(row, center, center);
        width: 400rpx;
        height: 80rpx;
        background: gray;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #fff;
      }
    }
  }
}
.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background:#fff;
}
</style>
