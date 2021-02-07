<template lang="pug">
  div(v-loading="loading")
    div
      div.head
        div.head-cover(v-lazy:background-image="tenantData.head_img")
        div.head-name-box
          div.head-name {{tenantData.nick_name}}
            span.icon(@click="dialogVisible = true")
              img.img(:src="qrcodeIcon")
          div.head-status {{showAppStatus(tenantData.app_status)}}
      div.body-status
        div.body-item-status 店铺状态：{{showTenantStatus(tenantData.tenant_status)}}
        el-button(v-if="tenantData.tenant_status === 1", type="danger", size="mini", @click="disable(tenantData.id)") 禁用
        el-button(v-else, type="primary", size="mini", @click="enable(tenantData.id)") 启用
      div.body-status.margin-left
        div.body-item-status 商品权限：
        el-button(type="text", @click="showProductAuthDialog(tenantData)", size="mini") {{showProductAuth(tenantData)}}
      div.body-detail
        div.body-item 店铺ID：{{tenantData.id}}
        div.body-border
        div.body-item 店铺管理员：
        div.body-item.btn(type="text", @click="toTenantUser(tenantData.admin_id)") {{tenantData.admin_name}}
        div.body-border
        div.body-item 授权状态：{{showRefundStatus(tenantData.refund_status)}}
        div.body-border
        div.body-item 首次上线：{{tenantData.first_uptime | datetime}}
      div.body-bottom-line
      div.list-title
        div.list-title-head
          div.list-title-item 最近收入
          div.list-title-item.btn(type="text", @click="toIncome(tenantData.id)") 详细
        div.list
          el-table.list-el-table(:data="incomeList", border)
            el-table-column(label="统计周期", prop="")
              template(slot-scope="scope")
                div {{showStatPeriod(scope.row)}}
            el-table-column(label="销售额（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.sale_total_amount | price}}
            el-table-column(label="货款（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.sp_total_amount | price}}
            el-table-column(label="平台服务费（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.platform_fee | price}}
            el-table-column(label="利润（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.tenant_total_amount | price}}
      div.list-title.margin-top
        div.list-title-head
          div.list-title-item 最新上架
          div.list-title-item.btn(type="text", @click="toTenantProduct(tenantData.id)") 详细
        div.list
          el-table.list-el-table(:data="productList", border)
            el-table-column(prop="", label="", width="70px")
              div.cover(slot-scope="scope", v-lazy:background-image="showCover(scope.row)")
            el-table-column(label="商品", prop="name")
            el-table-column(label="利润（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.min_profit | price}}～{{scope.row.max_profit | price}}
            el-table-column(label="售价（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.min_price | price}}～{{scope.row.max_price | price}}
            el-table-column(label="销量", prop="sold")
            el-table-column(label="库存", prop="")
              div(slot-scope="scope") {{scope.row.prop.stock}}
            el-table-column(label="首次上架", prop="", width="155px")
              div(slot-scope="scope", v-if="scope.row.pt > 0") {{ scope.row.pt | datetime }}
            el-table-column(label="来源", prop="")
              div(slot-scope="scope") {{showTp(scope.row.tp)}}
    el-dialog(title="小程序码", :visible.sync="dialogVisible", width="480px", :modal-append-to-body="false")
      img.dlgImg(:src="tenantData.acode_url")
      el-button(style='margin-left:150px;', @click="download") 下载小程序码
    product-auth-dialog(ref="dlgProductAuth", @refresh="getDetail")
</template>

<script>
  import ProductAuthDialog from 'src/ui/common/product-auth-dialog/Index.vue'
  import * as TenantApi from 'src/api/tenant'
  import { showAppStatus, showTenantStatus, showProductAuth } from 'src/service/other/index'
  import { showCover } from 'src/service/product/index'
  import { dateFormat } from 'src/util/format'
  import { TENANT_STATUS_IN_COME, TENANT_STATUS_ORDER, TENANT_STATUS_PRODUCT } from 'src/constants/tenantPush'

  export default {
    props: {},
    components: {ProductAuthDialog},
    data () {
      return {
        dialogVisible: false,
        qrcodeIcon: require('src/assets/image/qrcode.png'),
        loading: false,
        incomeList: [],
        productList: [],
        tenantData: {}
      }
    },
    computed: {},
    watch: {},
    methods: {
      showProductAuthDialog (row) {
        this.$refs.dlgProductAuth.show(row)
      },
      showStatPeriod (row) {
        const start = dateFormat(row.start_tick, 'YYYY-MM')
        const end = dateFormat(row.end_tick, 'YYYY-MM')
        return start === end ? start : `${start}~${end}`
      },
      toIncome (id) {
        this.$router.push({
          name: 'TenantIncome',
          params: {
            tid: id,
            tenant: true
          }
        })
      },
      toTenantProduct (id) {
        this.$router.push({
          name: 'TenantProduct',
          params: {
            id: id
          }
        })
      },
      download () {
        let link = document.createElement('a')
        link.href = this.tenantData.acode_url
        link.download = 'qrcode'
        link.click()
        this.dialogVisible = false
      },
      toTenantUser (id) {
        this.$router.push({
          name: 'TenantUser',
          params: {
            id: id,
            tenantDetail: true
          }
        })
      },
      enable (id) {
        this.$confirm('启用店铺？', '提示？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.loading = true
            await TenantApi.enableTenant(id)
            this.$message({
              type: 'success',
              message: '已启用!'
            })
            this.getDetail()
          } catch (err) {
            this.loading = false
          }
        }).catch(() => {
        })
      },
      disable (id) {
        this.$confirm('小程序将无法访问，店铺后台将无法登录', '禁用？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.loading = true
            await TenantApi.disableTenant(id)
            this.$message({
              type: 'success',
              message: '已禁用!'
            })
            this.getDetail()
          } catch (err) {
            this.loading = false
          }
        }).catch(() => {
        })
      },
      showTp (tp) {
        if (tp === 1) {
          return ''
        }
        if (tp === 2) {
          return '自营'
        }
        return '平台'
      },
      showRefundStatus (row) {
        if (row === 1) {
          return '未授权'
        }
        return '已授权'
      },
      async getDetail () {
        try {
          this.loading = true
          let res = await TenantApi.getDetail(this.$route.params.tid)
          this.tenantData = res.data.tenant
          this.incomeList = res.data.bills ? res.data.bills : []
          this.productList = res.data.products ? res.data.products : []
        } catch (err) {
        } finally {
          this.loading = false
        }
      },
      ...$global.$mapMethods({'showAppStatus': showAppStatus}),
      ...$global.$mapMethods({'showTenantStatus': showTenantStatus}),
      ...$global.$mapMethods({'showCover': showCover}),
      ...$global.$mapMethods({'showProductAuth': showProductAuth})
    },
    created () {
      const status = this.$route.query.status
      if (status === TENANT_STATUS_IN_COME) {
        this.$parent.updateBreadcrumb([{
          text: '收入',
          to: {name: 'TenantIncome'}
        }, {
          text: '店铺详情'
        }])
      } else if (status === TENANT_STATUS_ORDER) {
        this.$parent.updateBreadcrumb([{
          text: '订单',
          to: {name: 'OrderIndex'}
        }, {
          text: '订单详情',
          to: {name: 'OrderDetail', param: {id: this.$route.params.id}}
        }, {
          text: '店铺详情'
        }])
      } else if (status === TENANT_STATUS_PRODUCT) {
        this.$parent.updateBreadcrumb([{
          text: '店铺自营商品',
          to: {name: 'TenantSelfProductIndex'}
        }, {
          text: '店铺详情'
        }])
      } else {
        this.$parent.updateBreadcrumb([{
          text: '店铺',
          to: {name: 'Tenant'}
        }, {
          text: '店铺详情'
        }])
      }
    },
    mounted () {
      this.getDetail()
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/other";
  .margin-left{
    margin-left: 20px;
  }

  .head {
    height: 50px;
    display: flex;
    .head-cover {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .head-name-box {
      margin-left: 10px;
      .head-name {
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 22px;
        line-height: 22px;
        .icon {
          margin-left: 6px;
          width: 16px;
          line-height: 16px;
          .img {
            cursor: pointer;
            width: 16px;
          }
        }
      }
      .head-status {
        line-height: 20px;
        height: 20px;
        font-size: 14px;
        display: inline-block;
        margin-left: 3px;
        margin-top: 5px;
      }
    }
  }

  .body-status {
    display: inline-flex;
    margin-top: 20px;
    align-items: center;
    .body-item-status {
      display: inline-block;
      font-size: 12px;
      height: 17px;
      line-height: 17px;
      margin-right: 10px;
    }
  }

  .body-detail {
    margin-top: 20px;
    display: flex;
    height: 21px;
    align-items: center;
    .body-border {
      display: inline-block;
      border-right: solid 1px #DCDFE6;
      margin-left: 10px;
      margin-right: 10px;
      height: 21px;
      background-color: #DCDFE6;
    }
    .body-item {
      display: inline-block;
      height: 17px;
      font-size: 12px;
      line-height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

  }


  .dlgImg {
    width: 430px;
    height: 430px;
  }

  .cover {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }

</style>
