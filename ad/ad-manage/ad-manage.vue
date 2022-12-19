<template>
  <div class="ad">
    <!-- 标题 -->
    <ad-header title="广告管理"></ad-header>
    <!-- 搜索 -->
    <div class="search mt-10">
      <el-form ref="form" :inline="true" size="mini">
        <el-form-item>
          <el-input
            v-model="queryParam.adTitle"
            style="width: 200px"
            maxlength="30"
            clearable
            placeholder="请输入广告标题"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-right:10px;">
          <el-date-picker
            v-model="queryParam.validityStartTime"
            type="datetime"
            style="width: 180px"
            placeholder="请选择广告开始日期"
            @change="changeDate('start')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-right:10px;">
          <div>-</div>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryParam.validityEndTime"
            type="datetime"
            style="width: 180px"
            placeholder="请选择广告结束日期"
            @change="changeDate('end')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryParam.isStop"
            clearable
            style="width: 200px"
            placeholder="广告状态"
          >
            <el-option label="启用" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            native-type="submiy"
            icon="el-icon-search"
            :loading="searchLoading"
            @click="handleSearch"
          />
        </el-form-item>
      </el-form>

      <div></div>
    </div>
    <!-- 导入 -->
    <div class="add mt-20">
      <el-button type="primary" @click="toAdd">
        新增广告
      </el-button>
    </div>
    <!-- 列表 -->
    <ad-table
      ref="tableList"
      :table-list="tableList"
      :page="page"
      :loading="loading"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDetail="handleDetail"
      @handleDelete="handleDelete"
      @handleStop="handleStop"
      @handleStart="handleStart"
    ></ad-table>
    <!-- 详情 -->
    <ad-detail
      ref="adDetail"
      :show-detail="showDetail"
      @close="handleCloseDetail"
    ></ad-detail>
  </div>
</template>
<script src="./ad-manage.js"></script>
<style lang="scss" scoped>

.search {
  > div {
    margin-right: 20px;
  }
}
.ad {
  width: 100%;
  padding: 20px 16px;
}
::v-deep .el-form--inline {
  display: flex!important;
}
</style>
