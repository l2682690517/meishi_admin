<template lang="pug">
  el-dialog(:visible.sync="dialogVisible", :title="dialogTitle", :width="commonDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="66px")
      el-form-item(prop="name", label="名称")
        el-input(v-model.trim="formData.name", :maxlength="20")
      el-form-item(prop="mobile", label="手机号")
        el-input(v-model.trim="formData.mobile")
      el-form-item(prop="passwd", label="密码")
        el-input(type="password", v-model.trim="formData.passwd")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="handleSubmit") 确定
</template>

<script>
  import { commonDialogWidth } from 'src/config/el'

  import * as SysUserApi from 'src/api/sysuser'
  import { REGEX_MOBILE } from 'src/util/regex'

  export default {
    data () {
      // todo: checkExist
      const validateMobile = async (rule, value, callback) => {
        if (value !== this.oldMobile) {
          try {
            const resData = await SysUserApi.checkExist({mobile: value})
            if (resData.status === 200) {
              callback(new Error('手机号已存在'))
              return
            }
          } catch (err) {
          }
        }
        callback()
      }
      return {
        loading: false,
        initialData: {},
        formData: {
          id: 0,
          name: '',
          mobile: '',
          passwd: '',
          roles: []
        },
        formRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {max: 20, message: '长度最大10个字符', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: REGEX_MOBILE, message: '请输入正确的手机号', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          roles: [
            {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
          ],
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        allRoles: [],
        dialogVisible: false,
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        })
      }
    },
    computed: {
      isEditMode () {
        return !!this.initialData
      },
      dialogTitle () {
        return this.isEditMode ? '编辑管理员' : '添加管理员'
      }
    },
    methods: {
      show (editData) {
        this.initialData = editData
        if (this.initialData) {
          this.formData = this.R.clone(this.initialData)
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.resetFields()
      },
      async handleSubmit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              if (!this.isEditMode) {
                await SysUserApi.create(this.formData)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$emit('created')
              } else {
                await SysUserApi.update(this.initialData.id, this.formData)
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$emit('updated')
              }
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
