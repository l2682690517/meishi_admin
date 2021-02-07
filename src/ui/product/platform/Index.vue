<template lang="pug">
  div(v-loading="loading")
    search-bar(:queryParams="queryParams", @submit="handleSearch")
    router-link(:to="{name:'PlatformProductCreate'}")
      el-button(type="primary", icon="el-icon-plus") 创建
    div.batch
      el-button-group
        el-button(size="small", @click="batchCategory", :disabled="multipleSelection.length === 0") 批量分类
        el-button(size="small", @click="batchTag", :disabled="multipleSelection.length === 0") 批量标签
        el-button(size="small", @click="batchChangeStatus", :disabled="multipleSelection.length === 0") 批量下架
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border, @selection-change="handleSelectionChange")
        el-table-column(type="selection", width="55px")
        el-table-column(prop="id", label="ID", width="55px")
          div(slot-scope="props")
            el-button(type="text", @click="showProductDetail(props.row)") {{props.row.id}}
        el-table-column(prop="cover", label="", width="70px")
          div.cover(slot-scope="props", v-lazy:background-image="showCover(props.row)")
        el-table-column(prop="name", label="商品", :show-overflow-tooltip="true")
        el-table-column(prop="suggest_price", label="建议售价", sortable, width="110px")
          div(slot-scope="props") {{ props.row | productSuggestPrice }}
        el-table-column(prop="sold", label="销量", sortable, width="100px")
          div(slot-scope="props") {{ props.row.sold }}
        el-table-column(prop="stock", label="库存", sortable, width="100px")
          div(slot-scope="props") {{ props.row.prop.stock }}
        el-table-column(prop="tenant_count", label="店铺选择", sortable, width="110px")
          div(slot-scope="props")
            div(v-if="props.row.tenant_count === 0") {{props.row.tenant_count}}
            el-button(v-else, type="text", @click="showTenantCountDialog(props.row)") {{props.row.tenant_count}}
        el-table-column(prop="pt", label="上架时间", sortable, width="160px")
          div(slot-scope="props", v-if="props.row.pt > 0") {{ props.row.pt | datetime }}
        el-table-column(type="expand", fixed="right")
          div(slot-scope="props")
            el-table.small-el-table(:data="props.row.prop.skus || []", border)
              el-table-column(prop="spec", label="规格")
              el-table-column(prop="suggest_price", label="建议售价")
                div(slot-scope="skuProps") {{ skuProps.row.suggest_price | price(false) }}
              el-table-column(prop="sold", label="销量")
                div(slot-scope="skuProps") {{ skuProps.row.sold }}
              el-table-column(prop="stock", label="库存")
        el-table-column(label="操作", width="120px", fixed="right")
          div(slot-scope="props")
            el-dropdown()
              el-button(type="primary", size="medium", plain)
                | 操作
                i.el-icon-arrow-down.el-icon--right()
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(@click.native="handleEdit(props.row)") &nbsp;&nbsp;编辑&nbsp;&nbsp;
                el-dropdown-item(@click.native="handleCopy(props.row)") &nbsp;&nbsp;复制&nbsp;&nbsp;
                el-dropdown-item(@click.native="changeStatus(props.row)") &nbsp;&nbsp;{{props.row.status === 1 ? '下架' : '上架'}}&nbsp;&nbsp;
                el-dropdown-item(@click.native="changeTop(props.row)") &nbsp;&nbsp;{{props.row.top_tick === 0 ? '置顶' : '取消置顶'}}&nbsp;&nbsp;
                el-dropdown-item(@click.native="deleteProduct(props.row)") &nbsp;&nbsp;删除&nbsp;&nbsp;
      el-button.recycle(@click="toRecycle") 回收站
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
      batch-category-dialog(ref="batchCategorydlg", @refresh="loadDataListByQueryPage")
      batch-tag-dialog(ref="batchTagdlg", :origin="tagsIdArray", @submit="chooseTagComplete", @refresh="loadDataListByQueryPage")
      tenant-count-dialog(ref="tenantCountDlg")
      product-detail-dialog(ref="dlgProductDetail")
</template>

