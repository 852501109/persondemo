import singleList from './single.vue'
import waterfall from './waterfall.vue'
import { uRouter } from '../../../../../router' // 具体路径以实际为准

export default {
  props: {
    // 列表数据
    list: {
      type: Array,
      default: () => []
    },
    // 是否加载中
    isLoading: {
      type: Boolean,
      default: false
    },
    // 状态 1 单列 2 瀑布流
    status: {
      type: Number,
      default: 1
    },
    // 列表数据总条数
    total: {
      type: Number,
      default: 0
    },
    // 缺项判断
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  components: {
    singleList, // 单列列表
    waterfall  // 瀑布流
  },
  methods: {
    toDetail (item) {
      uRouter.push(
        '/subpacks/mall/pages/product-list/product-detail/product-detail',
        { id: item.id }
      )
    },
    // 滚动触发
    scrolltolower () {
      this.$emit('getList')
    }
  }
}
