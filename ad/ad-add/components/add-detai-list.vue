<template>
  <div class="table mt-10">
    <el-table
      ref="table"
      v-loading="loading"
      :height="`calc(90vh - 80px)`"
      style="width: 100%;"
      empty-text="暂无数据"
      :data="tableList"
    >
      <el-table-column type="index" fixed label="序号" align="center"></el-table-column>
      <el-table-column label="商品名称" min-width="120">
        <template v-slot="scope">
          <div v-ellipsis.tooltip="2" style="min-width:100px">
            {{ scope.row.itemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <div class="table-operation fw-400">
            <el-button type="primary" @click="handleSelect(scope.row)">
              选择
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt-10 float-right"
      :current-page.sync="page.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Table',
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
  data() {
    return {

    }
  },
  methods: {
    handleSizeChange(value) {
      this.$emit('handleSizeChange', value)
    },
    handleCurrentChange(value) {
      this.$emit('handleCurrentChange', value)
    },
    handleSelect(value) {
      this.$emit('handleSelect', value)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
