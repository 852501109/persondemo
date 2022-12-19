<template>
  <div class="label-manage-import">
    <el-dialog
      v-loading="importFileLoading"
      title="导入入驻门店"
      :visible.sync="importShow"
      width="830px"
      dialog-center
      @close="cancel"
    >
      <!-- 1 -->
      <div class="d-flex align-items-center">
        <span class="fs-14 color-303133">一、下载导入模板</span>
        <span
          class="fs-12 color-909399 ml-20"
        >提示：请按照导入模板的格式导入数据，
          模板的表头名称不可更改，列表头行不能删除。</span>
        <div class="d-flex align-items-center cursor-pointer">
          <el-image :src="downloadImg" class="downloadIcon ml-20"></el-image>
          <span
            class="ml-6 fs-14 color-1989FA"
            @click="downloadTemplate"
          >下载模板</span>
        </div>
      </div>
      <!-- 2 -->
      <div class="d-flex align-items-center mt-34">
        <span class="fs-14 color-303133 mr-10">二、上传导入文件</span>
        <el-upload
          ref="upload"
          class="upload-demo float-left"
          :action="importFileUrlAction"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :on-remove="removeFile"
          :show-file-list="false"
          :data="formItemData"
          :on-change="onChange"
          list-type="xlsx,xls"
          :auto-upload="false"
        >
          <div class="d-flex upload-btn">
            <el-input
              v-model="fileName"

              class="upload-btn--input"
              readonly
              @click.native.stop.prevent
            >
            </el-input>

            <el-button size="mini" class="upload-btn--select">
              选择文件
            </el-button>
          </div>
        </el-upload>
        <el-button
          class="ml-20 push"
          size="mini"
          type="primary"
          @click="submit"
        >
          上传
        </el-button>
      </div>
      <div>
        <div class="upload-tip fs-12 fw-400 mt-10">
          提示：本次导入数据，将追加到之前已导入数据中。
        </div>
      </div>
      <!-- 3 -->
      <div class="d-flex align-items-center mt-34">
        <span class="fs-14 color-303133 mr-10">三、导入结果查看</span>
        <span
          class="color-909399"
        >本次共上传{{ totalCount }}条：成功{{ successCount }}条，
          <span class="color-F56C6C">失败{{ failCount }}条</span>
          。</span>
        <div class="d-flex align-items-center cursor-pointer">
          <el-image :src="downloadImg" class="downloadIcon ml-20"></el-image>
          <span
            class="ml-6 fs-14 color-1989FA"
            @click="downloadFailData"
          >下载失败数据</span>
        </div>
      </div>

      <template slot="footer">
        <el-button size="mini" @click="close">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { CloudExchange, CloudGoods, CloudBrandMall } from '@/api'
