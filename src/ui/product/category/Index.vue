<template lang="pug">
  div(v-loading="loading")
    div
      el-button(type="primary", icon="el-icon-plus", @click="handleCreate") 添加
    div.table-wrapper
      smart-table(ref="tabCategory", :dataList.sync="categories.data", @drag-end="handleDragEnd", rowKey="id", expandChildKey="children", :showHeader="false")
        smart-table-column(label="", type="drag")
        smart-table-column(label="", type="expand")
          div.child-wrapper(slot-scope="props")
            smart-table(:dataList.sync!="props.row.children", :showHeader="false", rowKey="id", @drag-end="handleChildDragEnd(props.row)")
              smart-table-column(label="", type="drag")
              smart-table-column(label="名称", prop="name")
              smart-table-column(label="商品", prop="pc")
                div(slot-scope="childProps") {{ childProps.row.pc }}款商品
              smart-table-column(label="操作", width="200px")
                div(slot-scope="childProps")
                  el-button(type="", size="mini", plain, @click="handleEditItem(childProps.row)") 编辑
                  el-button(v-if!="showDelete(childProps.row)", type="", size="mini", plain,  @click="deleteItem(childProps.row)") 删除
        smart-table-column(label="名称", prop="name")
        smart-table-column(label="商品", prop="pc")
          div(slot-scope="props") {{ props.row.pc }}款商品
        smart-table-column(label="操作", width="250px")
          div(slot-scope="props")
            el-button(type="", size="mini", plain, @click="handleCreateChild(props.row)") 添加子分类
            el-button(type="", size="mini", plain, @click="handleEditItem(props.row)") 编辑
            el-button(v-if!="showDelete(props.row)", type="danger", size="mini", plain, @click="deleteItem(props.row)") 删除
    form-dialog(ref="dlgForm", :visible.sync="dialogVisible", @updated="loadData", @created="categoryCreated")
</template>

<script>
  import FormDialog from './FormDialog.vue'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'

  import * as CategoryApi from 'src/api/category'

  export default {
    components: {
      FormDialog,
      SmartTable,
      SmartTableColumn
    },
    data () {
      return {
        loading: false,
        dialogVisible: false,
        categories: {}
      }
    },
    methods: {
      handleCreate () {
        this.$refs.dlgForm.show()
      },
      async handleEditItem (item) {
        const resData = await CategoryApi.getItem(item.id)
        this.$refs.dlgForm.show(resData.data)
      },
      async deleteItem (model) {
        await this.$confirm('删除?', '提示', {type: 'warning'})
        this.loading = true
        try {
          await CategoryApi.deleteItem(model.id)
          await this.loadData()
          this.$message({message: '删除成功', type: 'success'})
        } finally {
          this.loading = false
        }
      },
      handleCreateChild (model) {
        this.$refs.dlgForm.show(null, model.id)
      },
      async loadData () {
        this.loading = true
        try {
          const resData = await CategoryApi.getList()
          this.categories = resData.data
        } finally {
          this.loading = false
        }
      },
      async categoryCreated (data) {
        if (data.parent_id) {
          this.$refs.tabCategory.expandKey(data.parent_id, true)
        }
        this.loadData()
      },
      async handleDragEnd () {
        this.loading = true
        try {
          await CategoryApi.sortCategory(0, this.R.map(item => {
            return item.id
          })(this.categories.data || []))
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
        }
      },
      async handleChildDragEnd (category) {
        this.loading = true
        try {
          await CategoryApi.sortCategory(category.id, this.R.map(item => {
            return item.id
          })(category.children || []))
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
        }
      },
      showDelete (category) {
        return !category.pc && this.RA.isNilOrEmpty(category.children)
      }
    },
    mounted () {
      this.loadData()
    }
  }
</script>

<style lang="scss" scoped>
  .table-wrapper {
    width: 700px;
  }

  .child-wrapper {
    margin-left: auto;
    margin-right: auto;
    width: 600px;
  }


</style>
