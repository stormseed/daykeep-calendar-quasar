<template>
    <div class="calendar-multi-day-component column fit">
        <!-- week nav -->
        <template v-if="numDays === 1">
            <calendar-header-nav
                time-period-unit="days"
                :time-period-amount="navDays"
            >
                {{ getDayOfWeek() }}, {{ getMonthNameFromMonthNumber() }} {{ dayNumber }}, {{ yearNumber }}
            </calendar-header-nav>
        </template>
        <template v-else>
            <calendar-header-nav
                time-period-unit="days"
                :time-period-amount="navDays"
            >
                {{ getMonthNameFromMonthNumber() }} {{ yearNumber }}
            </calendar-header-nav>
        </template>

        <div v-if="numDays > 1" class="calendar-time-margin">
            <calendar-day-labels
                :number-of-days="numDays"
                :show-dates="true"
                :start-year="getStartNumber('year')"
                :start-month="getStartNumber('month')"
                :start-day="getStartNumber('day')"
                :force-start-of-week="forceStartOfWeek"
            />
        </div>

        <!-- all day events -->
        <div class="calendar-time-margin">
            <calendar-all-day-events
                :number-of-days="numDays"
                :start-year="getStartNumber('year')"
                :start-month="getStartNumber('month')"
                :start-day="getStartNumber('day')"
                :parsed="parsed"
            />
        </div>

        <!-- content -->
        <q-scroll-area
            :style="getScrollStyle"
        >
            <div class="col">
                <div class="calendar-day row">
                    <calendar-time-label-column />
                    <div class="calendar-multiple-days col row">
                        <calendar-day-column
                            v-for="daysForward in numDays"
                            :key="daysForward"
                            :start-date-object="getStartDateObject(daysForward)"
                            :date-events="getDateEvents(daysForward)"
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
  import moment from 'moment'
  import CalendarMixin from './CalendarMixin'
  import CalendarEvent from './CalendarEvent'
  import CalendarDayColumn from './CalendarDayColumn'
  import CalendarTimeLabelColumn from './CalendarTimeLabelColumn'
  import CalendarDayLabels from './CalendarDayLabels'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import CalendarAllDayEvents from './CalendarAllDayEvents'
  import {
    QBtn,
    QTooltip,
    QScrollArea
  } from 'quasar'
  export default {
    name: 'CalendarMultiDay',
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
        default: []
      },
      parsedEvents: {
        type: Object,
        // default: this.getDefaultParsed()
        default: function () {
          return {}
        }
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
        default: '400px'
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
        yearNumber: moment().year(),
        monthNumber: moment().month() + 1,
        weekNumber: moment().week(),
        dayNumber: moment().date(),
        dayRowArray: [],
        parsed: this.getDefaultParsed()
      }
    },
    computed: {
      dayCellWidth: function () {
        return (100 / this.numDays).toFixed(3) + '%'
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
      }
    },
    methods: {
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
      },
      getStartDateObject: function (daysForward) {
        let returnVal = {}
        if (this.forceStartOfWeek) {
          returnVal = this.createThisDate().weekday(0).add(daysForward - 1, 'days')
        }
        else {
          returnVal = this.createThisDate().add(daysForward - 1, 'days')
        }
        // console.debug('getStartDateObject returnVal = ', returnVal)
        return returnVal
      },
      getDateEvents: function (daysForward) {
        let returnVal = []
        if (this.forceStartOfWeek) {
          returnVal = this.dateGetEvents(this.createThisDate().weekday(0).add(daysForward - 1, 'days'))
        }
        else {
          returnVal = this.dateGetEvents(this.createThisDate().add(daysForward - 1, 'days'))
        }
        // console.debug('getDateEvents returnVal = ', returnVal)
        return returnVal
      },
      getStartNumber: function (periodType) {
        if (this.forceStartOfWeek) {
          switch (periodType) {
            case 'year':
              return this.createThisDate().weekday(0).year()
            case 'month':
              return this.createThisDate().weekday(0).month()
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
      }
    },
    mounted () {
      this.doUpdate()
      console.debug('calendarMultiDay about to call handlePassedInEvents')
      this.handlePassedInEvents()
    },
    watch: {
      startYear: 'handleStartChange',
      startMonth: 'handleStartChange',
      startDay: 'handleStartChange',
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