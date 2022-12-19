import configProvider from '../../../components/config-provider.vue'
import searhHead from './components/head/head.vue'
import { bemMixin } from '../../../mixins'
import http from '../../../http'
import { getThemeConfig } from '../../../utils/theme'
import { CloudShopGoods } from '../../../apis/cloud-shop-goods'
import { getStorage, removeStorage, setStorage } from '../../../utils/storage'
import { uRouter } from '../../../router' // 具体路径以实际为准
import { imageCompressUrl } from '../../../utils'
import { buriedPointReport } from '../../../utils/report'
import browseReportMixins from '../../../mixins/browse-report-mixins'
export default {
  mixins: [browseReportMixins, bemMixin('product-list-search')],
  components: {
    searhHead,
    configProvider
  },
  data () {
    return {
      brandColor: getThemeConfig().brandColor,
      browseReportConfig: {
        pageType: 10,
        pageName: '商品列表-搜索',
        browseWithName: ''
      },
      hisList: [],
      hotList: [],
      from: '',
      clearShow: false
    }
  },
  onLoad (query) {
    if (query && query.from) {
      console.log(query.from)
      this.from = query.from
    }
  },
  onShow () {
    this.getHotList()
    this.getSearchHistory()
  },
  methods: {
    imgUrl (img) {
      return img ? imageCompressUrl(img, '300') : ''
    },
    // 获取搜索结果
    getSearchHistory () {
      this.hisList = getStorage('searchHistory') || []
      this.hisList = this.hisList.reverse()
    },
    // 跳转搜索结果页
    toResult (i) {
      const searchBackObj = { type: 'search', itemName: i }
      setStorage('searchBackObj', searchBackObj)
      if (this.from !== 'productListIndex') {
        uRouter.push('/subpacks/mall/pages/product-list/product-list-index/product-list-index')
      } else {
        uRouter.back()
      }
    },
    // 跳转至商品详情
    toDetail (i) {
      buriedPointReport({ pageName: '搜索-人气商品', buttonName: i.itemName })
      uRouter.push(
        '/subpacks/mall/pages/product-list/product-detail/product-detail',
        { id: i.id })
    },
    // 获取热销商品列表
    getHotList () {
      http.post(CloudShopGoods.listGoodsSellWell).then(res => {
        if (res.statusCode === 200) {
          this.hotList = res.data.data
        }
      })
    },
    // 清除搜索历史记录
    clearHisSure () {
      removeStorage('searchHistory')
      this.hisList = []
      this.clearShow = false
    },
    closeModal () {
      this.clearShow = false
    },
    clearHis () {
      this.clearShow = true
    }
  }
}
