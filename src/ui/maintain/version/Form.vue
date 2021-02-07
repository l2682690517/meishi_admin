<template lang="pug">
  el-form.medium-el-form(v-loading="loading", ref="form", :model="formData", :rules="formRules", labelWidth="110px")
    el-form-item.tiny-el-input(prop="code", label="版本号")
      el-input(v-model.trim="formData.code", :maxlength="10")
    el-form-item(prop="update_time", label="版本更新时间", :required="true")
      date-picker(:value.sync="formData.update_time")
    el-form-item(prop="desc", label="内容")
      el-input(type="textarea", v-model.trim="formData.description", :rows="2")
    el-form-item
      el-button(@click="$router.back()") 取消
      el-button(type="primary", :loading="saving", @click="save") 确定
</template>

<script>
  import * as FormApi from 'src/api/version'
  import { DatePicker } from '@baibao/zeratul'

  export default {
    components: {
      DatePicker
    },
    data () {
      const updateTimeValidator = (rule, val, callback) => {
        if (!val) {
          callback(new Error('请输入版本更新时间'))
        } else {
          callback()
        }
      }
      return {
        test: 1515577736000,
        loading: false,
        saving: false,
        initialData: {},
        formData: {
          id: 0,
          code: '',
          update_time: 0,
          description: ''
        },
        formRules: {
          code: [
            {required: true, message: '请输入版本号', trigger: 'blur'},
            {max: 10, message: '长度最大10个字符', trigger: 'blur'}
          ],
          update_time: [
            {validator: updateTimeValidator, trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async initEditData () {
        if (this.isEditMode) {
          this.loading = true
          try {
            const resItem = await FormApi.getItem(this.$route.params.id)
            this.formData = resItem.data
            this.initialData = this.R.clone(this.formData)
          } finally {
            this.loading = false
          }
        }
      },
      save () {
        this.saving = true
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              if (!this.isEditMode) {
                await FormApi.create(this.R.clone(this.formData))
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              } else {
                await FormApi.update(this.formData.id, this.R.clone(this.formData))
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
              }
              this.$router.back()
            } catch (err) {
            }
          }
          this.saving = false
        })
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'VersionEdit'
      }
    },
    async mounted () {
      this.initEditData()
    }
  }
</script>

<style lang="scss" scoped>
</style>
