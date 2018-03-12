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
                        'calendar-day-weekend': isWeekendDay(thisDay.dateObject),
                        'calendar-day-current': isCurrentDate(thisDay.dateObject)
                        }"
                    v-for="(thisDay, weekDayIndex) in thisWeek"
                >
                    <div
                        v-if="isCurrentDate(thisDay.dateObject)"
                        :class="{ 'cursor-pointer': calendarDaysAreClickable }"
                        @click="handleDayClick(thisDay.dateObject)"
                    >
                        <quantity-bubble
                            :quantity="thisDay.dateObject.getDate()"
                            :offset="false"
                        />
                    </div>
                    <div
                        v-else
                        :class="{
                            'calendar-day-number': true,
                            'cursor-pointer': calendarDaysAreClickable
                        }"
                        @click="handleDayClick(thisDay.dateObject)"
                    >
                        {{ thisDay.dateObject.getDate() }}
                    </div>
                    <div class="calendar-day-content">
                        <template v-if="hasAnyEvents(thisDay.dateObject)">
                            <div
                                v-for="thisEvent in monthGetDateEvents(thisDay.dateObject)"
                            >
                                <calendar-event
                                    :event-object="thisEvent"
                                    :month-style="true"
                                    :event-ref="eventRef"
                                    :has-previous-day="thisEvent.hasPrev"
                                    :has-next-day="thisEvent.hasNext"
                                    :first-day-of-week="(weekDayIndex === 0)"
                                    :last-day-of-week="(weekDayIndex === 6)"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <calendar-event-detail
            ref="defaultEventDetail"
            :event-object="eventDetailEventObject"
        />

    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import CalendarEventMixin from './CalendarEventMixin'
  import {
    date,
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
  import CalendarEventDetail from './CalendarEventDetail'
  export default {
    name: 'CalendarMonth',
    components: {
      QuantityBubble,
      CalendarEvent,
      CalendarDayLabels,
      CalendarHeaderNav,
      CalendarEventDetail,
      QBtn,
      QTooltip,
      QTabs,
      QTab,
      QTabPane,
      QScrollArea
    },
    mixins: [CalendarMixin, CalendarEventMixin],
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
      },
      fullComponentRef: String
    },
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: new Date(),
        weekArray: [],
        parsed: this.getDefaultParsed(),
        eventDetailEventObject: {}
      }
    },
    computed: {
      calendarDaysAreClickable: function () {
        return (this.fullComponentRef && this.fullComponentRef.length > 0)
      }
    },
    methods: {
      monthGetDateEvents: function (dateObject) {
        let returnVal = this.dateGetEvents(dateObject)
        // console.debug('monthGetDateEvents called with %s, returning %O', this.formatToSqlDate(dateObject), this.stripObject(returnVal))
        return returnVal
      },
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
        return weekArray
      },
      generateCalendarCellArray: function () {
        this.weekArray = this.getCalendarCellArray(
          this.workingDate.getMonth(),
          this.workingDate.getFullYear()
        )
      },
      handleNavMove: function (params) {
        this.moveTimePeriod(params)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          {
            unitType: params.unitType,
            amount: params.amount
          }
        )
        this.generateCalendarCellArray()
      },
      handleDayClick: function (dateObject) {
        if (this.fullComponentRef) {
          this.fullMoveToDay(dateObject)
        }
      },
    },
    mounted () {
      this.doUpdate()
      this.handlePassedInEvents()
      this.$root.$on(
        this.eventRef + ':navMovePeriod',
        this.handleNavMove
      )
      this.$root.$on(
        'click-event-' + this.eventRef,
        this.handleEventDetailEvent
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
    @import 'calendar.vars.styl'

    .calendar-month

        .calendar-time-width
            width $dayTimeLabelWidth
        .calendar-time-margin
            margin-left $dayTimeLabelWidth

        .calendar-header
            .calendar-header-label
                font-size 1.25em
                font-weight bold
        .calendar-content
            padding 4px 12px
            .calendar-cell
                width $cellWidth
                max-width $cellWidth
                /*padding 2px*/
                padding 0
            .calendar-day-labels
                .calendar-day-label
                    font-size 1.1em
                .calendar-day-label-current
                    font-weight bold
            .calendar-multi-day
                border-bottom 1px solid $borderColor
                :last-child
                    border-bottom none
            .calendar-day
                background-color none
                height $cellHeight
                max-height $cellHeight
                overflow hidden
                width $sevenCellWidth
                .calendar-day-number
                    font-size 0.9em
                    height 2em
                    width 2em
                    vertical-align middle
                    padding-top .25em
                    padding-left .25em
            .calendar-day-current
                background-color $currentDayBackgroundColor
            .calendar-day-weekend
                background-color $weekendDayBackgroundColor

</style>
