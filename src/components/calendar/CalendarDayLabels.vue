<template>
    <div class="calendar-day-labels row no-wrap justify-end">
        <div
            v-for="thisDay in weekDateArray"
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
            {{ formatDate(thisDay, 'ddd') }}
            <div
                v-if="showDates"
                class="calendar-day-label-date"
            >
                {{ formatDate(thisDay, 'D') }}
            </div>
        </div>
    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import { date } from 'quasar'
  export default {
    name: 'CalendarDayLabels',
    props: {
      startDate: {
        type: Date,
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
      fullComponentRef: String
    },
    components: {},
    mixins: [CalendarMixin],
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: new Date(),
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
        this.buildWeekDateArray()
      },
      isCurrentDayLabel: function (thisDay, checkMonthOnly) {
        let now = new Date()
        // console.debug('isCurrentDayLabel called', thisDayNum, date.getDayOfWeek(now))
        if (checkMonthOnly === true) {
          return (
            date.getDayOfWeek(now) === date.getDayOfWeek(thisDay) &&
            now.getMonth() === thisDay.getMonth()
          )
        }
        else {
          return (date.isSameDate(now, thisDay, 'day'))
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