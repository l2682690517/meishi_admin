<template lang="pug">
  mixin textContent
    el-form-item.show-validate-el-form(ref="fiShowText", v-if!="formData.tp === allContentTp.text.value", label="", prop="text")
      div.input-text-wrapper
        el-input(v-model.trim="formData.text", :maxlength="26")
        div.input-right-desc {{ formData.text.length }} / 26
  mixin imageContent
    el-form-item.show-validate-el-form(ref="fiImage", v-if!="formData.tp === allContentTp.img.value", label="", prop="image")
      upload-image(ref="uploadImage", :image.sync="formData.image", :host="getHost", :token="getToken")

  el-dialog(:visible.sync="dialogVisible", title="添加描述", :width="commonDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="40px")
      el-form-item(label="类型", prop="tp")
        el-radio-group(v-model="formData.tp", @change="handleTpChange")
          el-radio(v-for!="item in allContentTp", :label="item.value", :key="item.value") {{ item.text }}
      + textContent
      + imageContent
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="submit") 确定
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import { commonDialogWidth } from 'src/config/el'
  import * as ResourceService from 'src/service/resource/index'
  import { UploadImage } from '@baibao/zeratul'

  export default {
    components: {
      UploadImage
    },
    props: {},
    data () {
      const validateImage = (rule, value, callback) => {
        if (this.$refs.uploadImage && this.$refs.uploadImage.updating) {
          callback(new Error('图片正在上传中'))
        }
        if (!value || !value.url) {
          callback(new Error('请上传图片'))
        }
        callback()
      }
      return {
        loading: false,
        formData: {
          tp: ResourceService.allTp.text.value,
          text: '',
          image: {
            url: '',
            width: 0,
            height: 0
          }
        },
        formRules: {
          text: [
            {required: true, message: '请输入文本', trigger: 'blur'},
            {max: 26, message: '最多可输入26个字符', trigger: 'blur'}
          ],
          image: [
            {validator: validateImage, trigger: 'change'}
          ]
        },
        dialogVisible: false,
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth,
          'allContentTp': ResourceService.allTp
        })
      }
    },
    methods: {
      async show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.clearValidate()
        // 保持tp, 只重置数据
        this.formData.text = ''
        this.formData.image = {
          url: '',
          width: 0,
          height: 0
        }
      },
      async submit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              let result = {}
              switch (this.formData.tp) {
                case this.allContentTp.text.value:
                  result = {
                    tp: this.allContentTp.text.value,
                    text: this.formData.text,
                    url: '',
                    width: 0,
                    height: 0
                  }
                  break
                case this.allContentTp.img.value:
                  result = {
                    tp: this.allContentTp.img.value,
                    text: '',
                    ...this.formData.image
                  }
                  break
              }
              this.$emit('success', result)
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      },
      handleTpChange () {
        this.$refs.fiShowText && this.$refs.fiShowText.clearValidate()
        this.$refs.fiImage && this.$refs.fiImage.clearValidate()
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  .input-text-wrapper {
    display: flex;

    .input-right-desc {
      width: 60px;
    }
  }
</style>
