import { AliOSS } from '@jsh/helper/utils'
import { CloudUser } from '@/api'
export default {
  data() {
    return {
      form: {
        pictureList: [] // 图片
      },
      uploadPictureLoading: false, // 上传图片加载状态
      uploadVideoLoading: false // 上传视频状态
    }
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
    }
  }
}
