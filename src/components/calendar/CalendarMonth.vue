<template>
    <div class="calendar-month">

        <!-- calendar header -->
        <calendar-header-nav
            time-period-unit="month"
            :time-period-amount="1"
            :move-time-period-emit="eventRef + ':navMovePeriod'"
        >
            <!--{{ getMonthNameFromMonthNumber() }} {{ workingDate.formatDate('YYYY') }}-->
            {{ formatDate(workingDate, 'MMMM') }} {{ formatDate(workingDate, 'YYYY') }}
        </calendar-header-nav>

        <div class="calendar-content">
            <calendar-day-labels
                :number-of-days="7"
                :start-date="workingDate"
                :force-start-of-week="true"
            />
            <div
                v-for="(thisWeek, index) in weekArray"
                :class="{
                    'calendar-multi-day': true,
                    'row': true,
                    'no-wrap': true,
                    'items-start': true,
                    'justify-end': index < (weekArray.length - 1),
                    'justify-start': index === (weekArray.length - 1)
                }"
            >
                <div
                    :class="{
                        'calendar-day': true,
                        'calendar-cell': true,
                        'calendar-day-current': isCurrentDate(thisDay.dateObject)
                        }"
                    v-for="thisDay in thisWeek"
                >
                    <quantity-bubble
                        v-if="isCurrentDate(thisDay.dateObject)"
                        :quantity="thisDay.dateObject.getDate()"
                        :offset="false"
                    />
                    <div v-else class="calendar-day-number">
                        <!--{{ thisDay.date }}-->
                        {{ thisDay.dateObject.getDate() }}
                    </div>
                    <div class="calendar-day-content">

                        <div
                            v-if="hasAnyEvents(thisDay.dateObject)"
                            v-for="thisEvent in dateGetEvents(thisDay.dateObject)"
                        >
                            <calendar-event
                                :event-object="thisEvent"
                                :monthStyle="true"
                            />
                        </div>
                        <!--Content here-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import {
    date,
    Events,
    QBtn,
    QTooltip,
    QTabs,
    QTab,
    QTabPane,
    QScrollArea,
    debounce
  } from 'quasar'
  import QuantityBubble from './QuantityBubble'
  import CalendarEvent from './CalendarEvent'
  import CalendarDayLabels from './CalendarDayLabels'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import './calendar.universal.styl'
  export default {
    name: 'CalendarMonth',
    components: {
      QuantityBubble,
      CalendarEvent,
      CalendarDayLabels,
      CalendarHeaderNav,
      QBtn,
      QTooltip,
      QTabs,
      QTab,
      QTabPane,
      QScrollArea
    },
    mixins: [CalendarMixin],
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
        // default: 'cal-' + this.createRandomString()
        default: 'cal-' + Math.random().toString(36).substring(2, 15)
      }
    },
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: new Date(),
        weekArray: [],
        parsed: this.getDefaultParsed()
        // thisNavRef: this.createNewNavEventName()
      }
    },
    computed: {},
    methods: {
      handleStartChange: function (val, oldVal) {
        // console.debug('calendarMonth handleStartChange called')
        debounce(this.doUpdate, 300)
        // this.doUpdate()
      },
      doUpdate: function () {
        // console.debug('calendarMonth doUpdate called')
        this.mountSetDate()
        this.generateCalendarCellArray()
      },
      getCalendarCellArray: function (monthNumber, yearNumber) {
        // let currentDay = moment().year(yearNumber).month(monthNumber - 1).date(1)
        let currentDay = date.buildDate({
          year: yearNumber,
          month: monthNumber + 1, // TODO: is this correct? This should be in the Quasar docs
          date: 1
        })
        // console.debug('getCalendarCellArray called,', monthNumber, yearNumber, currentDay)
        // let currentWeekOfYear = currentDay.week()
        let currentWeekOfYear = date.getWeekOfYear(currentDay)
        let weekArray = []
        let currentWeekArray = []
        let thisDayObject = {}
        for (let thisDateOfMonth = 1; thisDateOfMonth <= 31; thisDateOfMonth++) {
          // console.debug('dateOfMonth = ' + thisDateOfMonth)
          // currentDay = moment().year(yearNumber).month(monthNumber - 1).date(thisDateOfMonth)
          currentDay = date.buildDate({
            year: yearNumber,
            // month: monthNumber,
            month: monthNumber + 1,
            date: thisDateOfMonth
          })
          // console.debug('currentDay = ', currentDay)
          // console.debug('currentDay.year() = ', currentDay.getFullYear())
          // console.debug('currentDay.month() = ', currentDay.getMonth(), monthNumber)
          if (
            currentDay.getFullYear() === yearNumber &&
            currentDay.getMonth() === monthNumber
          ) {
          // if (currentDay.year() === yearNumber && currentDay.month() === monthNumber - 1) {
          //   console.debug('past first IF, ', date.getWeekOfYear(currentDay), currentWeekOfYear)
            if (date.getWeekOfYear(currentDay) !== currentWeekOfYear) {
            // if (currentDay.week() !== currentWeekOfYear) {
              weekArray.push(currentWeekArray)
              // currentWeekOfYear = currentDay.week()
              currentWeekOfYear = date.getWeekOfYear(currentDay)
              currentWeekArray = []
            }
            thisDayObject = {
              moment: currentDay,
              dateObject: currentDay,
              year: currentDay.getFullYear(),
              month: currentDay.getMonth(),
              date: currentDay.getDate(),
              // dayName: currentDay.day(),
              dayName: date.formatDate(currentDay, 'dddd'),
              dayNumber: date.getDayOfWeek(currentDay)
            }
            currentWeekArray.push(thisDayObject)
          }
        }
        if (weekArray.length > 0) {
          weekArray.push(currentWeekArray)
        }
        console.debug('getCallendarCellArray about to return weekArray', weekArray)
        return weekArray
      },
      generateCalendarCellArray: function () {
        console.debug('generateCalendarCellArray called')
        this.weekArray = this.getCalendarCellArray(
          this.workingDate.getMonth(),
          this.workingDate.getFullYear()
        )
      },
      // handleNavMove: function (unitType, amount) {
      handleNavMove: function (params) {
        console.debug('calendarMonth called handleNavMove', params.unitType, params.amount)
        // this.moveTimePeriod(params.unitType, params.amount)
        this.moveTimePeriod(params)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          {
            unitType: params.unitType,
            amount: params.amount
          }
        )
        this.generateCalendarCellArray()
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
      // console.debug('calendarMonth about to call handlePassedInEvents')
      this.handlePassedInEvents()
      // Events.$on(
      //   this.eventRef + ':navMovePeriod:' + this.thisNavRef,
      //   // this.moveTimePeriod
      //   this.handleNavMove
      // )
      Events.$on(
        this.eventRef + ':navMovePeriod',
        // this.moveTimePeriod
        this.handleNavMove
      )
    },
    watch: {
      startDate: 'handleStartChange',
      eventArray: function () {
        // console.debug('watch eventArray hit')
        this.getPassedInEventArray()
      },
      parsedEvents: function () {
        // console.debug('watch parsedEvents hit')
        this.getPassedInParsedEvents()
      }
    }
  }
</script>

<style lang="stylus">
    $cellWidth = 14.285%
    $cellHeight = 5em
    $currentDayBackgroundColor = #eeeeee

    .calendar-month
        .calendar-header
            .calendar-header-label
                font-size 1.25em
                font-weight bold
        .calendar-content
            padding 4px 12px
            .calendar-cell
                width $cellWidth
                max-width $cellWidth
                /*margin 1px*/
                padding 2px
            .calendar-day-labels
                .calendar-day-label
                    font-size 1.1em
                .calendar-day-label-current
                    font-weight bold
            .calendar-multi-day
                border-bottom 1px solid silver
                :last-child
                    border-bottom none
            .calendar-day
                background-color none
                height $cellHeight
                max-height $cellHeight
                overflow hidden
                .calendar-day-number
                    font-size 0.9em
                    height 2em
                    width 2em
                    vertical-align middle
                    padding-top .25em
                    padding-left .25em
            .calendar-day-current
                background-color $currentDayBackgroundColor

</style>