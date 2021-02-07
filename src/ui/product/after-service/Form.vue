<template lang="pug">
  div
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="78px", v-loading="loading")
      el-form-item(label="名称", prop="name")
        el-input.small-el-input(v-model.trim="formData.name", placeholder="最多10个字", :maxlength="10")
      el-form-item(label="内容")
        content-comp(:content.sync="formData.items")
      el-form-item(style="margin-top: 50px;")
        el-button(@click="$router.back()") 取 消
        el-button(type="primary", @click="submit") 确 定
</template>

<script>
  import ContentComp from './Content.vue'
  import * as AfterServiceApi from 'src/api/after-service'

  export default {
    props: {},
    components: {
      ContentComp
    },
    data () {
      return {
        loading: false,
        formData: {
          id: 0,
          name: '',
          items: []
        },
        formRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'AfterServiceEdit'
      }
    },
    watch: {},
    methods: {
      submit () {
        if (this.formData.items.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择内容'
          })
        } else if (this.formData.name === '') {
          this.$message({
            type: 'warning',
            message: '请输入名称'
          })
        } else {
          try {
            if (this.isEditMode) {
              this.update()
            } else {
              this.create()
            }
          } catch (err) {
          }
        }
      },
      async update () {
        try {
          this.loading = true
          await AfterServiceApi.editItem(this.formData)
          this.loading = false
          this.$router.back()
        } catch (err) {
          this.loading = false
        }
      },
      async create () {
        try {
          this.loading = true
          await AfterServiceApi.createItem(this.formData)
          this.loading = false
          this.$router.back()
        } catch (err) {
          this.loading = false
        }
      },
      async getEditItem () {
        if (this.isEditMode) {
          try {
            this.loading = true
            let res = await AfterServiceApi.getEditItem(this.$route.params.id)
            this.formData = res.data
            this.loading = false
          } catch (err) {
            this.loading = false
          }
        }
      }
    },
    mounted () {
      this.getEditItem()
    }
  }
</script>


<style lang="scss" scoped>

</style>
