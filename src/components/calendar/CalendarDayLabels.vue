<template>
  <div class="calendar-day-labels row no-wrap justify-end">
    <div
      v-for="thisDay in weekDateArray"
      :key="formatDate(thisDay, 'EEE')"
      :class="{
        'calendar-day-label': true,
        'calendar-cell': true,
        'calendar-day-label-current': isCurrentDayLabel(thisDay),
        'cursor-pointer': calendarDaysAreClickable
      }"
      :style="{
        'width': cellWidth,
        'max-width': cellWidth,
      }"
      @click="handleDayClick(thisDay)"
    >
      {{ formatDate(thisDay, 'EEE') }}
      <div
        v-if="showDates"
        class="calendar-day-label-date"
      >
        {{ formatDate(thisDay, 'd') }}
      </div>
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin
  } from './mixins'
  import DateTime from 'luxon/src/datetime'
  export default {
    name: 'CalendarDayLabels',
    props: {
      startDate: {
        type: [Object, Date],
        default: () => { return new Date() }
      },
      numberOfDays: {
        type: Number,
        default: 7
      },
      showDates: {
        type: Boolean,
        default: false
      },
      forceStartOfWeek: {
        type: Boolean,
        default: false
      },
      fullComponentRef: String,
      sundayFirstDayOfWeek: {
        type: Boolean,
        default: false
      },
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      }
    },
    components: {},
    mixins: [CalendarMixin],
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        // workingDate: new Date(),
        workingDate: DateTime.local(),
        weekDateArray: []
      }
    },
    computed: {
      cellWidth: function () {
        return this.calculateDayCellWidth(this.numberOfDays)
      },
      calendarDaysAreClickable: function () {
        return (this.fullComponentRef && this.fullComponentRef.length > 0)
      }
    },
    methods: {
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
        this.buildWeekDateArray(this.numberOfDays, this.sundayFirstDayOfWeek)
      },
      isCurrentDayLabel: function (thisDay, checkMonthOnly) {
        let now = DateTime.local()
        thisDay = this.makeDT(thisDay)
        if (checkMonthOnly === true) {
          return (
            now.weekday === thisDay.weekday &&
            now.month === thisDay.month
          )
        }
        else {
          return now.hasSame(thisDay, 'day')
        }
      },
      handleDayClick: function (dateObject) {
        if (this.fullComponentRef) {
          this.fullMoveToDay(dateObject)
        }
      }
    },
    mounted () {
      this.mountSetDate()
    },
    watch: {
      startDate: 'handleStartChange'
    }
  }
</script>

<style lang="stylus">
  .calendar-day-labels
    .calendar-day-label
      font-size 1.1em
      padding-left 4px
      .calendar-day-label-date
        font-size 1.75em
    .calendar-day-label-current
      font-weight bold

</style>
