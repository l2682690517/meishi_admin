<template lang="pug">
  el-date-picker(type="daterange", range-separator="至", start-placeholder="开始日期", end-placeholder="结束日期", :picker-options="pickerOptions", align="right", unlink-panels, v-bind!="$attrs", v-on!="$listeners",  v-model="chooseDate")
</template>

<script>
  export default {
    props: {
      defaultDate: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        chooseDate: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    watch: {
      defaultDate (newVal) {
        this.chooseDate = newVal
      }
    },
    created () {
      this.chooseDate = this.defaultDate
    }
  }
</script>
