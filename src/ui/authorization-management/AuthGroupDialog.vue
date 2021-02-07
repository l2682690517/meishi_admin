<template lang="pug">
  el-dialog(:title="showTitle()", :visible.sync="dialogVisible", @close="handleClose()")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="120px")
      el-form-item(label="名称：", prop="name")
        el-input.tiny-x-el-input(v-model="formData.name", :maxlength="20")
      el-form-item(label="是否显示名称：", prop="show_name")
        el-radio(v-model="formData.show_name", :label="true") 是
        el-radio(v-model="formData.show_name", :label="false") 否
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogVisible = false") 取 消
      el-button(type="primary", @click="submit", v-loading="loading") 确 定
</template>

<script>
  import * as AuthorizationManagementApi from 'src/api/authorization-management'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        tp: 1,
        formData: {
          id: 0,
          name: '',
          tp: '',
          show_name: true
        },
        initialData: null,
        formRules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'},
            {max: 20, message: '名称最长20个字符', trigger: 'blur'}]
        }
      }
    },
    computed: {
      isEdit () {
        return !!this.initialData
      }
    },
    watch: {},
    methods: {
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              if (this.isEdit) {
                await AuthorizationManagementApi.editAuthGroup(this.formData)
                this.dialogVisible = false
                this.$emit('refresh')
              } else {
                await AuthorizationManagementApi.createAuthGroup(this.formData)
                this.dialogVisible = false
                this.$emit('refresh')
              }
            } finally {
              this.loading = false
            }
          }
        })
      },
      handleClose () {
        this.initialData = null
        this.formData = {
          id: 0,
          name: '',
          tp: '',
          show_name: true
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      show (tp, item) {
        if (item) {
          this.formData.id = item.id
          this.formData.name = item.name
          this.formData.tp = item.tp
          this.formData.show_name = item.show_name
          this.initialData = item
        } else {
          this.formData.tp = tp
        }
        this.tp = tp
        this.dialogVisible = true
      },
      showTitle () {
        let model = this.isEdit ? '编辑' : '创建'
        let tp = this.tp === 1 ? '平台' : '店铺'
        return `${model}${tp}权限组`
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
