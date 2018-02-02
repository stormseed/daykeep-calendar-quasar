<template>
    <div class="calendar-day-labels row no-wrap justify-end">
        <div
            v-for="(thisDayNum, index) in numberOfDays"
            :class="{
              'calendar-day-label': true,
              'calendar-cell': true,
              'calendar-day-label-current': isCurrentDayLabel(thisDayNum)
            }"
            :style="{
              'width': cellWidth,
              'max-width': cellWidth,
            }"
        >
            {{ getDayName(thisDayNum) }}
            <div
                v-if="showDates"
                class="calendar-day-label-date"
            >
                {{ getDateObject().clone().add((thisDayNum - 1), 'days').date() }}
            </div>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'
  import CalendarMixin from './CalendarMixin'
  // import {} from 'quasar'
  export default {
    name: 'CalendarDayLabels',
    props: {
      startMonth: {
        type: Number,
        default: moment().month() + 1
      },
      startYear: {
        type: Number,
        default: moment().year()
      },
      startDay: {
        type: Number,
        default: moment().date()
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
      }
    },
    components: {},
    mixins: [CalendarMixin],
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        yearNumber: moment().year(),
        monthNumber: moment().month(),
        weekNumber: moment().week(),
        dayNumber: moment().date(),
        workingDateObject: {},
        weekArray: []
      }
    },
    computed: {
      cellWidth: function () {
        return this.calculateDayCellWidth(this.numberOfDays)
      }
      // getDateObject: function () {
      //   return moment()
      //     .year(this.startYear)
      //     .month(this.startMonth - 1)
      //     .date(this.startDay)
      // }
    },
    methods: {
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
      },
      isCurrentDayLabel: function (thisDayNum) {
        let now = moment()
        let test = moment()
          .year(this.yearNumber)
          .month(this.monthNumber - 1)
          .date(15)
          .day(thisDayNum - 1)
        // console.debug('isCurrentDayLabel called,', thisDayNum, now, test)
        // return (moment().add((thisDayNum - 1), 'days').date())
        // TODO: take out debugging and simplify
        return (now.day() === test.day())
      },
      getDayName (thisDayNum) {
        let dateVal = {}
        if (this.forceStartOfWeek) {
          dateVal = this.getDateObject()
            .clone()
            .date(15) // just somewhere in the middle of the month
            .weekday(thisDayNum - 1)
        }
        else {
          dateVal = this.getDateObject()
            .clone()
            .add((thisDayNum - 1), 'days')
        }
        return this.dayNameAbbreviation(dateVal.format('dddd'), 3)
      }
    },
    mounted () {
      this.mountSetDate()
    },
    updated () {
      // this.mountSetDate()
      this.workingDateObject
        .year(this.startYear)
        .month(this.startMonth - 1)
        .date(this.startDay)
    },
    watch: {
      startYear: 'handleStartChange',
      startMonth: 'handleStartChange',
      startDay: 'handleStartChange'
    }
  }
</script>

<style lang="stylus">
    $cellWidth = 14.285%
    $cellHeight = 5em

    .calendar-day-labels
        .calendar-day-label
            font-size 1.1em
            .calendar-day-label-date
                font-size 1.75em
        .calendar-day-label-current
            font-weight bold

</style>