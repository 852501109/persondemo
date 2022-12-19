<template>
  <view>
    <scroll-view
      class="scroll-view"
      scroll-y
      :scroll-top="0"
      @scroll="scroll"
    >
      <view
        v-for="(item, index) in list"
        :key="index"
        @tap="toDetail(item)"
      >
        <view
          class="product-list-index-single"
          :class="[`current-mark-${index + 1}`]"
        >
          <view>
            <view
              class="empty"
              v-if="!item.hasStock && item.pictureUrl"
            >
              <image
                src="https://yilihuo-img.jsh.com/2022/11/25/78f1832458ee4077b5623f5b8c82e9f6.png"
              />
            </view>
            <view class="image">
              <image
                :src="imgUrl(item.pictureUrl)"
                :class="[`current-single-${index}`]"
                :style="{height: `${currentHeightList[index] || '280'}rpx`}"
              />
            </view>
          </view>
          <view
            :class="[$bem('content')]"
            :style="{height: `${currentHeightList[index] || '280'}rpx`}"
          >
            <view>
              <view class="fw-600">
                {{ item.itemName }}
              </view>
              <view>
                {{
                  item.itemSellingPoint ? item.itemSellingPoint.join(" | ") : ""
                }}
              </view>
            </view>
            <view v-if="item.retailPrice">
              <view class="fs-28">
                ￥
              </view>
              <view
                class="fs-36"
                v-if="item.retailPrice"
              >
                {{
                  item.retailPrice| money(2, "", false, true)
                }}
              </view>
              <view v-else>
                -
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { bemMixin } from '../../../../../mixins'
import { imageCompressUrl } from '../../../../../utils'
import { money } from '../../../../../filters'
import { buriedPointReport } from '../../../../../utils/report'
export default {
  mixins: [bemMixin('product-list-index-single')],
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: () => null
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    money
  },
  data () {
    return {
      currentHeightList: []
    }
  },
  watch: {
    list: {
      handler: function (newVal, oldVal) {
        const old = oldVal || []
        if (newVal) {
          const _this = this
          const newList = []
          newVal.forEach((item, index) => {
            if (!old.find((listItem) => listItem.id === item.id)) {
              const newListItem = item
              newListItem.index = index
              newList.push(newListItem)
            }
          })
          const p = new Array(newList.length)
          for (let i = 0; i < newList.length; i++) {
            p[i] = new Promise(function (resolve) {
              uni.getImageInfo({
                src: newList[i].pictureUrl,
                success: function () {
                  resolve('success')
                },
                fail: function () {
                  resolve('default')
                }
              })
            })
          }
          // 无货遮罩高度计算
          Promise.all(p).then(res => {
            newList.forEach((item) => {
              const view = uni
                .createSelectorQuery()
                .in(this)
                .select(`.current-single-${item.index}`)
              view
                .fields(
                  {
                    size: true
                  },
                  (data) => {
                    _this.currentHeightList[item.index] = (!data || data.height === 0) ? '280' : _this.pxToRpx(data.height)
                    _this.$forceUpdate()
                  }
                )
                .exec()
            })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    pxToRpx (px) {
      const deviceWidth = wx.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const rpx = (750 / deviceWidth) * Number(px)
      return Math.floor(rpx)
    },
    // 跳转至商品详情
    toDetail (item) {
      this.$emit('toDetail', item)
      buriedPointReport({ pageName: '商品列表-商品详情', buttonName: item.itemName })
    },
    imgUrl (img) {
      return img ? imageCompressUrl(img, '300') : ''
    },
    rpxToPx (rpx) {
      const deviceWidth = uni.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const px = (deviceWidth / 750) * Number(rpx)
      return Math.floor(px)
    },
    scroll () {
      const query = uni.createSelectorQuery().in(this)
      const index = this.list.length - 10
      const currentClass = `.current-mark-${index}`
      // 判断值为距离底部的第十个元素出现时触发
      query
        .select(currentClass)
        .boundingClientRect((data) => {
          if (!data) return
          if (data.top - this.rpxToPx(1300) < 0) {
            if (this.isLoading) return
            this.$emit('scrolltolower')
          }
        })
        .exec()
    }
  }
}
</script>

<style lang="scss" scoped>
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
  flex-wrap: wrap;
}
@mixin height-center($h) {
  height: #{$h}rpx;
  line-height: #{$h}rpx;
}
.loading {
  margin-top: 30rpx;
  background: #fff !important;
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
.scroll-view {
  position: relative;
  height: 1360rpx;
}
.product-list-index-single {
  @include flex(row, space-between, center);
  min-height: 280rpx;
  background: #fff;
  padding: 20rpx 32rpx;
  > view:nth-child(1) {
    position: relative;
    box-sizing: border-box;
    width: 40%;
    image {
      width: 280rpx;
      border-radius: 12rpx;
    }
    .empty {
      @include flex(flex, center, center);
      position: absolute;
      left: 0;
      top: 0;
      width: 102%;
      height: 99%;
      line-height: 100%;
      text-align: center;
      color: #fff;
      font-size: 25rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 12rpx;
      image {
        width: 100rpx;
        height: 100rpx;
      }
    }
  }
  &_content {
    @include flex(column, space-between, flex-start);
    width: 60%;
    padding-left: 16rpx;
    min-height: 280rpx;
    > view:nth-child(1) {
      > view:nth-child(1) {
        width: 390rpx;
        color: var(--text-color-1);
        word-wrap: break-word;
        word-break: normal;
        font-weight: 600;
        font-size: 28rpx;
        @extend .overflow-hidden-two;
      }
      > view:nth-child(2) {
        margin-top: 16rpx;
        color: var(--text-color-2);
        font-size: 22rpx;
      }
    }
    > view:nth-child(2) {
      @include flex(row, flex-start, baseline);
      color: var(--highlight-color);
      font-weight: 600;
      vertical-align: middle;
      > view:nth-child(1) {
        font-size: 28rpx;
        position: relative;
        bottom: 1rpx;
      }
      > view:nth-child(2) {
        font-size: 36rpx;
      }
    }
  }
}
.no-more {
  padding: 40rpx;
  text-align: center;
}
</style>
