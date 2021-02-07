<template lang="pug">
  div
    el-form(labelWidth="150px", v-loading="loading")
      el-form-item
        div.flexBox.small-el-table
          div.head-title
            div 最新发版
            div TemplateID
          div.number {{showTemplateId()}}
          div
            el-button(@click="toChooseTemplate") 选择模板
      el-form-item
        el-table.small-el-table(:data="dataList", :showHeader="false", border)
          el-table-column(label="", prop="name", align="center")
          el-table-column(label="", prop="", align="center")
            template(slot-scope="scope")
              el-button(type="text", @click="toAuditList(scope.row)") {{scope.row.number}}
</template>

<script>
  import * as AppVersionApi from 'src/api/app-version'
  import { getShowList } from 'src/service/maintain/index'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dataList: [],
        template_id: ''
      }
    },
    computed: {},
    watch: {},
    methods: {
      toAuditList (row) {
        this.$router.push({
          name: 'AuditList',
          query: {
            name: row.name
          }
        })
      },
      toChooseTemplate () {
        this.$router.push({
          name: 'AppTemplate'
        })
      },
      showTemplateId () {
        return this.template_id
      },
      async initData () {
        try {
          this.loading = true
          let res = await AppVersionApi.getTotalData()
          this.template_id = res.data.template_id
          this.dataList = getShowList(res.data)
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>


<style lang="scss" scoped>
  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-title {
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .head-title :nth-child(1) {
      font-size: 20px;
      height: 30px;
      line-height: 30px;
    }
    .head-title :nth-child(2) {
      font-size: 12px;
      height: 10px;
      line-height: 10px;
    }
    .number {
      height: 40px;
      font-size: 18px;
      line-height: 40px;
    }
  }
</style>
