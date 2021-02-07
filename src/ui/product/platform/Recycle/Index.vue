<template lang="pug">
  div
    div
      el-form(:inline="true")
        el-form-item
          el-input(v-model.trim="queryParams.text", placeholder="商品名/ID/编码")
        el-form-item
          el-button(type="primary", icon="el-icon-search", @click="search") 搜 索
    div(v-loading="loading")
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="id", label="ID", width="55px")
        el-table-column(prop="cover", label="", width="70px")
          div.cover(slot-scope="props", v-lazy:background-image="showCover(props.row)")
        el-table-column(prop="name", label="商品")
        el-table-column(prop="suggest_price", label="建议售价", sortable, width="110px")
          div(slot-scope="props") {{ props.row | productSuggestPrice }}
        el-table-column(prop="sold", label="销量", sortable, width="100px")
        el-table-column(prop="stock", label="库存", sortable, width="100px")
          div(slot-scope="props") {{ props.row.prop.stock }}
        el-table-column(prop="pt", label="上架时间", sortable, width="160px")
          div(slot-scope="props", v-if="props.row.pt > 0") {{ props.row.pt | datetime }}
        el-table-column(type="expand", fixed="right")
          div(slot-scope="props")
            el-table.small-el-table(:data="props.row.prop.skus || []", border)
              el-table-column(prop="spec", label="规格")
              el-table-column(prop="suggest_price", label="建议售价")
                div(slot-scope="skuProps") {{ skuProps.row.suggest_price | price(false) }}
              el-table-column(prop="sold", label="销量")
              el-table-column(prop="stock", label="库存")
        el-table-column(label="操作", width="120px", fixed="right")
          div(slot-scope="props")
            el-dropdown()
              el-button(type="primary", size="medium", plain)
                | 操作
                i.el-icon-arrow-down.el-icon--right()
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(@click.native="handleCopy(props.row)") &nbsp;&nbsp;复制&nbsp;&nbsp;
                el-dropdown-item(@click.native="cancelDelete(props.row)") &nbsp;&nbsp;恢复&nbsp;&nbsp;
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import * as ProductApi from 'src/api/product'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { showCover } from 'src/service/product/index'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {},
    data () {
      return {
        queryParams: {
          trash: 1,
          text: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi () {
        return ProductApi.getRecycleList(this.queryParams)
      },
      search () {
        this.queryChange(this.queryParams)
      },
      cancelDelete (row) {
        this.$confirm('恢复为下架商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.loading = true
            if (!row.prop.category || !row.prop.category.id) {
              this.$router.push({
                name: 'PlatformProductEdit',
                params: {
                  id: row.id,
                  recycle: true
                }
              })
              return
            }
            await ProductApi.cancelDeleteProduct(row.id)
            this.$message({
              type: 'success',
              message: '已恢复为下架商品'
            })
            this.loadDataListByQueryPage()
          } catch (err) {
            this.loading = false
          }
        }).catch(() => {
        })
      },
      handleCopy (product) {
        this.$router.push({
          name: 'PlatformProductCreate',
          params: {
            id: product.id,
            copy: true
          }
        })
      },
      ...$global.$mapMethods({'showCover': showCover})
    }
  }
</script>


<style lang="scss" scoped>
  .cover {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }
</style>
