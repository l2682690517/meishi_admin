<template lang="pug">
  div(v-loading="loading")
    div
      search-toolbar(:model="queryParams", ref="searchtoolbar", @submit="search")
    div
      el-button(size="medium", icon="el-icon-plus", type="primary", @click="createItem") 创建
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="id", label="店铺管理员ID")
        el-table-column(prop="name", label="名字")
        el-table-column(prop="mobile", label="手机号")
        el-table-column(prop="", label="公司")
          div(slot-scope="scope") {{showCompany(scope.row)}}
        el-table-column(prop="", label="店铺")
          div(slot-scope="scope")
            div
              p(v-html="showTenantName(scope.row)")
        el-table-column(width="100" label="操作")
          template(slot-scope="scope")
            el-button(size="mini", @click="editItem(scope.row)", type="primary", plain) 编辑
    el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")

</template>

<script>
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as TenantUserApi from 'src/api/tenant-user'
  import SearchToolbar from 'src/ui/other/tenant-user/SearchToolbar.vue'
  import * as Obj from 'src/util/obj'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {SearchToolbar},
    data () {
      return {
        queryParams: {
          tenant_id: '',
          key: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return TenantUserApi.getList(params)
      },
      showCompany (row) {
        if (row.company) {
          return row.company.name
        } else {
          return '无公司名称'
        }
      },
      showTenantName (row) {
        if (row.company) {
          if (row.company.tenants) {
            let arr = row.company.tenants
            let text = ''
            for (let i = 0; i < arr.length; i++) {
              text = arr[i].nick_name + '</br>'
            }
            return text
          }
        }
        return '无店铺'
      },
      search (model) {
        this.queryParams = Object.assign(this.queryParams, model)
        let query = Obj.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.push({
          path: '/tenantuser',
          query: query
        })
        this.$refs.searchtoolbar.getTenantList()
      },
      createItem () {
        this.$router.push({
          name: 'CreateTenantUser'
        })
      },
      editItem (row) {
        this.$router.push({
          name: 'EditTenantUser',
          params: {
            id: row.id
          }
        })
      }
    },
    mounted () {
      if (this.$route.params.tenantDetail === true) {
        const data = {
          tenant_id: '',
          key: this.$route.params.id
        }
        this.search(data)
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
