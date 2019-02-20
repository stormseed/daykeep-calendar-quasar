<template>
  <div class="calendar-day-column-label col-auto">
    <div
      class="calendar-day-time"
      v-for="thisHour in 24"
      :key="thisHour"
      :style="{ 'height': dayCellHeight, 'max-height': dayCellHeight }"
    >
      {{ formatTimeFromNumber(thisHour - 1) }}
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin
  } from './mixins'
  import DateTime from 'luxon/src/datetime'
  export default {
    name: 'CalendarTimeLabelColumn',
    props: {
      dayCellHeight: {
        type: String,
        default: '5rem'
      },
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      }
    },
    components: {},
    mixins: [CalendarMixin],
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {}
  }
</script>

<style lang="stylus">
</style>
