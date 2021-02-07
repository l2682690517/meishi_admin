<template lang="pug">
  div
    smart-table.large-el-table(ref="skuTable", :dataList="skus", @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      smart-table-column(type="drag")
      smart-table-column(label="规格")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`spec{props.index}`", :prop="'skus.' + props.index + '.spec'", :rules="formRules.spec")
            el-input(v-model.trim="props.row.spec")
      smart-table-column(label="建议售价")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`suggest_price${props.index}`", :prop="'skus.' + props.index + '.suggest_price'", :rules="formRules.suggest_price")
            el-input(v-model.trim="props.row.suggest_price")
      smart-table-column(label="库存")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`stock${props.index}`", :prop="'skus.' + props.index + '.stock'", :rules="formRules.stock")
            el-input(v-model.trim="props.row.stock")
      smart-table-column(label="编码")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`code${props.index}`", :prop="'skus.' + props.index + '.code'", :rules="formRules.code")
            el-input(v-model.trim="props.row.code")
      smart-table-column(label="图片", width="80px")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`image${props.index}`", :prop="'skus.' + props.index + '.image'", :rules="formRules.image")
            upload-image(:ref="`uploadImage${props.index}`", :image.sync="props.row.image", size="50px", addIconSize="20px", :host="getHost", :token="getToken")
      smart-table-column(label="", width="80px")
        div(slot-scope="props")
          el-button(type="danger", size="mini", plain, @click="handleDelSku(props.index)") 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleAddSku") 添加商品规格
      span.input-right-desc 商品编码不能重复，且必须首先在ERP系统上线，否则将无法发货
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import emitter from 'element-ui/src/mixins/emitter'
  import { SmartTable, SmartTableColumn, UploadImage } from '@baibao/zeratul'
  import { nonZeroIntegerValidator } from 'src/util/validator'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn,
      UploadImage
    },
    props: {
      skus: {
        type: Array,
        required: true
      },
      supplyPrice: {
        type: String,
        required: true
      },
      stPrice: {
        type: String,
        required: true
      }
    },
    data () {
      const suggestPriceValidator = (rule, value, callback) => {
        if (!this.R_.isPrice(value)) {
          callback(new Error('不正确的价格'))
          return
        }
        const suggestPrice = this.R_.convertYuanToFen(value)
        if (this.R_.isPrice(this.supplyPrice)) {
          const sp = this.R_.convertYuanToFen(this.supplyPrice)
          if (suggestPrice < sp) {
            callback(new Error('不能小于供货价'))
            return
          }
        }
        if (this.R_.isPrice(this.stPrice)) {
          const st = this.R_.convertYuanToFen(this.stPrice)
          if (suggestPrice > st) {
            callback(new Error('不能大于划线价'))
            return
          }
        }
        callback()
      }
      return {
        formRules: {
          spec: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          suggest_price: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: suggestPriceValidator, trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: nonZeroIntegerValidator, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleDragChange (dataList) {
        this.$emit('update:skus', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.skus) {
          const item = this.skus[i]
          Object.keys(item).forEach(async (k) => {
            await this.$nextTick()
            this.$refs[`${k}${i}`] && this.$refs[`${k}${i}`].clearValidate()
          })
        }
      },
      async handleAddSku () {
        this.skus.push(
          {
            spec: '',
            suggest_price: '',
            stock: '',
            code: '',
            image: {
              url: '',
              width: 0,
              height: 0
            }
          }
        )
        await this.$nextTick()
        this.dispatch('ElFormItem', 'el.form.change', [this.skus])
      },
      async handleDelSku (index) {
        this.skus.splice(index, 1)
        await this.$nextTick()
        this.dispatch('ElFormItem', 'el.form.change', [this.skus])
      },
      isUpdating () {
        for (const i in this.skus) {
          if (this.$refs[`uploadImage${i}`] && this.$refs[`uploadImage${i}`].isUpdating) {
            return true
          }
        }
        return false
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    }
  }
</script>

<style lang="scss" scoped>
  .skus-table {
    width: 700px;
  }
</style>
