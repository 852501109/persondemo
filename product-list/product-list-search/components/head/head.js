import { uRouter } from '../../../../../router' // 具体路径以实际为准
import { bemMixin } from '../../../../../mixins'
import { setStorage, getStorage } from '../../../../../utils/storage'
import { buriedPointReport } from '../../../../../utils/report'
export default {
  props: {
    from: {
      type: String,
      default: ''
    }
  },
  mixins: [bemMixin('product-list-search-head')],
  data () {
    return {
      searchInput: '',
      btnHeight: '' // 计算自定义头部高度
    }
  },
  created () {
    this.btnHeight = this.pxToRpx(uni.getMenuButtonBoundingClientRect().height) + 'rpx!important'
  },
  methods: {
    // px转换为rpx
    pxToRpx (px) {
      const deviceWidth = wx.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const rpx = (750 / deviceWidth) * Number(px)
      return Math.floor(rpx)
    },
    // 点击搜索按钮事件
    searchBack () {
      buriedPointReport({ pageName: '搜索-搜索按钮', buttonName: '' })
      // 生成收索记录
      let searchHistory = getStorage('searchHistory') || []
      if (this.searchInput) {
        const currentIndex = searchHistory.indexOf(this.searchInput)
        // 已有搜索内容时，先去掉，在添加至后方
        if (currentIndex < 0) {
          searchHistory.push(this.searchInput)
        } else {
          searchHistory.splice(currentIndex, 1)
          searchHistory.push(this.searchInput)
        }
      }
      // 取后10个
      if (searchHistory.length > 10) searchHistory = searchHistory.slice(searchHistory.length - 10, searchHistory.length)
      setStorage('searchHistory', searchHistory)
      // 回传搜索参数
      const searchBackObj = { type: 'search', itemName: this.searchInput }
      setStorage('searchBackObj', searchBackObj)
      if (this.from !== 'productListIndex') {
        uRouter.push('/subpacks/mall/pages/product-list/product-list-index/product-list-index')
      } else {
        uRouter.back()
      }
    },
    goBack () {
      uRouter.back()
    }
  }
}
