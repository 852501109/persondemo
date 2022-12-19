<template>
  <configProvider>
    <!-- 商品列表头部 -->
    <product-head
      v-if="!isShowfilterPopup"
      :item-name="params.itemName"
      :source="source"
    />
    <!-- 抽屉筛选头部 -->
    <filter-head
      v-if="isShowfilterPopup"
      @filterGoBack="filterGoBack"
      @filterSure="filterSure"
    />
    <!-- tab筛选栏 -->
    <filter-tab
      @changeType="changeType"
      :status="status"
      :sort="params.sort"
      :current-type="currentType"
    />
    <!-- 列表 -->
    <view class="list">
      <product-list
        :is-empty="isEmpty"
        :list="list"
        :status="status"
        :is-loading="isLoading"
        :total="total"
        :address-detail="addressDetail"
        @getList="getList"
      />
    </view>
    <!-- 筛选抽屉 -->
    <filterSlider
      :show="isShowfilterPopup"
      :address-detail="addressDetail"
      @filterSure="filterSure"
      @filterGoBack="filterGoBack"
      :default-param="params"
      @accessChange="accessChange"
    />
  </configProvider>
</template>
<script src="./product-list-index"></script>
<style scoped lang="scss">
@import "../../../static/utils.scss";
.list {
  background: var(--background-color);
}

.commodity {
  margin-top: 120rpx;
  background: var(--background-color);
}
// 去除1px间距
::v-deep .u-navbar__content {
  margin-top: -1px;
}
</style>
