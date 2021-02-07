<template lang="pug">
  div
    div
      el-button(type="primary", @click="createTagGroup") 添加标签组
    div(v-loading="loading")
      div.tagGroup-wrapper(v-for="groupItem in tagGroupList", :key="groupItem.id")
        div.toolbar
          div.group-name {{groupItem.name}}
          div.edit-btn
            el-button(size="mini", type="primary", @click="editTagGroup(groupItem)") 编辑
          div.edit-btn
            el-button(:disabled="isDisabled(groupItem)", size="mini", type="danger", @click="deleteTagGroup(groupItem)") 删除
          div.create-btn
            el-button(size="mini", type="primary", @click="createTag(groupItem.id)") 添加标签
        div.tag-list
          el-table.table(:data="groupItem.items", :show-header="false")
            el-table-column
              template(slot-scope="scope")
                div.tag-name(@click="editTag(scope.row, groupItem.id)") {{scope.row.name}}
            el-table-column
              template(slot-scope="scope")
                div {{scope.row.pc}}款商品
            el-table-column(width="70px")
              template(slot-scope="scope")
                el-button(size="mini", type="", @click="deleteTag(scope.row)", plain) 删除
    edit-dialog(ref="dlgEdit", @refresh="refresh")
</template>

<script>
  import * as TagGroupApi from 'src/api/tag'
  import EditDialog from 'src/ui/product/tag/EditDialog'

  export default {
    props: {},
    components: {EditDialog},
    data () {
      return {
        loading: false,
        tagGroupList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      isDisabled (groupItem) {
        if (groupItem.items === null || groupItem.items.length === 0) {
          return false
        }
        return true
      },
      createTagGroup () {
        this.$refs.dlgEdit.show()
      },
      editTagGroup (groupItem) {
        this.$refs.dlgEdit.show(groupItem)
      },
      createTag (groupId) {
        this.$refs.dlgEdit.show(undefined, groupId)
      },
      editTag (row, groupId) {
        this.$refs.dlgEdit.show(row, groupId)
      },
      async deleteTag (row) {
        if (row.pc !== 0) {
          this.$confirm('有商品在使用该标签，确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            try {
              this.loading = true
              await TagGroupApi.deleteTag(row)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.refresh()
            } catch (err) {
              this.loading = false
            }
          }).catch(() => {
          })
        } else {
          try {
            this.loading = true
            await TagGroupApi.deleteTag(row)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.refresh()
          } catch (err) {
            this.loading = false
          }
        }
      },
      async deleteTagGroup (groupItem) {
        try {
          this.loading = true
          await TagGroupApi.deleteTagGroup(groupItem)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.refresh()
          this.refresh()
        } catch (err) {
          this.loading = false
        }
      },
      async refresh () {
        try {
          this.loading = true
          let res = await TagGroupApi.getTagGroup()
          this.tagGroupList = res.data.data
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
  .tagGroup-wrapper {
    margin-top: 50px;
    .toolbar {
      width: 500px;
      height: 40px;
      .group-name {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        float: left;
      }
      .edit-btn {
        margin-left: 10px;
        padding-top: 5px;
        display: inline-block;
      }
      .create-btn {
        padding-top: 5px;
        display: inline-block;
        float: right;
      }

    }
    .tag-list {
      .table {
        width: 500px;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        border-top: 1px solid #ebeef5;
        .tag-name {
          display: inline-block;
          color: #409eff;
          cursor: pointer;
        }
      }
    }
  }
</style>
