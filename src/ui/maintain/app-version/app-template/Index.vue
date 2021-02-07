<template lang="pug">
  div(v-loading="loading")
    el-radio-group(v-model="activeName")
      el-radio-button(label="draft") 草稿箱（{{draftLength}}）
      el-radio-button(label="template") 小程序模板库（{{templateLength}}）
    div.content(v-show="activeName === 'draft'")
      app-draft(:rowList="draftDataList", @refresh="refresh")
    div.content(v-show="activeName === 'template'")
      app-template(:rowList="templateDataList")
</template>

<script>
  import AppDraft from 'src/ui/maintain/app-version/app-template/Draft.vue'
  import AppTemplate from 'src/ui/maintain/app-version/app-template/Template.vue'
  import * as AppVersionApi from 'src/api/app-version'

  export default {
    props: {},
    components: {
      AppDraft,
      AppTemplate
    },
    data () {
      return {
        loading: false,
        activeName: 'draft',
        draftDataList: [],
        templateDataList: []
      }
    },
    computed: {
      draftLength () {
        return this.draftDataList.length
      },
      templateLength () {
        return this.templateDataList.length
      }
    },
    watch: {},
    methods: {
      async refreshDraftList () {
        try {
          this.loading = true
          const res = await AppVersionApi.getDraftList()
          if (res.data) {
            this.draftDataList = res.data.draft_list ? res.data.draft_list : []
          }
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      },
      async refreshTemplateList () {
        try {
          this.loading = true
          const res = await AppVersionApi.getTemplateList()
          if (res.data) {
            this.templateDataList = res.data.template_list ? res.data.template_list : []
          }
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      },
      refresh () {
        this.refreshDraftList()
        this.refreshTemplateList()
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>


<style lang="scss" scoped>
  .content {
    margin-top: 20px;
  }
</style>
