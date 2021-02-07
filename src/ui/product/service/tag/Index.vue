<template lang="pug">
  div
    el-button(type="primary", @click="create") 添加
    div.list
      el-table(style="width: 450px;", :data="serviceTagList", row-key="id", border, :show-header="false", v-loading="loading")
        el-table-column(label="", prop="name", width="299")
          template(slot-scope="scope")
            el-button(type="text", @click="edit(scope.row)") {{scope.row.name}}
        el-table-column(label="", width="150")
          template(slot-scope="scope")
            el-button(size="small", type="danger", @click="del(scope.row)", plain) 删 除
    edit-dialog(ref="dlgEdit", @created="submitCreated", @updated="submitEdit")
</template>

<script>
  import * as ServiceTagApi from 'src/api/servicetag'
  import EditDialog from './Edit'

  export default {
    props: {},
    components: {
      EditDialog
    },
    data () {
      return {
        loading: false,
        serviceTagList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      create () {
        this.$refs.dlgEdit.show()
      },
      del (row) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true
          await ServiceTagApi.deleteTagItem(row.id)
          this.refresh()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      edit (row) {
        this.$refs.dlgEdit.show(row)
      },
      async submitEdit (formData) {
        try {
          this.loading = true
          await ServiceTagApi.editTagItem(formData)
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.refresh()
        } catch (err) {
          this.loading = false
        }
      },
      async submitCreated (formData) {
        try {
          this.loading = true
          await ServiceTagApi.createTagItem(formData)
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.refresh()
        } catch (err) {
          this.loading = false
        }
      },
      async refresh () {
        try {
          this.loading = true
          let res = await ServiceTagApi.getTagList()
          this.serviceTagList = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>


<style lang="scss" scoped>
  .list {
    margin-top: 20px;
  }
</style>
