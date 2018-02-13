<template>
    <div class="calendar-multi-day-component column fit no-wrap">
        <!-- week nav -->
        <template v-if="numDays === 1">
            <calendar-header-nav
                time-period-unit="days"
                :time-period-amount="navDays"
                :move-time-period-emit="eventRef + ':navMovePeriod'"
            >
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
          let bookendDates = this.getForcedWeekBookendDates()
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
      eventArray: 'getPassedInEventArray',
      parsedEvents: 'getPassedInParsedEvents'
    }
  }
</script>

<style lang="stylus">
    @import 'calendar.vars.styl'

    .calendar-multi-day-component
        .calendar-time-margin
            margin-left $dayTimeLabelWidth
        .calendar-header
            .calendar-header-label
                font-size 1.25em
                font-weight bold
        .calendar-day
            .calendar-day-column-label
                width $dayTimeLabelWidth
            .calendar-day-column-content
                border-right $borderThin
                position relative
            .calendar-day-time
                padding-right .5em
                border-right $borderOuter
            .calendar-day-time-content
                border-top $borderThin

</style>