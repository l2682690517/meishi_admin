<template lang="pug">
  div
    div
      router-link(:to="{name:'DeliveryRegioncCreate'}")
        el-button(type="primary") 添加
    div(v-loading="loading")
      div(v-for="item in dataList")
        div
          el-card.box-card
            div.clearfix(slot="header")
              span {{item.name}}
              div(style="float: right; height:22px;")
                span.head-pc {{item.pc}}款商品
                el-button(size="mini", style="float: right", :disabled="item.pc!==0", type="danger", @click="deleteItem(item)", plain) 删除
                el-button(size="mini", style="float: right;margin-right: 10px;", type="primary", @click="editItem(item)", plain) 编辑
            div.text {{regionText(item)}}

</template>

<script>
  import * as DRegionApi from 'src/api/delivery-region'
  import * as AddressUtil from 'src/util/addressUtil'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dataList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      regionText (row) {
        if (row.include) {
          if (row.province.length < AddressUtil.allProvince.length / 2) {
            return `配送范围支持${row.province.join('、')}。`
          } else {
            let provinceArr = AddressUtil.reverseProvince(row.province)
            return `配送范围支持除${provinceArr.join('、')}以外的中国大陆地区。`
          }
        } else {
          if (row.province.length < AddressUtil.allProvince.length / 2) {
            return `配送范围支持除${row.province.join('、')}以外的中国大陆地区`
          } else {
            let provinceArr = AddressUtil.reverseProvince(row.province)
            return `配送范围支持${provinceArr.join('、')}。`
          }
        }
      },
      editItem (row) {
        this.$router.push({
          name: 'DeliveryRegionEdit',
          params: {
            id: row.id
          }
        })
      },
      deleteItem (row) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.loading = true
            await DRegionApi.deleteItem(row.id)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } catch (err) {
            this.loading = false
          }
          this.refreshDataList()
        }).catch(() => {
        })
      },
      async refreshDataList () {
        try {
          this.loading = true
          let res = await DRegionApi.getList()
          this.dataList = res.data.data
          this.loading = false
        } catch (err) {}
      }
    },
    mounted () {
      this.refreshDataList()
    }
  }
</script>


<style lang="scss" scoped>
  .head-pc {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix {
    height: 28px;
    line-height: 28px;
    font-size: 20px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-top: 20px;
    width: 480px;
  }
</style>
