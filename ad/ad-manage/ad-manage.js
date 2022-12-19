import adHeader from './components/ad-head.vue'
import adTable from './components/ad-list.vue'
import adDetail from './components/ad-detail.vue'
import SelectDateRange from '@/components/SelectDateRange'
import { CloudBrandMall } from '@/api'
export default {
  components: {
    adHeader,
    adTable,
    adDetail,
    SelectDateRange
  },
  data() {
    return {
      indexPath: CloudBrandMall.Base.searchAdListByConditions, // 列表路径
      delPath: CloudBrandMall.Base.deleteAdById, // 删除广告
      updatePath: CloudBrandMall.Base.updateAdStatusById, // 停用启用路径
      typePath: CloudBrandMall.Base.listAdType, // 获取广告类型基础数据路径
      titleOptions: [],
      isLoading: [],
      page: {
        total: 0,
        limit: 10,
        page: 1
      },
      // 搜索参数
      queryParam: {
        adTitle: '',
        isStop: '',
        validityStartTime: '',
        validityEndTime: ''
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
      handleLoading: false
    }
  },
  created() {
    this.getAdList()
  },
  methods: {
    // 日期改变事件
    changeDate(type) {
      const params = this.queryParam
      if (type === 'start') {
        if (
          params.validityEndTime &&
          params.validityStartTime > params.validityEndTime
        ) {
          params.validityStartTime = ''
          this.$message.warning('开始时间不得晚于结束时间')
        }
      }
      if (type === 'end') {
        if (
          params.validityStartTime &&
          params.validityStartTime > params.validityEndTime
        ) {
          params.validityEndTime = ''
          this.$message.warning('结束时间不得早于开始时间')
        }
      }
    },
    // 获取列表
    getAdList() {
      this.loading = true
      const params = {
        mallTypeCode: 'CASARTE_MALL',
        adTitle: this.queryParam.adTitle,
        isStop: this.queryParam.isStop,
        validityStartTime: this.queryParam.validityStartTime,
        validityEndTime: this.queryParam.validityEndTime,
        pageNum: this.page.page,
        pageSize: this.page.limit
      }
      this.$http.post(this.indexPath, params).then(res => {
        if (res.data.success) {
          this.tableList = res.data.data.list
          this.page.total = res.data.data.total
          this.$refs['tableList'].dayLayout()
        } else {
          this.$message.error(res.msg)
        }
        this.searchLoading = false
        this.loading = false
      })
    },
    // 搜索事件
    handleSearch() {
      if (this.searchLoading) return
      this.searchLoading = true
      this.getAdList()
    },
    // 跳转至新增
    toAdd() {
      this.$router.push({ path: '/ylh/brand-mall/ad/ad-add' })
    },
    // 页码改变事件
    handleSizeChange(val) {
      this.page.limit = val
      this.page.page = 1
      this.getAdList()
    },
    // 点击分页事件
    handleCurrentChange(val) {
      this.page.page = val
      this.getAdList()
    },
    // 查看详情事件
    handleDetail(row) {
      this.$refs.adDetail.getDetail(row.id).then(res => {
        this.showDetail = true
      })
    },
    // 关闭详情事件
    handleCloseDetail() {
      this.showDetail = false
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
            userNo: owner.$store.state.n_user.id,
            userName: owner.$store.state.n_user.name,
            id: row.id
          }
          owner.$http.post(this.delPath, params).then(res => {
            if (res.data.success) {
              owner.$message.success('删除成功！')
              owner.getAdList()
            }
          }).catch(() => {
            owner.$message.error('服务器错误')
          })
            .finally(() => {
              owner.handleLoading = false
            })
        })
        .catch(() => {})
    },
    // 单条停用事件
    handleStop(row) {
      const params = {
        userNo: this.$store.state.n_user.id,
        userName: this.$store.state.n_user.name,
        id: row.id,
        isStop: 1
      }
      this.$confirm('确认停用?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post(this.updatePath, params).then(res => {
            if (res.data.success) {
              this.$message.success('停用成功')
              this.getAdList()
            }
          })
        })
        .catch(() => {})
    },
    // 单条启用事件
    handleStart(row) {
      const params = {
        userNo: this.$store.state.n_user.id,
        userName: this.$store.state.n_user.name,
        id: row.id,
        isStop: 0
      }
      this.$confirm('确认启用?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post(this.updatePath, params).then(res => {
            if (res.data.success) {
              this.$message.success('启用成功')
              this.getAdList()
            }
          })
        })
        .catch(() => {})
    }
  }
}
