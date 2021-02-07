<template lang="pug">

  mixin imageContent
    div.image-content(v-if!="props.row.tp === allContentTp.img.value", v-lazy:background-image="props.row.url")
  mixin textContent
    div.text-content(v-if!="props.row.tp === allContentTp.text.value")
      el-form-item.show-validate-el-form(:ref="`text${props.index}`", :prop="'content.' + props.index + '.text'", :rules="formRules.text")
        el-input(v-model.trim="props.row.text",  :maxlength="26")

  div
    smart-table.medium-el-table(ref="contentTable", :dataList="content", :showHeader="false",  @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      smart-table-column(type="drag")
      smart-table-column(label="内容")
        div(slot-scope="props")
          +imageContent
          +textContent
      smart-table-column(label="", width="120px")
        div(slot-scope="props")
          el-button(type="danger", size="mini", plain, @click="handleDel(props.index)") 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleCreate") 添加
      el-button(type="primary", size="mini", plain, @click="preview") 预览
    create-content-dialog(ref="dlgCreateContent", @success="handleCreateSuccess")
    preview-dialog(ref="dlgPreview", :resources="content")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import {SmartTable, SmartTableColumn} from '@baibao/zeratul'
  import CreateContentDialog from './CreateContentDialog.vue'
  import * as ResourceService from 'src/service/resource/index'
  import PreviewDialog from 'src/ui/common/preview/PreviewDialog.vue'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn,
      CreateContentDialog,
      PreviewDialog
    },
    props: {
      content: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        formRules: {
          text: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 26, message: '最多可以输入26个字符', trigger: 'blur'}
          ]
        },
        createAtPos: -1,
        ...$global.$mapConst({
          'allContentTp': ResourceService.allTp
        })
      }
    },
    methods: {
      handleDragChange (dataList) {
        this.$emit('update:content', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      preview () {
        this.$refs.dlgPreview.show()
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.content) {
          this.$refs[`text${i}`] && this.$refs[`text${i}`].clearValidate()
        }
      },
      handleCreate () {
        this.createAtPos = this.content.length
        this.$refs.dlgCreateContent.show()
      },
      handleCreateSuccess (data) {
        if (this.createAtPos < 0 || this.createAtPos >= this.content.length) {
          this.content.push({...data})
        } else {
          this.content.splice(this.createAtPos, 0, {...data})
        }
      },
      handleDel (index) {
        this.content.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-content {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }
</style>
