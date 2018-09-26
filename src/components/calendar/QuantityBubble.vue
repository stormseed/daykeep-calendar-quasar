<template>
  <div
    class="quantity-bubble-holder"
    v-if="quantity > 0"
  >
    &nbsp;
    <div :class="bubbleClass">
      <div class="quantity-value">
        {{ quantity }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      quantity: {
        type: Number,
        default: 0
      },
      backgroundColor: {
        type: String,
        default: 'primary'
      },
      textColor: {
        type: String,
        default: 'white'
      },
      offset: {
        type: Boolean,
        default: true
      }
    },
    filters: {},
    computed: {
      bubbleClass: function () {
        let returnVal = {
          'quantity-bubble': true,
          'row': true,
          'col': true,
          'items-center': true,
          'justify-center': true,
          'shadow-1': true
        }
        returnVal['bg-' + this.backgroundColor] = true
        returnVal['text-' + this.textColor] = true
        if (this.offset) {
          returnVal['quantity-bubble-offset'] = true
        }
        return returnVal
      }
    },
    methods: {},
    components: {},
    data () {
      return {}
    }
  }
</script>

<style lang="stylus">
  .quantity-bubble-holder
    position relative
    display inline-block
    .quantity-bubble
      border-radius 50%
      font-size 0.75em
      text-align center
      font-weight bold
      height 2em
      width 2em
      position absolute
      top 2px
      left 2px
      .quantity-value
        vertical-align middle
    .quantity-bubble-offset
      bottom 0.25em
      left -0.25em
</style>
