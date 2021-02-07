<template lang="pug">
  div
    el-button(type="primary", @click="create") 添加
    div.list
      el-table(style="width: 450px;", :data="serviceTagGroupList", row-key="id", border, :show-header="false", v-loading="loading")
        el-table-column(label="", prop="name", width="150")
          template(slot-scope="scope")
            el-button(type="text", @click="edit(scope.row)") {{scope.row.name}}
        el-table-column(label="", prop="name", width="150")
          template(slot-scope="scope")
            div {{scope.row.pc}}款商品
        el-table-column(label="", width="149")
          template(slot-scope="scope")
            el-button(:disabled="scope.row.pc!==0",size="small", type="danger", @click="del(scope.row)", plain) 删 除
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
        serviceTagGroupList: []
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
          try {
            await ServiceTagApi.deleteTagGroupItem(row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } catch (err) {
            this.loading = false
          }
          this.refresh()
        }).catch(() => {
        })
      },
      edit (row) {
        this.$refs.dlgEdit.show(row)
      },
      async submitEdit (formData) {
        try {
          this.loading = true
          await ServiceTagApi.editTagGroupItem(formData)
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
          await ServiceTagApi.createTagGroupItem(formData)
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
          let res = await ServiceTagApi.getTagGroupList()
          this.serviceTagGroupList = res.data.data
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
