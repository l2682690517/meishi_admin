<template lang="pug">
  div
    el-dialog(title="上架店铺", :visible.sync="dialogVisible")
      div(v-loading="loading")
        div.name {{name}}
        el-table(:data="tenantSelectList", border)
          el-table-column(prop="id", label="店铺ID")
          el-table-column(prop="name", label="店铺")
          el-table-column(prop="sold", label="销量")
</template>

<script>
  import * as ProductApi from 'src/api/product'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        tenantSelectList: [],
        name: ''
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.dialogVisible = true
        this.name = row.name
        this.getList(row.id)
      },
      hide () {
        this.dialogVisible = false
      },
      async getList (id) {
        try {
          this.loading = true
          let res = await ProductApi.getTenantSelectList(id)
          this.tenantSelectList = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  .name {
    padding-left: 5px;
    height: 50px;
  }

</style>
