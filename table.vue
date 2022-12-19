<template>
    <div class="table">
        <el-table
            ref="table"
            v-loading="loading"
            border
            style="width: 100%"
            empty-text="暂无数据"
            :data="tableList"
            @click="handleClick"
            @sort-change="sortChange"
        >
              <el-table-column
                  v-for="(i, n) in columns"
                  :prop="i.prop"
                  :label="i.label"
                  :width="i.width"
                  :align="i.align || 'left'"
                  :fixed="i.fixed || false"
                  :sortable="i.sortable || false"
                  :show-overflow-tooltip="i.tips"
                  :key="n"
              >
                  <template slot-scope="scope">
                      <span>{{ scope.row[i.prop] }}</span>
                  </template>
              </el-table-column>
        </el-table>
        <el-pagination
            class="table-pagination"
            :current-page.sync="page.page"
            :page-sizes="[20, 50, 100]"
            :page-size="page.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.totalCount"
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
            default: false,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        tableList: {
            type: Array,
            default: () => [],
        },
        page: {
            type: Object,
            default: () => {},
        },
    },
    data() {},
    methods: {
        handleSizeChange(value) {
            this.page.limit = value;
            this.$emit('handleSizeChange');
        },
        handleCurrentChange(value) {
            this.kyPathPage.page = value;
            this.$emit('handleCurrentChange');
        }
    },
};
</script>

<style scoped lang="scss"></style>
