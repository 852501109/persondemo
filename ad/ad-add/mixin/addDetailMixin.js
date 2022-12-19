export default {
  data() {
    return {
      page: {
        total: 0,
        limit: 50,
        page: 1
      },
      productGroup: [],
      // 搜索参数
      queryParam: {
        goodsKey: ''
      },
      searchLoading: false,
      // 显示详情标识
      importShow: false,
      // 表格加载中状态
      loading: false,
      // 表格数据
      tableList: []
    }
  },
  created() {},
  methods: {
    handleSearch() {
      if (this.searchLoading) return
      this.searchLoading = true
      this.page.page = 1
      this.getList()
    },
    // 搜索事件
    getList() {
      if (this.loading) return
      this.loading = true
      // 产品组和品牌没有选中则传全部
      const params = {
        ...this.queryParam,
        page: this.page.page,
        rows: this.page.limit,
        mallTypeCode: 'CASARTE_MALL',
        shelvesStatusList: ['1'],
        productGroupCodes:
          this.productGroup && this.productGroup.length > 0
            ? this.productGroup
            : this.initProductGroup
      }
      this.$http
        .post(this.indexPath, params)
        .then(res => {
          if (res.data.success) {
            this.tableList = res.data.data.list || []
            this.page.total = res.data.data.total
            if (this.selectList) {
              this.tableList.forEach((e, index) => {
                this.tableList[index].isSel = this.selectList.includes(
                  e.itemId
                )
              })
            }
          } else {
            this.$message.warning(res.data.errorMsg || '服务异常')
          }
        })
        .catch(err => {
          console.error(err)
          this.$message.error('服务异常')
        })
        .finally(() => {
          this.loading = false
          this.searchLoading = false
        })
    },
    // 页码改变事件
    handleSizeChange(val) {
      this.page.page = 1
      this.page.limit = val
      this.getList()
    },
    // 点击分页事件
    handleCurrentChange(val) {
      this.page.page = val
      this.getList()
    },
    // 关闭详情事件
    handleCloseDetail() {
      this.$emit('close')
    }
  }
}
