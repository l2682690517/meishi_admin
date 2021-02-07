<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item
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
      el-form-item(label="首次访问：")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item(label="")
        el-input(v-model.trim="formData.key", placeholder="用户昵称/ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import * as TenantApi from 'src/api/tenant'
  import { getTenantNameId } from 'src/service/other/index'
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

  export default {
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            tenant_id: '',
            key: '',
            start: new Date().getTime(),
            end: new Date().getTime()
          }
        }
      }
    },
    components: {DatePicker},
    data () {
      return {
        formData: {
          tenant_id: '',
          key: '',
          start: new Date().getTime(),
          end: new Date().getTime() + 86400000
        },
        defaultDate: [],
        tenantList: [],
        initialDataL: null,
        selectLoading: false
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
        this.convertQueryParamsToForm()
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
      },
      handleSearch () {
        this.$emit('submit', this.formData)
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
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.defaultDate = []
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = {
          tenant_id: this.queryParams.tenant_id,
          start: this.R_.parseDateTick(0, this.queryParams.start),
          end: this.R_.parseDateTick(0, this.queryParams.end),
          key: this.queryParams.key
        }
        if (this.formData.start && this.formData.end) {
          this.defaultDate = [this.formData.start, this.formData.end]
        } else {
          this.defaultDate = []
        }
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>


<style lang="scss" scoped>

</style>