import img from '@/assets/images/yilihuo-distribution/download.png'
import { exportExcelAsync } from '@jsh/helper/utils'
export default {
  props: {
    importShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileName: '',
      importFileLoading: false,
      saceDataLoading: false,
      downloadImg: img,
      failCount: 0,
      successCount: 0,
      totalCount: 0,
      isFinished: false,
      downloading: false,
      importKey: '',
      file: null,
      formItemData: {
        userNo: '',
        userName: '',
        mallTypeCode: 'CASARTE_MALL'
      },
      // 暂时不用分页，之前产品文档上有，现在没有了
      page: {
        total: 0,
        limit: 20,
        page: 1
      },
      tableData: [],
      originData: [],
      checkStatauNum: 0
    }
  },
  computed: {
    importFileUrlAction() {
      return CloudBrandMall.Base.importSiteBaseInfoHiwork
    }
  },
  created() {
    this.formItemData.userNo = this.$store?.state.n_user.id
    this.formItemData.userName = this.$store?.state.n_user.name
  },
  methods: {
    // clear() {
    //   console.log('1端口扫描雷克萨面对凯撒l')
    //   this.$refs['upload'].clearFiles()
    // },
    submit() {
      if (!this.file || !this.fileName) {
        this.$message.error('请先选择文件再上传')
        return
      }
      // this.$refs.upload.submit()
      this.importFileLoading = true
      const formData = new FormData()
      formData.append('userNo', this.formItemData.userNo)
      formData.append('file', this.file)
      formData.append('userName', this.formItemData.userName)
      formData.append('mallTypeCode', 'CASARTE_MALL')
      this.$http.post(this.importFileUrlAction, formData).then(res => {
        this.handleSuccess(res.data)
      })
    },
    removeUpload() {
      this.$refs.upload.clearFiles()
      this.fileName = ''
    },
    resetNum() {
      this.totalCount = 0
      this.successCount = 0
      this.failCount = 0
    },
    onChange(file, fileList) {
      this.file = file.raw
      console.log(file.raw)
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      const fileName = file.name.toLowerCase()
      if (!fileName.match(/^.*\.(xlsx|xls)$/i)) {
        this.$message.error('文件上传格式不正确')
        return false
      }
      this.fileName = file.name
      this.resetNum()
    },
    handleExceed() {
      this.$message.warning('只能上传一个文件')
    },
    // 导入发货信息或开票信息-导入成功
    handleSuccess(res) {
      console.log(res)
      let count = 0
      if (!res.success) {
        this.$message.error(res.errorMsg)
        this.importFileLoading = false
        return
      }
      const check = () => {
        const timer = setTimeout(
          () => {
            clearTimeout(timer)
            count += 1
            this.$http.get(CloudBrandMall.Base.getImportSiteBaseInfoStatus, {
              importKey: res.data
            })
              .then(async response => {
                const { data } = response.data
                const { totalNum, successNum, failNum } = data || {}
                if (res.success) {
                  this.totalCount = totalNum
                  this.successCount = successNum
                  this.failCount = failNum
                  if (data.status === 2) {
                    this.importKey = res.data
                    const timer = setTimeout(() => {
                      clearTimeout(timer)
                      this.importFileLoading = false
                    }, 2000)
                  } else {
                    check()
                  }
                } else {
                  check()
                }
              })
              .catch(check)
          },
          count <= 60 ? 500 : 1000
        )
      }
      check()
    },
    // 导出参数示例(copy的)，有接口会替换逻辑
    getParams() {
      return {
        importKey: this.importKey
      }
    },
    // 导出示例(copy的)，有接口会替换逻辑
    downloadFailData() {
      const owner = this
      if (this.failCount === 0) {
        this.$message.info('没有上传失败的数据！')
        return
      }
      this.loadingObj = this.$loading({
        lock: true,
        text: '正在导出,请稍后。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })
      if (this.downloading) {
        owner.$message.warning('正在导出中，请稍后')
        return
      }
      owner.downloading = true
      exportExcelAsync({
        initExcel: () =>
          this.$http.get(
            CloudExchange.exportSiteBaseImportFailResult,
            owner.getParams()
          ),
        checkExcelStatus: params =>
          this.$http.get(
            CloudExchange.exporSiteBaseImportFailResultStatus,
            params
          ),
        downloadExcel: (params, config) =>
          this.$http.get(
            CloudExchange.exportSiteBaseImportFailResultDownload,
            params,
            config
          ) // 由于是返回的文件流，这里需要两个参数
      }).finally(() => {
        owner.downloading = false
        owner.loadingObj.close()
      })
    },
    // 导入发货信息或开票信息-上传过程中
    handleProgress(file) {
      this.importFileLoading = true
    },
    // 导入发货信息或开票信息-上传失败
    handleError() {
      this.$message.error('上传失败')
      this.importFileLoading = false
    },
    close() {
      this.$emit('close')
    },
    // 导入发货信息或开票信息-导入前校验
    beforeUpload(file) {
      const fileName = file.name.toLowerCase()
      if (!fileName.match(/^.*\.(xlsx|xls)$/i)) {
        return false
      }
      return true
    },
    // 页码改变事件
    handleSizeChange(val) {
      this.page.limit = val
      this.tableData = this.originData.slice(
        (this.page.page - 1) * val,
        this.page.page * val
      )
      this.$refs.tableData.doLayout()
    },
    // 点击分页事件
    handleCurrentChange(val) {
      this.page.page = val
      this.tableData = this.originData.slice(
        (val - 1) * this.page.limit,
        val * this.page.limit
      )
      console.log(this.tableData)
    },
    /**
     * 检查导入状态
     */
    checkStatau(id) {
      this.$http
        .get(CloudGoods.checkImportStatus, { downloadId: id })
        .then(res => {
          if (res.data.success) {
            if (res.data.data === '0') {
              if (this.checkStatauNum < 200) {
                setTimeout(() => {
                  this.checkStatauNum = this.checkStatauNum + 1
                  this.checkStatau(id)
                }, 500)
              } else {
                this.saceDataLoading = false
                this.$message.error('导入超时')
              }
            } else if (res.data.data === '1') {
              this.$message.success('导入成功')
              this.saceDataLoading = false
              this.$emit('refresh')
            } else if (res.data.data === '2') {
              this.$message.error('导入失败')
              this.saceDataLoading = false
            } else {
              this.$message.error('导入异常')
              this.saceDataLoading = false
            }
          } else {
            this.saceDataLoading = false
          }
        })
        .catch(error => {
          console.error(error)
          this.saceDataLoading = false
        })
    },
    // 删除文件
    removeFile() {
      this.tableData = []
    },
    /**
     * 下载模板
     */
    downloadTemplate() {
      this.$http
        .get(
          CloudExchange.exportSiteImportTemplate,
          {},
          { responseType: 'blob' }
        )
        .then(res => {
          if (res.status === 200) {
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
              // IE浏览器
              navigator.msSaveBlob(blob, '导入入驻门店保存模版' + '.xlsx')
            } else {
              // 非IE浏览器。
              const aTag = document.createElement('a')
              document.body.appendChild(aTag)
              aTag.download = '导入入驻门店保存模版' + '.xlsx'
              aTag.href = URL.createObjectURL(blob)
              aTag.click()
              document.body.removeChild(aTag)
            }
          }
        })
    },
    /**
     * 删除数据
     */
    deleteOne(index) {
      const currentIndex = (this.page.page - 1) * this.page.limit + index
      console.log(currentIndex)
      if (this.originData[currentIndex].success) {
        this.suceessCount = this.suceessCount - 1
      } else {
        this.failCount = this.failCount - 1
      }

      this.totalNumber = this.totalNumber - 1
      this.originData.splice(currentIndex, 1)
      this.tableData = this.originData.slice(
        0,
        this.page.limit * this.page.page
      )

      this.page.page = 1
      this.page.total = this.originData.length
      this.$refs.tableData.doLayout()
    },
    cancel() {
      Object.assign(this.$data, this.$options.data())
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.label-manage-import {
  .downloadIcon {
    width: 14px;
    height: 14px;
  }
  .color-1989FA {
    color: #1989fa;
  }
  .color-F56C6C {
    color: #f56c6c;
  }
  .color-909399 {
    color: #909399;
  }
  .color-303133 {
    color: #303133;
  }
  .mt-34 {
    margin-top: 34px;
  }
  .ml-27 {
    margin-left: 27px;
  }
  .push {
    border-radius: 4px;
  }
  .upload-tip {
    color: #909399;
    margin-left: 122px;
  }
  .upload-btn {
    position:relative;
    &--input {
      width: 240px;
      box-sizing: border-box;
      ::v-deep input {
        border-radius: 4px 0px 0px 4px;
      }
    }
    &--select {
      background: #e6f1fc;
      color: #409eff;
      border-radius: 0px 4px 4px 0px;
      border: 1px solid #a3d0fd;
      border-left: none;
    }
  }
  .table-pagination {
    margin: 0 auto;
  }
}
.import-close {
  position: absolute;
  top: 7px;
  right: 90px;
  width: 20px;
  cursor: pointer;
  background: #fff;
}
</style>
