<template lang="pug">
  div
    el-dialog(title="选择标签", width="40%", :visible.sync="dialogVisible", v-loading="loading")
      el-checkbox-group(v-model="chooseTags")
        div.group-wrapper(v-for="group in allTagGroup", :key="group.id", v-show="group.items && group.items.length > 0" )
          div.group-name {{group.name}}
          div
            el-checkbox(
            v-for="tag in group.items",
            :label="tag", :key="tag.id",
            @click.native="changeIndeterminate(tag)",
            :indeterminate="tag.indeterminate"
            ) {{tag.name}}
          div.create-tag-wrapper
            el-button.create-tag(size="small", type="primary", icon="plus", @click="createTag(group)") 添加
      div.dialog-footer
        el-button(@click="dialogVisible = false") 取 消
        el-button(type="primary", @click="submitForm") 确 定
    edit-tag-dialog(ref="editTagDlg", @refresh="show")
</template>

<script>
  import * as TagApi from 'src/api/tag'
  import EditTagDialog from 'src/ui/product/tag/EditDialog.vue'

  export default {
    props: {
      origin: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {EditTagDialog},
    data () {
      return {
        dialogVisible: false,
        loading: false,
        chooseTags: [],
        allTagGroup: [],
        originIndeterminateTags: [],
        originAddTags: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      async show () {
        this.dialogVisible = true
        await this.getTagGroupList()
        this.preparePage()
      },
      hide () {
        this.dialogVisible = false
      },
      submitForm () {
        let addTags = this.chooseTags.map(item => {
          return item.id
        })
        let currentIndeterminateTags = this._findCurrentIndeterminateTags().map(item => {
          return item.id
        })
        let deleteTags = []
        this.originIndeterminateTags.forEach(item => {
          if (addTags.indexOf(item) === -1 && currentIndeterminateTags.indexOf(item) === -1) {
            deleteTags.push(item)
          }
        })
        this.originAddTags.forEach(item => {
          if (addTags.indexOf(item) === -1 && deleteTags.indexOf(item) === -1) {
            deleteTags.push(item)
          }
        })
        this.$emit('submit', {component: this, add_tags: addTags, del_tags: deleteTags})
      },
      _findCurrentIndeterminateTags () {
        let tags = []
        this.allTagGroup.forEach((group) => {
          if (group.tags && group.tags instanceof Array) {
            group.tags.forEach((tag) => {
              if (tag.indeterminate) {
                tags.push(tag)
              }
            })
          }
        })
        return tags
      },
      async getTagGroupList () {
        try {
          this.loading = true
          let res = await TagApi.getTagGroup()
          this.allTagGroup = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      preparePage () {
        this.originIndeterminateTags = []
        this.originAddTags = []
        let originLength = this.origin.length
        let tagobjs = this._initIndeterminate()
        let choose = []
        this.allTagGroup.forEach((group) => {
          if (group.items && group.items instanceof Array) {
            group.items.forEach((tag) => {
              tag.indeterminate = false // 默认非半选
              let tagobj = tagobjs.find((item) => {
                return item.id === tag.id
              })
              if (tagobj) {
                tag.indeterminate = tagobj.total < originLength
                // 保存原始的半选tag
                if (tag.indeterminate) {
                  this.originIndeterminateTags.push(tag.id)
                }
                if (tagobj.total === originLength) {
                  choose.push(tag)
                  this.originAddTags.push(tag.id)
                }
              }
            })
          }
        })
        this.chooseTags = choose
      },
      _initIndeterminate () {
        let tags = []
        this.origin.forEach((item) => {
          if (item && item.tags) {
            item.tags.forEach((tag) => {
              let tagobj = tags.find((obj) => {
                return obj.id === tag.id
              })
              if (!tagobj) {
                tags.push({id: tag.id, total: 1})
              } else {
                tagobj.total++
              }
            })
          }
        })
        return tags
      },
      changeIndeterminate (tag) {
        tag.indeterminate = false
      },
      createTag (group) {
        this.$refs.editTagDlg.show(undefined, group.id)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .dialog-footer {
  margin-top: 20px;
  }
</style>
