<template lang="pug">
  el-menu(mode="vertical", :default-active="$route.path" router)
    template(v-for!="menuItem in menus")
      el-submenu(:index="menuItem.name" v-if!="menuItem.isGroup")
        template(slot="title") {{ menuItem.title }}
        template(v-for!="childItem in menuItem.items")
          el-menu-item(:index!="fullPath(menuItem, childItem)") {{ childItem.meta.title }}
      el-menu-item(v-else :index="menuItem.path") {{ menuItem.meta.title }}
</template>

<script>
  export default {
    computed: {
      menus () {
        const menus = []
        const homeRoute = this.$router.options.routes.find((item) => {
          return item.meta.menu === true
        })
        if (homeRoute) {
          let currentGroup = null
          for (let item of homeRoute.children) {
            if (!item.meta || !item.meta.showInSide) {
              continue
            }
            const currentGroupName = currentGroup ? currentGroup.name : null
            if (!item.meta.group && currentGroupName) {
              currentGroup = null
            } else {
              if (item.meta.group && item.meta.group !== currentGroupName) {
                currentGroup = homeRoute.meta.groups.find(groupItem => {
                  return groupItem.name === item.meta.group
                })
                currentGroup.items = []
                currentGroup.isGroup = true
                menus.push(currentGroup)
              }
            }
            if (!currentGroup) {
              menus.push(item)
            } else {
              currentGroup.items.push(item)
            }
          }
        }
        return menus
      }
    },
    methods: {
      fullPath (menuItem, childItem) {
        return `${menuItem.path}${childItem.path}`
      }
    }
  }
</script>

<style lang="scss">
  .el-menu {
    min-height: 100%;
  }
</style>

