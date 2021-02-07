<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item
        el-select(v-model="formData.audit_status", clearable, placeholder="审核状态")
          el-option(v-for="item in statusList", :key="item.status", :label="item.name", :value="item.status")
      el-form-item
        el-input(v-model.trim="formData.key", placeholder="店铺名称/店铺ID")
      el-form-item
        el-select(v-model="formData.online_template_id", clearable, placeholder="线上版本", :loading="loading")
          el-option(v-for="item in onLineList", :key="item", :value="item")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜&nbsp索
</template>

<script>
  import * as AppVersionApi from 'src/api/app-version'

  export default {
    props: {
      queryParams: {}
    },
    components: {},
    data () {
      return {
        loading: false,
        formData: {
          audit_status: 0,
          online_template_id: 0,
          key: ''
        },
        onLineList: [],
        statusList: [
          {name: '审核成功', status: '1'},
          {name: '审核中', status: '2'},
          {name: '审核失败', status: '3'},
          {name: '上线失败', status: '4'},
          {name: '上线成功', status: '5'}
        ]
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      convertQueryParamsToForm () {
        this.formData.audit_status = this.queryParams.audit_status
        this.formData.online_template_id = this.queryParams.online_template_id
        this.formData.key = this.queryParams.key
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      async getOnlineIdList () {
        try {
          this.loading = true
          let res = await AppVersionApi.getOnlineList()
          this.onLineList = Array.from(new Set(res.data))
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.convertQueryParamsToForm()
      this.getOnlineIdList()
    }
  }
</script>


<style lang="scss" scoped>

</style>
