<template>
    <div class="calendar-day-labels row no-wrap justify-end">
        <div
            v-for="thisDay in weekDateArray"
            :class="{
              'calendar-day-label': true,
              'calendar-cell': true,
              'calendar-day-label-current': isCurrentDayLabel(thisDay)
            }"
            :style="{
              'width': cellWidth,
              'max-width': cellWidth,
            }"
        >
            {{ formatDate(thisDay, 'ddd') }}
            <div
                v-if="showDates"
                class="calendar-day-label-date"
            >
                {{ formatDate(thisDay, 'D') }}
            </div>
        </div>
        <!--<div-->
            <!--v-for="thisDayNum in numberOfDays"-->
            <!--:class="{-->
              <!--'calendar-day-label': true,-->
              <!--'calendar-cell': true,-->
              <!--'calendar-day-label-current': isCurrentDayLabel(thisDayNum)-->
            <!--}"-->
            <!--:style="{-->
              <!--'width': cellWidth,-->
              <!--'max-width': cellWidth,-->
            <!--}"-->
        <!--&gt;-->
            <!--{{ getDayName(thisDayNum) }}-->
            <!--<div-->
                <!--v-if="showDates"-->
                <!--class="calendar-day-label-date"-->
            <!--&gt;-->
                <!--{{ getDayNumDate(thisDayNum) }}-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
  // import moment from 'moment'
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
      }
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
      // isCurrentDayLabelOLD: function (thisDayNum, checkMonthOnly) {
      //   let now = new Date()
      //   // console.debug('isCurrentDayLabel called', thisDayNum, date.getDayOfWeek(now))
      //   if (checkMonthOnly === true) {
      //     return (
      //       date.getDayOfWeek(now) === thisDayNum &&
      //       now.getMonth() === this.workingDate.getMonth()
      //     )
      //   }
      //   else {
      //     return (
      //       date.getDayOfWeek(now) === thisDayNum &&
      //       now.getMonth() === this.workingDate.getMonth()
      //     )
      //   }
      //   //
      //   // let test = moment()
      //   //   .year(this.yearNumber)
      //   //   .month(this.monthNumber - 1)
      //   //   // .date(15)
      //   //   // .day(thisDayNum - 1)
      //   //   .date(this.dayNumber)
      //   //   .day(thisDayNum - 1)
      //   // // console.debug('isCurrentDayLabel called,', thisDayNum, now, test)
      //   // // return (moment().add((thisDayNum - 1), 'days').date())
      //   // // TODO: take out debugging and simplify
      //   // // return (now.day() === test.day())
      //   // if (checkMonthOnly === true) {
      //   //   return (now.IsSame(test, 'month') && now.day() === test.day())
      //   // }
      //   // else {
      //   //   return now.isSame(test, 'day')
      //   // }
      // },
      getDayName: function (thisDayNum) {
        let dateVal = new Date()
        if (this.forceStartOfWeek) {
          // dateVal = date.adjustDate(dateVal, { date: 15 })
          if (thisDayNum < date.getDayOfWeek(this.workingDate)) {
            dateVal = this.dateAdjustWeekday(dateVal, -thisDayNum)
          }
          else {
            dateVal = this.dateAdjustWeekday(dateVal, thisDayNum)
          }

        }
        else {
          dateVal = date.addToDate(this.workingDate, { days: thisDayNum - 1 })
        }
        console.debug('getDayName has dateVal = ', dateVal, this.forceStartOfWeek)
        return this.dayNameAbbreviation(date.formatDate(dateVal, 'dddd'), 3)
      },
      getDayNumDate: function (thisDayNum) {
        return date.formatDate(
          date.addToDate(this.workingDate, { 'days': thisDayNum }),
          'D'
        )
      }
    },
    mounted () {
      this.mountSetDate()
    },
    // updated () {
    //   // this.mountSetDate()
    //   this.workingDateObject
    //     .year(this.startYear)
    //     .month(this.startMonth - 1)
    //     .date(this.startDay)
    // },
    watch: {
      startDate: 'handleStartChange'
    }
  }
</script>

<style lang="stylus">
    $cellWidth = 14.285%
    $cellHeight = 5em

    .calendar-day-labels
        .calendar-day-label
            font-size 1.1em
            padding-left 4px
            .calendar-day-label-date
                font-size 1.75em
        .calendar-day-label-current
            font-weight bold

</style>