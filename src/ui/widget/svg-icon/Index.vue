<template lang="pug">
  svg.svg-icon(aria-hidden="true")
    use(:xlink:href="iconName")
</template>

<script>
  export default {
    name: 'svg-icon',
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    computed: {
      iconName () {
        return `#icon-${this.icon}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
