<template lang="pug">
  el-dialog(:title="title", width="30%", :visible.sync="dialogVisible")
    el-form(ref="form", :model="formData", :rules="rules", v-loading="loading")
      el-form-item(label="名称", prop="name", :maxlength="10")
        el-input(v-model="formData.name")
    div(slot="footer", class="dialog-footer")
      el-button(@click="dialogVisible = false") 取 消
      el-button(type="primary", @click="submitForm") 确 定
</template>

<script>
  import * as TagApi from 'src/api/tag'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        formData: {
          id: 0,
          name: ''
        },
        isEdit: false,
        isTag: false,
        dialogVisible: false,
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}]
        }
      }
    },
    computed: {
      title () {
        let mode = this.isEdit ? '编辑' : '创建'
        let title = this.isTag ? '标签' : '标签组'
        return mode + title
      }
    },
    watch: {},
    methods: {
      async create () {
        try {
          this.loading = true
          if (this.isTag) {
            await TagApi.createTag(this.formData)
          } else {
            await TagApi.createTagGroup(this.formData)
          }
          this.$emit('refresh')
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      async edit () {
        try {
          this.loading = true
          if (this.isTag) {
            await TagApi.editTag(this.formData)
          } else {
            await TagApi.editTagGroup(this.formData)
          }
          this.$emit('refresh')
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      submitForm () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              this.edit()
            } else {
              this.create()
            }
            this.dialogVisible = false
          }
        })
      },
      show (item, toEditTag) {
        this.reset()
        if (item !== undefined) {
          this.isEdit = true
          this.formData.id = item.id
          this.formData.name = item.name
        }
        if (toEditTag !== undefined) {
          this.isTag = true
          this.formData.tag_group_id = toEditTag
        }
        this.dialogVisible = true
      },
      reset () {
        this.formData = {
          id: 0,
          name: ''
        }
        this.isEdit = false
        this.isTag = false
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
