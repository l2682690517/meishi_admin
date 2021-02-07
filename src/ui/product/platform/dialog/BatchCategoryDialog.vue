<template lang="pug">
  div
    el-dialog(v-loading="loading", title="选择分类", :visible.sync="dialogVisible", width="280px")
      el-select(placeholder="请选择", v-model="categoryId")
        el-option-group(v-for="group in categoryList", :key="group.name", :label="group.name")
          el-option(v-for="item in group.children", :key="item.name", :label="item.name", :value="item.id")
      div.button-box
        el-button(size="small", @click="hide") 取消
        el-button(size="small", type="primary", @click="submit", :disabled="categoryId === ''") 确定
</template>

<script>
  import * as CategoryApi from 'src/api/category'
  import * as ProductApi from 'src/api/product'

  export default {
    props: {},
    components: {},
    data () {
      return {
        dialogVisible: false,
        loading: false,
        categoryList: [],
        pidList: [],
        categoryId: ''
      }
    },
    computed: {},
    watch: {},
    methods: {
      hide () {
        this.dialogVisible = false
      },
      show (row) {
        this.reset()
        this.dialogVisible = true
        let pidArr = row.map((i) => {
          return i.id
        })
        this.pidList = pidArr
        this.getCategoryList()
      },
      async getCategoryList () {
        try {
          this.loading = true
          let res = await CategoryApi.getList()
          this.categoryList = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      async submit () {
        try {
          this.loading = true
          let formData = {
            pids: this.pidList,
            category_id: this.categoryId
          }
          await ProductApi.batchCategory(formData)
          this.$message({
            type: 'success',
            message: '批量分类成功'
          })
          this.loading = false
          this.hide()
          this.$emit('refresh')
        } catch (err) {
          this.loading = false
        }
      },
      reset () {
        this.categoryList = []
        this.pidList = []
        this.categoryId = ''
      }
    }
  }
</script>


<style lang="scss" scoped>
  .button-box {
    margin-top: 25px;
  }
</style>
