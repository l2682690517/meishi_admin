<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item()
        el-input.tiny-x-el-input(v-model="formData.text", placeholder="名称/手机号")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  export default {
    components: {},
    props: {
      queryParams: {}
    },
    data () {
      return {
        // region query
        formData: {
          text: ''
        },
        // endregion
        initialData: null
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      async initData () {
        this.initialData = this.R.clone(this.formData)
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = this.R_.updateWithObj(this.formData, this.queryParams)
      }
    },
    async mounted () {
      await this.initData()
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>
</style>
