<template>
  <basiComponent>
    <template #header>
      新增广告
    </template>
    <!-- 表单 -->
    <el-form
      ref="submitForm"
      :model="submitForm"
      :rules="rules"
      label-width="100px"
      label-position="right"
      class="form mt-25"
    >
      <el-form-item label="广告类型" prop="adTypeId">
        <el-radio-group v-model="submitForm.adTypeId">
          <el-radio v-for="i in listAdTypeOptions" :key="i.id" :label="i.id">
            {{ i.adTypeName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图" prop="adImageUrl">
        <div v-loading="uploadPictureLoading">
          <div class="fs-14 fw-400 color-909">
            图片尺寸建议750*640px&nbsp;<span class="add-adtips" @click="showExample">示例</span>
          </div>
          <div class="picture-list d-flex flex-wrap-wrap">
            <div v-if="form.pictureList.length === 0" class="picture-list--item">
              <upload-icon @click="uploadPicture" />
            </div>
            <div v-for="(picture, picIndex) in form.pictureList" :key="picIndex" class="picture-list--item">
              <el-image
                :src="picture"
                :preview-src-list="form.pictureList"
                fit="cover"
                :z-index="2020"
                class="picture-list--item__img"
              ></el-image>
              <img
                :src="require('@/assets/images/brand-mall/del-pic.png')"
                class="picture-list--item__del cursor-pointer"
                @click="delPicture(picIndex)"
              >
              <img
                v-if="picIndex"
                :src="require('@/assets/images/brand-mall/set-main-icon.png')"
                class="picture-list--item__set cursor-pointer"
                @click="setMain(picture, picIndex)"
              >
            </div>
          </div>
        </div>
        <!-- <div v-if="submitForm.adTypeId !== '2'" class="add-adtips">
          图片尺寸建议750*640px
          <span @click="showExample">示例</span>
        </div>
        <div v-if="submitForm.adTypeId === '2'" class="add-adtips">
          其他长宽尺寸建议390*180px<span @click="showExample">示例</span>
        </div>
        <ad-upload :limit="{width: 1440, height:2600}" @fileSuccess="fileSuccess"></ad-upload> -->
      </el-form-item>
      <el-form-item label="广告标题" prop="adTitle">
        <div class="add-title d-flex">
          <el-input
            v-model="submitForm.adTitle"
            type="text"
            placeholder="请输入广告标题"
            maxlength="30"
            style="width: 360px;"
            show-word-limit
            @input="adTitleFilter"
          />
          <span
            class="add-title--text fs-14 ml-10"
          ><i class="el-icon-info mr-10"></i>商城中不显示此标题，仅便于维护者识别广告</span>
        </div>
      </el-form-item>
      <el-form-item label="链接内容" prop="adLinkType">
        <el-radio-group
          v-model="submitForm.adLinkType"
          @change="changeLinkContent"
        >
          <el-radio v-model="submitForm.adLinkType" :label="0">
            无
          </el-radio>
          <el-radio v-model="submitForm.adLinkType" :label="1">
            商品
          </el-radio>
          <el-radio v-model="submitForm.adLinkType" :label="2">
            链接
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="submitForm.adLinkType === 1"
        prop="linkSelect"
        label=""
      >
        <div class="add-link">
          <div class="add-link--title" @click="selectCommodity">
            选择商品
          </div>
          <div>
            <el-input
              v-model="submitForm.linkSelect"
              class="add-link--select"
            ></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="submitForm.adLinkType === 2"
        prop="adLinkContent"
        label=""
      >
        <el-input
          v-model="submitForm.adLinkContent"
          placeholder="请输入链接地址"
          style="width: 360px;"
        ></el-input>
      </el-form-item>
      <div class="d-flex">
        <el-form-item label="有效期" prop="validityStartTime">
          <el-date-picker
            v-model="submitForm.validityStartTime"
            type="datetime"
            style="width: 200px"
            :picker-options="pickerStartOptions"
            placeholder="开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <span class="add-zhi fs-14 fw-400 text-center mr-10">至</span>
        <el-form-item label="" label-width="0" prop="validityEndTime">
          <el-date-picker
            v-model="submitForm.validityEndTime"
            type="datetime"
            style="width: 200px"
            :picker-options="pickerEndOptions"
            placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </div>

      <el-form-item label="展示顺序" prop="sort">
        <el-input
          v-model="submitForm.sort"
          placeholder="请输入展示顺序"
          style="width: 360px;"
          @input="transNumber"
        />
      </el-form-item>
    </el-form>
    <!-- 详情 -->
    <add-detail
      ref="addDetail"
      :show-detail="showDetail"
      @handleSelect="handleSelect"
      @close="handleCloseDetail"
    ></add-detail>
    <!-- 图片示例 -->
    <el-image-viewer
      v-if="exampleImgVisible"
      :url-list="exampleUrlList"
      :on-close="onExampleClose"
      class="el-image-viewer-example"
    ></el-image-viewer>
    <template #footer>
      <div class="d-flex justify-content-center align-items-center pt-15 pb-15">
        <el-button @click="goBack">
          取消
        </el-button>
        <el-button type="primary" :loading="publishLoading" @click="publish">
          发布
        </el-button>
      </div>
    </template>
    <!--图片上传-->
    <input v-show="false" ref="picture" type="file" multiple accept="image/*" @change="handleUploadChange">
  </basiComponent>
</template>

<script>
import addDetail from './components/add-detail.vue'
import basiComponent from '../../components/basic-component.vue'
import { CloudBrandMall, CloudUser } from '@/api'
import { AliOSS } from '@jsh/helper/utils'
import { EMOJI_REG } from '@/utils/regular'
import UploadIcon from './components/upload-icon'
export default {
  components: {
    basiComponent,
    addDetail,
    UploadIcon
  },
  data() {
    return {
      form: {
        pictureList: [] // 图片
      },
      uploadPictureLoading: false, // 上传图片加载状态
      uploadVideoLoading: false, // 上传视频状态
      exampleUrlList: [
        'https://yilihuo-img.jsh.com/2022/11/17/527e7e514c794702add8f184813dce17.png'
      ],
      publishLoading: false,
      submitForm: {
        mallTypeCode: 'CASARTE_MALL',
        adTypeId: '',
        adImageUrl: '',
        adTitle: '',
        adLinkType: '',
        validityStartTime: '',
        validityEndTime: '',
        adLinkContent: '',
        linkSelect: '',
        adItemId: '',
        adItemSkuId: '',
        sort: null,
        userNo: this.$store.state.n_user.id,
        userName: this.$store.state.n_user.name
      },
      listAdTypeOptions: [],
      rules: {
        adTypeId: [
          { required: true, message: '请选择广告类型', trigger: 'change' }
        ],
        adImageUrl: [
          { required: true, message: '请上传广告图', trigger: 'change' }
        ],
        adTitle: [
          { required: true, message: '请输入广告标题', trigger: 'blur' }
        ],
        adLinkType: [
          { required: true, message: '请选择链接内容', trigger: 'change' }
        ],
        linkSelect: {
          required: true,
          validator: this.validateLinkSelect,
          trigger: 'change'
        },
        adLinkContent: {
          required: true,
          validator: this.validateLinkContent,
          trigger: 'blur'
        },
        validityStartTime: {
          required: true,
          validator: this.validateStartDate,
          trigger: 'change'
        },
        validityEndTime: {
          required: true,
          validator: this.validateEndDate,
          trigger: 'change'
        },
        sort: [{ required: true, message: '请输入展示顺序', trigger: 'blur' }]
      },
      commodityActive: 1,
      showDetail: false,
      exampleImgVisible: false,
      pickerStartOptions: {
        disabledDate: time => {
          const dateTime = new Date()
          const startDateTime = dateTime.setDate(dateTime.getDate() - 1)
          return time.getTime() < new Date(startDateTime).getTime()
        }
      },
      pickerEndOptions: {
        disabledDate: time => {
          const dateTime = new Date()
          const startDateTime = dateTime.setDate(dateTime.getDate() - 1)
          return time.getTime() < new Date(startDateTime).getTime()
        }
      }
    }
  },
  created() {
    this.getListAdType()
  },
  methods: {
    // 选择图片
    uploadPicture() {
      const owner = this
      owner.$refs.picture.dispatchEvent(new MouseEvent('click'))
    },
    // 上传图片
    handleUploadChange(event) {
      const owner = this
      const files = event.target.files
      owner.uploadPictureLoading = true
      owner.uploadPictureRequest(files)
        .then(res => {
          owner.form.pictureList = [...owner.form.pictureList, ...(res.filter(img => img))]
          this.fileSuccess(owner.form.pictureList)
          owner.$forceUpdate()
        })
        .finally(() => {
          owner.uploadPictureLoading = false
          owner.$nextTick(() => {
            event.target.value = ''
          })
        })
    },
    // 删除图片
    delPicture(index) {
      const owner = this
      owner.form.pictureList.splice(index, 1)
      this.submitForm.adImageUrl = ''
      owner.$forceUpdate()
    },
    // 上传图片请求
    uploadPictureRequest(pictures) {
      const owner = this
      return new Promise((resolve) => {
        const results = []
        let counter = 0
        const processData = (index, image) => {
          results[index] = image
          if (++counter === pictures.length) {
            resolve(results)
          }
        }

        pictures.forEach((file, index) => {
          new AliOSS({
            bucket: 'jsh-oss-hwork'
          })
            .setToken(owner.$http.get(CloudUser.getStsToken))
            .upload({
              file,
              env: process.env.VUE_APP_RUN_ENV,
              filetype: 'image'
            })
            .then(res => {
              processData(index, res?.url || '')
            })
            .catch(() => {
              processData(index, '')
            })
        })
      })
    },
    onExampleClose() {
      this.exampleImgVisible = false
    },
    transNumber() {
      this.submitForm.sort = this.submitForm.sort
        .replace(/[^\d]/g, '')
        .substr(0, 8)
      if (this.submitForm.sort) { this.submitForm.sort = Number(this.submitForm.sort) }
      this.$forceUpdate()
    },
    // 获取广告类型
    getListAdType() {
      this.$http
        .get(CloudBrandMall.Base.listAdType, { mallTypeCode: 'CASARTE_MALL' })
        .then(res => {
          if (res.data.success) {
            const list = res.data.data || []
            this.listAdTypeOptions = list
            this.submitForm.adTypeId = list[0].id
          }
        })
    },
    // 广告标题筛选
    adTitleFilter() {
      this.submitForm.adTitle = this.submitForm.adTitle.replace(EMOJI_REG, '')
      this.$forceUpdate()
    },
    // 触发选择事件
    handleSelect(row) {
      this.submitForm.linkSelect = row.itemName
      this.submitForm.adItemId = row.id
      this.submitForm.adItemSkuId = row.itemSkuId
      this.showDetail = false
    },
    // 显示示例图片
    showExample() {
      this.exampleImgVisible = true
    },
    // 选择商品
    selectCommodity() {
      this.showDetail = true
      this.$nextTick(() => {
        this.$refs['addDetail'].getList()
      })
    },
    // 图片上传c成功回调函数
    fileSuccess(list) {
      console.log('mark', list)
      this.submitForm.adImageUrl = list[0]
      this.$refs['submitForm'].validateField('adImageUrl')
      this.$forceUpdate()
    },
    // 链接内容校验
    validateLinkContent(rule, value, callback) {
      if (!value && this.submitForm.adLinkType === 2) {
        callback(new Error('请输入链接地址'))
      } else {
        callback()
      }
    },
    // 选择校验
    validateLinkSelect(rule, value, callback) {
      if (!value && this.submitForm.adLinkType === 1) {
        callback(new Error('请选择商品'))
      } else {
        callback()
      }
    },
    // 链接内容改变事件
    changeLinkContent(val) {
      this.$refs['submitForm'].clearValidate('adLinkType')
      this.$refs['submitForm'].clearValidate('adLinkContent')
      this.$refs['submitForm'].clearValidate('linkSelect')
    },
    // 日期校验
    validateStartDate(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择开始时间'))
      } else if (
        this.submitForm.validityEndTime &&
        this.submitForm.validityStartTime > this.submitForm.validityEndTime
      ) {
        callback(new Error('开始时间结不得晚于结束时间'))
      } else {
        callback()
      }
    },
    // 结束日期校验
    validateEndDate(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择结束时间'))
      } else if (
        this.submitForm.validityStartTime &&
        this.submitForm.validityStartTime > this.submitForm.validityEndTime
      ) {
        callback(new Error('结束时间不得早于开始时间'))
      } else {
        callback()
      }
    },
    handleCloseDetail() {
      this.showDetail = false
    },
    changeDate() {
      if (
        this.submitForm.validityEndTime &&
        this.submitForm.validityStartTime > this.submitForm.validityEndTime
      ) {
        this.submitForm.validityStartTime = ''
        this.$refs['submitForm'].validateField('validityStartTime')
        this.$refs['submitForm'].validateField('validityEndTime')
      }
    },
    // 取消事件
    goBack() {
      this.$confirm('取消后内容不会保存，是否取消?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({ path: '/ylh/brand-mall/ad/ad-manage' })
        })
        .catch(() => {})
    },
    // 转换为时间戳
    transTime(date) {
      return new Date(date).getTime()
    },
    // 发布事件
    publish() {
      if (this.publishLoading) return
      this.$refs['submitForm'].validate(valid => {
        if (valid) {
          this.publishLoading = true
          const params = Object.assign({}, this.submitForm)
          params.validityStartTime = this.transTime(params.validityStartTime)
          params.validityEndTime = this.transTime(params.validityEndTime)
          delete params.linkSelect
          console.log(params)
          this.$http.post(CloudBrandMall.Base.saveAdInfo, params).then(res => {
            if (res.data.success) {
              this.$router.push({ path: '/ylh/brand-mall/ad/ad-manage' })
              this.$message.success('发布成功')
              this.publishLoading = false
            } else {
              this.$message.error(res.data.errorMsg)
              this.publishLoading = false
            }
          })
        } else {
          console.log('error submit!!')
          this.publishLoading = false
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// element默认样式被全局覆盖，改回来
::v-deep .el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
::v-deep.el-form-item--mini .el-form-item__error {
  padding-top: 4px;
}
.el-image-viewer-example {
  .el-image-viewer__canvas {
    > div{
      width: 450px!important;
    }
  }
}
.close {
  width: 100%;
  opacity: 0.8;
  text-align: center;
}

// 示例图片 加入真实地址去掉宽高
.example-img {
  height: 90vh;
  overflow-y: auto;
  text-align: center;
}
.picture-list {
  &--item {
    width: 100px;
    height: 100px;
    margin: 10px 15px 0 0;
    position: relative;
    &__img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    &__main {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
    }
    &__del {
      position: absolute;
      top: 0;
      right: 0;
      width: 14px;
      height: 14px;
    }
    &__set {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 24px;
    }
  }
}
.add-adtips {
  color: #1890ff!important;
  cursor: pointer;
  font-weight: 400;
}
.add {
  width: 100%;
  padding: 20px 16px 70px 16px;
  &-title {
    &--text {
      color: #1890ff;
    }
  }
  &-zhi {
    height: 28px;
    color: #303133;
    line-height: 28px;
    margin-left: -14px;
  }
  &-link {
    > div {
      box-sizing: border-box;
      display: inline-block;
      width: 86px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
    &--title {
      background: #409eff;
      color: #fff;
      border: 1px solid #409eff;
    }
    &--select {
      border: none;
      ::v-deep input {
        border: none;
        min-width: 400px;
      }
    }
  }
}
</style>
