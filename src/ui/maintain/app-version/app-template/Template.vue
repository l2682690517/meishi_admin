<template lang="pug">
  div
    div.text 最多可添加50个，还可添加{{50-rowList.length}}个
    div
      el-table(:data="dataList", border)
        el-table-column(label="版本号", prop="user_version", width="100px")
        el-table-column(label="描述", prop="user_desc", width="400px")
        el-table-column(label="TemplateID", prop="template_id")
        el-table-column(label="添加到模板库时间", width="200px")
          template(slot-scope="scope")
            div {{scope.row.create_time * 1000 | datetime}}
        el-table-column(label="操作", width="200px")
          template(slot-scope="scope")
            el-button(@click="toDetail(scope.row)", type="primary", size="mini", plain) 详情
</template>

<script>
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
      return {}
    },
    computed: {
      dataList () {
        return this.rowList
      }
    },
    watch: {},
    methods: {
      toDetail (row) {
        this.$router.push({
          name: 'AppTemplateDetail',
          params: {
            rowItem: row
          }
        })
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
