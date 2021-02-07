<template lang="pug">
  div(v-loading="loading")
    div 账号信息
    div
      el-form(ref="form", :model="formData", :rules="rules", label-width="300px")
        el-form-item(v-if="mode===1", label="店铺管理员ID：") {{formData.id}}
        el-form-item(label="名字：", prop="name")
          el-input.input(placeholder="最多20个字", :maxlength="20", v-model.trim="formData.name")
        el-form-item(label="手机号码：", prop="mobile")
          el-input.input(placeholder="手机号11位1开头", :maxlength="11", v-model.trim="formData.mobile")
        el-form-item(label="密码：", prop="passwd")
          el-input.input(type="password", placeholder="请输入密码", v-model.trim="formData.passwd")
        el-form-item(label="重复密码：", prop="checkpasswd")
          el-input.input(type="password", placeholder="请重复密码", v-model.trim="formData.checkpasswd")
        div.border 公司信息
        el-form-item(label="公司名称：", prop="company_name")
          el-input.input(v-model.trim="formData.company_name")
        el-form-item(label="公司地址：", prop="company_addr")
          el-input.input(v-model.trim="formData.company_addr")
        el-form-item(label="公司官网：", prop="company_website")
          el-input.input(v-model.trim="formData.company_website")
        el-form-item(label="公司描述：", prop="company_desc")
          el-input.input(type="textarea", :autosize="{ minRows: 3, maxRows: 5}", v-model.trim="formData.company_desc")
        el-form-item(label="联系人：", prop="company_contact")
          el-input.input(v-model.trim="formData.company_contact")
        el-form-item(label="手机号：", prop="company_mobile")
          el-input.input(v-model.trim="formData.company_mobile")
        el-form-item(label="邮箱：", prop="company_email")
          el-input.input(v-model.trim="formData.company_email")
        el-form-item
          el-button(type="primary", @click="submit") 确定
</template>

<script>
  import * as TenantUserApi from 'src/api/tenant-user'

  export default {
    props: {
      mode: {
        type: Number
      }
    },
    components: {},
    data () {
      const validatePass = (rule, value, callback) => {
        let reg = /^[\w]{6,20}$/
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (reg.test(value)) {
          if (this.formData.checkpasswd !== '') {
            this.$refs.form.validateField('checkpasswd')
          }
          callback()
        } else if (!reg.test(value)) {
          callback(new Error('密码只能是长度6到20的字母和数字'))
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formData.passwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        const num = /^[1][3,4,5,7,8][0-9]{9}$/
        if (value === '') {
          callback(new Error('请输入手机号码'))
        } else if (num.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号码'))
        }
      }
      return {
        loading: false,
        formData: {
          name: '',
          mobile: '',
          passwd: '',
          checkpasswd: '',
          company_name: '',
          company_addr: '',
          company_website: '',
          company_desc: '',
          company_contact: '',
          company_mobile: '',
          company_email: ''
        },
        rules: {
          name: [{required: true, message: '请输入名字', trigger: 'blur'}],
          mobile: [{required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}],
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkpasswd: [
            {required: true, message: '请重复密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ],
          company_name: [
            {required: true, message: '请输入公司名称', trigger: 'blur'},
            {min: 0, max: 30, message: '公司名称最长30个字符', trigger: 'blur'}],
          company_addr: [{min: 0, max: 100, message: '公司地址最长100个字符', trigger: 'blur'}],
          company_website: [{min: 0, max: 100, message: '公司官网最长100个字符', trigger: 'blur'}],
          company_desc: [{min: 0, max: 200, message: '公司描述最长200个字符', trigger: 'blur'}],
          company_contact: [
            {required: true, message: '请填写公司联系人', trigger: 'blur'},
            {min: 0, max: 20, message: '公司联系人最长20个字符', trigger: 'blur'}],
          company_mobile: [{required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}],
          company_email: [{min: 0, max: 100, message: '邮箱最长100个字符', trigger: 'blur'}]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      submit () {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            if (this.mode === 1) {
              this.update()
            } else {
              this.create()
            }
          }
        })
      },
      async create () {
        let data = JSON.parse(JSON.stringify(this.formData))
        delete data.checkpasswd
        try {
          this.loading = true
          await TenantUserApi.createTenantUser(data)
          this.$message({
            message: '创建成功',
            showClose: true,
            type: 'success'
          })
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$my.ErrorPlugin(this, err)
        }
      },
      async update () {
        let data = JSON.parse(JSON.stringify(this.formData))
        delete data.checkpasswd
        try {
          this.loading = true
          await TenantUserApi.editTenantUser(this.$route.params.id, data)
          this.$message({
            message: '更新成功',
            showClose: true,
            type: 'success'
          })
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$my.ErrorPlugin(this, err)
        }
      },
      async getItem () {
        if (this.mode === 1) {
          try {
            this.loading = true
            let res = await TenantUserApi.getTenantUserItem(this.$route.params.id)
            this.formData = res.data
          } catch (err) {
            this.$my.ErrorPlugin(this, err)
          } finally {
            this.loading = false
          }
        }
      }
    },
    mounted () {
      this.getItem()
    }
  }
</script>


<style lang="scss" scoped>
  .input {
    width: 400px;
  }

  .border {
    padding-top: 10px;
    border-top: 1px solid #dcdfe6;
  }
</style>
