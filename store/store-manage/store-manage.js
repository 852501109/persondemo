import storeHeader from './components/store-head.vue'
import storeTable from './components/store-list.vue'
import storeDetail from './components/store-detail.vue'
import storeImport from './components/store-import.vue'
import { EMOJI_REG } from '@/utils/regular'
// storeMixin 主列表逻辑
import { CloudBrandMall, CloudBase, CloudUser } from '@/api'
export default {
  components: {
    storeHeader,
    storeTable,
    storeDetail,
    storeImport
  },
  data() {
    return {
      page: {
        total: 0,
        limit: 20,
        page: 1
      },
      // 搜索参数
      queryParam: {
        siteCodeOrName: '',
        siteTypeCode: '',
        gmCodeList: [],
        activityStartTime: '',
        activityEndTime: ''
      },
      searchLoading: false,
      // 显示详情标识
      showDetail: false,
      // 导入弹框标识
      importShow: false,
      // 表格加载中状态
      loading: false,
      // 表格数据
      tableList: [],
      allGmCodeList: [], // 所属小薇
      siteCodeOrNameOptions: [],
      isLoading: false,
      handleLoading: false
    }
  },
  created() {
    this.getSmall()
  },
  methods: {
    // 获取列表
    getStoreList() {
      // 小微下拉无数据不请求
      if (this.allGmCodeList.length === 0) {
        this.searchLoading = false
        this.loading = false
        return
      }
      this.loading = true
      const params = {
        mallTypeCode: 'CASARTE_MALL',
        gmCodeList: this.queryParam?.gmCodeList.length > 0 ? this.queryParam.gmCodeList.split(',') : [],
        siteTypeCode: this.queryParam.siteTypeCode,
        siteCodeOrName: this.queryParam.siteCodeOrName.replace(EMOJI_REG, ''),
        pageNum: this.page.page,
        pageSize: this.page.limit
      }
      this.$http.post(CloudBrandMall.Base.searchSiteBaseListByConditions, params).then(res => {
        if (res.data.success) {
          console.log(res.data)
          this.tableList = res.data.data.list
          this.page.total = res.data.data.total
          this.searchLoading = false
        }
        this.loading = false
      })
    },
    // 查hwork小微
    getSmall() {
      this.$http
        .get(CloudBase.centerList, { userid: this.$store.getters.id })
        .then(res => {
          if (res.data.success) {
            this.allGmCodeList = res.data.data.trades[0].tradeBeans
            this.getStoreList()
          } else {
            this.$message.error(res.data.resultMsg)
          }
        })
        .catch(() => {
          this.$message('网络异常，请稍后在试')
        })
    },
    // 查客户
    getCustomer(query) {
      const owner = this
      const centerCodeList = []
      if (owner.allGmCodeList.length > 0) {
        owner.allGmCodeList.forEach(item => {
          if (item.name !== '总公司') {
            centerCodeList.push(item.code)
          }
        })
      }
      if (query !== '') {
        this.isLoading = true
        const params = {
          customerInfo: query,
          gmCodeList: centerCodeList
        }
        setTimeout(() => {
          this.$http
            .post(CloudUser.getCustomer, params)
            .then(res => {
              if (res.data.success) {
                owner.siteCodeOrNameOptions = res.data.data
              } else {
                owner.$message(res.data.errorMsg)
                owner.siteCodeOrNameOptions = []
              }
              owner.isLoading = false
            })
            .catch(err => {
              owner.$message.error('服务器异常')
              console.error(err)
              owner.isLoading = false
            })
        }, 200)
      }
    },
    // 搜索事件
    handleSearch() {
      this.page.page = 1
      this.searchLoading = true
      this.getStoreList()
    },
    // 导入事件
    handleImport() {
      this.importShow = true
    },
    // 导入关闭事件
    handleCloseImport() {
      this.getStoreList()
      this.importShow = false
    },
    // 页码改变事件
    handleSizeChange(val) {
      this.page.limit = val
      this.page.page = 1
      this.getStoreList()
    },
    // 点击分页事件
    handleCurrentChange(val) {
      this.page.page = val
      this.getStoreList()
    },
    // 查看详情事件
    handleDetail(row) {
      this.$refs.storeDetail.getDetail(row.siteBaseId).then(res => {
        this.showDetail = true
      })
    },
    // 关闭详情事件
    handleCloseDetail() {
      this.showDetail = false
      this.getStoreList()
    },
    // 单条删除事件
    handleDelete(row) {
      const owner = this
      owner.$confirm('是否删除', '', {
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          owner.handleLoading = true
          const params = {
            mallTypeCode: 'CASARTE_MALL',
            siteBaseId: row.siteBaseId
          }
          this.$http.post(CloudBrandMall.Base.delSiteById, params).then(res => {
            if (res.data.success) {
              this.$message.success('删除成功')
              this.page.page = 1
              this.getStoreList()
            }
          }).catch(() => {
            owner.$message.error('服务器错误')
          })
            .finally(() => {
              owner.handleLoading = false
            })
        })
        .catch(() => {})
    }
  }
}
