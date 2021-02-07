<template lang="pug">
  div
    div.text 每个小程序只保留最新一次的上传记录
    div
      el-table(:data="dataList", v-loading="loading", border)
        el-table-column(label="版本号", prop="user_version", width="100px")
        el-table-column(label="描述", prop="user_desc", width="400px")
        el-table-column(label="来源小程序", prop="source_miniprogram")
        el-table-column(label="最近上传开发者", prop="developer")
        el-table-column(label="最近提交时间", width="200px")
          template(slot-scope="scope")
            div {{scope.row.create_time * 1000 | datetime}}
        el-table-column(label="操作", width="200px")
          template(slot-scope="scope")
            el-button(@click="addToTemplate(scope.row)", type="primary", size="mini" , plain) 添加到模板库
</template>

<script>
  import * as AppVersionApi from 'src/api/app-version'

  export default {
    props: {
      rowList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    components: {},
    data () {
      return {
        loading: false
      }
    },
    computed: {
      dataList () {
        return this.rowList
      }
    },
    watch: {},
    methods: {
      async addToTemplate (row) {
        try {
          this.loading = true
          await AppVersionApi.AddDraftToTemplate(row.draft_id)
          this.$message({
            message: '已添加到模板',
            type: 'success'
          })
          this.$emit('refresh')
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  .text {
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    color: #606266;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
