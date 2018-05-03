<template>
  <div class="calendar-header col-auto row justify-between items-center">
    <div class="calendar-header-left col-auto">
      <q-btn
        @click="doMoveTimePeriod(timePeriodUnit, -timePeriodAmount)"
        icon="chevron_left"
        color="primary"
        round
        flat
      />
    </div>
    <div class="calendar-header-label">
      <slot/>
    </div>
    <div class="calendar-header-right col-auto">
      <q-btn
        @click="doMoveTimePeriod(timePeriodUnit, timePeriodAmount)"
        icon="chevron_right"
        color="primary"
        round
        flat
      />
    </div>
  </div>
</template>

<script>
  import {
    QBtn
  } from 'quasar'
  export default {
    name: 'CalendarHeaderNav',
    props: {
      timePeriodUnit: {
        type: String,
        default: 'days'
      },
      timePeriodAmount: {
        type: Number,
        default: 1
      },
      moveTimePeriodFunction: Object,
      moveTimePeriodEmit: {
        type: String,
        default: 'calendar:navMovePeriod'
      }
    },
    components: {
      QBtn
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
      doMoveTimePeriod (timePeriodUnit, timePeriodAmount) {
        this.$root.$emit(
          this.moveTimePeriodEmit,
          {
            unitType: timePeriodUnit,
            amount: timePeriodAmount
          }
        )
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus">
  .calendar-header
    .calendar-month-year
      font-size 1.25em
      font-weight bold
</style>
