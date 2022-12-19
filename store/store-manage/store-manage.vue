<template>
  <div class="store">
    <!-- 标题 -->
    <store-header title="门店管理"></store-header>
    <!-- 搜索 -->
    <div class="mt-10">
      <el-form ref="form" :inline="true" size="mini">
        <el-form-item>
          <el-input
            v-model="queryParam.siteCodeOrName"
            style="width: 200px"
            clearable
            placeholder="门店名称或8码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryParam.gmCodeList"
            clearable
            style="width: 200px"
            placeholder="请选择小微"
          >
            <el-option
              v-for="(item, index) in allGmCodeList"
              :key="index"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submiy"
            size="mini"
            icon="el-icon-search"
            :loading="searchLoading"
            @click.prevent="handleSearch"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 导入 -->
    <div class="import mt-20">
      <el-button type="primary" @click="handleImport">
        导入
      </el-button>
    </div>
    <!-- 导入弹框 -->
    <storeImport
      v-if="importShow"
      :import-show="importShow"
      @close="handleCloseImport"
    ></storeImport>
    <!-- 列表 -->
    <store-table
      :table-list="tableList"
      :page="page"
      :loading="loading"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDetail="handleDetail"
      @handleDelete="handleDelete"
    ></store-table>
    <!-- 详情 -->
    <store-detail
      ref="storeDetail"
      :show-detail="showDetail"
      @close="handleCloseDetail"
    ></store-detail>
  </div>
</template>

<script src="./store-manage.js"></script>

<style lang="scss" scoped>
.search {
  > div {
    margin-right: 20px;
  }
}
.store {
  width: 100%;
  padding: 20px 16px;
}
</style>
