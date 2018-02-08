<template>
    <div class="calendar-multi-day-component column fit no-wrap">
        <!-- week nav -->
        <template v-if="numDays === 1">
            <calendar-header-nav
                time-period-unit="days"
                :time-period-amount="navDays"
                :move-time-period-emit="eventRef + ':navMovePeriod'"
            >
                <!--{{ getDayOfWeek() }}, {{ getMonthNameFromMonthNumber() }} {{ dayNumber }}, {{ yearNumber }}-->
                <!--{{ workingDate.formatDate('dddd') }}, {{ workingDate.formatDate('MMMM') }} {{ workingDate.formatDate('D') }}, {{ workingDate.formatDate('YYYY') }}-->
                {{ formatDate(workingDate, 'dddd, MMMM D YYYY')}}
            </calendar-header-nav>
        </template>
        <template v-else>
            <calendar-header-nav
                time-period-unit="days"
                :time-period-amount="navDays"
                :move-time-period-emit="eventRef + ':navMovePeriod'"
            >
                {{ getHeaderLabel() }}
            </calendar-header-nav>
        </template>

        <div v-if="numDays > 1" class="calendar-time-margin">
            <calendar-day-labels
                :number-of-days="numDays"
                :show-dates="true"
                :start-date="workingDate"
                :force-start-of-week="forceStartOfWeek"
            />
        </div>

        <!-- all day events -->
        <div class="calendar-time-margin">
            <calendar-all-day-events
                :number-of-days="numDays"
                :NOstart-date="workingDate"
                :start-date="weekDateArray[0]"
                :parsed="parsed"
            />
        </div>

        <!-- content -->
        <q-scroll-area
            :style="getScrollStyle"
            :class="getScrollClass"
        >
            <div class="col">
                <div class="calendar-day row">
                    <calendar-time-label-column />
                    <div class="calendar-multiple-days col row">
                        <calendar-day-column
                            v-for="thisDate in weekDateArray"
                            :start-date="thisDate"
                            :date-events="dateGetEvents(thisDate)"
                            column-css-class="calendar-day-column-content"
                            :style="{ 'width': dayCellWidth }"
                        />
                        <!--<calendar-day-column-->
                            <!--v-for="daysForward in numDays"-->
                            <!--:key="daysForward"-->
                            <!--:start-date-object="getStartDateObject(daysForward)"-->
                            <!--:date-events="getDateEvents(daysForward)"-->
                            <!--column-css-class="calendar-day-column-content"-->
                            <!--:style="{ 'width': dayCellWidth }"-->
                        <!--/>-->
                    </div>
                </div>
            </div>

        </q-scroll-area>
    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import CalendarEvent from './CalendarEvent'
  import CalendarDayColumn from './CalendarDayColumn'
  import CalendarTimeLabelColumn from './CalendarTimeLabelColumn'
  import CalendarDayLabels from './CalendarDayLabels'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import CalendarAllDayEvents from './CalendarAllDayEvents'
  import {
    date,
    Events,
    QBtn,
    QTooltip,
    QScrollArea
  } from 'quasar'
  import './calendar.universal.styl'
  export default {
    name: 'CalendarMultiDay',
    props: {
      startDate: {
        type: Date,
        default: () => { return new Date() }
      },
      eventArray: {
        type: Array,
        default: () => []
      },
      parsedEvents: {
        type: Object,
        default: () => {}
      },
      eventRef: {
        type: String,
        // default: 'calendar'
        default: 'cal-' + Math.random().toString(36).substring(2, 15)
      },
      numDays: {
        type: Number,
        default: 7
      },
      navDays: {
        type: Number,
        default: 7
      },
      forceStartOfWeek: {
        type: Boolean,
        default: true
      },
      dayCellHeight: {
        type: Number,
        default: 5
      },
      dayCellHeightUnit: {
        type: String,
        default: 'rem'
      },
      scrollStyle: {
        type: Object,
        default: function () {
          return {}
        }
      },
      scrollHeight: {
        type: String,
        default: 'auto'
      }
    },
    components: {
      // QuantityBubble,
      CalendarEvent,
      CalendarDayColumn,
      CalendarTimeLabelColumn,
      CalendarDayLabels,
      CalendarHeaderNav,
      CalendarAllDayEvents,
      QBtn,
      QTooltip,
      QScrollArea
    },
    mixins: [CalendarMixin],
    data () {
      return {
        // dayCellHeight: 5,
        // dayCellHeightUnit: 'rem',
        // yearNumber: moment().year(),
        // monthNumber: moment().month() + 1,
        // weekNumber: moment().week(),
        // dayNumber: moment().date(),
        workingDate: new Date(),
        weekDateArray: [],
        dayRowArray: [],
        parsed: this.getDefaultParsed(),
        thisNavRef: this.createNewNavEventName()
      }
    },
    computed: {
      dayCellWidth: function () {
        return this.calculateDayCellWidth(this.numDays)
        // return (100 / this.numDays).toFixed(3) + '%'
      },
      getScrollStyle: function () {
        if (this.scrollStyle.length > 0) {
          return this.scrollStyle
        }
        else {
          return {
            'height': this.scrollHeight
          }
        }
      },
      getScrollClass: function () {
        if (this.scrollHeight === 'auto') {
          return {
            'col': true,
            'testmarker': true
          }
        }
        else {
          return {}
        }
      }
    },
    methods: {
      getHeaderLabel: function () {
        if (this.forceStartOfWeek) {
          let dateReturn = ''
          // let middleOfMonthDate = date.adjustDate(workingDate, { date: 21 })
          // let middleOfMonthDate = this.workingDate
          // let firstDate = this.getDateObject().clone().weekday(0)
          // let lastDate = this.getDateObject().clone().weekday(6)
          // let firstDate = this.dateAdjustWeekday(middleOfMonthDate, -1)
          // let lastDate = this.dateAdjustWeekday(middleOfMonthDate, 7)
          // let lastDate = this.dateAdjustWeekday(middleOfMonthDate, 7)
          let bookendDates = this.getForcedWeekBookendDates()
          // console.debug('getHeaderLabel called', firstDate, lastDate)

          if (bookendDates.first.getMonth() !== bookendDates.last.getMonth()) {
            dateReturn += date.formatDate(bookendDates.first, 'MMM')
            if (bookendDates.first.getFullYear() !== bookendDates.last.getFullYear()) {
              dateReturn += date.formatDate(bookendDates.first, ' YYYY')
            }
            dateReturn += ' - '
          }
          dateReturn += date.formatDate(bookendDates.last, 'MMM YYYY')
          return dateReturn
        }
        else {
          return date.formatDate(this.workingDate, 'MMMM YYYY')
        }
      },
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
        this.buildWeekDateArray()
      },
      getStartDateObject: function (daysForward) {
        let returnVal = {}
        if (this.forceStartOfWeek) {
          // returnVal = this.createThisDate().weekday(0).add(daysForward - 1, 'days')
          returnVal = date.addToDate(
            this.dateAdjustWeekday(this.workingDate, 1),
            { days: daysForward }
          )
        }
        else {
          // returnVal = this.createThisDate().add(daysForward - 1, 'days')
          returnVal = date.addToDate(
            this.workingDate,
            { days: daysForward }
          )
        }
        // console.debug('getStartDateObject returnVal = ', returnVal)
        return returnVal
      },
      getDateEvents: function (daysForward) {
        // let returnVal = []
        return this.dateGetEvents(
          this.getStartDateObject(daysForward)
        )
        // if (this.forceStartOfWeek) {
        //   returnVal = this.dateGetEvents(this.createThisDate().weekday(0).add(daysForward - 1, 'days'))
        // }
        // else {
        //   returnVal = this.dateGetEvents(this.createThisDate().add(daysForward - 1, 'days'))
        // }
        // return returnVal
      },
      getStartNumber: function (periodType) {
        if (this.forceStartOfWeek) {
          switch (periodType) {
            case 'year':
              return this.createThisDate().weekday(0).year()
            case 'month':
              return this.createThisDate().weekday(0).month() + 1
            case 'day':
              return this.createThisDate().weekday(0).date()
          }
        }
        else {
          switch (periodType) {
            case 'year':
              return this.createThisDate().year()
            case 'month':
              return this.createThisDate().month()
            case 'day':
              return this.createThisDate().date()
          }
        }
      },
      handleNavMove: function (unitType, amount) {
        this.moveTimePeriod(unitType, amount)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          {
            unitType: unitType,
            amount: amount
          }
        )
        this.buildWeekDateArray()
        // this.$emit(
        //   this.eventRef + ':changeDates',
        //   {
        //     yearNumber: this.yearNumber,
        //     monthNumber: this.monthNumber,
        //     dayNumber: this.dayNumber
        //   }
        // )
      }
    },
    mounted () {
      this.doUpdate()
      // console.debug('calendarMultiDay about to call handlePassedInEvents')
      this.handlePassedInEvents()
      Events.$on(
        this.eventRef + ':navMovePeriod',
        // this.moveTimePeriod
        this.handleNavMove
      )
    },
    watch: {
      startDate: 'handleStartChange',
      eventArray: 'getPassedInEventArray',
      parsedEvents: 'getPassedInParsedEvents'
    }
  }
</script>

<style lang="stylus">
    $sevenCellWidth = 14.285%
    $cellHeight = 5em
    $borderOuter = 1px solid silver
    $borderThin = 1px dotted silver
    $dayTimeLabelWidth = 4em
    $currentDayBackgroundColor = #eeeeee

    .calendar-multi-day-component
        .calendar-day-labels
        .calendar-day-label
        // width $sevenCellWidth
        .calendar-header
            .calendar-header-label
                font-size 1.25em
                font-weight bold
        .calendar-day
            //.calendar-day-cell-height
            //    height $cellHeight
            //    max-height $cellHeight
            .calendar-day-column-label
                width $dayTimeLabelWidth
            .calendar-day-column-content
                // border-right $borderOuter
                // width $sevenCellWidth
                border-right $borderThin
                position relative
            .calendar-day-time
                padding-right .5em
                border-right $borderOuter
            .calendar-day-time-content
                border-top $borderThin

        .calendar-multiple-daysNO
            .calendar-day-column-content
                width $sevenCellWidth
                border-right $borderThin
                position absolute
                top 0
</style>