import { uRouter } from '../../../../../router' // 具体路径以实际为准
import { bemMixin } from '../../../../../mixins'
import browseReportMixins from '../../../../../mixins/browse-report-mixins'
import { imageCompressUrl } from '../../../../../utils'
import { buriedPointReport } from '../../../../../utils/report'
export default {
  props: {
    itemName: {
      type: String,
      default: ''
    },
    currentType: {
      type: Number,
      default: 0
    },
    sort: {
      type: Number,
      default: 0
    },
    source: {
      type: String,
      default: ''
    }
  },
  mixins: [bemMixin('product-list-index-head'), browseReportMixins],
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
    this.btnHeight = this.pxToRpx(uni.getMenuButtonBoundingClientRect().height) + 'rpx!important'
  },
  methods: {
    // 筛选tab状态改变时触发
    selectType (n) {
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
    },
    goBack () {
      if (this.source === 'share') {
        uRouter.switchTab('/pages/mall/mall')
      } else {
        uRouter.back()
      }
    },
    toSearch () {
      buriedPointReport({ pageName: '商品列表-搜索', buttonName: '' })
      uRouter.push('/subpacks/mall/pages/product-list/product-list-search/product-list-search', { from: 'productListIndex' })
    }
  }
}
