<template>
  <div class="mt-10">
    <el-table
      ref="table"
      v-loading="loading"
      :height="`calc(90vh - 200px)`"
      border
      style="width: 100%;"
      :empty-text="loading ? '' : '暂无数据'"
      :data="tableList"
    >
      <el-table-column type="index" fixed label="序号" align="center"></el-table-column>
      <el-table-column label="门店名称" prop="siteName"></el-table-column>
      <el-table-column label="门店8码" prop="siteCode" width="150"></el-table-column>
      <el-table-column label="所属客户" prop="memberName"></el-table-column>
      <el-table-column label="所属小微" prop="gmName" width="150"></el-table-column>
      <el-table-column label="门店状态" prop="siteStatus" width="150">
        <template v-slot="scope">
          <span v-if="scope.row.siteStatus === 0">无效</span>
          <span v-if="scope.row.siteStatus === 1">有效</span>
        </template>
      </el-table-column>
      <el-table-column label="入驻时间" prop="settledTime">
        <template v-slot="scope">
          {{ scope.row.settledTime | date('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="142px">
        <template slot-scope="scope">
          <div class="operation fw-400 d-flex">
            <div class="store-detail" @click="toDetail(scope.row)">
              详情
            </div>
            <div slot="reference" class="delete" @click="handleDelete(scope.row)">
              删除
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination
        class="table-pagination float-right mt-10"
        :current-page.sync="page.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableList: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleSizeChange(value) {
      this.$emit('handleSizeChange', value)
    },
    handleCurrentChange(value) {
      this.$emit('handleCurrentChange', value)
    },
    toDetail(row) {
      this.$emit('handleDetail', row)
    },
    handleDelete(row) {
      this.$emit('handleDelete', row)
    }
  }
}
</script>

<style scoped lang="scss">
    .operation {
        color: #1890FF;
        text-align: left;
        div {
            cursor: pointer;
        }
        .delete {
            margin-left: 20px;
        }
    }
    .footer {
      position: fixed;
      bottom: 10px;
      right: 20px;
    }
</style>
