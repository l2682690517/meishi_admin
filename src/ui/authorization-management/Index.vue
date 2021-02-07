<template lang="pug">
  div(v-loading="loading")
    div.text 平台后台
    div.head
      el-button.head(type="primary", @click="handleAuthGroup(platform)") 添加权限组
      el-table.large-el-table(:data="platformAuthGroupList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="应用的权限数量")
          div(slot-scope="scope") {{scope.row.auth_count }}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleAuthGroup(platform,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope.row)", :disabled="scope.row.auth_count !== 0") 删除
    div.head
      el-button.head(type="primary", @click="handleAuth(platform)") 添加权限
      el-table.large-el-table(:data="platformAuthList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="权限组ID")
          div(slot-scope="scope") {{scope.row.auth_group_id}}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleAuth(platform,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="deleteAuth(scope.row)") 删除
    div.text 店铺后台
    div.head
      el-button.head(type="primary", @click="handleAuthGroup(tenant)") 添加权限组
      el-table.large-el-table(:data="tenantAuthGroupList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="应用的权限数量")
          div(slot-scope="scope") {{scope.row.auth_count}}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleAuthGroup(tenant,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope.row)", :disabled="scope.row.auth_count !== 0") 删除
    div.head
      el-button.head(type="primary", @click="handleAuth(tenant)") 添加权限
      el-table.large-el-table(:data="tenantAuthList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="权限组ID")
          div(slot-scope="scope") {{scope.row.auth_group_id}}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleAuth(tenant,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="deleteAuth(scope.row)") 删除
    auth-group-dialog(ref="dlgAuthGroup", @refresh="refreshData")
    auth-dialog(ref="dlgAuth", @refresh="refreshData")
</template>

<script>
  import * as AuthManagementApi from 'src/api/authorization-management'
  import AuthGroupDialog from 'src/ui/authorization-management/AuthGroupDialog.vue'
  import AuthDialog from 'src/ui/authorization-management/AuthDialog.vue'

  export default {
    props: {},
    components: {
      AuthGroupDialog,
      AuthDialog
    },
    data () {
      return {
        platform: 1,
        tenant: 2,
        platformAuthGroupList: [],
        platformAuthList: [],
        tenantAuthGroupList: [],
        tenantAuthList: [],
        loading: false
      }
    },
    computed: {
    },
    watch: {},
    methods: {
      async deleteAuth (row) {
        this.loading = true
        try {
          await AuthManagementApi.deleteAuth(row.id)
          this.refreshData()
        } finally {
          this.loading = false
        }
      },
      handleAuth (tp, row) {
        this.$refs.dlgAuth.show(tp, row)
      },
      async deleteAuthGroup (row) {
        this.loading = true
        try {
          await AuthManagementApi.deleteAuthGroup(row.id)
          this.refreshData()
        } finally {
          this.loading = false
        }
      },
      handleAuthGroup (tp, row) {
        this.$refs.dlgAuthGroup.show(tp, row)
      },
      getPlatformList () {
        this.getCharacterAuthGroupList(this.platform)
        this.getCharacterAuthList(this.platform)
      },
      getTenantList () {
        this.getCharacterAuthGroupList(this.tenant)
        this.getCharacterAuthList(this.tenant)
      },
      async getCharacterAuthGroupList (tp) {
        this.loading = true
        try {
          if (tp === this.platform) {
            let res = await AuthManagementApi.getAuthGroupList(tp)
            this.platformAuthGroupList = res.data.data
          } else {
            let res = await AuthManagementApi.getAuthGroupList(tp)
            this.tenantAuthGroupList = res.data.data
          }
        } finally {
          this.loading = false
        }
      },
      async getCharacterAuthList (tp) {
        this.loading = true
        try {
          if (tp === this.platform) {
            let res = await AuthManagementApi.getAuthList(tp)
            this.platformAuthList = res.data.data
          } else {
            let res = await AuthManagementApi.getAuthList(tp)
            this.tenantAuthList = res.data.data
          }
        } finally {
          this.loading = false
        }
      },
      refreshData () {
        this.getPlatformList()
        this.getTenantList()
      }
    },
    async mounted () {
      this.getPlatformList()
      this.getTenantList()
    }
  }
</script>


<style lang="scss" scoped>
  .head {
    margin-bottom: 20px;
  }
  .text {
    font-size: 22px;
    color: #606266;
    margin-bottom: 20px;
  }
</style>
