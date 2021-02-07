<template lang="pug">
  div(v-loading="loading")
    search-bar(@search="search")
    list(:dataList.sync="dataList")
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import List from './List'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import {refuseList} from '../../../api/refuse'

  export default {
    mixins: [LoadPagerData],
    components: {
      SearchBar,
      List
    },
    data () {
      return {
        queryParams: {
          refund_status: 0,
          tenant_id: '',
          prod_tp: 0,
          prod: '',
          start_time: '',
          end_time: ''
        }
      }
    },
    computed: {},
    methods: {
      getQueryApi (params) {
        return refuseList(params)
      },
      search (model) {
        this.queryChange(model)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
