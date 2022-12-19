<template>
  <configProvider>
    <!-- 自定义弹框 -->
    <u-modal
      :show="clearShow"
      close-on-click-overlay
      show-cancel-button
      cancel-color="#1D2129"
      @confirm="clearHisSure"
      @cancel="closeModal"
      @close="closeModal"
      confirm-text="删除"
      cancel-text="我再想想"
      :confirm-color="brandColor"
      ref="uModal"
    >
      <template #default>
        <view>确认清空失效商品吗？</view>
      </template>
    </u-modal>
    <!-- 自定义弹框 -->
    <u-modal
      :show="deleteShow"
      close-on-click-overlay
      show-cancel-button
      cancel-color="#1D2129"
      @confirm="deleteHisSure"
      @cancel="deleteModal"
      @close="deleteModal"
      confirm-text="删除"
      cancel-text="我再想想"
      :confirm-color="brandColor"
      ref="uModal"
    >
      <template #default>
        <view>{{ `确认将这${allNumWithInvalidList}个商品删除？` }}</view>
      </template>
    </u-modal>
    <!-- 缺省 -->
    <view
      class="no-address"
      v-if="(vaildList.length === 0 && vaildList.length === 0 && invalidList.length === 0 && !cartIsLoading)"
    >
      <image
        class="img-510"
        mode="widthFix"
        src="https://yilihuo-img.jsh.com/2022/11/10/6c4a4ac3d44e4fb09909fe2216b87ea2.png"
      />
      <view>购物车暂无商品</view>
    </view>

    <view class="shoping-cart">
      <!-- 头部 -->
      <view
        :class="[$bem('head')]"
        v-if="vaildList.length > 0"
      >
        <view>共{{ vaildList.length + invalidList.length }}款商品</view>
        <view
          class="edit"
          v-if="status === 1"
          @tap="handleEdit"
        >
          编辑
        </view>
        <view
          class="save"
          v-if="status === 2"
          @tap="handleSave"
        >
          完成
        </view>
      </view>
      <!-- 有效商品 -->
      <view
        :class="[$bem('valid')]"
        v-if="vaildList.length > 0"
      >
        <view
          v-for="(i, n) in vaildList"
          :key="n"
          @tap="cartToDetail(i)"
          :class="[computeClass(i)]"
        >
          <view
            :class="[$bem('valid--select')]"
            @tap.stop="hotTap(i)"
          >
            <u-checkbox-group
              v-model="i.checked"
              @change="watchSelect('noParam')"
            >
              <u-checkbox
                @tap.stop
                shape="circle"
                size="19"
                :name="i.id"
                :label-size="rpxToPx(12)"
                :icon-size="16"
                :active-color="brandColor"
              />
            </u-checkbox-group>
          </view>
          <view :class="[$bem('valid--image')]">
            <image
              :src="imgUrl(i.itemPictureUrl)"
              mode="widthFix"
            />
          </view>
          <view :class="[$bem('valid--operation')]">
            <view>
              <view>{{ i.itemName }}</view>
              <view>
                <view v-if="i.retailPrice">
                  <text class="fs-28">
                    ￥
                  </text>{{ (i.retailPrice || 0) | money(2, '', false, true) }}
                </view>
                <view>
                  <view
                    class="number-type-one"
                    v-if="!numberBoxIndexs[n]"
                    @tap.stop="showNumberBox(n)"
                  >
                    x{{ i.cartItemQty }}
                  </view>
                  <u-number-box
                    @tap.stop
                    v-if="numberBoxIndexs[n]"
                    disabled-input
                    bg-color="#F2F3F5"
                    :button-size="buttonSize"
                    :input-width="inputWidth"
                    v-model="i.cartItemQty"
                    @change="cur => changeNum(cur, i)"
                    :min="1"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 失效商品 -->
      <view
        :class="[$bem('invalid')]"
        v-if="invalidList.length"
      >
        <view :class="[$bem('invalid--head')]">
          <view>失效商品{{ invalidList.length }}件</view>
          <view @tap="clearInvalid">
            清空
          </view>
        </view>
        <view>
          <view
            v-for="(i, n) in invalidList"
            :key="n"
            :class="[computeClass(i)]"
          >
            <view>
              <u-checkbox-group
                v-model="i.checked"
                v-if="status === 2"
                @change="watchSelect('noParam')"
              >
                <u-checkbox
                  shape="circle"
                  size="19"
                  :name="i.id"
                  :label-size="rpxToPx(12)"
                  :icon-size="16"
                  :active-color="brandColor"
                />
              </u-checkbox-group>
            </view>
            <view
              :class="[$bem('invalid--image')]"
              :style="{marginLeft: status === 2 ? '16rpx' : ''}"
            >
              <image
                :src="imgUrl(i.itemPictureUrl)"
                mode="widthFix"
              />
              <view class="empty" />
            </view>
            <view
              :class="[$bem('invalid--main')]"
              :style="{width: status === 2 ? '426rpx' : '476rpx'}"
            >
              <view>{{ i.itemName }}</view>
              <view>
                <view>商品已不能购买</view>
                <view @tap="findSame(i)">
                  找相似
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 猜你喜欢 -->
      <view
        :class="[$bem('guess')]"
        v-if="list.length > 0"
      >
        <view>
          <image
            class="image-48-48"
            src="https://yilihuo-img.jsh.com/2022/12/09/4562a805bb8147848222c9c6530798a9.png"
          />
          <text>猜你喜欢</text>
        </view>
        <recommed-waterfall-flow
          :list="list"
          @handle-click="toDetail"
          img-key="pictureUrl"
          id-key="id"
          offset="8"
          :item-style="{
            background: '#fff',
            borderRadius: '16rpx',
            padding: '20rpx',
          }"
          :image-style="{ borderRadius: '16rpx', width: '308rpx' }"
          ref="recommedListRef"
        >
          <template v-for="item in list">
            <view
              :slot="`default${item.id}`"
              :key="item.id"
            >
              <view class="ceil">
                <view>{{ item.itemName }}</view>
                <view v-if="item.itemSellingPoint">
                  {{ item.itemSellingPoint.join(" | ") }}
                </view>
                <view>
                  <view class="fs-28">
                    ￥
                  </view>
                  <view class="fs-36">
                    {{ (item.retailPrice || 0) | money(2, '', false, true) }}
                  </view>
                </view>
              </view>
            </view>
          </template>
        </recommed-waterfall-flow>
      </view>
    </view>
    <!-- 底部操作栏 -->
    <shop-fixed-bar background="#fff">
      <view
        class="shoping-cart-footer"
        v-if="vaildList.length > 0"
      >
        <view class="all">
          <view
            :class="[computeAllClass(selectAllArr)]"
          >
            <u-checkbox-group v-model="selectAllArr">
              <u-checkbox
                @change="selectAll"
                :name="1"
                shape="circle"
                size="19"
                :label-size="rpxToPx(12)"
                :icon-size="16"
                :active-color="brandColor"
              />
            </u-checkbox-group>
            <text>全选</text>
          </view>
        </view>

        <view>
          <view
            v-if="status === 1"
            class="mr-24"
          >
            <view>不含运费</view>
            <view>
              <text>合计</text><text class="fs-26">
                ￥
              </text><text class="fs-36">
                {{ total | money(2, '', false, true) }}
              </text>
            </view>
          </view>

          <view>
            <view
              class="settlement cw-200"
              v-if="status === 1"
              @tap="settlement"
            >
              <view>结算</view>
              <view v-if="allNum > 0">
                ({{ allNum }})
              </view>
            </view>
            <view
              class="edit"
              v-if="status === 2"
            >
              <view @tap="collect">
                移入收藏夹
              </view>
              <view
                @tap="delProduct"
                class="cw-200"
              >
                <view>删除</view><view v-if="allNumWithInvalidList > 0">
                  ({{ allNumWithInvalidList }})
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </shop-fixed-bar>
  </configProvider>