<script>
  import SearchBar from './SearchBar.vue'
  import * as ProductApi from 'src/api/product'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { showCover } from 'src/service/product/index'
  import { dateFormat } from 'src/util/format'
  import BatchCategoryDialog from 'src/ui/product/platform/dialog/BatchCategoryDialog.vue'
  import BatchTagDialog from 'src/ui/product/platform/dialog/BatchTagDialog.vue'
  import TenantCountDialog from 'src/ui/product/platform/dialog/TenantCountDialog.vue'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'

  export default {
    name: 'AdminIndex',
    mixins: [
      LoadPagerData
    ],
    components: {
      SearchBar,
      BatchCategoryDialog,
      BatchTagDialog,
      TenantCountDialog,
      ProductDetailDialog
    },
    data () {
      return {
        queryParams: {
          top: false,
          status: 0,
          category_id: '',
          start: 0,
          end: 0,
          text: '',
          tags: []
        },
        multipleSelection: []
      }
    },
    watch: {},
    computed: {
      tagsIdArray () {
        return this.multipleSelection.map((i) => {
          let tagsArr = {
            tags: i.prop.tags
          }
          return tagsArr
        })
      }
    },
    methods: {
      getQueryApi (params) {
        return ProductApi.getList(this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val, 'YYYY-MM-DD')
            }
          } else if (key === 'top') {
            if (val) {
              return 1
            } else {
              return 0
            }
          } else if (key === 'tags') {
            if (val.length !== 0) {
              return val.map((i) => {
                return parseInt(i)
              })
            } else {
              return []
            }
          }
          return val
        })(params))
      },
      showProductDetail (row) {
        this.$refs.dlgProductDetail.show(row)
      },
      shouldResetRouteQuery (to, from) {
        return from.name === 'PlatformProductCreate'
      },
      showTenantCountDialog (row) {
        this.$refs.tenantCountDlg.show(row)
      },
      async chooseTagComplete (result) {
        result.component.hide()
        if (result.add_tags.length === 0 && result.del_tags.length === 0) {
          return
        }
        let formData = {
          pids: this.multipleSelection.map((i) => {
            return i.id
          }),
          add_tags: result.add_tags,
          del_tags: result.del_tags
        }
        try {
          this.loading = true
          await ProductApi.batchChangeTags(formData)
          this.$message({
            type: 'success',
            message: '修改标签成功'
          })
        } catch (err) {
          this.loading = false
        }
        this.loadDataListByQueryPage()
      },
      batchChangeStatus () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择商品'
          })
        } else {
          this.$confirm('下架商品？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.loading = true
            let pidArr = this.multipleSelection.map((i) => {
              return i.id
            })
            await ProductApi.batchShelveDown(pidArr)
            this.$message({
              type: 'success',
              message: '下架成功'
            })
            this.loadDataListByQueryPage()
          }).catch(() => {
          })
        }
      },
      batchTag () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择商品'
          })
        } else {
          this.$refs.batchTagdlg.show()
        }
      },
      batchCategory () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择商品'
          })
        } else {
          this.$refs.batchCategorydlg.show(this.multipleSelection)
        }
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      deleteProduct (row) {
        this.$confirm('删除商品？商品将一律称为下架状态', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.loading = true
            await ProductApi.deleteProduct(row.id)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.loadDataListByQueryPage()
          } catch (err) {
            this.loading = false
          }
        }).catch(() => {
        })
      },
      changeStatus (row) {
        try {
          if (row.status === 1) {
            this.$confirm('下架商品？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              this.loading = true
              await ProductApi.shelveDown(row.id)
              this.$message({
                type: 'success',
                message: '下架成功'
              })
              this.loadDataListByQueryPage()
            }).catch(() => {
            })
          } else {
            this.$confirm('上架商品？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              this.loading = true
              await ProductApi.shelveUp(row.id)
              this.$message({
                type: 'success',
                message: '上架成功'
              })
              this.loadDataListByQueryPage()
            }).catch(() => {
            })
          }
        } catch (err) {
          this.loading = false
        }
      },
      async changeTop (row) {
        try {
          this.loading = true
          if (row.top_tick === 0) {
            await ProductApi.top(row.id)
            this.$message({
              type: 'success',
              message: '置顶成功'
            })
          } else {
            await ProductApi.cancelTop(row.id)
            this.$message({
              type: 'success',
              message: '已取消置顶'
            })
          }
          this.loadDataListByQueryPage()
        } catch (err) {
          this.loading = false
        }
      },
      handleEdit (product) {
        this.$router.push({
          name: 'PlatformProductEdit',
          params: {
            id: product.id
          }
        })
      },
      toRecycle () {
        this.$router.push({
          name: 'PlatformProductRecycle'
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

  .name {

  }

  .batch {
    margin-left: 15px;
    display: inline-block;
  }

  .recycle {
    display: block;
    margin-top: 10px;
    margin-left: 93%;
  }
</style>
