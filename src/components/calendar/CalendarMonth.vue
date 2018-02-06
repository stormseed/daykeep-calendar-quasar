<template>
    <div class="calendar-month">

        <!-- calendar header -->
        <calendar-header-nav
            time-period-unit="months"
            :time-period-amount="1"
            :start-year="startYear"
            :start-month="startMonth"
            :start-day="startDay"
            :move-time-period-emit="eventRef + ':navMovePeriod'"
        >
            {{ getMonthNameFromMonthNumber() }} {{ yearNumber }}
        </calendar-header-nav>

        <div class="calendar-content">
            <calendar-day-labels
                :number-of-days="7"
                :start-year="yearNumber"
                :start-month="monthNumber"
                :start-day="1"
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
                        'calendar-day-current': isCurrentDate(thisDay.date)
                        }"
                    v-for="thisDay in thisWeek"
                >
                    <quantity-bubble
                        v-if="isCurrentDate(thisDay.date)"
                        :quantity="thisDay.date"
                        :offset="false"
                    />
                    <div v-else class="calendar-day-number">
                        {{ thisDay.date }}
                    </div>
                    <div class="calendar-day-content">
                        <div
                            v-if="hasAnyEvents(thisDay.date)"
                            v-for="thisEvent in dateGetEvents(thisDay.date)
                        ">
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
  import moment from 'moment'
  import CalendarMixin from './CalendarMixin'
  import {
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
        yearNumber: moment().year(),
        monthNumber: moment().month() + 1,
        weekNumber: moment().week(),
        dayNumber: moment().date(),
        weekArray: [],
        parsed: this.getDefaultParsed()
        // thisNavRef: this.createNewNavEventName()
      }
    },
    computed: {},
    methods: {
      handleStartChange: function (val, oldVal) {
        console.debug('calendarMonth handleStartChange called')
        debounce(this.doUpdate, 300)
        // this.doUpdate()
      },
      doUpdate: function () {
        console.debug('calendarMonth doUpdate called')
        this.mountSetDate()
        this.generateCalendarCellArray()
      },
      getCalendarCellArray: function (monthNumber, yearNumber) {
        let currentDay = moment().year(yearNumber).month(monthNumber - 1).date(1)
        let currentWeekOfYear = currentDay.week()
        let weekArray = []
        let currentWeekArray = []
        let thisDayObject = {}
        for (let thisDateOfMonth = 1; thisDateOfMonth <= 31; thisDateOfMonth++) {
          // console.debug('dateOfMonth = ' + thisDateOfMonth)
          currentDay = moment().year(yearNumber).month(monthNumber - 1).date(thisDateOfMonth)
          // console.debug('currentDay.year() = ', currentDay.year())
          // console.debug('currentDay.month() = ', currentDay.month(), monthNumber)
          if (currentDay.year() === yearNumber && currentDay.month() === monthNumber - 1) {
            // console.debug('past first IF, ', currentDay.week(), currentWeekOfYear)
            if (currentDay.week() !== currentWeekOfYear) {
              weekArray.push(currentWeekArray)
              currentWeekOfYear = currentDay.week()
              currentWeekArray = []
            }
            thisDayObject = {
              moment: currentDay,
              year: currentDay.year(),
              month: currentDay.month() + 1,
              date: currentDay.date(),
              // dayName: currentDay.day(),
              dayName: currentDay.format('dddd'),
              dayNumber: currentDay.weekday()
            }
            currentWeekArray.push(thisDayObject)
          }
        }
        if (weekArray.length > 0) {
          weekArray.push(currentWeekArray)
        }
        return weekArray
      },
      generateCalendarCellArray: function () {
        console.debug('generateCalendarCellArray called')
        this.weekArray = this.getCalendarCellArray(this.monthNumber, this.yearNumber)
      },
      handleNavMove: function (unitType, amount) {
        console.debug('calendarMonth called handleNavMove', unitType, amount)
        this.moveTimePeriod(unitType, amount)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          {
            unitType: unitType,
            amount: amount
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
      console.debug('calendarMonth about to call handlePassedInEvents')
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
      startYear: 'handleStartChange',
      startMonth: 'handleStartChange',
      startDay: 'handleStartChange',
      // eventArray: 'getPassedInEventArray',
      eventArray: function () {
        console.debug('watch eventArray hit')
        this.getPassedInEventArray()
      },
      // parsedEvents: 'getPassedInParsedEvents'
      parsedEvents: function () {
        console.debug('watch parsedEvents hit')
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