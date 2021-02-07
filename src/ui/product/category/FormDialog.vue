<template lang="pug">
  el-dialog(:visible.sync="dialogVisible", title="添加分类", :width="commonDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="rules", labelWidth="60px")
      el-form-item(label="名称:", prop="name")
        el-input(v-model.trim="formData.name")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="submit") 确定
</template>

<script>
  import { commonDialogWidth } from 'src/config/el'
  import * as CategoryApi from 'src/api/category'
  import * as CategoryService from 'src/service/category'
  import { MODE_CREATE, MODE_EDIT } from 'src/constants/index'

  export default {
    components: {
    },
    props: {},
    data () {
      const validateName = async (rule, value, callback) => {
        if (value) {
          if (this.formData.parent_id !== 0) {
            if (value.length > 5) {
              callback(new Error('名称最大5个字符'))
            }
          } else {
            if (value.length > 6) {
              callback(new Error('名称最大6个字符'))
            }
          }
        }
        if (!this.initialData || value !== this.initialData.name) {
          try {
            const resData = await CategoryApi.checkExist({name: value})
            if (resData.status === 200) {
              callback(new Error('名称已存在'))
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
          name: '',
          parent_id: 0
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {validator: validateName, trigger: 'blur'}
          ]
        },
        dialogVisible: false,
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        })
      }
    },
    computed: {
      currentMode () {
        if (this.initialData) {
          return MODE_EDIT
        } else {
          return MODE_CREATE
        }
      }
    },
    methods: {
      async show (editCategory, parentId = 0) {
        this.dialogVisible = true
        await this.$nextTick()
        this.initialData = editCategory
        if (this.initialData) {
          this.formData = CategoryService.convertModelToForm(this.initialData)
        }
        if (parentId !== 0) {
          this.formData.parent_id = parentId
        }
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.resetFields()
      },
      async submit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              let res
              if (this.currentMode === MODE_CREATE) {
                res = await CategoryApi.create({...this.formData})
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$emit('created', res.data)
              } else {
                res = await CategoryApi.update(this.initialData.id, this.formData)
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$emit('updated', res.data)
              }
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped></style>
