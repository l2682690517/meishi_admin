<template lang="pug">
  div
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="78px", v-loading="loading")
      el-form-item(label="名称", prop="name")
        el-input.small-el-input(v-model.trim="formData.name", placeholder="最多10个字", :maxlength="10")
      el-form-item(label="选择地区", prop="include", :required="true")
        div
          el-radio.radio(v-model="formData.include", :label="false") 无法配送
          el-radio.radio(v-model="formData.include", :label="true") 可配送
        div.province
          el-table(ref="tabProvince", :data="allProvince", :height="200", :show-header="false", @selection-change="handleSelectionChange")
            el-table-column(type="selection", width="63")
            el-table-column
              template(slot-scope="scope")  {{scope.row}}
      el-form-item
        el-button(@click="$router.back()") 取 消
        el-button(type="primary", @click="submit") 确 定
</template>

<script>
  import * as AddressUtil from 'src/util/addressUtil'
  import * as DRegionApi from 'src/api/delivery-region'

  export default {
    props: {},
    components: {},
    data () {
      const validateInclude = (rule, value, callback) => {
        if (this.formData.province.length === this.allProvince.length) {
          callback(new Error('不能选择全部的地区'))
          return
        }
        if (this.formData.province.length === 0) {
          callback(new Error('请选择地区'))
          return
        }
        callback()
      }

      return {
        loading: false,
        formData: {
          id: 0,
          name: '',
          include: false,
          province: []
        },
        formRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ],
          include: [
            {validator: validateInclude, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'DeliveryRegionEdit'
      },
      allProvince () {
        return AddressUtil.allProvince
      }
    },
    watch: {},
    methods: {
      handleSelectionChange (val) {
        this.formData.province = val
      },
      async getEditItem () {
        if (this.isEditMode) {
          try {
            this.loading = true
            const res = await DRegionApi.getItem(this.$route.params.id)
            Object.assign(this.formData, res.data)
            this.$nextTick(() => {
              this.formData.province.slice(0).forEach((item) => {
                if (this.allProvince.indexOf(item) !== -1) {
                  this.$refs.tabProvince.toggleRowSelection(item, true)
                }
              })
            })
            this.loading = false
          } catch (err) {
            this.loading = false
          }
        }
      },
      async update () {
        try {
          this.loading = true
          await DRegionApi.editIem(this.formData)
          this.$message({
            message: '编辑成功',
            showClose: true,
            type: 'success'
          })
          this.$router.back()
        } catch (err) {
          this.loading = false
        }
      },
      async create () {
        try {
          this.loading = true
          await DRegionApi.createItem(this.formData)
          this.$message({
            message: '创建成功',
            showClose: true,
            type: 'success'
          })
          this.$router.back()
        } catch (err) {
          this.loading = false
        }
      },
      submit () {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            try {
              if (this.isEditMode) {
                this.update()
              } else {
                this.create()
              }
            } catch (err) {
            }
          }
        })
      }
    },
    mounted () {
      this.getEditItem()
    }
  }
</script>


<style lang="scss" scoped>
  .province {
    width: 250px;
    border: 1px solid #e6ebf5;
  }
</style>
