<template>
  <el-drawer
    :visible.sync="showDetail"
    :show-close="true"
    :size="760"
    :with-header="false"
    @close="handleCloseDetail"
  >
    <div class="pt-20 pl-15 pr-20">
      <!-- 标题 -->
      <div class="fs-18 fw-400 d-flex justify-content-between mt-10">
        <div>添加商品</div>
        <i
          class="el-icon-close cursor-pointer"
          @click="handleCloseDedtail"
        ></i>
      </div>
      <!-- 搜索 -->
      <div class="d-flex mt-10">
        <el-input
          v-model="queryParam.goodsKey"
          clearable
          style="width: 200px"
          class="mr-20"
          placeholder="商品名称/型号/编码"
        ></el-input>
        <div>
          <el-cascader
            v-model="productGroup"
            popper-class="income-cascader-popper"
            :options="productGroupList"
            :props="{ multiple: true, emitPath: false }"
            style="width:220px"
            placeholder="请选择产品组"
            collapse-tags
            clearable
          ></el-cascader>
        </div>
        <el-button
          type="primary"
          native-type="submiy"
          icon="el-icon-search"
          :loading="searchLoading"
          @click="handleSearch"
        />
      </div>
      <!-- 列表 -->
      <add-table
        :table-list="tableList"
        :page="page"
        :loading="loading"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        v-on="$listeners"
      ></add-table>
    </div>
  </el-drawer>
</template>

<script>
import addTable from './add-detai-list.vue'
// 列表增删改查逻辑
import addDetailMixin from '../mixin/addDetailMixin.js'
import { CloudUser, CloudBase, CloudBrandMall, CloudGoods } from '@/api'
export default {
  name: 'List',
  components: {
    addTable
  },
  mixins: [addDetailMixin],
  props: {
    showDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      indexPath: CloudBrandMall.Goods.searchGoods, // 列表路径
      pickerStartOptions: {
        disabledDate: time => {
          const date = new Date(this.queryParam.endDate)
          return time.getTime() > new Date(date)
        }
      },
      titleOptions: [],
      productGroupList: [],
      initProductGroup: [],
      isLoading: []
    }
  },
  created() {
    this.getProductGroupList()
  },
  methods: {
    changeDate(type) {
      if (this.queryParam.startDate > this.queryParam.endDate) {
        this.queryParam.startDate = ''
      }
    },
    /**
     * 获取产品组
     */
    getProductGroupList() {
      return new Promise((resolve, reject) => {
        this.$http.get(CloudBase.getProductGroup, { mallTypeCode: 'CASARTE_MALL', userid: this.$store.getters.id }).then(res => {
          if (res.data.success) {
            this.productGroupList = []
            const list = res.data.data && res.data.data.industryList[0] && res.data.data.industryList[0].industryProList || []
            if (list.length > 0) {
              let listSon = []
              list.forEach(e => {
                e.proGoupList.forEach(ee => {
                  const item = {
                    industryCode: e.industryCode,
                    productGroupCode: ee.proGroup
                  }
                  listSon.push(item)
                })
              })
              if (listSon.some(e => e.industryCode === '*')) {
                listSon = []
              }
              console.log(listSon)
              this.$http.post(CloudGoods.searchProductGroupByGroupCode, { detailDtoList: listSon }).then(resp => {
                if (resp.data.success) {
                  // 组装数据,根据产业industryCode，进行分组
                  if (resp.data.data && resp.data.data.length > 0) {
                    const obj = {}
                    this.productGroupList = resp.data.data.reduce((cur, next) => {
                      obj[next.industryCode]
                        ? cur[ cur.findIndex(e => e.value === next.industryCode)].children.push({
                          value: next.productGroupCode,
                          label: next.productGroupName
                        }) : obj[next.industryCode] = true && cur.push({
                          value: next.industryCode,
                          label: next.industryName,
                          children: [{
                            value: next.productGroupCode,
                            label: next.productGroupName
                          }]
                        })
                      return cur
                    }, [])
                    // 获取所有产品组code
                    this.initProductGroup = []
                    if (this.productGroupList.length > 0) {
                      this.productGroupList.forEach(e => {
                        if (e.children && e.children.length > 0) {
                          e.children.forEach(ee => {
                            this.initProductGroup.push(ee.value)
                          })
                        }
                      })
                    }
                  }
                  this.isProductGroupList = true
                  resolve('')
                }
              }).catch(() => {
                reject('')
              })
            }
          }
        }).catch(() => {
          reject('')
        })
      })
    },
    handleCloseDedtail() {
      this.$emit('close')
    },
    // 获取服务商下拉
    getService(query) {
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
          memberFlagList: ['P'], // S：伞下 P：服务商 O: 其它
          customerInfo: query,
          gmCodeList: centerCodeList
        }
        setTimeout(() => {
          this.$http
            .post(CloudUser.getCustomer, params)
            .then(res => {
              if (res.data.success) {
                owner.titleOptions = res.data.data
              } else {
                owner.$message(res.data.errorMsg)
                owner.titleOptions = []
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
