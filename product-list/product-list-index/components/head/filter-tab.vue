<template>
  <view class="filter-tab d-flex justify-content-between">
    <view
      :class="[$bem('tab')]"
      class="fs-30 d-flex justify-content-between"
    >
      <view
        @tap="selectType(0)"
        :class="{ active: currentType === 0 }"
      >
        综合
      </view>
      <view
        @tap="selectType(1)"
        :class="{ active: currentType === 1 }"
        class="d-flex"
      >
        <view>销量</view>
        <view v-if="sort !== 2 && sort !== 3">
          <!-- 平序 -->
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              src="https://yilihuo-img.jsh.com/2022/11/17/98940aa43f764be386cbac4d9fe03620.png"
            />
          </view>
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              src="https://yilihuo-img.jsh.com/2022/11/17/694c5da3f3aa4db28bf1ae82c24a556c.png"
            />
          </view>
        </view>
        <!-- 降序 -->
        <view v-if="sort === 3">
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              src="https://yilihuo-img.jsh.com/2022/11/17/98940aa43f764be386cbac4d9fe03620.png"
            />
          </view>
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              src="https://yilihuo-img.jsh.com/2022/11/17/fe63194de8df4aebb6b34c914493aead.png"
            />
          </view>
        </view>
        <!-- 升序 -->
        <view v-if="sort === 2">
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              src="https://yilihuo-img.jsh.com/2022/11/17/31c94b5b9e5247b4bb025346689204b5.png"
            />
          </view>
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              src="https://yilihuo-img.jsh.com/2022/11/17/694c5da3f3aa4db28bf1ae82c24a556c.png"
            />
          </view>
        </view>
      </view>
      <view
        class="d-flex"
        @tap="selectType(2)"
      >
        <view :class="{ active: currentType === 2 }">
          价格
        </view>
        <!-- 平序 -->
        <view v-if="sort !== 4 && sort !== 5">
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              :src="
                filterImage(
                  'https://yilihuo-img.jsh.com/2022/11/17/98940aa43f764be386cbac4d9fe03620.png'
                )
              "
            />
          </view>
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              :src="
                filterImage(
                  'https://yilihuo-img.jsh.com/2022/11/17/694c5da3f3aa4db28bf1ae82c24a556c.png'
                )
              "
            />
          </view>
        </view>
        <!-- 降序 -->
        <view v-if="sort === 5">
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              :src="
                filterImage(
                  'https://yilihuo-img.jsh.com/2022/11/17/98940aa43f764be386cbac4d9fe03620.png'
                )
              "
            />
          </view>
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              :src="
                filterImage(
                  'https://yilihuo-img.jsh.com/2022/11/17/fe63194de8df4aebb6b34c914493aead.png'
                )
              "
            />
          </view>
        </view>
        <!-- 升序 -->
        <view v-if="sort === 4">
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              :src="
                filterImage(
                  'https://yilihuo-img.jsh.com/2022/11/17/31c94b5b9e5247b4bb025346689204b5.png'
                )
              "
            />
          </view>
          <view class="h-12 d-flex align-items-center">
            <image
              class="img-25-12"
              :src="
                filterImage(
                  'https://yilihuo-img.jsh.com/2022/11/17/694c5da3f3aa4db28bf1ae82c24a556c.png'
                )
              "
            />
          </view>
        </view>
      </view>
    </view>
    <view
      :class="[$bem('tab')]"
      class="fs-30 d-flex justify-content-between"
    >
      <view
        @tap="selectType(5)"
        :class="{ active: currentType === 5 }"
        class="d-flex"
      >
        <view
          @tap.stop="selectType(4)"
          :class="{ active: currentType === 4 }"
          class="exhibition d-flex align-items-center"
        >
          <image
            class="img-36-36"
            mode="aspectFill"
            :src="
              filterImage(
                'https://yilihuo-img.jsh.com/2022/12/07/5057e1736f49438b981196ba74c41cf7.png'
              )
            "
            v-if="status === 1"
          />
          <image
            class="img-36-36"
            mode="aspectFill"
            :src="
              filterImage(
                'https://yilihuo-img.jsh.com/2022/12/07/88df069ec89e47e2be709c45597f488e.png'
              )
            "
            v-if="status === 2"
          />
        </view>
        <view class="line" />
        <view class="ml-24 filter-text">
          筛选
        </view>
        <view class="filter d-flex align-items-center">
          <image
            class="img-36-36"
            mode="aspectFill"
            :src="
              filterImage(
                'https://yilihuo-img.jsh.com/2022/12/07/4806fbc2c70f486b856e4da391075cad.png'
              )
            "
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { bemMixin } from '../../../../../mixins'
import browseReportMixins from '../../../../../mixins/browse-report-mixins'
import { imageCompressUrl } from '../../../../../utils'
import { buriedPointReport } from '../../../../../utils/report'
export default {
  props: {
    status: {
      type: Number,
      default: 2
    },
    currentType: {
      type: Number,
      default: 0
    },
    sort: {
      type: Number,
      default: 0
    }
  },
  mixins: [bemMixin('filter-tab'), browseReportMixins],
  data () {
    return {
      browseReportConfig: {
        pageType: 10,
        pageName: '商品列表-排序',
        browseWithName: ''
      },
      btnHeight: '',
      btnTop: ''
    }
  },
  created () {
    console.log(uni.getMenuButtonBoundingClientRect())
    this.btnHeight =
      this.pxToRpx(uni.getMenuButtonBoundingClientRect().height) +
      'rpx!important'
  },
  methods: {
    selectType (n) {
      if (n === 1 || n === 2) {
        buriedPointReport({ pageName: '商品列表-排序', buttonName: '' })
      }
      if (n === 5) {
        buriedPointReport({ pageName: '商品列表-筛选', buttonName: '' })
      }
      this.$emit('changeType', n)
    },
    pxToRpx (px) {
      const deviceWidth = wx.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const rpx = (750 / deviceWidth) * Number(px)
      return Math.floor(rpx)
    },
    // 优化图片加载速度
    filterImage (img) {
      return img ? imageCompressUrl(img, 800) : ''
    }
  }
}
</script>

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
.img-36-36 {
  position: relative;
  top: 0rpx;
  width: 36rpx!important;
  height: 36rpx!important;
}
.img-25-12 {
  width: 29rpx;
  height: 12rpx;
}
.filter-tab {
  position: relative;
  top: -1rpx;
  &_tab:nth-child(1) {
    width: 460rpx;
    padding-left: 54rpx;
    box-sizing: border-box;
  }
  &_tab:nth-child(2) {
    box-sizing: border-box;
    padding-right: 32rpx;
    padding-left: 70rpx;
  }
  &_tab {
    > view:nth-child(4) {
      position: relative;
    }
    .active {
      color: var(--brand-color) !important;
      font-weight: 600;
    }
    .filter-text {
      width: 84rpx;
    }
    .filter {
      margin-left: -11rpx;
    }
    .line {
      width: 1rpx;
      margin-left: 24rpx;
      height: 48rpx;
      background: var(--border-color);
    }
    @include height-center(88);
    background: #fff;
    > view {
      color: var(--text-color-1);
      @include flex(row, center, center);
    }
  }
}
</style>
