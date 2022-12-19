<template>
  <el-drawer
    :visible.sync="showDetail"
    :show-close="true"
    :size="640"
    :with-header="false"
    modal-append-to-body
    append-to-body
    @close="close"
  >
    <!-- 头部 -->
    <div class="detail fs-18 fw-400">
      <div class="detail-header d-flex justify-content-between">
        <div>门店详情</div>
        <i style="cursor: pointer" class="el-icon-close cursor-pointer" @click="close"></i>
      </div>
      <div class="detail-content">
        <div class="detail-content--item">
          <div>门店名称：</div>
          <div>{{ store.siteName }}</div>
        </div>
        <div class="detail-content--item">
          <div>门店简称：</div>
          <div>{{ store.customSiteName }}</div>
        </div>
        <div class="detail-content--item">
          <div>门店地址：</div>
          <div>{{ store.provinceName }} - {{ store.cityName }} - {{ store.districtName }} - {{ store.streetName }}</div>
        </div>
        <div class="detail-content--item">
          <div>门店详细地址：</div>
          <div>{{ store.fullAddress }}</div>
        </div>
        <div class="detail-content--item">
          <div>门店面积：</div>
          <div>{{ store.siteArea }}</div>
        </div>
        <div class="detail-content--item">
          <div>
            门店照片
            <el-tooltip
              effect="dark"
              content="门店照片最多9张"
              placement="top-start"
            >
              <img class="store-question" src="https://yilihuo-img.jsh.com/2022/12/09/b7a8a4e314e84e7b8999f62f7be58991.png">
            </el-tooltip>
            ：
          </div>
          <div v-if="store.imgList && store.imgList.length">
            <img v-for="(i, n) in store.imgList" :key="n" :src="i" @click="showStorePicture">
          </div>
          <div v-else>
            -
          </div>
        </div>
        <div class="detail-content--item">
          <div>门店负责人：</div>
          <div>{{ store.siteManageName }}</div>
        </div>
        <div class="detail-content--item">
          <div>门店联系电话：</div>
          <div v-if="store.siteManagePhone">
            {{ siteManagePhone }}<span class="detail-content--item__desensitization" @click="toggleDesensitizationState">{{ desensitizationState ? '显示' : '隐藏' }}</span>
          </div>
          <div v-else>
            -
          </div>
        </div>
        <div class="detail-content--item">
          <div>销售员：</div>
          <div v-if="store.counselorName">
            {{ store.counselorName }}
          </div>
          <div v-else>
            -
          </div>
        </div>
        <div class="detail-content--item">
          <div>门店介绍：</div>
          <div>{{ store.siteIntroduction }}</div>
        </div>
        <div class="detail-content--item">
          <div>营业执照：</div>
          <div v-if="store.memberBusinessImg">
            <img :src="store.memberBusinessImg" @click="showBusinessLicensePicture(store.memberBusinessImg)">
          </div>
          <div v-else>
            -
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="graybar"></div>
      <div class="close bg-fff text-center">
        <el-button @click="close">
          关闭
        </el-button>
      </div>
    </div>
    <el-image-viewer
      v-if="imgVisble"
      :url-list="imgList"
      :on-close="onImgClose"
    ></el-image-viewer>
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
      store: {},
      // 手机号是否脱敏
      desensitizationState: true,
      imgVisble: false,
      imgList: [],
      siteBaseId: '',
      siteManagePhone: '',
      desensitizationStateLoading: false
    }
  },
  methods: {
    toggleDesensitizationState() {
      this.$nextTick(() => {
        // 调用脱敏接口
        if (this.desensitizationState) {
          if (this.desensitizationStateLoading) return
          this.desensitizationStateLoading = true
          this.$http.get(CloudBrandMall.Base.getCarsetPhoneById, { id: this.siteBaseId }).then(res => {
            if (res.data.success) {
              this.siteManagePhone = res.data.data
            }
          }).catch(() => {
            this.$message.error('服务器错误')
          })
            .finally(() => {
              this.desensitizationState = !this.desensitizationState
              this.desensitizationStateLoading = false
            })
        } else {
          this.siteManagePhone = this.store.siteManagePhone
          this.desensitizationState = !this.desensitizationState
        }
      })
    },
    onImgClose() {
      this.imgVisble = false
    },
    showStorePicture() {
      this.imgList = this.store.imgList
      this.imgVisble = true
    },
    showBusinessLicensePicture(item) {
      this.imgList = [item]
      this.imgVisble = true
    },
    close() {
      this.$emit('close')
    },
    reset() {
      this.store = {}
      // 手机号是否脱敏
      this.desensitizationState = true
      this.imgVisble = false
      this.imgList = []
      this.siteManagePhone = ''
      this.desensitizationStateLoading = false
    },
    getDetail(id) {
      this.reset()
      this.siteBaseId = id
      return new Promise((resolve, reject) => {
        this.$http.get(CloudBrandMall.Base.getSiteInfoById, { siteBaseId: id }).then(res => {
          if (res.data.success) {
            this.store = res.data.data
            this.siteManagePhone = this.store.siteManagePhone
            resolve('success')
          } else {
            reject('error')
          }
        })
      })
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
    div.el-tooltip__popper.is-dark {
      z-index: 4000!important;
    }
    .detail {
        width: 100%;
        padding: 20px 15px;
        &-content {
            height: 80vh;
            overflow: auto;
            margin-top: 30px;
            padding-left: 5px;
            &--item {
                @include flex(row, flex-start, flex-start, nowrap);
                text-align: left;
                font-size: 14px;
                font-weight: 400;
                >div:nth-child(1) {
                    color: #909399;
                    width: 94px;
                }
                >div:nth-child(2) {
                    @include flex(row, flex-start, flex-start, wrap);
                    width: 450px;
                    color: #606266;
                    img {
                        width: 64px;
                        height: 64px;
                        border-radius: 5px;
                        margin-right: 7px;
                        margin-bottom: 7px;
                        cursor: pointer;
                    }
                }

                margin-top: 8px;
                &__desensitization {
                    color: #1890FF;
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
        }
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
        }
    }
    .store-question {
      position: relative;
      top: 3px;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
</style>
