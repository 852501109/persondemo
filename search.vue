<!--
* @description
* @fileName serach.vue
* @author chenwenquan
* @date 2021/11/25 10:00:41
!-->
<template>
    <div class="container">
      <div class="search" :class="{searchopen: openStatu === 2 }">
        <el-form ref="form" :model="queryParam" :rules="queryProps" label-width="90px" style="text-align: left;">
          <template v-if="openStatu === 1">
            <el-row v-for="(num, index) in Math.ceil(defaultNum/searchRowNum)" :key="index" :gutter="5">
              <el-col v-for="(i, n) in listSearch.slice(0, defaultNum).slice(index*searchRowNum, (index + 1)*searchRowNum)" :key="n" :span="i.span || 5">
                <el-form-item :label="i.label" :prop="i.key">
                  <component
                    :is="i.components"
                    v-model.trim="queryParam[i.key]"
                    :placeholder="i.placeHodler"
                    :disabled="i.disabled"
                    :options="i.options"
                    :type="i.type"
                    :props="i.props"
                    :show-all-levels="false"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:230px;"
                    @change="val => i.method(queryParam, val)"
                  >
                    <template v-if="i.components === 'el-select'">
                      <el-option v-for="(ii, nn) in i.data" :key="nn" :label="ii.label" :value="ii.value">
                        {{ ii.label }}
                      </el-option>
                    </template>
                    <template v-if="i.components === 'el-checkbox-group'">
                      <el-checkbox v-for="(ii, nn) in i.data" :key="nn" :label="ii.value" :value="ii.value">
                        {{ ii.label }}
                      </el-checkbox>
                    </template>
                  </component>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="openStatu === 2">
            <div class="el-custom-form">
              <el-row v-for="(num, index) in Math.ceil(listSearch.length/searchRowNum)" :key="'info2' + index" :gutter="22">
                <el-col v-for="(i, n) in listSearch.slice(index*searchRowNum, (index + 1)*searchRowNum)" :key="n" :span="i.span || 4">
                  <el-form-item :label="i.label">
                    <component
                      :is="i.components"
                      v-model.trim="queryParam[i.key]"
                      :placeholder="i.placeHodler"
                      :disabled="i.disabled"
                      :options="i.options"
                      :props="i.props"
                      :type="i.type"
                      :show-overflow-tooltip="true"
                      :show-all-levels="false"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      @change="val => i.method(queryParam, val)"
                    >
                      <template v-if="i.components === 'el-select'">
                        <el-option v-for="(ii, nn) in i.data" :key="nn" :label="ii.label" :value="ii.value">
                          {{ ii.label }}
                        </el-option>
                      </template>
                      <template v-if="i.components === 'el-checkbox-group'">
                        <el-checkbox v-for="(ii, nn) in i.data" :key="nn" :label="ii.value || ii.personTypeId" :value="ii.value || ii.personTypeId">
                          {{ ii.label || ii.personTypeName }}
                        </el-checkbox>
                      </template>
                    </component>
                  </el-form-item>
                </el-col>
              </el-row>
            </div></template>
          <div class="btn-group">
            <el-button class="custom-btn" @click="queryEvent()">查询</el-button>
            <el-button type="info" plain style="margin-right: 4px;" @click="resetForm()">重置</el-button>
            <span v-if="defaultNum!=searchRowNum">
              <span v-if="openStatu === 1" style="cursor:pointer;color: #66b1ff;padding: 9px 11px 11px 9px;margin-left :10px" @click="openStatu = 2"><span style="margin-right: 4.3px">展开</span><i class="el-icon-arrow-down" style="margin: 0" /></span>
              <span v-if="openStatu === 2" style="cursor:pointer;color: #66b1ff;padding: 10px" @click="openStatu = 1"><span style="margin-right: 4.3px">收起</span><i class="el-icon-arrow-up" /></span>
            </span>
          </div>
        </el-form>
      </div>
    </div>
  </template>
  <script>
  export default {
    props: {
      listSearch: {
        type: Array,
        default: () => []
      },
      defaultNum: {
        type: Number,
        default: 3
      },
      searchRowNum: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        option: [],
        openStatu: 1 // 展开收缩状态
      }
    },
    watch: {
      orgArray() {
        this.queryParam.orgCode = this.orgArray
      }
    },
    mounted() {
     
    },
    created() {
      
    },
    methods: {
      queryEvent(param) { // 搜索控件事件
        this.$emit('searchEvent', param)
      },
      // 重置
      resetForm() {
        this.$emit('searchEvent', { limit: 20, page: 1, createSort: '1' })
      }
    }
  }
  </script>
  <style scoped lang="scss">
  </style>