<template>
    <div class="calendar-test">
        <q-tabs class="calendar-tabs" inverted>
            <q-tab
                name="tab-month"
                icon="view_module"
                label="Month"
                default
                slot="title"
            />
            <q-tab
                name="tab-week-component"
                icon="view_week"
                label="Week"
                slot="title"
            />
            <q-tab
                name="tab-days-component"
                icon="view_column"
                label="3 Day"
                slot="title"
            />
            <q-tab
                name="tab-single-day-component"
                icon="view_day"
                label="Day"
                slot="title"
            />
            <q-tab
                name="tab-agenda"
                icon="view_agenda"
                label="Agenda"
                slot="title"
            />

            <q-tab-pane name="tab-month" class="calendar-tab-pane-month">
                <calendar-month
                    :ref="'month-' + thisRefName"
                    :startYear="yearNumber"
                    :startMonth="monthNumber"
                    :startDay="dayNumber"
                    :parsed-events="parsed"
                    :event-ref="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-week-component" class="calendar-tab-pane-week">
                <calendar-multi-day
                    :ref="'week-' + thisRefName"
                    :start-day="dayNumber"
                    :start-month="monthNumber"
                    :start-year="yearNumber"
                    :parsed-events="parsed"
                    :num-days="7"
                    :nav-days="7"
                    :force-start-of-week="true"
                    :event-ref="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-days-component" class="calendar-tab-pane-week">
                <calendar-multi-day
                    :ref="'days-' + thisRefName"
                    :start-day="dayNumber"
                    :start-month="monthNumber"
                    :start-year="yearNumber"
                    :parsed-events="parsed"
                    :num-days="3"
                    :nav-days="1"
                    :force-start-of-week="false"
                    :event-ref="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-single-day-component" class="calendar-tab-pane-week">
                <calendar-multi-day
                    :ref="'day-' + thisRefName"
                    :start-day="dayNumber"
                    :start-month="monthNumber"
                    :start-year="yearNumber"
                    :parsed-events="parsed"
                    :num-days="1"
                    :nav-days="1"
                    :force-start-of-week="false"
                    :event-ref="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-agenda" class="calendar-tab-pane-agenda">
                <calendar-agenda
                    :ref="'agenda-' + thisRefName"
                    :start-day="dayNumber"
                    :start-month="monthNumber"
                    :start-year="yearNumber"
                    :parsed-events="parsed"
                    :num-days="30"
                    :event-ref="eventRef"
                    scroll-height="300px"
                />
            </q-tab-pane>

        </q-tabs>
    </div>
</template>

