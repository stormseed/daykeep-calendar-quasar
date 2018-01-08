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
            <slot />
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
  // import moment from 'moment'
  // import CalendarMixin from './CalendarMixin'
  import {
    QBtn,
    Events
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
    // mixins: [CalendarMixin],
    data () {
      return {}
    },
    computed: {},
    methods: {
      doMoveTimePeriod (timePeriodUnit, timePeriodAmount) {
        // console.debug('doMoveTimePeriod called, this = ', this)
        Events.$emit(
          this.moveTimePeriodEmit,
          timePeriodUnit,
          timePeriodAmount
        )
        // if (this.moveFunction !== undefined) {
        //   this.moveFunction(timePeriodUnit, timePeriodAmount)
        // }
        // if (this.moveTimePeriod !== undefined) {
        //   this.moveTimePeriod(timePeriodUnit, timePeriodAmount)
        // }
        // else {
        //   this.$parent.moveTimePeriod(timePeriodUnit, timePeriodAmount)
        // }
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