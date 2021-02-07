<template lang="pug">
  div
    el-dialog(title="服务说明", :visible.sync="dialogVisible", width="30%")
      el-form(ref="form", :model="formData", :rules="rules", label-width="80px", v-loading="loading")
        el-form-item(label="服务名称" prop="name")
          el-input(placeholder="最多5个字", v-model.trim="formData.name", :maxlength="5")
        el-form-item(label="服务描述", prop="desc")
          el-input(type="textarea", :autosize="{ minRows: 5, maxRows: 5}", placeholder="", v-model.trim="formData.desc", :maxlength="100")
          span.input-tip {{formData.desc ? formData.desc.length : 0}}/100
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取 消
        el-button(type="primary", @click="submit") 确 定
</template>

<script>
  import * as ServiceTagApi from 'src/api/servicetag'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        originData: '',
        formData: {
          id: 0,
          name: '',
          desc: ''
        },
        rules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'}],
          desc: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      async show (row) {
        this.dialogVisible = true
        this.originData = row
        if (row) {
          try {
            this.loading = true
            let res = await ServiceTagApi.getTagItem(row.id)
            res = res.data
            this.formData.id = res.id
            this.formData.name = res.name
            this.formData.desc = res.desc
            this.loading = false
          } catch (err) {
            this.loading = false
          }
        } else {
          let formData = {
            id: 0,
            name: '',
            desc: ''
          }
          this.formData = formData
        }
      },
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if (this.originData === undefined) {
              this.$emit('created', this.formData)
              this.dialogVisible = false
            } else {
              this.$emit('updated', this.formData)
              this.dialogVisible = false
            }
          }
        })
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