<script>
  import moment from 'moment'
  import CalendarMixin from './CalendarMixin'
  import CalendarEvent from './CalendarEvent'
  import CalendarMonth from './CalendarMonth'
  import CalendarMultiDay from './CalendarMultiDay'
  import CalendarAgenda from './CalendarAgenda'
  import CalendarDayColumn from './CalendarDayColumn'
  import CalendarTimeLabelColumn from './CalendarTimeLabelColumn'
  import CalendarDayLabels from './CalendarDayLabels'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import {
    Events,
    QBtn,
    QTooltip,
    QTabs,
    QTab,
    QTabPane,
    QScrollArea
  } from 'quasar'
  import QuantityBubble from './QuantityBubble'
  export default {
    name: 'Calendar',
    // name: 'calendar',
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
      eventRef: {
        type: String,
        default: 'cal-' + Math.random().toString(36).substring(2, 15)
      }
    },
    components: {
      QuantityBubble,
      CalendarEvent,
      CalendarMonth,
      CalendarMultiDay,
      CalendarAgenda,
      CalendarDayColumn,
      CalendarTimeLabelColumn,
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
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        yearNumber: moment().year(),
        monthNumber: moment().month() + 1,
        weekNumber: moment().week(),
        dayNumber: moment().date(),
        // weekArray: [],
        parsed: {
          byAllDayStartDate: {},
          byStartDate: {},
          byId: {}
        },
        dayRowArray: [],
        thisRefName: this.createRandomString()
        // thisNavRef: this.createNewNavEventName(),
        // thisEventRef: 'cal-' + this.createRandomString()
      }
    },
    computed: {},
    methods: {
      setupEventsHandling: function () {
        // Events.$on(
        //   'calendar:navMovePeriod',
        //   this.moveTimePeriod
        // )
        // Events.$on(
        //   this.thisNavRef,
        //   this.moveTimePeriod
        // )
        Events.$on(
          this.eventRef + ':navMovePeriod',
          this.calPackageMoveTimePeriod
        )
      },
      // doMoveTimePeriod (unitType, amount) {
      //   console.debug('calendar.doMoveTimePeriod triggered')
      // }
      calPackageMoveTimePeriod: function (params) {
        this.moveTimePeriod(params)
        this.$emit(
          'calendar' + ':navMovePeriod',
          params
        )
      }
    },
    mounted () {
      // console.debug('thisMonth = ', moment().month())
      // console.debug('thisMoment = ', moment())
      // console.debug('props = ', this.startMonth, this.startYear, this.startDay)
      this.mountSetDate()
      // this.generateCalendarCellArray()
      console.debug('calendar about to call parseEventList')
      this.parseEventList()
      this.setupEventsHandling()
    }
  }
</script>

<style lang="stylus">
    $sevenCellWidth = 14.285%
    $cellHeight = 5em
    $borderOuter = 1px solid silver
    $borderThin = 1px dotted silver
    $dayTimeLabelWidth = 4em

    .calendar-time-width
        width $dayTimeLabelWidth
    .calendar-time-margin
        margin-left $dayTimeLabelWidth

    .calendar-tabs
        .calendar-tab-pane-day,
        .calendar-tab-pane-week
        /*.calendar-tab-pane-agenda*/
            height 60vh
            max-height 60vh
            overflow hidden
        /*
        .calendar-tab-pane-day
            height 60vh
            max-height 60vh
            overflow hidden
        */
        .calendar-tab-pane-week
            /*height 60vh*/
            /*max-height 60vh*/
            /*overflow hidden*/
            .calendar-day-labels
                .calendar-day-label
                    // width $sevenCellWidth
            .calendar-header
                .calendar-header-label
                    font-size 1.25em
                    font-weight bold
    /*
    .calendar-month
        .calendar-header
            .calendar-month-year
                font-size 1.25em
                font-weight bold
        .calendar-content
            padding 4px 12px
            .calendar-cell
                width $sevenCellWidth
                max-width $sevenCellWidth
                margin 1px
                padding 2px
            .calendar-day-labels
                .calendar-day-label
                    font-size 1.1em
                .calendar-day-label-current
                    font-weight bold
            //.calendar-multi-day
            //    border-bottom 1px solid silver
            //    :last-child
            //        border-bottom none
            .calendar-day
                background-color none
                height $cellHeight
                max-height $cellHeight
                .calendar-day-number
                    font-size 0.9em
                    height 2em
                    width 2em
                    vertical-align middle
                    padding-top .25em
                    padding-left .25em
                .calendar-day-current
                    background-color: red
    */
    .calendar-day,
    .calendar-multi-day,
    .calendar-multi-day .calendar-multiple-days
        .calendar-day-cell-height
            height 5rem
            max-height 5rem
        .calendar-day-column-label
            width $dayTimeLabelWidth
        .calendar-day-column-content
            // border-right $borderOuter
            position relative
        .calendar-day-time
            padding-right .5em
            border-right $borderOuter
        .calendar-day-time-content
            border-top $borderThin
    .calendar-day
        position relative
    .calendar-multiple-days
        .calendar-day-column-content
            width $sevenCellWidth
            border-right $borderThin
            position absolute
            top 0
</style>