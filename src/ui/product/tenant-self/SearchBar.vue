<template lang="pug">
  div
    el-form(ref="frmSearch", :inline="true")
      el-form-item(label="首次上架:")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item(label="店铺：")
        el-select(v-model="formData.tenant_id",
        filterable,
        clearable,
        :loading="selectLoading",
        placeholder="店铺/ID"
        )
          el-option(v-for="item in tenantList",
          :key="item.id",
          :label="item.principal_name_id",
          :value="item.id")
      el-form-item(label="")
        el-input(v-model.trim="formData.text", placeholder="商品名/ID/编码")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'
  import * as TenantApi from 'src/api/tenant'
  import { getTenantNameId } from 'src/service/other/index'

  export default {
    components: {
      DatePicker
    },
    props: {
      queryParams: {}
    },
    data () {
      return {
        // region query
        formData: {
          tenant_id: '',
          start: 0,
          end: 0,
          text: ''
        },
        // endregion
        initialData: null,
        defaultDate: [],
        selectLoading: false,
        tenantList: []
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      initData () {
        this.initialData = this.R.clone(this.formData)
        this.getTenantList()
      },
      changeDate (event) {
        if (event && event.length === 2) {
          this.formData.start = event[0].getTime()
          this.formData.end = event[1].getTime()
        } else {
          this.formData.start = 0
          this.formData.end = 0
        }
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.defaultDate = []
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = {
          start: this.R_.parseDateTick(0, this.queryParams.start),
          end: this.R_.parseDateTick(0, this.queryParams.end),
          text: this.queryParams.text,
          tenant_id: this.queryParams.tenant_id
        }
        if (this.formData.start && this.formData.end) {
          this.defaultDate = [this.formData.start, this.formData.end]
        } else {
          this.defaultDate = []
        }
      },
      async getTenantList () {
        let params = {
          limit: 50
        }
        try {
          this.selectLoading = true
          let res = await TenantApi.getList(params)
          res = res.data.data
          this.tenantList = getTenantNameId(res)
          this.selectLoading = false
        } catch (err) {
          this.selectLoading = false
        }
      }
    },
    async mounted () {
      this.initData()
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>
</style>
