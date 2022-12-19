import { bemMixin } from '../../mixins'
import configProvider from '../../components/config-provider.vue'
import { uRouter } from '../../router'
import { setStorage } from '../../utils/storage'
import { getThemeConfig } from '../../utils/theme'
import http from '../../http'
import { CloudShopGoods } from '../../apis/cloud-shop-goods'
import recommedWaterfallFlow from '../../components/waterfall-flow/waterfall-flow.vue'
import browseReportMixins from '../../mixins/browse-report-mixins'
import ShopFixedBar from '../../components/fixed-bar/fixed-bar'
import { money } from '../../filters'
import { imageCompressUrl } from '../../utils'
import { buriedPointReport } from '../../utils/report'
export default {
  mixins: [bemMixin('shoping-cart'), browseReportMixins],
  components: {
    configProvider,
    recommedWaterfallFlow,
    ShopFixedBar
  },
  filters: {
    money
  },
  onLoad () {
    this.getRecommend()
  },
  onShow () {
    this.getCartList()
    this.selectAllArr = []
  },
  data () {
    return {
      browseReportConfig: {
        pageType: 14,
        pageName: '购物车',
        browseWithName: '购物车'
      }, // 浏览统计相关信息
      userId: uni.getStorageSync('flow_user_id'),
      brandColor: getThemeConfig().brandColor,
      // 底部数据相关
      footer: {
        isHasFreight: '', // 是否包含运费
        total: '', // 总价格
        isAll: false, // 是否全选
        settlementcartItemQty: 1
      },
      // 分页
      page: {
        page: 1,
        limit: 20
      },
      pageTotal: 0,
      // 清除弹框
      clearShow: false,
      isLoading: false,
      cartIsLoading: true,
      deleteShow: false,
      params: {
        itemName: '',
        sort: 1,
        countryCode: ''
      },
      // 全选全减状态是否激活
      selectAllArr: [],
      // 地址信息维护对象
      addressDetail: {
        // 默认收获地址,接口获取
        defaultAddress: {
          name: '',
          position: []
        },
        // 授权地址
        accessAddress: {
          name: '',
          position: []
        }
      },
      // 初始化显示步进器或`x num`布尔值集合
      numberBoxIndexs: [],
      // 编辑或完成
      status: 1,
      invalidList: [],
      // 有效商品列表
      vaildList: [],
      // 猜你喜欢数据
      list: []
    }
  },
  computed: {
    // 全选激活状态计算
    computeAllClass () {
      return function (i) {
        return i.length > 0 ? 'check-active' : 'check-normal'
      }
    },
    // 激活状态计算
    computeClass () {
      return function (i) {
        return i.checked.length > 0 ? 'check-active' : 'check-normal'
      }
    },
    // 已选中有效商品数量
    allNum () {
      return this.vaildList.filter((item) => item.checked.length > 0).length
    },
    // 已选中全部商品（有效+无效）数量
    allNumWithInvalidList () {
      return [...this.vaildList, ...this.invalidList].filter(
        (item) => item.checked.length > 0
      ).length
    },
    // 金额总数计算
    total () {
      let num = 0
      const checkList = this.vaildList.filter(
        (item) => item.checked.length > 0
      )
      checkList.forEach((item) => {
        if (item.retailPrice) {
          num += Number(item.retailPrice) * Number(item.cartItemQty)
        }
      })
      return num
    },
    // 步进器尺寸
    buttonSize () {
      return this.rpxToPx(56)
    },
    // 步进器文本框尺寸
    inputWidth () {
      return this.rpxToPx(64)
    }
  },
  onPullDownRefresh () {
    this.page.page = 1
    this.status = 1
    this.list = []
    this.invalidList = []
    this.vaildList = []
    this.selectAllArr = []
    this.numberBoxIndexs = []
    this.getCartList(1)
    this.getRecommend(1)
    this.$forceUpdate()
  },
  onReachBottom () {
    this.getRecommend()
  },
  methods: {
    rpxToPx (rpx) {
      const deviceWidth = uni.getSystemInfoSync().windowWidth // 获取设备屏幕宽度
      const px = (deviceWidth / 750) * Number(rpx)
      return Math.floor(px)
    },
    imgUrl (img) {
      return img ? imageCompressUrl(img, '300') : ''
    },
    // 显示步进器
    showNumberBox (n) {
      this.numberBoxIndexs[n] = true
      this.$forceUpdate()
    },
    // 移入收藏夹点击事件
    collect () {
      const itemIdList = [...this.vaildList, ...this.invalidList]
        .filter((item) => item.checked.length > 0)
        .map((item) => item.itemId)
      if (itemIdList.length === 0) {
        uni.showToast({
          title: '您还没有选择商品哦',
          icon: 'none'
        })
        return
      }
      const params = {
        idList: itemIdList,
        type: 1
      }
      http.post(CloudShopGoods.saveStar, params).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: '收藏成功',
            icon: 'none'
          })
          this.handleMinus()
        }
      })
    },
    // 获取猜你喜欢
    getRecommend (type) {
      // 无下一页判断
      if (this.pageTotal && this.list.length >= this.pageTotal) return
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      this.isLoading = true
      const params = {
        page: this.page.page,
        rows: this.page.limit
      }
      http
        .post(CloudShopGoods.listGoodsRecommend, params)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data
            this.list = this.list.concat(data.list)
            this.page.page++
            this.pageTotal = data.total
            this.isLoading = false
            uni.hideLoading()
          }
        })
        .catch((errMsg) => {
          errMsg &&
            uni.showToast({
              title: errMsg.message,
              icon: 'none'
            })
        })
        .finally(() => {
          this.isLoading = false
          if (type === 1) uni.stopPullDownRefresh()
        })
    },
    getCartList (type) {
      this.cartIsLoading = true
      http
        .post(CloudShopGoods.listCartInfoByUser)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data || {}
            const vaildList = data.effectiveList || []
            const invalidList = data.invalidList || []
            vaildList.forEach((item) => {
              item.checked = []
            })
            invalidList.forEach((item) => {
              item.checked = []
            })
            this.vaildList = vaildList
            this.invalidList = invalidList
          }
          this.cartIsLoading = false
        })
        .catch((errMsg) => {
          errMsg &&
            uni.showToast({
              title: errMsg.message,
              icon: 'none'
            })
        })
        .finally(() => {
          this.cartIsLoading = false
          if (type === 1) uni.stopPullDownRefresh()
        })
    },
    // 购物车数量发生变化
    changeNum (cur, item) {
      this.$nextTick(() => {
        const params = {
          id: item.id,
          itemQty: cur.value
        }
        http.post(CloudShopGoods.updateCartItemQty, params).then((res) => {
          console.log(item, res)
        })
      })
    },
    // 编辑
    handleEdit () {
      this.status = 2
    },
    // 完成
    handleSave () {
      this.status = 1
      this.handleMinus()
    },
    // 找相似
    findSame (item) {
      uRouter.push(
        '/subpacks/mall/pages/product-list/product-list-index/product-list-index',
        { type: 'findSame', item: JSON.stringify(item) }
      )
    },
    clearHisSure () {
      const params = {
        idList: this.invalidList.map((item) => item.id)
      }
      http.post(CloudShopGoods.deleteCatrItemBatch, params).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: '清除成功',
            icon: 'none'
          })
          this.clearShow = false
          this.invalidList = []
        }
      })
    },
    // 清空失效商品操作
    clearInvalid () {
      this.clearShow = true
    },
    closeModal () {
      this.clearShow = false
    },
    // 类似复选框事件委托
    hotTap (item) {
      console.log(item)
      item.checked = item.checked.length > 0 ? [] : [item.id]
      this.$forceUpdate()
    },
    // 监听页面选择事件，判断全选选中或者取消
    watchSelect () {
      // 当前页面可操作元素选中数量
      this.$nextTick(() => {
        let selectNum = 0
        const inVildSelectNum = this.invalidList.filter(
          (item) => item.checked.length > 0
        )
        const vildSelectNum = this.vaildList.filter(
          (item) => item.checked.length > 0
        )
        // 根据状态判断
        // 1 编辑状态 status = 2 全选数量包含有效和无效两种商品
        // 2 非编辑状态，status = 1 全选数量只包含有效一种
        selectNum =
          this.status === 1
            ? vildSelectNum.length
            : vildSelectNum.length + inVildSelectNum.length
        // 根据以上条件判断全选状态
        if (this.status === 1) {
          this.selectAllArr = selectNum === this.vaildList.length ? [1] : []
        }
        if (this.status === 2) {
          this.selectAllArr =
            selectNum === this.invalidList.length + this.vaildList.length
              ? [1]
              : []
        }
      })
    },
    //删除二次确认弹框（UI需求，所以替换掉了uni.modal）
    deleteModal () {
      this.deleteShow = false
    },
    deleteHisSure () {
      const params = {
        idList: [...this.vaildList, ...this.invalidList]
          .filter((item) => item.checked.length > 0)
          .map((item) => item.id)
      }
      http.post(CloudShopGoods.deleteCatrItemBatch, params).then((resTwo) => {
        if (resTwo.data.success) {
          uni.showToast({
            title: '删除成功',
            icon: 'none'
          })
          this.deleteShow = false
          this.getCartList()
        }
      })
    },
    //删除二次确认弹框（UI需求，所以替换掉了uni.modal）
    delProduct () {
      if (this.allNumWithInvalidList === 0) {
        uni.showToast({
          title: '请选择需要删除的商品',
          icon: 'none'
        })
        return
      }
      this.deleteShow = true
    },
    handleMinus () {
      this.vaildList.forEach((item) => {
        item.checked = []
      })
      this.invalidList.forEach((item) => {
        item.checked = []
      })
      this.selectAllArr = []
    },
    // 全选
    selectAll (isSelect) {
      // 已选商品
      if (isSelect) {
        this.vaildList.forEach((item) => {
          item.checked = [item.id]
        })
        this.invalidList.forEach((item) => {
          item.checked = [item.id]
        })
        // 取消全选全部取消
      } else {
        this.vaildList.forEach((item) => {
          item.checked = []
        })
        this.invalidList.forEach((item) => {
          item.checked = []
        })
      }
    },
    settlement () {
      buriedPointReport({ pageName: '购物车-结算', buttonName: '' })
      if (this.allNum === 0) {
        uni.showToast({
          title: '请选择需要结算的商品',
          icon: 'none'
        })
        return
      }
      const itemIds = this.vaildList.map((item) => item.itemId)
      const params = { itemIdList: itemIds }
      http
        .post(CloudShopGoods.productCheckGoodsShelvesStatus, params)
        .then((res) => {
          // 所有失效商品
          const allSubmitGoods = res.data.data || []
          // 接口成功并且当前选中不存在无效商品
          if (
            res.data.success &&
            !allSubmitGoods.find((item) => item.shelvesStatus !== 1)
          ) {
            const itemList = []
            this.vaildList
              .filter((item) => item.checked.length > 0)
              .forEach((item) => {
                itemList.push({
                  itemId: item.itemId,
                  invoicePrice: item.retailPrice,
                  salePrice: item.retailPrice,
                  itemQty: item.cartItemQty,
                  cartId: item.id
                })
              })
            console.log(itemList)
            const addMallOrderInfo = {
              addressId: '',
              itemList: itemList
            }
            setStorage('addMallOrderInfo', addMallOrderInfo)
            uRouter.push('/subpacks/mall/pages/order/add-order/add-order', {})
          } else {
            // 失效商品的itemId
            const invalidGoodsItemIds = allSubmitGoods
              .filter((item) => item.shelvesStatus !== 1)
              .map((item) => item.itemId)
            // 失效商品名字
            const invalidGoodsItemName = this.vaildList
              .filter((item) => invalidGoodsItemIds.includes(item.itemId))
              .map((item) => item.itemName)
            uni.showToast({
              title: `${invalidGoodsItemName.join('商品,  ')}已下架,请重新选择`,
              icon: 'none'
            })
          }
        })
    },
    cartToDetail (item) {
      buriedPointReport({
        pageName: '购物车-商品详情',
        buttonName: item.itemName
      })
      uRouter.push(
        '/subpacks/mall/pages/product-list/product-detail/product-detail',
        { id: item.itemId })
    },
    toDetail (item) {
      buriedPointReport({
        pageName: '购物车-猜你喜欢-商品',
        buttonName: item.itemName
      })
      uRouter.push(
        '/subpacks/mall/pages/product-list/product-detail/product-detail',
        { id: item.id }
      )
    }
  }
}
