<template lang="pug">
  div
    tenant-user-form(:mode="create")
</template>

<script>
  import tenantUserForm from 'src/ui/other/tenant-user/Form.vue'

  export default {
    props: {},
    components: {tenantUserForm},
    data () {
      return {
        create: 0
      }
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>


<style lang="scss" scoped>

</style>
