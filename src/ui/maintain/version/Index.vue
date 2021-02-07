<template lang="pug">
  div
    router-link(:to="{name:'VersionCreate'}")
      el-button(type="primary", icon="el-icon-plus") 创建
    div
      el-table.list-el-table(:data="dataList.data", border)
        el-table-column(prop="code", label="版本号")
        el-table-column(prop="update_time", label="版本更新时间")
          div(slot-scope="props")
            div.name {{ props.row.update_time | datetime }}
        el-table-column(label="操作", width="220px")
          template(slot-scope="props")
            div
              el-button(type="primary", size="mini", plain, @click="handleEditItem(props.row)") 编辑
              el-button(type="danger", size="mini", plain, @click="handleDeleteItem(props.row)") 删除
</template>


<script>
  import * as VersionApi from 'src/api/version'

  export default {
    data () {
      return {
        loading: false,
        dataList: {}
      }
    },
    mounted () {
      this.reloadDataList()
    },
    methods: {
      async reloadDataList () {
        this.loading = true
        try {
          const resData = await VersionApi.getList()
          this.dataList = resData.data
        } finally {
          this.loading = false
        }
      },
      handleEditItem (item) {
        this.$router.push({
          name: 'VersionEdit',
          params: {
            id: item.id
          }
        })
      },
      async handleDeleteItem (item) {
        await this.$confirm('删除?', '提示', {
          type: 'warning'
        })
        this.loading = true
        try {
          await VersionApi.deleteItem(item.id)
          await this.reloadDataList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
