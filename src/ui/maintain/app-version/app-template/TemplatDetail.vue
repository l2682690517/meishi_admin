<template lang="pug">
  div
    el-form(labelWidth="100px")
      el-form-item(label="版本号")
        div.item {{itemData.user_version}}
      el-form-item(label="描述")
        div.item {{itemData.user_desc}}
      el-form-item(label="TemplateID")
        div.item {{itemData.template_id}}
      el-form-item(label="来源小程序")
        div.item {{itemData.source_miniprogram}}
      el-form-item(label="小程序AppID")
        div.item {{itemData.source_miniprogram_appid}}
      el-form-item(label="添加时间")
        div.item {{itemData.create_time * 1000 | datetime}}
      el-form-item(label="开发者")
        div.item {{itemData.developer}}
      el-form-item(label="")
        div.bottomBtn(v-if="itemData.template_id || itemData.template_id === 0")
          el-button(v-loading="loading", type="primary", @click="newVersion(itemData.template_id,itemData.user_version,itemData.user_desc)") 发版
          el-button.margin(v-loading="loading", type="danger", @click="deleteVersion(itemData.template_id)") 从模板库删除
</template>

<script>
  import * as AppVersionApi from 'src/api/app-version'

  export default {
    props: {},
    components: {},
    data () {
      return {
        itemData: {},
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      async deleteVersion (id) {
        try {
          this.loading = true
          await AppVersionApi.deleteTemplate(id)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$router.back()
        } finally {
          this.loading = false
        }
      },
      newVersion (id, version, desc) {
        this.$confirm(`TemplateID: ${id}`, '发版', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true
          await AppVersionApi.newVersion(id, version, desc)
          this.$message({
            type: 'success',
            message: '已发版'
          })
          this.$router.back()
        }).catch(() => {
        })
      }
    },
    mounted () {
      this.itemData = this.$route.params.rowItem
    }
  }
</script>


<style lang="scss" scoped>
  .item {
    margin-left: 100px;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    color: #606266;
  }

  .bottomBtn {
    margin-left: 100px;
  }

  .margin {
    margin-left: 20px;
  }
</style>
