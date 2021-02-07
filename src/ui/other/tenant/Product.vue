<template lang="pug">
  div(v-loading="loading")
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="商品")
          template(slot-scope="scope")
            div.productInfo
              div.infoImg(v-lazy:background-image="getImg(scope.row)")
              div.infoText(@click="showProductDetail(scope.row)") {{scope.row.name}}
        el-table-column(prop="profit", label="利润", sortable, width="100")
          template(slot-scope="scope")
            div {{scope.row | productProfit}}
        el-table-column(prop="price", label="售价", sortable, width="100")
          template(slot-scope="scope")
            div {{scope.row | productPrice}}
        el-table-column(prop="sold", label="销量", sortable, width="80")
          template(slot-scope="scope")
            div {{ scope.row.sold }}
        el-table-column(prop="stock", label="库存", sortable, width="80")
          template(slot-scope="scope")
            div {{scope.row.prop.stock}}
        el-table-column(prop="pt", label="首次上架", sortable, width="160")
          template(slot-scope="scope")
            div {{scope.row.pt | datetime}}
        el-table-column(label="来源", prop="tp", width="80")
          template(slot-scope="scope")
            div {{getTpText(scope.row)}}
      div
        el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
      product-detail-dialog(ref="dlgProductDetail")
</template>

<script>
  import SearchToolbar from 'src/ui/other/tenant/search-toolbar/ProductToolbar.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as TenantApi from 'src/api/tenant'
  import * as ProductService from 'src/service/product/index'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'

  export default {
    mixins: [LoadPagerData],
    props: {},
    components: {
      SearchToolbar,
      ProductDetailDialog
    },
    data () {
      return {
        queryParams: {
          tp: 0,
          status: 1,
          text: ''
        },
        ...$global.$mapConst({
          'allStatus': ProductService.allStatus
        })
      }
    },
    watch: {},
    methods: {
      showProductDetail (row) {
        this.$refs.dlgProductDetail.show(row, false, row.tenant_id)
      },
      getImg (row) {
        return ProductService.showCover(row)
      },
      getQueryApi (params) {
        return TenantApi.getTenantProductList(this.$route.params.id, params)
      },
      getTpText (row) {
        if (row.tp === ProductService.allTp.self_support.value) {
          return ProductService.allTp.self_support.text
        } else if (row.tp === ProductService.allTp.choose_platform.value) {
          return ProductService.allTp.choose_platform.text
        }
      },
      handleSearch (data) {
        this.queryChange(data)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .productInfo {
    display: flex;

    .infoImg {
      width: 50px;
      height: 50px;
      background-size: cover;
      margin-right: 10px;
    }

    .infoText {
      flex: 1;
      color: $color-primary;
      text-decoration: underline;
      cursor: pointer;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 23px;
      height: 46px;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }

  .bottom-div {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    .bottom-btn {
      float: right;
    }
  }

  .btn-mina-wrapper {
    margin-top: 10px;
  }
</style>
