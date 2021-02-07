<template lang="pug">
  div
    el-dialog(title="商品权限", :visible.sync="dialogVisible", width="400px", @close="closeCallback")
      el-form(ref="form", :rules="formRules", :model="formData")
        el-form-item
          div.head
            div.cover(v-lazy:background-image="tenantData.head_img")
            div.name {{tenantData.nick_name}}
        el-form-item(prop="checkbox")
          el-checkbox-group(v-model="formData.checkList")
            div
              el-checkbox(label="2") 在美市平台选货
            el-checkbox(label="1") 销售店铺自营商品
      span(slot="footer", class="dialog-footer")
        el-button(@click="dialogVisible = false") 取 消
        el-button(type="primary", @click="submit", :loading="loading") 确 定
</template>

<script>
  import * as TenantApi from 'src/api/tenant'

  export default {
    props: {},
    components: {},
    data () {
      const checkBoxValidator = (rule, value, callback) => {
        if (!this.formData.checkList || this.formData.checkList.length <= 0) {
          callback(new Error('至少选择一项'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        formData: {
          checkList: ['2']
        },
        tenantData: {},
        formRules: {
          checkbox: [{validator: checkBoxValidator, trigger: 'blur'}]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.formData.checkList = row.product_auth === 3 ? ['1', '2'] : [`${row.product_auth}`]
        this.dialogVisible = true
        this.tenantData = row
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.resetFields()
        this.formData.checkList = ['2']
        this.tenantData = {}
      },
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              this.loading = true
              let formData = {
                product_auth: this.formData.checkList.length === 2 ? 3 : Number(this.formData.checkList[0])
              }
              await TenantApi.changeProductAuth(this.tenantData.id, formData)
              this.$message({
                type: 'success',
                message: '已修改商品权限!'
              })
              this.dialogVisible = false
              this.$emit('refresh')
            } finally {
              this.loading = false
            }
          }
        })
      }
    }
  }
</script>


<style lang="scss" scoped>
.head {
  display: flex;
  height: 50px;
  .cover {
    display: inline-block;
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }
  .name{
    height: 50px;
    line-height: 50px;
    margin-left: 15px;
  }
}
</style>
