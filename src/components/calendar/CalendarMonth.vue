<template>
    <div class="calendar-month">

        <!-- calendar header -->
        <calendar-header-nav
            time-period-unit="month"
            :time-period-amount="1"
            :move-time-period-emit="eventRef + ':navMovePeriod'"
        >
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
      }
    },
    computed: {},
    methods: {
      handleStartChange: function (val, oldVal) {
        debounce(this.doUpdate, 300)
      },
      doUpdate: function () {
        this.mountSetDate()
        this.generateCalendarCellArray()
      },
      getCalendarCellArray: function (monthNumber, yearNumber) {
        let currentDay = date.buildDate({
          year: yearNumber,
          month: monthNumber + 1, // TODO: is this correct? This should be in the Quasar docs
          date: 1
        })
        let currentWeekOfYear = date.getWeekOfYear(currentDay)
        let weekArray = []
        let currentWeekArray = []
        let thisDayObject = {}
        for (let thisDateOfMonth = 1; thisDateOfMonth <= 31; thisDateOfMonth++) {
          currentDay = date.buildDate({
            year: yearNumber,
            month: monthNumber + 1,
            date: thisDateOfMonth
          })
          if (
            currentDay.getFullYear() === yearNumber &&
            currentDay.getMonth() === monthNumber
          ) {
            if (date.getWeekOfYear(currentDay) !== currentWeekOfYear) {
              weekArray.push(currentWeekArray)
              currentWeekOfYear = date.getWeekOfYear(currentDay)
              currentWeekArray = []
            }
            thisDayObject = {
              moment: currentDay,
              dateObject: currentDay,
              year: currentDay.getFullYear(),
              month: currentDay.getMonth(),
              date: currentDay.getDate(),
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
      handleNavMove: function (params) {
        console.debug('calendarMonth called handleNavMove', params.unitType, params.amount)
        this.moveTimePeriod(params)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          {
            unitType: params.unitType,
            amount: params.amount
          }
        )
        this.generateCalendarCellArray()
      }
    },
    mounted () {
      this.doUpdate()
      this.handlePassedInEvents()
      Events.$on(
        this.eventRef + ':navMovePeriod',
        this.handleNavMove
      )
    },
    watch: {
      startDate: 'handleStartChange',
      eventArray: function () {
        this.getPassedInEventArray()
      },
      parsedEvents: function () {
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