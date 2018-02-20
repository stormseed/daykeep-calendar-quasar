<template>
    <div class="calendar-test">
        <q-tabs class="calendar-tabs" ref="fullCalendarTabs" inverted>
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
                    :start-date="workingDate"
                    :parsed-events="parsed"
                    :event-ref="eventRef"
                    :fullComponentRef="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-week-component" class="calendar-tab-pane-week">
                <calendar-multi-day
                    :ref="'week-' + thisRefName"
                    :start-date="workingDate"
                    :parsed-events="parsed"
                    :num-days="7"
                    :nav-days="7"
                    :force-start-of-week="true"
                    :event-ref="eventRef"
                    :fullComponentRef="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-days-component" class="calendar-tab-pane-week">
                <calendar-multi-day
                    :ref="'days-' + thisRefName"
                    :start-date="workingDate"
                    :parsed-events="parsed"
                    :num-days="3"
                    :nav-days="1"
                    :force-start-of-week="false"
                    :event-ref="eventRef"
                    :fullComponentRef="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-single-day-component" class="calendar-tab-pane-week">
                <calendar-multi-day
                    :ref="'day-' + thisRefName"
                    :start-date="workingDate"
                    :parsed-events="parsed"
                    :num-days="1"
                    :nav-days="1"
                    :force-start-of-week="false"
                    :event-ref="eventRef"
                    :fullComponentRef="eventRef"
                />
            </q-tab-pane>
            <q-tab-pane name="tab-agenda" class="calendar-tab-pane-agenda">
                <calendar-agenda
                    :ref="'agenda-' + thisRefName"
                    :start-date="workingDate"
                    :parsed-events="parsed"
                    :num-days="30"
                    :event-ref="eventRef"
                    scroll-height="300px"
                    :fullComponentRef="eventRef"
                />
            </q-tab-pane>

        </q-tabs>
    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import CalendarEventMixin from './CalendarEventMixin'
  import CalendarEvent from './CalendarEvent'
  import CalendarMonth from './CalendarMonth'
  import CalendarMultiDay from './CalendarMultiDay'
  import CalendarAgenda from './CalendarAgenda'
  import CalendarDayColumn from './CalendarDayColumn'
  import CalendarTimeLabelColumn from './CalendarTimeLabelColumn'
  import CalendarDayLabels from './CalendarDayLabels'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import {
    date,
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
    props: {
      startDate: {
        type: Date,
        default: () => { return new Date() }
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
    mixins: [CalendarMixin, CalendarEventMixin],
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: new Date(),
        parsed: {
          byAllDayStartDate: {},
          byStartDate: {},
          byId: {}
        },
        dayRowArray: [],
        thisRefName: this.createRandomString()
      }
    },
    computed: {},
    methods: {
      setupEventsHandling: function () {
        Events.$on(
          this.eventRef + ':navMovePeriod',
          this.calPackageMoveTimePeriod
        )
        Events.$on(
          this.eventRef + ':moveToSingleDay',
          this.switchToSingleDay
        )
      },
      calPackageMoveTimePeriod: function (params) {
        this.moveTimePeriod(params)
        this.$emit(
          'calendar' + ':navMovePeriod',
          params
        )
      },
      switchToSingleDay: function (params) {
        this.setTimePeriod(params)
        this.$refs.fullCalendarTabs.selectTab('tab-single-day-component')
      }
    },
    mounted () {
      this.mountSetDate()
      this.parseEventList()
      this.setupEventsHandling()
    }
  }
</script>

<style lang="stylus">
    @import 'calendar.vars.styl'

    .calendar-tabs
        .calendar-tab-pane-day,
        .calendar-tab-pane-week
            height 60vh
            max-height 60vh
            overflow hidden
        .q-tab-pane
            border none

</style>