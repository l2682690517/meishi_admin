<template lang="pug">
  div
    div
      income-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div(v-loading="loading")
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="店铺", prop="")
          template(slot-scope="scope")
            el-button(type="text", @click="toTenantDetail(scope.row)") {{scope.row.tenant_nickname}}
        el-table-column(label="统计周期", prop="")
          template(slot-scope="scope")
            div {{showStatPeriod(scope.row)}}
        el-table-column(label="销售额（元）", prop="sale_total_amount")
          template(slot-scope="scope")
            el-button(type="text", @click="toOrder(scope.row)") {{scope.row.sale_total_amount | price}}
        el-table-column(label="货款（元）", prop="sp_total_amount")
          template(slot-scope="scope")
            div {{scope.row.sp_total_amount | price}}
        el-table-column(label="平台服务费（元）", prop="platform_fee")
          template(slot-scope="scope")
            div {{scope.row.platform_fee | price}}
        el-table-column(label="利润（元）", prop="total_profit")
          template(slot-scope="scope")
            div {{scope.row.tenant_total_amount | price}}
      div.total
      div.bottom.txt-head(v-if="dataList.data && dataList.data.length>1") 销售总额: {{overview.sale_total_amount | friendlyPrice(false)}}，货款合计: {{overview.sp_total_amount | friendlyPrice(false)}}，平台服务费：{{overview.total_platform_fee | friendlyPrice(false)}}, 利润合计: {{overview.tenant_total_amount | friendlyPrice(false)}}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import IncomeToolbar from 'src/ui/other/Income/SearchToolbar.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { dateFormat } from 'src/util/format'
  import * as BillApi from 'src/api/bill'
  import { PUSH_STATUS_IN_COME } from 'src/constants/orderPush'
  import { TENANT_STATUS_IN_COME } from 'src/constants/tenantPush'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {IncomeToolbar},
    data () {
      return {
        queryParams: {
          start: 0,
          end: 0,
          tenant_id: ''
        },
        defaultDate: [],
        overview: {
          sale_total_amount: 0,
          sp_total_amount: 0,
          total_platform_fee: 0,
          tenant_gross_total_amount: 0,
          tenant_total_amount: 0
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return BillApi.getIncomeList(this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val, 'YYYY-MM')
            }
          }
          return val
        })(params))
      },
      toOrder (row) {
        this.$router.push({
          name: 'OrderIndex',
          params: {
            tid: row.tenant_id,
            start: row.start_tick,
            end: row.end_tick
          },
          query: {
            status: PUSH_STATUS_IN_COME
          }
        })
      },
      toTenantDetail (row) {
        this.$router.push({
          name: 'TenantDetail',
          params: {
            tid: row.tenant_id
          },
          query: {
            status: TENANT_STATUS_IN_COME
          }
        })
      },
      showStatPeriod (row) {
        const start = dateFormat(row.start_tick, 'YYYY-MM')
        const end = dateFormat(row.end_tick, 'YYYY-MM')
        return start === end ? start : `${start}~${end}`
      },
      handleSearch (data) {
        this.queryChange(data)
      }
    },
    async mounted () {
      const res = await BillApi.getProfitOverview()
      this.overview = res.data.stat
      if (this.$route.params.tenant) {
        let params = {
          start: 0,
          end: 0,
          tenant_id: this.$route.params.tid
        }
        this.queryChange(params)
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/other";

  .margin {
    margin-left: 60px;
  }

  .total {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
