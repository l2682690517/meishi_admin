<template lang="pug">
  div
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table(v-loading="loading", :data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="店铺ID", prop="id", width="68px")
        el-table-column(label="", prop="", width="68px")
          div(slot-scope="scope")
            div.cover(v-lazy:background-image="scope.row.head_img")
        el-table-column(label="名称", prop="nick_name")
        el-table-column(label="线上版本ID", prop="")
          div(slot-scope="scope") {{showOnlineTemplateId(scope.row)}}
        el-table-column(label="审核版本ID", prop="audit_template_id")
        el-table-column(label="审核状态", prop="")
          template(slot-scope="scope")
            div(v-html="showAuditStatus(scope.row)")
        el-table-column(label="操作", prop="", width="90px")
          template(slot-scope="scope")
            el-button(v-if="showButtonStatus(scope.row)", size="mini", type="primary", plain, @click="handle(scope.row)") {{showButtonStatus(scope.row)}}
    el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as AppVersionApi from 'src/api/app-version'
  import SearchToolbar from 'src/ui/maintain/app-version/audit-list/SearchToolbar.vue'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {
      SearchToolbar
    },
    data () {
      return {
        queryParams: {
          key: '',
          audit_status: '',
          online_template_id: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return AppVersionApi.getAuditList(params)
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      showOnlineTemplateId (row) {
        if (row.online_template_id === 0 && row.online_status !== 5) {
          return '--'
        }
        return row.online_template_id
      },
      showAuditStatus (row) {
        let text = ''
        switch (row.audit_status) {
          case 1:
            text = '审核成功'
            break
          case 2:
            text = '审核中'
            break
          case 3:
            text = `审核失败（${row.audit_err_msg}）`
            break
          case 4:
            text = '上线失败'
            break
          case 5:
            text = '已上线'
            break
        }
        return text
      },
      showButtonStatus (row) {
        let text = ''
        switch (row.audit_status) {
          case 1:
            text = '刷新'
            break
          case 2:
            text = '刷新'
            break
          case 3:
            text = '重试'
            break
          case 4:
            text = '重试'
            break
          case 5:
            text = ''
            break
        }
        return text
      },
      async handle (row) {
        // audit_status 1：审核成功 2：审核中 3：审核失败 4：上线失败 5：已上线
        try {
          this.loading = true
          if (row.audit_status === 4) {
            await AppVersionApi.release(row.id)
            this.$message({
              type: 'success',
              message: '已重试上线'
            })
          } else if (row.audit_status === 3) {
            await AppVersionApi.retryAudit(row.id)
            this.$message({
              type: 'success',
              message: '已重新提交审核'
            })
          } else if (row.audit_status === 1 || row.audit_status === 2) {
            await AppVersionApi.refreshAppStatus(row.id)
            this.$message({
              type: 'success',
              message: '已重新获取审核状态'
            })
          }
          this.loadDataListByQueryPage()
        } finally {
          this.loading = false
        }
      },
      autoSearch () {
        let name = this.$route.query.name
        let params = {}
        if (name) {
          switch (name) {
            case '审核成功':
              params.audit_status = 1
              break
            case '审核中':
              params.audit_status = 2
              break
            case '审核失败':
              params.audit_status = 3
              break
            case '上线失败':
              params.audit_status = 4
              break
            case '已上线':
              params.audit_status = 5
              break
          }
          this.queryChange(params)
        }
      }
    },
    mounted () {
      this.autoSearch()
    }
  }
</script>


<style lang="scss" scoped>
  .cover {
    display: inline-block;
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }
</style>
