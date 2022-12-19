import { bemMixin } from '../../../../mixins'
import { uRouter } from '../../../../router'
import { selectLocation } from '../../../../utils/location.js'
export default {
  props: {
    // 送至当前地址
    shipToAddress: {
      type: Object,
      default: () => {}
    },
    // 已有地址列表
    harvestList: {
      type: Array,
      default: () => []
    }
  },
  mixins: [bemMixin('ship-to')],
  data () {
    return {
      // 加载状态
      isLoading: false
    }
  },
  filters: {
    filterElipse (str) {
      let newStr = ''
      if (str.length > 6) { // 如果字符长度超过10，后面的字符就变成...可自行调整长度和代替字符
        newStr = str.substr(0, 6) + '...' // 截取从第一个字符开始，往后取6个字符，剩余的用...代替
      } else {
        newStr = str
      }
      return newStr
    }
  },
  computed: {
    // 送至地址回显
    shipToAddressFourLevel () {
      const address = this.shipToAddress.address
      console.log(address)
      return `${address.provinceName || ''}${address.cityName || ''}${address.countyName || ''}${address.townName || ''}${address.fullAddress || ''}`
    }
  },
  methods: {
    // 微信插标
    getLocation () {
      const _this = this
      selectLocation().then(res => {
        _this.$emit('chooseAddress', res)
      }).catch(() => {
        uni.showToast({
          title: '请授权地址信息后，重新定位',
          icon: 'none'
        })
      })
    },
    // 删除收货地址
    deleteAddress (item) {
      uni.showModal({
        content: '确认删除吗?',
        success: (res) => {
          if (res.confirm) {
            this.$emit('delHarvest', item)
          }
        }
      })
    },
    // 跳转至编辑地址
    toEditAddress (address, index) {
      const owner = this
      owner.$nextTick(() => {
        uRouter.push('/subpacks/mall/pages/shipping-address/shipping-address-add/shipping-address-add', { type: 'edit' }, {
          success: res => {
            res.eventChannel.emit('toEditAddress', { address })
          }
        })
      })
    },
    // 跳转至新增地址
    toAddAddress () {
      this.$nextTick(() => {
        uRouter.push('/subpacks/mall/pages/shipping-address/shipping-address-add/shipping-address-add', {
          type: 'add',
          pageSource: 'shipTo',
          isDefaultFlag: this.harvestList.length
        })
      })
    },
    close () {
      this.$emit('close')
    },
    // 选择地址事件
    chooseDefault (item) {
      console.log(item)
      const currentAddress = {
        address: {
          provinceCode: item.provinceCode,
          provinceName: item.provinceName,
          cityCode: item.cityCode,
          cityName: item.cityName,
          countyCode: item.districtCode,
          countyName: item.districtName,
          townCode: item.streetCode,
          townName: item.streetName,
          fullAddress: item.fullAddress,
          isDefault: true
        },
        latitude: item.latitude,
        longitude: item.longitude
      }
      this.$emit('chooseAddress', currentAddress, { id: item.id })
    },
    // 返回
    goBack () {
      uRouter.back()
    }
  }
}
