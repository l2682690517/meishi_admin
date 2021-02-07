<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="店铺：")
        el-select(v-model="model.tenant_id",
        filterable,
        clearable,
        :loading="selectLoading",
        placeholder="店铺/ID"
        )
          el-option(v-for="item in tenantList",
          :key="item.id",
          :label="item.principal_name_id",
          :value="item.id")
      el-form-item.input
        el-input.medium-el-input(v-model.trim="model.key", placeholder="名字/手机号/公司/店铺管理员ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="submit") 搜索
</template>

<script>
  import * as TenantApi from 'src/api/tenant'
  import { getTenantNameId } from 'src/service/other/index'

  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            tenant_id: '',
            key: ''
          }
        }
      }
    },
    components: {},
    data () {
      return {
        selectLoading: false,
        tenantList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      submit () {
        this.$emit('submit', this.model)
      },
      async getTenantList () {
        try {
          this.selectLoading = true
          let res = await TenantApi.getListAll()
          res = res.data.data
          this.tenantList = getTenantNameId(res)
          this.selectLoading = false
        } catch (err) {
          this.selectLoading = false
        }
      }
    },
    mounted () {
      this.getTenantList()
    }
  }
</script>


<style lang="scss" scoped>
  .input {
    margin-left: 20px;
  }

  @import "../../../assets/scss/el";
</style>
