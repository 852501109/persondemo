import productList from './components/list/list.vue' // 列表: 瀑布流+普通列表
import configProvider from '../../../components/config-provider.vue'
import productHead from './components/head/head.vue' // 非筛选头部
import filterHead from './components/filter-head.vue' // 筛选头部
import { selectLocation } from '../../../utils/location.js' // 微信插标
import filterSlider from './components/filter-slider.vue' // 筛选抽屉
import filterTab from './components/head/filter-tab.vue' // 筛选tab
import http from '../../../http'
import { CloudShopGoods } from '../../../apis/cloud-shop-goods'
import { CloudShopBase } from '../../../apis/cloud-shop-base'
import { getUserLoginStatus } from '../../../utils/userInfo'
import { getStorage, removeStorage, setStorage } from '../../../utils/storage'
import SdkApi from '../../../core/sdk-api/mp-weixin'
import ShareMixins from '../../../mixins/share-mixins'
import browseReportMixins from '../../../mixins/browse-report-mixins'
export default {
  mixins: [ShareMixins, browseReportMixins],
  components: {
    productList,
    configProvider,
    productHead,
    filterSlider,
    filterHead,
    filterTab
  },
  data () {
    return {
      code: '', // 页面标识
      source: '', // 页面来源 默认跳转 share-分享
      browseReportConfig: {
        pageType: 10,
        pageName: '商品列表',
        browseWithName: ''
      }, // 浏览统计相关信息
      shareConfig: {
        title: '商品列表',
        report: {
          pageType: 10,
          pageName: '商品列表',
          shareWithName: ''
        }
      },
      listChanging: false,
      page: {
        page: 1,
        rows: 20
      },
      isLogin: getUserLoginStatus(),
      total: null,
      userId: uni.getStorageSync('flow_user_id'),
      params: {
        itemName: '',
        minPrice: '',
        maxPrice: '',
        hasStock: 1,
        productGroupCodeList: [],
        industryCodeList: [],
        sort: 1,
        countryCode: '110101' // 默认东华门街道
      },
      defaultShipAddress: '',
      address: '',
      status: 2,
      isLoading: false,
      isShowfilterPopup: false,
      currentType: 0,
      isEmpty: false,
      list: [],
      // 地址信息维护对象
      addressDetail: {
        // 默认收获地址,接口获取
        default: {
          address: {
            provinceCode: '',
            provinceName: '',
            cityCode: '',
            cityName: '',
            countyCode: '',
            countyName: '',
            townCode: '',
            townName: '',
            fullAddress: ''
          },
          latitude: null,
          longitude: null
        },
        // 授权地址默认北京市-北京市-东城区-东华门街道
        access: {
          address: {
            provinceCode: '110000',
            provinceName: '北京市',
            cityCode: '110000',
            cityName: '北京市',
            countyCode: '110101',
            countyName: '东城区',
            townCode: '110101001000',
            townName: '东华门街道',
            fullAddress: '北京市-北京市-东城区-东华门街道'
          },
          latitude: 39.5427,
          longitude: 116.2317
        }
      }
    }
  },
  onShow () {
    this.isLogin = getUserLoginStatus()
    // 回传搜索结果
    const searchObject = getStorage('searchBackObj') || ''
    if (searchObject && searchObject.type === 'search') {
      this.params.itemName = searchObject.itemName
      // 清空从筛选带回来的条件
      this.params.minPrice = ''
      this.params.maxPrice = ''
      this.params.hasStock = 1
      this.params.productGroupCodeList = []
      this.params.industryCodeList = []
      this.params.sort = 1
      this.currentType = 0
      this.getList(true)
      removeStorage('searchBackObj')
      return
    }
    if (searchObject && searchObject.type === 'location') {
      removeStorage('searchBackObj')
      return
    }
    // 新增逻辑调整，有过定位地址 优先级 大于默认地址
    if (getStorage('productListLocation')) {
      this.addressDetail.access = getStorage('productListLocation')
      this.params.countryCode = getStorage('productListLocation').address.countyCode
      this.getList(true)
    } else {
      this.getDetaultAddress()
    }
  },
  onLoad (query) {
    this.isLogin = getUserLoginStatus()
    this.source = query.source || ''
    // 从 `找相似` 跳转过来的
    if (query && query.type === 'findSame') {
      if (query.item) {
        const params = JSON.parse(query.item)
        this.params.industryCodeList = [params.industryCode]
        this.params.productGroupCodeList = [params.productGroupCode]
      }
    }
  },
  methods: {
    // 获取当前位置信息
    getLocalAddressInit () {
      SdkApi.authorize({
        scope: 'scope.userLocation'
      }).then((res) => {
        console.log(res)
        if (res.errMsg === 'authorize:ok') {
          SdkApi.getFuzzyLocation({
            type: 'gcj02',
            geocode: true, // 设置该参数为true可直接获取经纬度及城市信息
            isHighAccuracy: true
          }).then((res) => {
            this.addressDetail.access = res
            this.getList(true)
          })
        }
      })
    },
    // 获取默认地址
    getDetaultAddress () {
      // 未登录逻辑与登录无默认地址逻辑相同
      if (!this.isLogin) {
        this.getLocation()
        return
      }
      http.post(CloudShopBase.getCustomerDefaultAddress).then((res) => {
        if (res.data.success) {
          const data = res.data.data
          if (!data) {
            // 无默认地址获取获取授权
            this.getLocation()
            // uni.getSetting({
            //   success: (res) => {
            //     // res.authSetting['scope.userLocation'] === undefined  表示 初始化进入，从未授权
            //     // res.authSetting['scope.userLocation'] === true       表示 已授权
            //     // res.authSetting['scope.userLocation'] === false      表示 授权拒绝
            //     if (res.authSetting["scope.userLocation"]) {
            //       SdkApi.getLocation({
            //         type: "gcj02",
            //         geocode: true, // 设置该参数为true可直接获取经纬度及城市信息
            //         isHighAccuracy: true,
            //       }).then((res) => {
            //         console.log(res)
            //         this.addressDetail.access = res;
            //         this.getList(true);
            //       });
            //     } else {
            //       this.getLocalAddressInit()
            //     }
            //   },
            // })
          } else {
            const addressObj = {
              address: {
                provinceCode: data.provinceCode,
                provinceName: data.provinceName,
                cityCode: data.cityCode,
                cityName: data.cityName,
                countyCode: data.districtCode,
                countyName: data.districtName,
                townCode: data.streetCode,
                townName: data.streetName,
                fullAddress: data.fullAddress,
                isDefault: true
              },
              latitude: data.latitude,
              longitude: data.latitude
            }
            this.addressDetail.default = addressObj
            this.addressDetail.access = addressObj
            this.params.countryCode = data.districtCode
            setStorage('productListLocation', this.addressDetail.access)
            this.getList(true)
          }
        }
      })
    },
    // tab栏事件
    changeType (n) {
      // 维护升降序css样式显示
      // type切换
      if (n < 4) {
        this.currentType = n
      }
      // 销量与价格平序 将sort值设置为非2，3，4，5的数字
      if (n === 0) {
        this.params.sort = 1
        this.getList(true)
      }
      // 销量升降序
      if (n === 1) {
        this.params.sort = this.params.sort === 3 ? 2 : 3
        this.getList(true)
      }
      // 价格升降序
      if (n === 2) {
        this.params.sort = this.params.sort === 5 ? 4 : 5
        this.getList(true)
      }
      if (n === 4) {
        if (this.listChanging) return
        this.listChanging = true
        const newList = JSON.parse(JSON.stringify(this.list))
        this.list = []
        setTimeout(() => {
          this.status = this.status === 1 ? 2 : 1
          this.list = newList
          this.listChanging = false
        }, 100)
      }
      if (n === 5) this.isShowfilterPopup = true
    },
    filterGoBack () {
      this.isShowfilterPopup = false
    },
    // 插标定位改变授权地址
    accessChange (res) {
      this.addressDetail.access = res
      // 默认请求地址改变
      this.params.countryCode = res.address.countyCode
      setStorage('productListLocation', res)
    },
    filterSure (filterParams) {
      this.params = Object.assign(this.params, filterParams)
      this.isShowfilterPopup = false
      this.getList(true)
    },
    handlePopupClose () {
      this.isShowfilterPopup = false
    },
    /**
     * 获取商品列表
     * @param {Boolean} isFilter 是否为筛选/搜索/排序等请求
     */
    getList (isFilter) {
      if (isFilter) {
        // 筛选分页从头开始
        this.page.page = 1
        this.isNoMore = false
        this.list = []
        uni.showLoading({
          title: '加载中',
          mask: true
        })
      } else {
        // 无下一页判断
        if (this.isLoading) return
        this.isLoading = true
        if (this.total && this.list.length >= this.total) return
        uni.showLoading({
          title: '加载中',
          mask: true
        })
      }
      const params = Object.assign(this.page, this.params)
      http
        .post(CloudShopGoods.searchGoodsMallByConditions, params)
        .then((res) => {
          if (res.statusCode === 200) {
            const data = res.data.data || {}
            this.list = this.list.concat(data.list || [])
            this.$forceUpdate()
            this.isEmpty = this.list.length === 0
            this.page.page++
            this.total = data.total
            uni.hideLoading()
            this.isLoading = false
          }
        }).catch(() => {
          uni.hideLoading()
          uni.showToast({
            title: '服务器错误',
            icon: 'none'
          })
        }).finally(() => {
          uni.hideLoading()
        })
    },
    // 调用插标
    getLocation () {
      setStorage('searchBackObj', { type: 'location' })
      selectLocation()
        .then((res) => {
          this.addressDetail.access = res
          // 如果定位过，保存定位第二次进入无需定位
          setStorage('productListLocation', res)
          // 默认请求地址改变
          this.params.countryCode = res.address.countyCode
          this.getList(true)
        })
        .catch(() => {
          uni.showToast({
            title: '请授权地址信息后，重新定位',
            icon: 'none'
          })
          this.getList(true)
        })
    }
  }
}