</template>

<script src="./shopping-cart.js"></script>

<style scoped lang="scss">
@import "../../static/utils.scss";
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
.overflow-hidden-two {
  overflow: hidden; //溢出内容隐藏
  text-overflow: ellipsis; //文本溢出部分用省略号表示
  display: -webkit-box; //特别显示模式
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical; //盒子中内容竖直排列
  word-break: break-all;
}
.u-number-extend {
  width: 56rpx!important;
  font-size: 26rpx!important;
  color: var(--text-color-1)!important;
  background: #EBECEE!important;
}
::v-deep .u-number-box__minus {
  border-radius: 100rpx 0px 0px 100rpx !important;
  @extend .u-number-extend;
  background: #F2F3F5!important;
}
::v-deep .u-number-box__plus {
  border-radius: 0px 100rpx 100rpx 0px !important;
  @extend .u-number-extend;
  background: #F2F3F5!important;
}
::v-deep .u-checkbox__icon-wrap {
  margin-right: 0rpx!important;
}
.check-normal {
  ::v-deep .u-checkbox__icon-wrap {
    background: #F7F8FA!important;
  }
}
.check-active {
  ::v-deep .u-checkbox__icon-wrap {
    background:  var(--brand-color)!important;
  }
}

.image-48-48 {
  width: 48rpx;
  height: 48rpx;
}
.img-510 {
  width: 510rpx!important;
  margin-top: 58rpx;
}
.cw-200 {
  @include flex(row, center, center);
  width: 200rpx;
  box-sizing: border-box;
  text-align: center;
  height: 80rpx;
  line-height: 79rpx;
  >view {
    height: 80rpx;
    line-height: 79rpx;
  }
}
.number-type-one {
  text-align: center;
  padding: 6rpx 8rpx;
  font-size: 26rpx;
  color: #323233;
  height: 30rpx;
  line-height: 30rpx;
  border-radius: 6rpx;
  border: 1px solid #C8C9CC;
}
.shoping-cart {
  padding: 32rpx 24rpx 152rpx 24rpx;
  background: var(--background-color);
  &_head {
    font-size: 28rpx;
    @include flex(row, space-between, flex-start);
    view:nth-child(1) {
      color: var(--text-color-2);
    }
    view:nth-child(2) {
      color: var(--brand-color);
    }
  }
  &_valid {
    padding: 32rpx 24rpx;
    background: #ffffff;
    border-radius: 24rpx;
    margin-top: 24rpx;
    &--select {
      padding: 30rpx 0;
    }
    > view {
      @include flex(row, flex-start, center);
    }
    > view:not(:nth-child(1)) {
      margin-top: 40rpx;
    }
    &--image {
      @include flex(row, center, center);
      width: 156rpx!important;
      text-align: center;
      height: 156rpx!important;
      margin-left: 16rpx;
      position: relative;

      image {
        width: 156rpx!important;
        height: 156rpx!important;
        border-radius: 8rpx;
      }
    }
    &--operation {
      width: 420rpx;
      padding-left: 16rpx;
      ::v-deep .u-icon__icon, ::v-deep input {
        font-size: 26rpx!important;
        font-weight: 400!important;
        color: var(--text-color-1)!important;

      }
      > view {
        height: 156rpx;
        @include flex(column, space-between);
        > view:nth-child(1) {
          @extend .overflow-hidden-two;
          font-weight: 600;
          color: var(--text-color-1);
          font-size: 26rpx;
        }
        > view:nth-child(2) {
          width: 100%;
          height: 56rpx;
          line-height: 56rpx;
          @include flex(row, space-between, center);
          > view:nth-child(1) {
            color: var(--highlight-color);
            font-weight: 600;
            font-size: 36rpx;
          }
        }
      }
    }
  }
  &_invalid {
    &--head {
      @include flex(row, space-between, center);
      > view:nth-child(2){
        color: var(--brand-color);
      }
    }
    font-size: 26rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    margin-top: 16rpx;
    > view:nth-child(2) {
      margin-top: 24rpx;
      > view {
        @include flex(row, space-between, center);
      }
      > view:not(:nth-child(1)) {
        margin-top: 40rpx;
      }
    }
    &--image {
      @include flex(row, center, center);
      position: relative;
      width: 156rpx;
      text-align: center;
      height: 156rpx!important;
      border-radius: 5rpx;
      .empty {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
        border-radius: 5rpx;
      }
      image {
        width: 156rpx!important;
        height: 156rpx!important;
        border-radius: 8rpx;
      }
    }
    &--main {
      height: 156rpx;
      margin-left: 16rpx;
      @include flex(column, space-between);
      > view:nth-child(1) {
        @extend .overflow-hidden-two;
        color: var(--text-color-3);
        font-size: 26rpx;
      }
      > view:nth-child(2) {
        width: 100%;
        @include flex(row, space-between, center);
        > view:nth-child(1) {
          color: var(--text-color-1);
          font-size: 28rpx;
          font-weight: 600;
        }
        > view:nth-child(2) {
          border-radius: 29rpx;
          padding: 13rpx 20rpx;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          font-size: 26rpx;
        }
      }
    }
  }
  &_guess {
    border-radius: 24rpx;
    color: var(--text-color-1);
    > view:nth-child(1) {
      @include flex(row, flex-start, center);
      margin-top: 32rpx;
      margin-bottom: 18rpx;
    }
    text {
      margin-left: 10rpx;
    }
  }
}
.no-address {
  width: 100%;
  background: #fff;
  padding-bottom: 100rpx;
  text-align: center;
  view:nth-child(2) {
    color: var(--text-color-3);
    font-size: 28rpx;
    margin-top: 56rpx;
  }
  view:nth-child(3) {
    box-sizing: border-box;
    width: 285rpx;
    height: 80rpx;
    background: var(--brand-color);
    font-size: 28rpx;
    padding: 19rpx 85rpx;
    border-radius: 40rpx;
    color: #fff;
    margin: 30rpx auto;
  }
}
.shoping-cart-footer {
  @include flex(row, space-between, center);
  position: relative;
  bottom: 15rpx;
  width: 100vw;
  height: 110rpx; // 高度不能去掉，会有抖动
  padding: 10rpx 32rpx 1rpx 32rpx; // 边框被吃掉。调整定位方式预留1rpx
  background: #fff;
  > view:nth-child(1) {
    color: var(--text-color-1);
  }
  .all {
    > view {
      @include flex(row, flex-end, center);
      text {
        margin-left: 8rpx;
        font-size: 24rpx;
      }
    }
  }
  > view {
    @include flex(row, space-between, center);
    > view:nth-child(1) {
      text-align: right;
      > view:nth-child(1) {
        color: var(--text-color-3);
        font-size: 24rpx;
      }
      > view:nth-child(2) {
        text:nth-child(1) {
          color: var(--text-color-1);
        }
        text:nth-child(2) {
          position: relative;
          top: -3rpx;
          color: var(--highlight-color);
          font-weight: 600;
        }
        text:nth-child(3) {
          color: var(--highlight-color);
          font-weight: 600;
        }
        font-size: 28rpx;
      }
    }
    .settlement {
      font-weight: 600;
      color: #fff;
      font-size: 28rpx;
      background: linear-gradient(
        90deg,
        var(--primary-color) 0%,
        var(--primary-secondary-color) 100%
      );
      border-radius: 50rpx;
    }
    .edit {
      @include flex(row, flex-start, center);
      font-weight: 600;
      > view:nth-child(1) {
        width: 240rpx;
        text-align: center;
        height: 79rpx;
        line-height: 79rpx;
        color: var(--primary-color);
        font-size: 28rpx;
        border: 0.5rpx solid var(--primary-color);
        border-radius: 50rpx;
        margin-right: 20rpx;
      }
      > view:nth-child(2) {
        color: #fff;
        font-size: 28rpx;
        background: linear-gradient(
          90deg,
          var(--primary-color) 0%,
          var(--primary-secondary-color) 100%
        );
        border-radius: 40rpx;
      }
    }
  }
}
.ceil {
  > view:nth-child(1) {
    color: #323233;
    font-weight: 600;
    margin-top: 20rpx;
    font-size: 26rpx;
    @extend .overflow-hidden-two;
  }
  > view:nth-child(2) {
    color: var(--text-color-2);
    margin-top: 8rpx;
    font-size: 22rpx;
  }
  > view:nth-child(3) {
    @include flex(row, flex-start, baseline);
    color: var(--highlight-color);
    margin-top: 8rpx;
    font-weight: 600;
  }
}
</style>
