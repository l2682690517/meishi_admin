<template lang="pug">
  div(v-loading="loading")
    search-bar(:queryParams="queryParams", @submit="handleSearch")
    el-button(type="primary", icon="el-icon-plus", @click="handleCreate") 创建
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="name", label="名字")
        el-table-column(prop="mobile", label="手机号")
        el-table-column(label="操作", width="220px")
          template(slot-scope="scope")
            div(v-if="!scope.row.super")
              el-button(type="primary", size="mini", plain, @click="handleEditItem(scope.row)") 编辑
              el-button(:type="scope.row.enabled ? 'danger' : 'success'", size="mini", plain, @click="handleEnableItem(scope.row)") {{ scope.row.enabled ? '禁用' : '启用' }}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
    div
      form-dialog(ref="dlgForm", @created="handleCreated")
</template>

<script>
  import * as SysUserApi from 'src/api/sysuser'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import FormDialog from './FormDialog.vue'
  import SearchBar from './SearchBar'

  export default {
    mixins: [
      LoadPagerData
    ],
    components: {
      FormDialog,
      SearchBar
    },
    data () {
      return {
        queryParams: {
          text: ''
        }
      }
    },
    watch: {},
    methods: {
      getQueryApi (params) {
        return SysUserApi.getList(params)
      },
      shouldResetRouteQuery (to, from) {
        return from.name === 'SysUserCreate'
      },
      async handleEnableItem (item) {
        await this.$confirm(item.enabled ? '禁用' : '启用')
        this.loading = true
        if (item.enabled) {
          await SysUserApi.disable(item.id)
        } else {
          await SysUserApi.enable(item.id)
        }
        this.loadDataList()
        this.loading = false
      },
      async handleEditItem (item) {
        const resData = await SysUserApi.getItem(item.id)
        this.$refs.dlgForm.show(resData.data)
      },
      handleCreate () {
        this.$refs.dlgForm.show()
      },
      handleCreated () {
        this.resetQuery()
      },
      handleSearch (result) {
        this.queryChange(result)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
