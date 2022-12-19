<template>
  <el-drawer
    :visible.sync="showDetail"
    :show-close="true"
    :size="640"
    :with-header="false"
    @close="close"
  >
    <!-- 头部 -->
    <div class="detail">
      <div class="detail-header">
        <div>广告详情</div>
        <i style="cursor: pointer" class="el-icon-close" @click="close"></i>
      </div>
      <div class="detail-content">
        <div class="detail-content--item">
          <div>广告类型：</div>
          <div>{{ ad.adTypeName }}</div>
        </div>
        <div class="detail-content--item">
          <div>广告图：</div>
          <div>
            <div><img :src="ad.adImageUrl" @click="currrentImgVisble = true"></div><div class="example" @click="exampleImgVisible = true">
              示例
            </div>
          </div>
        </div>
        <div class="detail-content--item">
          <div>广告标题：</div>
          <div>{{ ad.adTitle }}</div>
        </div>
        <div class="detail-content--item">
          <div>链接内容：</div>
          <div v-if="ad.adLinkType === 0">
            无
          </div>
          <div v-if="ad.adLinkType === 1">
            商品 {{ ad.adLinkContent }}
          </div>
          <div v-if="ad.adLinkType === 2">
            链接 {{ ad.adLinkContent }}
          </div>
        </div>
        <div class="detail-content--item">
          <div>有效期：</div>
          <div>{{ ad.validityStartTime | date('yyyy-MM-dd hh:mm:ss') }} - {{ ad.validityEndTime | date('yyyy-MM-dd hh:mm:ss') }}</div>
        </div>
      </div>
    </div>
    <!-- 图片示例 -->
    <el-image-viewer
      v-if="currrentImgVisble"
      :url-list="currrentImgUrlList"
      :on-close="onCurrrentImgClose"
    ></el-image-viewer>
    <!-- 图片示例 -->
    <el-image-viewer
      v-if="exampleImgVisible"
      :url-list="exampleUrlList"
      :on-close="onExampleClose"
      class="el-image-viewer-example"
    ></el-image-viewer>
    <div class="footer">
      <div class="graybar"></div>
      <div class="close">
        <el-button @click="close">
          关闭
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { CloudBrandMall } from '@/api'
export default {
  props: {
    showDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currrentImgVisble: false,
      currrentImgUrlList: [],
      // 手机号是否脱敏
      desensitizationState: true,
      exampleImgVisible: false,
      exampleUrlList: [
        'https://yilihuo-img.jsh.com/2022/11/17/527e7e514c794702add8f184813dce17.png'
      ],
      ad: {}
    }
  },
  computed: {
    filterTel() {
      return function(val) {
        if (!val) return ''
        let str = val
        console.log(this.desensitizationState)
        if (this.desensitizationState) {
          str = str.replace(new RegExp('[^0-9]+', 'g'), '')
          str = str.toString().replace(/(\d{3})\d*(\d{4})/, '$1****$2')
        }
        return str
      }
    }

  },
  methods: {
    onCurrrentImgClose() {
      this.currrentImgVisble = false
    },
    onExampleClose() {
      this.exampleImgVisible = false
    },
    getDetail(id) {
      return new Promise((resolve, reject) => {
        this.$http.get(CloudBrandMall.Base.getAdInfoById, { id: id }).then(res => {
          if (res.data.success) {
            resolve('ok')
            this.ad = res.data.data
            this.currrentImgUrlList = [this.ad.adImageUrl]
          } else {
            reject('error')
          }
        })
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scope lang="scss">
    @mixin flex ($direction: row, $justify-content: flex-start, $align-items: flex-start,$flex-wrap: nowrap) {
        box-sizing: border-box;
        display: flex;
        flex-direction: $direction;
        justify-content: $justify-content;
        align-items: $align-items;
        flex-wrap: $flex-wrap;
    }
    .el-image-viewer-example {
      .el-image-viewer__canvas {
        > div{
          width: 450px!important;
        }
      }
    }
    .detail {
        width: 100%;
        padding: 20px 15px;

        &-header {
            @include flex(row, space-between, flex-start, nowrap);
            font-size: 18px;
            font-weight: 400;
            i {cursor: pointer;}
        }
        &-content {
            height: 80vh;
            overflow: auto;
            margin-top: 30px;
            padding-left: 5px;
            &--item {
                @include flex(row, flex-start, flex-start, nowrap);
                font-size: 14px;
                font-weight: 400;
                .example {
                  cursor: pointer;
                  color: #1890ff;
                  margin-top: 92px;
                }
                >div:nth-child(1) {
                    color: #909399;
                    width: 72px;
                }
                >div:nth-child(2) {
                   @include flex(row, flex-start, flex-end, wrap);
                    width: 450px;
                    color: #606266;
                    img {
                        width: 192px;
                        height: auto;
                        margin-right: 7px;
                        cursor: pointer;
                    }
                }

                margin-top: 8px;
                .desensitization {
                    color: #1890FF;
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
        }
    }
    // 示例图片 接入真实图片去掉宽高
    .example-img {
        height: 90vh;
        overflow-y: auto;
        text-align: center;
      }
    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
       .graybar {
            width: 100%;
            height: 10px;
            background: #F0F2F5;
        }
        .close {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: #fff;
        }
    }
</style>
