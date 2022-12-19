import rightDetail from '../../right/right-detail/right-detail.vue' // 权益组件
import getCoupon from '../../coupon/get-coupon/get-coupon.vue' // 卡券组件
import configProvider from '../../../components/config-provider.vue'
import videoPlayer from '../../../components/video-player/video-player.vue'
import shipTo from './components/ship-to.vue' // 送至组件
import { uRouter } from '../../../router'
import { bemMixin } from '../../../mixins'
import http from '../../../http'
import { CloudShopGoods } from '../../../apis/cloud-shop-goods'
import { CloudShopStock } from '../../../apis/cloud-shop-stock'
import { CloudShopBase } from '../../../apis/cloud-shop-base'
import { setStorage, getStorage, removeStorage } from '../../../utils/storage'
import { getThemeConfig } from '../../../utils/theme'
import { getUserLoginStatus } from '../../../utils/userInfo'
import browseReportMixins from '../../../mixins/browse-report-mixins'
import ShareMixins from '../../../mixins/share-mixins'
import ShopFixedBar from '../../../components/fixed-bar/fixed-bar'
import detailBadge from '../../../components/badge/badge.vue'
import { money } from '../../../filters'
import { imageCompressUrl } from '../../../utils'
import { buriedPointReport } from '../../../utils/report'
export default {
  mixins: [bemMixin('product-detail'), browseReportMixins, ShareMixins],
  components: {
    configProvider,
    getCoupon,
    rightDetail,
    shipTo,
    videoPlayer,
    ShopFixedBar,
    detailBadge
  },
  filters: {
    money
  },
  onLoad (query) {
    // 详情规格生成吸顶
    const owenr = this
    const domQuery = uni.createSelectorQuery()
    domQuery.select('#scrollId').boundingClientRect()
    domQuery.exec(function (res) {
      if (res && res[0]) { owenr.nameTop = res[0].top }
    })

    // 页面跳转时删除默认回传的地址，为了onshow获取到时时的返回地址更新
    removeStorage('orderBackAddress')

    // 获取详情
    this.detailId = query.id

    const productListLocation = getStorage('productListLocation')
    // 商品有过定位，即带过来
    if (productListLocation) {
      this.addressDetail.access = productListLocation
    }
    // 查询商品上下架状态
    this.checkGoodsShelvesStatus()
    // 获取详情
  },
  onShow () {
    // 每次进入重置货物状态
    this.isLogin = getUserLoginStatus()
    // 刷新下立即登录按钮状态
    this.immediatelyLogin = !this.isLogin
    // 获取所有收获地址列表
    this.getHarvestList().then(() => {
      // 订单页面返回时送至地址变为选择地址
      const orderBackAddress = getStorage('orderBackAddress')
      // 此处代码是因为没有addressId，所以有繁杂的筛选
      if (orderBackAddress) {
        const currentId = this.harvestList.find(item => item.provinceCode === orderBackAddress.provinceCode && item.cityCode === orderBackAddress.cityCode && item.districtCode === orderBackAddress.districtCode && item.townCode === orderBackAddress.townCode && item.townCode === orderBackAddress.townCode && item.fullAddress === orderBackAddress.fullAddress).id
        this.shipToAddress.address = {
          provinceCode: orderBackAddress.provinceCode,
          provinceName: orderBackAddress.provinceName,
          cityCode: orderBackAddress.cityCode,
          cityName: orderBackAddress.cityName,
          countyCode: orderBackAddress.districtCode,
          countyName: orderBackAddress.districtName,
          townCode: orderBackAddress.townCode,
          townName: orderBackAddress.townName,
          fullAddress: orderBackAddress.fullAddress,
          isDefault: true
        }
        // 地址id更新
        this.addressId = currentId
        // 商品模块定位地址统一
        setStorage('productListLocation', this.shipToAddress)
        // 从上一页回来要更新送至逻辑
        this.initShipPromise()
        removeStorage('orderBackAddress')
      }
    })
    // 更新购物车数量
    this.getCartNum()
    // 获取详情
    this.getDetail(this.detailId)
  },
  watch: {
    // 监听登录状态, 当登录状态从否变为是时，重新生成送至逻辑
    isLogin: {
      handler: function (newVal) {
        if (newVal) {
          // 重置货物状态
          this.isInStock = null
          this.getDefaultAddress()
        }
      },
      deep: true
    }
  },
  // 计算详情吸顶距离
  onPageScroll (e) {
    this.rect = e.scrollTop
  },
  data () {
    return {
      info: {
        address: {}
      },
      // 需要已登录接口
      browseReportConfig: {
        pageType: 11,
        pageName: '商品详情',
        browseWithName: ''
      }, // 浏览统计相关信息
      shareConfig: {
        title: '',
        report: {
          pageType: 11,
          pageName: '商品详情',
          shareWithName: ''
        }
      },
      dots: 0, // banner指示器
      userId: uni.getStorageSync('flow_user_id'),
      selectAddressShow: false, // 四级地址弹窗
      highlightColor: getThemeConfig().highlightColor,
      primarySecondaryColor: getThemeConfig().primarySecondaryColor,
      isLogin: getUserLoginStatus(),
      tabList: [{ name: '商品详情' }, { name: '规格参数' }],
      // 送至弹框
      isShipToShow: false,
      // 是否已收藏
      updateVideo: true,
      // 当前详情ID
      detailId: '',
      // 是否显示立即登录
      immediatelyLogin: false,
      // 用户地址配送范围内客户统仓是否有货
      isInStock: null,
      // 商品是否已上架状态
      goodsIsSelling: true,
      // 商品详情和商品属性
      cartProductNum: 0,
      // 送装承诺文案
      shipToPromiseMsg: '',
      // 所有收获地址列表
      harvestList: [],
      itemDescribe: 1,
      isFixed: false,
      nameTop: '',
      rect: '',
      detailData: {
        pictureList: [],
        videoList: [],
        hasStock: false,
        itemName: '',
        retailPrice: '',
        itemSellingPoint: [],
        salesVolume: '',
        starStatus: false,
        itemDescribe: ''
      },
      // 地址ID
      addressId: '',
      // 送至的收获地址
      shipToAddress: {
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
      // 地址信息维护对象
      addressDetail: {
        // 默认收获地址
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
        // 授权地址
        access: {
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
        }
      }
    }
  },
  computed: {
    // 图片列表主图
    mainPictureUrl () {
      const mainPicture = this.detailData.pictureList.find(item => item.mainFlag === 'Y')
      return mainPicture ? mainPicture.pictureUrl : ''
    },
    // 商品属性
    attributesInfo () {
      if (!this.detailData.attributesInfo) return []
      const entries = Object.entries(
        JSON.parse(this.detailData.attributesInfo)
      )
      return entries
    },
    // 送至四级地址
    shipToAddressFourLevel () {
      const address = this.shipToAddress.address
      return `${address.provinceName || ''}${address.cityName || ''}${address.countyName || ''}${address.townName || ''}${address.fullAddress || ''}`
    },
    // 默认收获地址四级地址
    defaultAddressFourLevel () {
      const address = this.addressDetail.default.address
      return `${address.provinceName || ''}${address.cityName || ''}${address.countyName || ''}${address.townName || ''}${address.fullAddress || ''}`
    },
    // 上一级带过来四级地址
    accessAddressFourLevel () {
      const address = this.addressDetail.access.address
      return `${address.provinceName || ''}${address.cityName || ''}${address.countyName || ''}${address.townName || ''}${address.fullAddress || ''}`
    },
    pageFixed () {
      if (this.rect > this.nameTop) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    // 富文本处理
    formatRichText () {
      const html = this.detailData.itemDescribe
      if (!html) return ''
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match
          .replace(/style=''/, '')
          .replace(/style="[^"]+"/gi, '')
          .replace(/style='[^']+'/gi, '')
        match = match
          .replace(/width="[^"]+"/gi, '')
          .replace(/width='[^']+'/gi, '')
        match = match
          .replace(/height="[^"]+"/gi, '')
          .replace(/height='[^']+'/gi, '')
        return match
      })
      newContent = newContent.replace(
        /style="[^"]+"/gi,
        function (match, capture) {
          match = match
            .replace(/width:[^;]+;/gi, 'max-width:100%;')
            .replace(/width:[^;]+;/gi, 'max-width:100%;')
          return match
        }
      )
      newContent = newContent.replace(/<br[^>]*\/>/gi, '')
      newContent = newContent.replace(
        /<img/gi,
        '<img class="rich-text-image"'
      )
      return newContent
    }
  },
  methods: {
    // 图片处理
    imgUrl (img) {
      return img ? imageCompressUrl(img, '300') : ''
    },
    // rpx转换为px
    rpxToPx (rpx) {
      const deviceWidth = uni.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const px = (deviceWidth / 750) * Number(rpx)
      return Math.floor(px)
    },
    // 查询商品上下架状态
    checkGoodsShelvesStatus () {
      const params = {
        itemIdList: [this.detailId]
      }
      http.post(CloudShopGoods.checkGoodsShelvesStatus, params).then((res) => {
        if (res.data.success) this.goodsIsSelling = res.data.data
      })
    },
    // 获取收获地址列表
    getHarvestList () {
      return new Promise((resolve) => {
        if (!this.isLogin) {
          resolve('needLogin')
          return
        }
        http.post(CloudShopBase.listCustomerAddressByUserId).then(res => {
          if (res.data.success) {
            this.isLoading = false
            this.harvestList = res.data.data || []
            resolve('success')
          } else {
            resolve('error')
          }
        })
      })
    },
    // 删除收货地址
    delHarvest (item) {
      const id = item.id
      const params = {
        id: id
      }
      http.post(CloudShopBase.deleteCustomerAddressById, params).then(res => {
        if (res.data.success) {
          uni.showToast({
            title: '删除成功',
            icon: 'none'
          })
          if (id === this.addressId) {
            this.addressId = ''
            this.shipToAddress = {
              address: {
                provinceCode: '',
                provinceName: '',
                cityCode: '',
                cityName: '',
                countyCode: '',
                countyName: '',
                townCode: '',
                townName: '',
                fullAddress: '请选择地址'
              },
              latitude: null,
              longitude: null
            }
          }
          this.getHarvestList()
        }
      })
    },
    // 获取默认地址列表
    getDefaultAddress () {
      if (!this.isLogin) {
        this.initShipTo()
        return
      }
      http
        .post(CloudShopBase.getCustomerDefaultAddress)
        .then((res) => {
          if (res.data.success && res.data.data) {
            const data = res.data.data
            this.addressDetail.default = {
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
              longitude: data.longitude
            }
            this.addressId = data.id
          }
          // 生成送至逻辑
          this.initShipTo()
        })
    },
    // 送至选择地址
    chooseAddress (res, idObj) {
      this.shipToAddress = res
      this.isShipToShow = false
      setStorage('productListLocation', res)
      if (idObj) this.addressId = idObj.id
      // 更新送承诺
      this.initShipPromise()
    },
    // 跳转至附近门店
    toNearByStores () {
      const orderToNearbyStores = this.shipToAddress
      buriedPointReport({ pageName: '商品详情-去附近门店查看实物', buttonName: this.detailData.itemName })
      this.$nextTick(() => {
        uRouter.push('/subpacks/mall/pages/nearby-stores/nearby-stores', { type: 'product-detail' }, {
          success: (res) => {
            res.eventChannel.emit('orderToNearbyStores', orderToNearbyStores)
          }
        })
      })
    },
    // 分享触发
    reportShare () {
      buriedPointReport({ pageName: '商品详情-分享', buttonName: this.detailData.itemName })
    },
    // 商品详情/规格参数 按钮上报
    detailReport (item) {
      if (item.name === '商品详情') this.itemDescribe = 1
      if (item.name === '规格参数') this.itemDescribe = 2
      buriedPointReport({ pageName: `商品详情-${item.name}`, buttonName: this.detailData.itemName })
    },
    // 关闭送至弹框
    shipToClose () {
      this.isShipToShow = false
    },
    // swiper切换
    swiperChange (e) {
      const owner = this
      const { current } = e.detail
      owner.dots = current
      owner.handlePauseVideoPlay()
      owner.$forceUpdate()
    },
    // 暂停本页面视频播放
    handlePauseVideoPlay () {
      const owner = this
      if (owner.$refs.videoPlayerInBannerRef && owner.$refs.videoPlayerInBannerRef.length) {
        owner.$refs.videoPlayerInBannerRef.forEach(player => {
          player.onPause().then(() => {})
        })
      }
    },
    // 跳转至购物车
    toShopingCart () {
      // 以下是已有逻辑
      if (this.isLogin) {
        uRouter.push('/subpacks/mall/pages/shopping-cart/shopping-cart', {
          id: this.detailId,
          addressDetail: JSON.stringify(this.addressDetail)
        })
      } else {
        this.login()
      }
    },
    // 获取购物车数量
    getCartNum () {
      if (!this.isLogin) return
      http
        .post(CloudShopGoods.getCartNumByUser)
        .then((res) => {
          if (res.data.success) {
            this.cartProductNum = res.data.data
          }
        })
    },
    // 获取商品详情界面数据
    getDetail (id) {
      // 增加判断是否已经请求过，如已经请求过，itemName存在，说明页面是跳转回来的
      const hasRequest = !!this.detailData.itemName
      console.log(hasRequest)
      const params = { id: id }
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      http.get(CloudShopGoods.getGoodsMallById, params).then((res) => {
        if (res.data.success) {
          this.detailData = res.data.data
          console.log('this.detailData.videoList', this.detailData.videoList)
          this.browseReportConfig.browseWithName = this.detailData.itemName
          this.shareConfig.title = this.detailData.itemName
          this.shareConfig.report.shareWithName = this.detailData.itemName
          // 从组件或者页面返回不需要获取默认地址, 避免覆盖重新定位或重新选择的地址
          if (!hasRequest) this.getDefaultAddress()
        }
        uni.hideLoading()
      })
      // 获取购物车数量
      this.getCartNum()
    },
    // 加入购物车逻辑
    addToCart () {
      //  以下是以调通逻辑
      if (this.isLogin) {
        const params = {
          itemIdList: [this.detailId]
        }
        http.post(CloudShopGoods.addItemToCart, params).then((res) => {
          if (res.data.success) {
            uni.showToast({
              title: '加入购物车成功',
              icon: 'none'
            })
            buriedPointReport({ pageName: '商品详情-加入购物车', buttonName: this.detailData.itemName })
            // 更新购物车数量
            this.getCartNum()
          }
        })
      } else {
        this.immediatelyLogin = true
      }
    },
    // 生成送至逻辑
    initShipTo () {
      // 无地址带入时
      if (!this.accessAddressFourLevel) {
        // 当前账号有默认收货地址时展示默认收货地址
        if (this.defaultAddressFourLevel) {
          this.shipToAddress = this.addressDetail.default
          this.initShipPromise()
        } else if (!this.defaultAddressFourLevel || !this.isLogin) {
          this.shipToAddress.address.fullAddress = '请选择地址'
          this.isInStock = false
        }
        // 精确定位逻辑先保留
        //  uni.getSetting({
        //   success: (res) => {
        // res.authSetting['scope.userLocation'] === undefined  表示 初始化进入，从未授权
        // res.authSetting['scope.userLocation'] === true       表示 已授权
        // res.authSetting['scope.userLocation'] === false      表示 授权拒绝
        // if (res.authSetting["scope.userLocation"]) {
        //   this.shipToAddress = this.addressDetail.access
        //   this.isInStock = false
        //   this.initShipPromise()
        // SdkApi.authorize({
        //   scope: 'scope.userLocation'
        // }).then((res) => {
        //   console.log(res)
        //   if (res.errMsg === 'authorize:ok') {
        //     SdkApi.getLocation({
        //       type: 'gcj02',
        //       geocode: true, // 设置该参数为true可直接获取经纬度及城市信息
        //       isHighAccuracy: true
        //     }).then((res) => {
        //       this.shipToAddress = res
        //       this.getList(true)
        //     })
        //   }
        // })
        // } else {
        //   this.shipToAddress.address.fullAddress = '请选择地址'
        //   this.isInStock = false
        // }
        // })
      } else {
        this.shipToAddress = this.addressDetail.access
        this.initShipPromise()
      }
    },
    // 生成送装承诺 ，调用两个接口
    initShipPromise () {
      // 获取统仓货物状态
      this.getStockByProductAndCountry()
      // 获取统仓货物送达时间
      this.getDeliveryTime()
    },
    // 送达时间
    getDeliveryTime () {
      const params = { countryCode: this.shipToAddress.address.countyCode }
      http
        .get(CloudShopStock.getExpectedDateByCountrycodeCasarte, params)
        .then((res) => {
          if (res.statusCode === 200) {
            if (!res.data.data) return
            const { expectDate, expectEndDate } = res.data.data
            this.shipToPromiseMsg = `预计送达时间${expectDate}，最晚送达时间${expectEndDate}`
          }
        })
    },
    // 查询库存地址状态
    getStockByProductAndCountry () {
      const params = {
        countryCode: this.shipToAddress.address.countyCode,
        productCodeList: [this.detailData.productCode]
      }
      http
        .post(CloudShopStock.getStockByProductAndCountry, params)
        .then((res) => {
          if (res.data.success) {
            this.isInStock = res.data.data[0].qty > 0
          }
        })
    },
    // 立即购买触发
    toSettlement () {
      buriedPointReport({ pageName: '商品详情-立即购买', buttonName: this.detailData.itemName })
      if (this.isLogin) {
        const addMallOrderInfo = {
          addressId: this.addressId,
          itemList: [
            {
              itemId: this.detailId,
              invoicePrice: this.detailData.retailPrice,
              salePrice: this.detailData.retailPrice,
              itemQty: 1
            }
          ]
        }
        setStorage('addMallOrderInfo', addMallOrderInfo)

        if (this.shipToAddress.address.fullAddress === '请选择地址') {
          this.isShipToShow = true
        } else if (
          !this.shipToAddress.address.isDefault
        ) {
          // 跳转至新增
          const orderToAddAddress = {
            address: {
              ...this.shipToAddress.address,
              latitude: this.shipToAddress.latitude,
              longitude: this.shipToAddress.longitude,
              districtCode: this.shipToAddress.address.countyCode,
              districtName: this.shipToAddress.address.countyName,
              streetCode: this.shipToAddress.address.townCode,
              streetName: this.shipToAddress.address.townName
            }
          }
          setStorage('orderToAddAddress', orderToAddAddress)
          uRouter.push('/subpacks/mall/pages/shipping-address/shipping-address-add/shipping-address-add', { type: 'add', pageSource: 'product-detail', isDefaultFlag: this.harvestList.length })
          // 带入“送至”的定位信息，保存后跳转订单确认页
        } else if (
          this.shipToAddress.address.isDefault
        ) {
          // 已登录 && 送至 即收货地址，跳转订单确认页；
          uRouter.push('/subpacks/mall/pages/order/add-order/add-order')
        } else {
          const str = JSON.stringify(this.shipToAddress)
          uni.showToast({
            title: str,
            icon: 'none'
          })
        }
      } else {
        this.login()
      }
    },
    // 登录
    login () {
      uRouter.push('/pages/login/login')
    },
    openShipTo () {
      buriedPointReport({ pageName: '商城详情-送至', buttonName: this.detailData.itemName })
      if (this.isLogin) {
        this.isShipToShow = true
      } else {
        this.login()
      }
    },
    // 点击收藏触发 需要请求接口
    collect (isCollect) {
      const params = {
        idList: [this.detailId],
        type: 1
      }
      if (!this.isLogin) {
        this.login()
        return
      }
      if (isCollect) {
        http.post(CloudShopGoods.saveStar, params).then((res) => {
          if (res.data.success) {
            this.detailData.starStatus = isCollect
            uni.showToast({
              title: '收藏成功',
              icon: 'none'
            })
            buriedPointReport({ pageName: '商城详情-收藏', buttonName: this.detailData.itemName })
          }
        })
      } else {
        http.post(CloudShopGoods.cancelStarForDetail, params).then((res) => {
          if (res.data.success) {
            this.detailData.starStatus = isCollect
            uni.showToast({
              title: '取消收藏',
              icon: 'none'
            })
          }
        })
      }
    },
    // 图片预览
    previewBanner (list) {
      const images = list.map((item) => item.pictureUrl)
      uni.previewImage({
        urls: images,
        current: 0,
        success: function (res) {
          console.log('预览成功', res)
        },
        fail: function (err) {
          console.log('预览失败', err)
        }
      })
    },
    // 返回按钮触发
    goBack () {
      uRouter.back()
    }
  }
}
