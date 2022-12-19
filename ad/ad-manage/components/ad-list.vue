<template>
  <div class="table">
    <el-table
      ref="table"
      v-loading="loading"
      :height="`calc(90vh - 200px)`"
      border
      style="width: 100%;"
      :empty-text="loading ? '' : '暂无数据'"
      :data="tableList"
    >
      <el-table-column
        type="index"
        fixed
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column label="广告图" prop="slot1">
        <template slot-scope="{ row }">
          <div class="row">
            <img class="ad-image-url" :src="row.adImageUrl" @click="showCurrrentImg(row)">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="广告标题" prop="adTitle" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <div class="adtitle">
            {{ row.adTitle }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="展示顺序" prop="sort"></el-table-column>
      <el-table-column label="创建人" prop="createUserName"></el-table-column>
      <el-table-column label="有效期" prop="validityStatus">
        <template slot-scope="{ row }">
          <div class="valid">
            <div v-if="row.validityStatus === 0">
              {{ row.validityStartTime | date('yyyy-MM-dd hh:mm:ss') }} - {{ row.validityEndTime| date('yyyy-MM-dd hh:mm:ss') }}
              <div class="no-begin">
                未开始
              </div>
            </div>
            <div v-if="row.validityStatus === 1">
              {{ row.validityStartTime | date('yyyy-MM-dd hh:mm:ss') }} - {{ row.validityEndTime| date('yyyy-MM-dd hh:mm:ss') }}
              <div class="being">
                进行中
              </div>
            </div>
            <div v-if="row.validityStatus === 2">
              {{ row.validityStartTime | date('yyyy-MM-dd hh:mm:ss') }} - {{ row.validityEndTime| date('yyyy-MM-dd hh:mm:ss') }}
              <div class="expired">
                已过期
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最新更新时间" prop="updateTime">
        <template slot-scope="{ row }">
          {{ row.updateTime | date('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isStop">
        <template slot-scope="{ row }">
          <span v-if="row.isStop === 0">启用</span>
          <span v-if="row.isStop === 1">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <div class="operation fw-400 d-flex">
            <div class="ad-detail" @click="toDetail(scope.row)">
              详情
            </div>
            <div
              v-if="scope.row.isStop === 0"
              class="stop"
              @click="handleStop(scope.row)"
            >
              停用
            </div>
            <div
              v-if="scope.row.isStop === 1"
              class="start"
              @click="handleStart(scope.row)"
            >
              启用
            </div>

            <div v-show="scope.row.isStop === 1" slot="reference" class="delete" @click="handleDelete(scope.row)">
              删除
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination
        class="table-pagination"
        :current-page.sync="page.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-image-viewer
      v-if="currrentImgVisble"
      :url-list="currrentImgUrlList"
      :on-close="onCurrrentImgClose"
    ></el-image-viewer>
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
  data() {
    return {
      currrentImgVisble: false,
      currrentImgUrlList: []
    }
  },
  methods: {
    // 显示当前图片
    showCurrrentImg(row) {
      this.currrentImgUrlList = [row.adImageUrl]
      this.currrentImgVisble = true
    },
    onCurrrentImgClose() {
      this.currrentImgVisble = false
    },
    dayLayout() {
      this.$refs['table'].doLayout()
    },
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
    },
    handleStop(row) {
      this.$emit('handleStop', row)
    },
    handleStart(row) {
      this.$emit('handleStart', row)
    }
  }
}
</script>

<style scoped lang="scss">
@mixin flex(
  $direction: row,
  $justify-content: flex-start,
  $align-items: flex-start,
  $flex-wrap: nowrap
) {
  box-sizing: border-box;
  display: flex;
  flex-direction: $direction;
  justify-content: $justify-content;
  align-items: $align-items;
  flex-wrap: $flex-wrap;
}
.table {
  margin-top: 10px;
}
.table-pagination {
  float: right;
  margin-top: 10px;
}
.operation {
  font-weight: 400;
  color: #1890ff;
  text-align: left;
  div {
    cursor: pointer;
  }
  >div:not(:nth-child(1)) {
    margin-left: 20px;
  }
}
.image {
  @include flex(row, flex-start, flex-start, wrap);
  img {
    width: 80px;
    height: 80px;
  }
}
.adtitle {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; // 默认不换行；
}
.box {
    width: 44px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    font-weight: 400;
}
.valid {
  .no-begin {
    @extend .box;
    background: #fff;
    border: 1px solid #909399;
    color: #909399;
  }
  .expired {
    @extend .box;
    background: #fff;
    border: 1px solid #F56C6C;
    color: #F56C6C;
  }
  .being {
    @extend .box;
    background: #fff;
    border: 1px solid #409eff;
    color: #409eff;
  }
}
.currrent-img {
  height: 90vh;
  overflow-y: auto;
  text-align: center;
}
.ad-image-url {
  height: 80px!important;
  cursor: pointer;
}

.footer {
  position: fixed;
  bottom: 10px;
  right: 20px;
}
</style>
