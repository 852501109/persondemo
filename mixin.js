import $request from '@/utils/request'
export default {
  data() {
    return {
      path: '', // 请求路径
      page: {
        total: 0,
        limit: 20,
        page: 1
      },
      indexPath: '', // 查
      formData: {}, // 表单数据
      kyGlobal: {}, // 全局配置
      // modal相关数据
      vsible: false,
      // 搜索参数
      queryParam: {},
      // 页面筛选条件
      listSearch: [],
      rowSelectData: '',
      // 表格加载中状态
      loading: true,
      // 表格数据
      tableList: [],
    }
  },
  created() {
   
  },
  methods: {
   
  }
}