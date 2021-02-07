<template lang="pug">
  div
    el-form(ref="frmSearch", :inline="true")
      el-form-item(label="")
        el-checkbox(v-model="formData.top") 置顶
      el-form-item(label="")
        el-radio-group(v-model="formData.status")
          el-radio-button(:label="0") 全部
          el-radio-button(:label="1") 已上架
          el-radio-button(:label="3") 缺货
          el-radio-button(:label="2") 已下架
      el-form-item(label="", prop="category_id")
        el-select(v-model="formData.category_id", placeholder="请选择分类", clearable)
          el-option-group(v-for!="parentItem in allCategories", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for!="childItem in parentItem.children", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="", prop="tags")
        el-select(v-model="formData.tags", placeholder="请选择标签", multiple)
          el-option-group(v-for="parentItem in allTags", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for="childItem in parentItem.items", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="上架:")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item(label="")
        el-input(v-model.trim="formData.text", placeholder="商品名/ID/编码")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import * as CategoryApi from 'src/api/category'
  import * as TagApi from 'src/api/tag'
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

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
          top: false,
          status: 0,
          category_id: '',
          start: 0,
          end: 0,
          text: '',
          tags: []
        },
        // endregion
        initialData: null,
        allCategories: [],
        allTags: [],
        defaultDate: []
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
        this.getCategoryList()
        this.getTagsList()
      },
      async getTagsList () {
        const resTagsList = await TagApi.getTagGroup()
        this.allTags = resTagsList.data.data
      },
      async getCategoryList () {
        const resCategory = await CategoryApi.getList()
        this.allCategories = resCategory.data.data
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
          top: this.queryParams.top,
          category_id: this.queryParams.category_id,
          status: this.queryParams.status,
          start: this.R_.parseDateTick(0, this.queryParams.start),
          end: this.R_.parseDateTick(0, this.queryParams.end),
          text: this.queryParams.text,
          tags: this.queryParams.tags
        }
        if (this.formData.start && this.formData.end) {
          this.defaultDate = [this.formData.start, this.formData.end]
        } else {
          this.defaultDate = []
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
