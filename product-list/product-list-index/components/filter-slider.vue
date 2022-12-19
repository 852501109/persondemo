<template>
  <view
    class="filter-slider d-flex justify-content-end"
    @tap="filterGoBack"
    :style="{ width: show ? '100vw' : '0' }"
  >
    <view
      @tap.stop
      :style="{
        width: show ? '620rpx' : '0',
        paddingTop: `${customBarHeight}px`,
        paddingLeft: show ? '32rpx' : '0'
      }"
    >
      <view v-if="delayContent">
        <view :class="[$bem('position')]">
          <image
            class="img-36-36"
            src="https://yilihuo-img.jsh.com/2022/11/22/9842176485e24b08ba3d6265b1895e17.png"
          />
          <view class="address">
            {{ address }}
          </view>
          <view
            class="color-6F3A8A"
            @tap="getLocation"
          >
            重新定位
          </view>
        </view>
        <view>
          <view :class="[$bem('title')]">
            价格区间(元)
          </view>
          <view :class="[$bem('input')]">
            <view :class="[$bem('input--box')]">
              <u-input
                :placeholder="lowPlaceholder"
                type="number"
                maxlength="8"
                v-model="minPrice"
                @blur="val => compare(val, 'minPrice')"
                @focus="lowPlaceholder = ''"
              />
            </view>
            <view :class="[$bem('input--bar')]">
              -
            </view>
            <view :class="[$bem('input--box')]">
              <u-input
                :placeholder="highPlaceholder"
                type="number"
                maxlength="8"
                v-model="maxPrice"
                @blur="val => compare(val, 'maxPrice')"
                @focus="highPlaceholder = ''"
              />
            </view>
          </view>
        </view>
        <view>
          <view :class="[$bem('title')]">
            品类
          </view>
          <view :class="[$bem('content')]">
            <view
              :class="[$bem('content--btn'), industryCodeList .includes(i.industryCode) ? 'active' : '']"
              @tap="togglePL(i)"
              v-for="(i, n) in plList"
              :key="n"
            >
              {{ i.industryName }}
            </view>
          </view>
        </view>
        <view>
          <view :class="[$bem('title')]">
            类型
          </view>
          <view :class="[$bem('content')]">
            <view
              :style="{fontSize: i.productGroupName.length > 5 ? '24rpx' : '28rpx'}"
              :class="[$bem('content--btn'), productGroupCodeList.includes(i.productGroupCode) ? 'active' : '']"
              @tap="toggleCPZ(i)"
              v-for="(i, n) in cpzList"
              :key="n"
            >
              {{ i.productGroupName }}
            </view>
          </view>
        </view>
        <view>
          <view :class="[$bem('title')]">
            库存余量
          </view>
          <view :class="[$bem('content')]">
            <view
              :class="[$bem('content--btn'), hasStock === (n+1) ? 'active' : '']"
              @tap="toggleKCYL(n+1)"
              v-for="(i, n) in kcylList"
              :key="n"
            >
              {{ i.name }}
            </view>
          </view>
        </view>
        <view :class="[$bem('footer')]">
          <view @tap="reset">
            重置
          </view>
          <view @tap="sure">
            确认
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { bemMixin } from '../../../../mixins'
import { selectLocation } from '../../../../utils/location.js'
import http from '../../../../http'
import { CloudShopGoods } from '../../../../apis/cloud-shop-goods'
export default {
  mixins: [bemMixin('filter-slider')],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    addressDetail: {
      type: Object,
      default: () => {}
    },
    defaultParam: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    show: function (newVal, oldVal) {
      this.reset()
      if (newVal) {
        // 调用接口之后，此逻辑要放在请求成功后
        setTimeout(() => {
          this.delayContent = true
          const address = this.addressDetail.access.address
          // 未授权时默认定位北京，支持修改；已授权展示实际地理位置
          this.address = `${address.provinceName || ''}${address.cityName || ''}${address.countyName || ''}${address.townName || ''}${address.fullAddress || ''}` || '北京'
          // 设置默认值
          this.setDefault()
          // 重置定位状态，确定时区分是否需要传位置
          this.isReloadPosition = false
        }, 200)
      } else {
        this.delayContent = false
      }
    },
    deep: true
  },
  created () {
    const _this = this
    // 判断顶部padding
    uni.getSystemInfo({
      success: function (e) {
        const custom = wx.getMenuButtonBoundingClientRect()
        _this.customBarHeight = custom.bottom + custom.top - e.statusBarHeight
      }
    })
    // 品类
    this.getIndustryAndProductGroup()
  },
  data () {
    return {
      // 是否重新定位了
      isReloadPosition: false,
      currentAddress: {},
      industryCodeList: [],
      productGroupCodeList: [],
      hasStock: 1,
      customBarHeight: '',
      delayContent: false, // 防止布局乱，在0.2s过度效果完成后显示主要内容
      minPrice: null,
      maxPrice: null,
      plList: [],
      cpzList: [],
      kcylList: [{ name: '有货' }],
      address: '',
      lowPlaceholder: '自定义低价',
      highPlaceholder: '自定义高价'
    }
  },
  methods: {
    // 初始化设置默认值
    setDefault () {
      const { industryCodeList, productGroupCodeList, hasStock, minPrice, maxPrice } = this.defaultParam
      this.industryCodeList = industryCodeList.length > 0 ? industryCodeList : []
      this.productGroupCodeList = productGroupCodeList.length > 0 ? productGroupCodeList : []
      this.hasStock = hasStock
      this.minPrice = minPrice
      this.maxPrice = maxPrice
      this.getCpzList()
    },
    // 获取所有品类
    getIndustryAndProductGroup () {
      http.get(CloudShopGoods.getIndustryAndProductGroup).then(res => {
        if (res.data.success) {
          this.plList = res.data.data
          this.cpzList = res.data.data[0].productGroupList
        }
      })
    },
    // 重置
    reset () {
      this.industryCodeList = []
      this.productGroupCodeList = []
      this.cpzList = []
      this.hasStock = 1
      this.minPrice = ''
      this.maxPrice = ''
    },
    // 确认按钮调用
    sure () {
      const params = {
        industryCodeList: this.industryCodeList,
        productGroupCodeList: this.productGroupCodeList,
        hasStock: this.hasStock,
        minPrice: this.minPrice ? Number(this.minPrice) : '',
        maxPrice: this.maxPrice ? Number(this.maxPrice) : ''
      }
      // 如果选择了重新定位，先把重新定位的地址保存为授权地址
      if (this.isReloadPosition) {
        this.$emit('accessChange', this.currentAddress)
      }
      this.$emit('filterSure', params)
    },
    // 价格比较
    compare (val, current) {
      this.$nextTick(() => {
        if (current === 'minPrice') this.lowPlaceholder = '自定义低价'
        if (current === 'maxPrice') this.highPlaceholder = '自定义高价'
        if (this.maxPrice === '' || this.minPrice === '') return
        if (current === 'minPrice' && Number(this.maxPrice) < Number(this.minPrice)) {
          this.minPrice = ''
          uni.showToast({
            title: '最低价不可高于最高价',
            icon: 'none'
          })
        }
        if (current === 'maxPrice' && Number(this.maxPrice) < Number(this.minPrice)) {
          this.maxPrice = ''
          uni.showToast({
            title: '最高价不可低于最低价',
            icon: 'none'
          })
        }
      })
    },
    // 品类事件 ,*****这里逻辑变过两次有变回来的风险，先保留代码, 过段时间删除 变更历史 1 多选变单选 2 二类全选变不全选，默认二类全部激活变为不激活
    togglePL (i) {
      // 点击已激活的品类取消激活
      if (this.industryCodeList.includes(i.industryCode)) {
        // 将当前品类下的产品组code进行取消css的active状态
        // 1 当前品类下的产品组
        const current = this.plList.find(item => item.industryCode === i.industryCode)
        // 2 取消当前品类下产品组的选中状态
        current.productGroupList.forEach(item => {
          this.productGroupCodeList.splice(this.productGroupCodeList.indexOf(item.productGroupCode), 1)
        })
        // 3 取消品类的active状态
        this.industryCodeList.splice(this.industryCodeList.indexOf(i.industryCode), 1)
      } else {
        // 点击没有激活的品类添加激活

        // ---------变更逻辑，原多选改为单选------------
        this.industryCodeList = [i.industryCode]
        // ---------变更逻辑，原多选改为单选------------

        // ---------变更前多选逻辑先注释
        // this.industryCodeList.push(i.industryCode)
        // ---------变更前多选逻辑先注释------------

        // 将当前触发品类下的产品组code进行保存为css的active状态

        // ---------变更逻辑，原激活状态变为不激活------------
        this.productGroupCodeList = []
        // ---------变更逻辑，原激活状态变为不激活------------

        // ---------变更前多选激活逻辑先注释------------
        // const current = this.plList.find(item => item.industryCode === i.industryCode)
        // current.productGroupList.forEach(item => {
        //   if (!this.productGroupCodeList.includes(item.productGroupCode)) {
        //     this.productGroupCodeList.push(item.productGroupCode)
        //   }
        // })
        // ---------变更前多选激活逻辑先注释-------------
      }
      this.getCpzList()
    },
    getCpzList () {
      // 点击品类时对产品组列表进行操作，将已有品类的产品组列表全部显示
      // 1 当前已选中品类
      const currentPLList = this.plList.filter(item => this.industryCodeList.includes(item.industryCode))
      // 2 重置产品组list
      this.cpzList = []
      // 3 将已选中品类的产品组添加到产品组列表中
      // 这里之所以些成这样是因为原来二类可以添加多次，如果逻辑不变回来，可以优化一层循环, 减少一层判断
      currentPLList.forEach(item => {
        item.productGroupList.forEach(itemChild => {
          if (!this.cpzList.find(itemThree => itemChild.productGroupCode === itemThree.productGroupCode)) {
            this.cpzList.push(itemChild)
          }
        })
      })
    },
    // 产品组事件
    toggleCPZ (i) {
      if (this.productGroupCodeList.includes(i.productGroupCode)) {
        this.productGroupCodeList.splice(this.productGroupCodeList.indexOf(i.productGroupCode), 1)
      } else {
        this.productGroupCodeList.push(i.productGroupCode)
      }
    },
    // 有无货事件
    toggleKCYL (n) {
      if (this.hasStock === n) this.hasStock = null
      else this.hasStock = n
    },
    // 点击遮罩返回
    filterGoBack () {
      this.$emit('filterGoBack')
    },
    // 微信插标
    getLocation () {
      selectLocation().then(res => {
        const address = res.address
        this.address = `${address.provinceName || ''}${address.cityName || ''}${address.countyName || ''}${address.townName || ''}${address.fullAddress || ''}`
        // 选择了重新定位
        this.isReloadPosition = true
        // 保存重新定位数据
        this.currentAddress = res
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../../static/utils.scss";
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
$main-color: #323233;
$main-bg: #f7f8fa;
$white: #ffffff;
$active-bg-color: var(--brand-secondary-color);
$active-color: var(--brand-color);
@mixin height-center($h) {
  height: #{$h}rpx;
  line-height: #{$h}rpx;
}
.img-36-36 {
  position: relative;
  top: 3rpx;
  width: 36rpx;
  height: 36rpx;
}
.filter-slider {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  width: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  > view {
    box-sizing: border-box;
    position: relative;
    width: 0vw;
    height: 100vh;
    background: $white;
    transition: width 0.2s ease-out;
    overflow-y: auto;
    color: $main-color;
    padding-bottom: 100rpx;
  }
  &_position {
    @include flex(row, space-between, center);
    @include height-center(88);
    font-size: 26rpx;
    margin-bottom: 24rpx;
    padding: 0 37rpx 0 0;
    .address {
      width: 374rpx;
      white-space: nowrap;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
    }
  }
  &_title {
    font-size: 30rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
  }
  &_input {
    @include flex(row, flex-start, flex-start);
    margin-bottom: 40rpx;
    &--box {
      @include flex(row, center, center);
      @include height-center(60);
      width: 255rpx;
      background: $main-bg;
      border-radius: 30rpx;
      ::v-deep input {
        text-align: center !important;
        font-size: 26rpx !important;
      }
    }
    &--bar {
      @include height-center(60);
      margin: 0 18rpx;
    }
  }
  &_content {
    font-size: 24rpx;
    margin-bottom: 52rpx;
    &--btn {
      box-sizing: border-box;
      margin-bottom: 16rpx;
      min-width: 180rpx;
      padding: 0 15rpx;
      display: inline-block;
      @include height-center(60);
      background: $main-bg;
      border-radius: 32rpx;
      text-align: center;
      border: 0.5rpx solid $main-bg;
      font-size: 28rpx;
    }
    &--btn:not(:nth-child(3n)) {
      margin-right: 8rpx;
    }
    .active {
      background: $active-bg-color;
      border: 0.5rpx solid $active-color;
      color: $active-color;
    }
  }
  &_footer {
    @include flex(row, flex-start, flex-start, wrap);
    @include height-center(80);
    position: fixed;
    bottom: 0px;
    background: #fff;
    padding-bottom: 100rpx;
    height: 140rpx;
    padding-top: 20rpx;
    font-size: 28rpx;
    color: $active-color;
    padding-bottom: 100rpx;
    > view {
      width: 270rpx;
      height: 80rpx;
      line-height: 80rpx;
      box-sizing: border-box;
      text-align: center;
      box-sizing: border-box;
    }
    > view:nth-child(1) {
      border-radius: 40rpx;
      border: 1rpx solid $active-color;
    }
    > view:nth-child(2) {
      color: $white;
      background: $active-color;
      border-radius: 40rpx;
      margin-left: 16rpx;
      border: 1rpx solid $active-color;
    }
  }
}
</style>
