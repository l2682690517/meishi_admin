<template lang="pug">
  div.order(v-loading="loading")
    search-bar(:queryParams="queryParams", @search="handleSearch", @create_export_task="createExportTask")
    list(:dataList="dataList")
    div.order-bottom.txt-head(v-if="dataList.data && dataList.data.length>0") 实付合计: {{showPrice(dataList.stat)}} &nbsp;&nbsp; 商品数量: {{showSold(dataList.stat)}}（其中退款金额：{{dataList.stat.refund_amount | price}}，退货数量：{{dataList.stat.refund_count}}）
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import List from './List'
  import { orderList } from 'src/api/order'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { getShowPrice } from 'src/util/moneyUtil'
  import { getShowCount } from 'src/util/number'
  import {PUSH_STATUS_IN_COME, PUSH_STATUS_TENANT, PUSH_STATUS_USER} from 'src/constants/orderPush'
  export default {
    mixins: [LoadPagerData],
    components: {
      SearchBar,
      List
    },
    data () {
      return {
        loading: false,
        tenants: [],
        queryParams: {
          status: ['3', '4', '5'],
          searchKey: '',
          searchType: 'prod',
          tenant_id: '',
          start_time: new Date().getTime(),
          end_time: new Date().getTime()
        }
      }
    },
    watch: {
      dataList (val) {
        console.log(val)
      }
    },
    computed: {},
    methods: {
      handleSearch (model) {
        if (model.status.length === 0) {
          model.status = ''
        }
        this.queryChange(model)
      },
      getQueryApi (params) {
        return orderList(params)
      },
      showPrice (stat) {
        let price = 0
        if (stat && stat.sum) {
          price = stat.sum
        }
        return getShowPrice(price)
      },
      showProfit (stat) {
        let price = 0
        if (stat && stat.profit) {
          price = stat.profit
        }
        return getShowPrice(price)
      },
      showSold (stat) {
        let sold = 0
        if (stat && stat.count) {
          sold = stat.count
        }
        return getShowCount(sold)
      },
      createExportTask (model) {
        // this._filter(model)
        // orderList(Object.assign({export: 1}, this.queryParams)).then((res) => {
        //   this.$message({
        //     showClose: true,
        //     message: res.data,
        //     type: 'success'
        //   })
        // }).catch((err) => {
        //   this.$myErrorHandler.handle(this, err)
        // })
      },
      async loadTenant () {

      },
      autoSearch () {
        const status = this.$route.query.status
        if (status === PUSH_STATUS_IN_COME) {
          let params = {
            tenant_id: String(this.$route.params.tid),
            start_time: this.$route.params.start,
            end_time: this.$route.params.end
          }
          this.queryChange(params)
        } else if (status === PUSH_STATUS_TENANT) {
          let params = {
            tenant_id: String(this.$route.params.tid)
          }
          this.queryChange(params)
        } else if (status === PUSH_STATUS_USER) {
          let params = {
            searchKey: String(this.$route.params.uid),
            searchType: 'user',
            start_time: 0,
            end_time: 0
          }
          this.queryChange(params)
        }
      }
    },
    mounted () {
      this.loadTenant()
      this.autoSearch()
    }
  }
</script>

<style lang="scss" scoped>
  .order-bottom {
    padding-top: 8px;
  }
</style>
