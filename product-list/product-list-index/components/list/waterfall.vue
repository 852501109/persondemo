<template>
  <configProvider>
    <view>
      <scroll-view
        class="scroll-view"
        scroll-y
        @scroll="scroll"
        :scroll-top="0"
      >
        <view class="waterfall">
          <view
            v-for="(column, columnIndex) of columnData"
            :key="columnIndex"
            class="column flex"
          >
            <view
              v-for="(item, index) in column"
              :key="index"
              class="ceil"
              :style="{ height: item.height }"
              @tap="toDetail(item)"
              :class="[`current-mark-${index + 1}`]"
            >
              <view class="ceil-image">
                <view
                  class="empty"
                  v-if="(!item.hasStock && item.pictureUrl)"
                >
                  <image src="https://yilihuo-img.jsh.com/2022/11/25/78f1832458ee4077b5623f5b8c82e9f6.png" />
                </view>
                <view
                  class="image"
                >
                  <image
                    :src="imgUrl(item.pictureUrl || '')"
                    mode="widthFix"
                  />
                </view>
              </view>
              <view>{{ item.itemName }}</view>
              <view>
                {{ item.itemSellingPoint ? item.itemSellingPoint.join(" | ") : '' }}
              </view>
              <view
                v-if="item.retailPrice"
                :style="{marginTop: (item && item.itemSellingPoint.length > 0) ? '8rpx' : ''}"
              >
                <view>￥</view>
                <view v-if="item.retailPrice">
                  {{ item.retailPrice | money(2, '', false, true) }}
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
  </configProvider>
</template>

<script>
import configProvider from '../../../../../components/config-provider'
import { imageCompressUrl } from '../../../../../utils'
import { money } from '../../../../../filters'
import { buriedPointReport } from '../../../../../utils/report'
export default {
  components: {
    configProvider
  },
  filters: {
    money
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: () => null
    }
  },
  data () {
    const columnNum = 2
    return {
      fallData: [],
      columnData: Array(columnNum)
        .fill('')
        .map(() => [])
    }
  },
  mounted () {
    // 首次加载时触发
    this.fallData = JSON.parse(JSON.stringify(this.list))
    this.setRecognitionImgs(this.fallData)
  },
  watch: {
    // 监听非首次加载时处理list增加的数据
    list: {
      handler: function (newVal, oldVal) {
        const newList = []
        newVal.forEach(item => {
          if (!oldVal.find(listItem => listItem.id === item.id)) {
            newList.push(item)
          }
        })
        this.fallData = newList
        this.setRecognitionImgs(this.fallData)
      },
      deep: true
    }
  },
  methods: {
    imgUrl (img) {
      return imageCompressUrl(img, '300')
    },
    // 滚动触发
    scroll () {
      const query = uni.createSelectorQuery().in(this)
      // 取单列计算剩余5个，触发时机为第九个或者第十个，不能取list，因为还没加载完
      const index = this.columnData[0].length - 5
      if (index <= 0) return
      const currentClass = `.current-mark-${index}`
      // 判断值为距离底部的第十个元素出现时触发
      query.select(currentClass).boundingClientRect(data => {
        if (!data) return
        if (data.top - this.rpxToPx(1300) < 0) {
          if (this.isLoading) return
          this.$nextTick(() => {
            this.$emit('scrolltolower')
          })
        }
      }).exec()
    },
    rpxToPx (rpx) {
      const deviceWidth = uni.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const px = (deviceWidth / 750) * Number(rpx)
      return Math.floor(px)
    },
    // img.onload 的promise集合
    setRecognitionImgs (list) {
      const p = new Array(list.length)
      for (let i = 0; i < list.length; i++) {
        p[i] = new Promise(function (resolve) {
          uni.getImageInfo({
            src: list[i].pictureUrl,
            success: function () {
              resolve('success')
            },
            fail: function () {
              resolve('default')
            }
          })
        })
      }
      // 所有图片加载完成后做瀑布流添加保证图片后加载高度不会影响效果
      Promise.all(p).then(() => {
        this.pushItem()
      })
    },
    // 对新增的每一项item进行处理
    pushItem () {
      const query = uni.createSelectorQuery().in(this)
      query
        .selectAll('.column')
        .fields({ size: true })
        .exec((result) => {
          const columns = result[0]
          if (columns.length === 0) return
          let minColumnIndex
          if (columns[0].height === 0) {
            minColumnIndex = 0
          } else {
            minColumnIndex = columns[0].height <= columns[1].height ? 0 : 1
          }
          const current = this.fallData.shift()
          if (current) {
            this.columnData[minColumnIndex].push(current)
            // 给此次已预加载图片显示时间，下次调用直接获取到完整高度
            setTimeout(() => {
              this.pushItem()
            }, 100)
          }
        })
    },
    // 跳转至商品详情
    toDetail (item) {
      buriedPointReport({ pageName: '商品列表-商品详情', buttonName: item.itemName })
      this.$emit('toDetail', item)
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
}
@mixin height-center($h) {
  height: #{$h}rpx;
  line-height: #{$h}rpx;
}
.scroll-view {
  height: 1360rpx;
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
.loading {
  margin-top: 30rpx;
  background: #fff!important;
}
.waterfall {
  @include flex(row, space-between, flex-start);
  padding: 0 24rpx;
  width: 100vw;
  .column {
    @include flex(column, space-between);
    margin-bottom: 10rpx;
  }

  .ceil {
    @include flex(column, space-between, flex-start);
    box-sizing: content-box!important;
    width: 304rpx;
    float: left;
    background-color: #fff;
    border-radius: 10rpx;
    margin-top: 16rpx;
    padding: 20rpx;
    &-image {
      position: relative;
      width: 304rpx;
      height: auto;
      .empty {
        @include flex(flex, center, center);
        position: absolute;
        left: 0;
        top: 0;
        width: 102%;
        min-height: 100rpx;
        height: 98%;
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
    image {
      width: 311rpx;
      border-radius: 12rpx;
    }
    > view:nth-child(2) {
      color: var(--text-color-1);
      font-weight: 600;
      font-size: 28rpx;
      margin-top: 8rpx;
      @extend .overflow-hidden-two;
    }
    > view:nth-child(3) {
      color: var(--text-color-2);
      margin-top: 8rpx;
      font-size: 22rpx;
    }
    > view:nth-child(4) {
      @include flex(row, flex-start, baseline);
      color: var(--highlight-color);
      font-weight: 600;
      >view:nth-child(1) {
        font-size: 24rpx;
        position: relative;
        bottom: 2rpx;
      }
      >view:nth-child(2) {
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
