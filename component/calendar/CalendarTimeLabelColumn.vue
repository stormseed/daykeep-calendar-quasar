<template>
  <div class="calendar-day-column-label col-auto">
    <template
      v-for="thisHour in 24"
    >
      <div
        class="relative-position calendar-day-time"
        :key="thisHour"
        :style="{ 'height': calcDayCellHeight, 'max-height': calcDayCellHeight }"
      >
        <div class="time-label">
          {{ formatTimeFromNumber(thisHour - 1) }}
        </div>
      </div>
      <div
        v-if="showHalfHours"
        :key="thisHour"
        class="calendar-day-time cdcl-half-hour"
        :style="{ 'height': calcDayCellHeight, 'max-height': calcDayCellHeight }"
      >
        <div class="time-label">
          :30
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    CalendarMixin
  } from './mixins'
  import DateTime from 'luxon/src/datetime'
  const debug = require('debug')('calendar:CalendarTimeLabelColumn')
  export default {
    name: 'CalendarTimeLabelColumn',
    props: {
      dayCellHeight: {
        type: Number,
        default: 5
      },
      dayCellHeightUnit: {
        type: String,
        default: 'rem'
      },
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      },
      showHalfHours: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      calcDayCellHeight: function () {
        if (this.showHalfHours) {
          return (this.dayCellHeight / 2) + this.dayCellHeightUnit
        }
        else {
          return this.dayCellHeight + this.dayCellHeightUnit
        }
      }
    },
    components: {},
    mixins: [CalendarMixin],
    data () {
      return {}
    },
    methods: {},
    mounted () {
      debug('Component mounted')
    }
  }
</script>

<style lang="stylus">
  .calendar-day-column-label
    .calendar-day-time
      position relative
      .time-label
        position absolute
        top -10px
        right 20px
    .cdcl-half-hour
      font-size 0.75em
      text-align right
      .time-label
        top -6px
        right 20px
</style>
