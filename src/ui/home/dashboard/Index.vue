<template lang="pug">
  div(v-loading="loading")
    el-form
      el-form-item
        div.button(@click="toOrder")
          div.text 今日销售额
          div.number {{showToday()}}
        div.button(@click="toOrderRefund")
          div.text 退款中
          div.number {{data.refunding_count}}
        div.button(@click="toTenant")
          div.text 店铺
          div.number {{data.tenant_count}}
      el-form-item
        el-table.table(:data="dataList", border, stripe)
          el-table-column(label="", prop="name")
          el-table-column(label="今日", prop="today_data")
          el-table-column(label="昨日", prop="yesterday_data")
          el-table-column(label="本月", prop="month_data")
          el-table-column(label="上月", prop="pre_month_data")
          el-table-column(label="累计", prop="all_data")
</template>

<script>
  import * as HomeApi from 'src/api/home'
  import { getList, getShowPrice } from 'src/service/home/index'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        data: {
          today_self: 0,
          today_platform: 0,
          refunding_count: 0,
          tenant_count: 0
        },
        dataList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      showToday () {
        return getShowPrice(this.data.today_self + this.data.today_platform)
      },
      async getDashboardData () {
        try {
          this.loading = true
          let res = await HomeApi.getHomeData()
          this.data = res.data
          this.dataList = getList(res.data)
          this.loading = false
        } catch (err) {
        } finally {
          this.loading = false
        }
      },
      toOrder () {
        this.$router.push({
          name: 'OrderIndex'
        })
      },
      toOrderRefund () {
        this.$router.push({
          name: 'OrderRefund'
        })
      },
      toTenant () {
        this.$router.push({
          name: 'Tenant'
        })
      }
    },
    mounted () {
      this.getDashboardData()
    }
  }
</script>


<style lang="scss" scoped>
  .table {
    width: 85%;
  }

  .button {
    display: inline-block;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    transition: .1s;
    font-weight: 500;
    font-size: large;
    border-radius: 4px;
    padding: 12px 20px;
    width: 25%;
    margin-right: 5%;
    .number {
      font-size: x-large;
    }
  }

  .button:hover {
    background: #fff;
    border-color: #409eff;
    color: #409eff;
  }

  .button:active {
    border-color: #3a8ee6;
    color: #3a8ee6;
  }
</style>
