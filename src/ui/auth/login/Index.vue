<template lang="pug">
  div.login-container
    el-form(ref="formLogin", :model="formData", :rules="formRules", labelPosition="left", labelWidth="0")
      h3.title 百宝美市管理后台
      el-form-item(prop="mobile")
        div.icon
          svg-icon(icon="account")
        el-input(type="text", placeholder="手机号", v-model="formData.mobile")
      el-form-item(prop="passwd")
        div.icon
          svg-icon(icon="key")
        el-input(type="password", placeholder="密码", v-model="formData.passwd")
      el-form-item(prop="capt_code")
        div.captcha
          div.icon.tip
            svg-icon(icon="captcha")
          div.code
            el-input(type="text", placeholder="验证码", v-model="formData.capt_code")
          div.img
            img(:src="capt_img", @click="refreshCaptcha")
      el-form-item
        el-button(type="primary", @click="handleLogin", :loading="loading") 登录
</template>

<script>
  import { login, getCaptcha } from 'src/api/auth'

  export default {
    data () {
      return {
        loading: false,
        capt_img: '',
        formData: {
          mobile: '',
          passwd: '',
          capt_code: '',
          capt_id: ''
        },
        formRules: {
          mobile: [
            {
              required: true, trigger: 'blur', message: '请输入手机号'
            }
          ],
          passwd: [
            {
              required: true, trigger: 'blur', message: '请输入密码'
            }
          ],
          capt_code: [
            {
              required: true, trigger: 'blur', message: '请输入验证码'
            }
          ]
        }
      }
    },
    methods: {
      handleLogin () {
        this.$refs.formLogin.validate(async valid => {
          if (valid) {
            this.loading = true
            try {
              await login(this.formData)
              this.$router.replace({
                name: 'Dashboard'
              })
            } catch (_) {
              this.refreshCaptcha()
            } finally {
              this.loading = false
            }
          }
        })
      },
      async refreshCaptcha () {
        this.formData.capt_code = ''
        this.formData.capt_id = ''
        const resCaptcha = await getCaptcha()
        this.formData.capt_id = resCaptcha.data.id
        this.capt_img = resCaptcha.data.url
      }
    },
    async mounted () {
      await this.refreshCaptcha()
    }
  }
</script>

<style lang="scss" scoped>

  $bg-color: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    width: 100%;
    height: 100vh;
    background-color: $bg-color;

    .el-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .el-button {
      width: 100%;
      height: 40px;
    }

    .el-input {
      display: inline-block;
      width: 90%;
    }

    .icon {
      box-sizing: border-box;
      display: inline-block;
      width: 30px;
      font-size: 20px;
      padding-left: 10px;
      color: $dark_gray;
      vertical-align: middle;
      text-align: center;

    }

    .captcha {
      display: flex;
      align-items: center;

      .tip {
        width: 30px;
        font-size: 15px;
      }

      .code {
        flex: 1;
      }

      .img {
        height: 47px;

        & > img {
          height: 100%;
          background: #fff;
          cursor: pointer;
        }
      }
    }

  }
</style>

<style lang="scss">
  $light_gray: #eee;

  .login-container {
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }

  }

</style>
