<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="状态：")
        el-select(v-model="formData.app_status", clearable)
          el-option(v-for="item in statusList", :key="item.status", :label="item.name", :value="item.status")
      el-form-item(label="商品权限：")
        el-select(v-model="formData.product_auth", clearable)
          el-option(v-for="item in productAuthList", :key="item.product_auth", :label="item.name", :value="item.product_auth")
      el-form-item(label="首次上线：")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item
        el-input(v-model.trim="formData.key", placeholder="店铺名称/店铺ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜&nbsp索
</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

  export default {
    props: {
      queryParams: {}
    },
    components: {
      DatePicker
    },
    data () {
      return {
        formData: {
          app_status: '',
          start: 0,
          end: 0,
          key: '',
          product_auth: ''
        },
        defaultDate: [],
        statusList: [
          {name: '审核中', status: '1'},
          {name: '已上线', status: '2'},
          {name: '已下线', status: '3'},
          {name: '解除授权', status: '4'}
        ],
        productAuthList: [
          {name: '选货/自营', product_auth: '3'},
          {name: '选货', product_auth: '2'},
          {name: '自营', product_auth: '1'}
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
      convertQueryParamsToForm () {
        this.formData = {
          app_status: this.queryParams.app_status,
          start: this.R_.parseDateTick(0, this.queryParams.start),
          end: this.R_.parseDateTick(0, this.queryParams.end),
          key: this.queryParams.key,
          product_auth: this.queryParams.product_auth
        }
        if (this.formData.start && this.formData.end) {
          this.defaultDate = [this.formData.start, this.formData.end]
        } else {
          this.defaultDate = []
        }
      }
    },
    mounted () {
      this.convertQueryParamsToForm()
    }
  }
</script>


<style lang="scss" scoped>

</style>
