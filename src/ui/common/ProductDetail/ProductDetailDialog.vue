<template lang="pug">
  div
    el-dialog(title="商品详情",
    :visible.sync="dialogVisible",
    width="750px",
    )
      div(v-loading="loading")
        product-detail(:rowFormData="formData", :isPrompt="prompt")
</template>

<script>
  import ProductDetail from './Index'
  import * as ProductApi from 'src/api/product'
  import * as TenantSelfProductApi from 'src/api/tenant-self-product'
  import * as TenantApi from 'src/api/tenant'

  export default {
    props: {},
    components: {ProductDetail},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        formData: {},
        prompt: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (item, needPrompt, tid) {
        if (needPrompt) {
          this.prompt = needPrompt
        }
        this.dialogVisible = true
        this.getDetail(item.id, item.tp, tid)
      },
      async getDetail (id, tp, tid) {
        try {
          this.loading = true
          let res = ''
          if (tp === 1) {
            res = await ProductApi.getItem(id)
          } else if (tid) {
            res = await TenantApi.getTenantProductDetail(tid, id)
          } else {
            res = await TenantSelfProductApi.getTenantSelfItem(id)
          }
          this.formData = res.data
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
