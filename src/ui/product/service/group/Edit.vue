<template lang="pug">
  div
    el-dialog(title="服务说明", :visible.sync="dialogVisible", width="30%")
      el-form(ref="form", :model="formData", :rules="rules", label-width="80px", v-loading="loading")
        el-form-item(label="组合名称" prop="name")
          el-input(placeholder="最多10个字", v-model.trim="formData.name", :maxlength="10")
        el-form-item(label="服务选择", prop="")
          el-checkbox-group(v-model="formData.items")
            div.list
              div.item(v-for="item in serviceTagList")
                div.name {{item.name}}
                div.ck
                  el-checkbox(:label="item.id", @change="itemCheckChanged(item)") &nbsp
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取 消
        el-button(type="primary", @click="submit") 确 定
</template>

<script>
  import * as ServiceTagApi from 'src/api/servicetag'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        serviceTagList: [],
        dialogVisible: false,
        originData: '',
        originItemList: [],
        formData: {
          id: 0,
          name: '',
          items: []
        },
        rules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    computed: {
      getId () {

      }
    },
    watch: {},
    methods: {
      itemCheckChanged (originItem) {
        const indexItem = this.originItemList.findIndex((item) => {
          return originItem.id === item.id
        })
        if (indexItem === -1) {
          this.originItemList.push(originItem)
        }
        if (indexItem !== -1) {
          this.originItemList.splice(indexItem, 1)
        }
      },
      show (row) {
        let formData = {
          id: 0,
          name: '',
          items: []
        }
        this.dialogVisible = true
        this.originData = row
        this.formData = formData
        if (row) {
          this.getItem(row)
        } else {
          this.formData = formData
        }
        this.refresh()
      },
      async getItem (row) {
        try {
          this.loading = true
          let res = await ServiceTagApi.getTagGroupItem(row.id)
          res = res.data
          this.formData.id = res.id
          this.formData.name = res.name
          this.originItemList = res.items
          this.formData.items = res.items.map((i) => {
            return i.id
          })
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if (this.originData === undefined) {
              this.$emit('created', this.formData)
              this.dialogVisible = false
            } else {
              this.$emit('updated', this.formData)
              this.dialogVisible = false
            }
          }
        })
      },
      async refresh () {
        try {
          this.loading = true
          let res = await ServiceTagApi.getTagList()
          this.serviceTagList = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      }
    },
    mounted () {}
  }
</script>


<style lang="scss" scoped>
  .list {
    border-top: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    .item {
      height: 40px;
      border-bottom: 1px solid #dcdfe6;
      .name {
        margin-left: 5%;
        display: inline-block;
        width: 80%;
        height: 40px;
      }
      .ck {
        height: 40px;
        display: inline-block;
      }
    }
  }

  .el-checkbox-group {
    font-size: 14px;
  }
</style>
