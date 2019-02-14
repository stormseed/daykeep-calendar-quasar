<template>
  <div class="calendar-test">
    <q-tabs class="calendar-tabs" ref="fullCalendarTabs" inverted>
      <q-tab
        name="tab-month"
        icon="view_module"
        :label="tabLabels.month"
        default
        slot="title"
      />
      <q-tab
        name="tab-week-component"
        icon="view_week"
        :label="tabLabels.week"
        slot="title"
      />
      <q-tab
        name="tab-days-component"
        icon="view_column"
        :label="tabLabels.threeDay"
        slot="title"
      />
      <q-tab
        name="tab-single-day-component"
        icon="view_day"
        :label="tabLabels.day"
        slot="title"
      />
      <q-tab
        name="tab-agenda"
        icon="view_agenda"
        :label="tabLabels.agenda"
        slot="title"
      />

      <q-tab-pane name="tab-month" class="calendar-tab-pane-month">
        <calendar-month
          :ref="'month-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :event-ref="eventRef"
          :full-component-ref="eventRef"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"

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
          :full-component-ref="eventRef"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :day-display-start-hour="dayDisplayStartHour"

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
          :full-component-ref="eventRef"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :day-display-start-hour="dayDisplayStartHour"

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
          :full-component-ref="eventRef"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :day-display-start-hour="dayDisplayStartHour"

        />
      </q-tab-pane>
      <q-tab-pane name="tab-agenda" class="calendar-tab-pane-agenda">
        <calendar-agenda
          :ref="'agenda-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :num-days="28"
          :event-ref="eventRef"
          scroll-height="300px"
          :full-component-ref="eventRef"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
        />
      </q-tab-pane>

    </q-tabs>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin
  } from './mixins'
  import CalendarEvent from './CalendarEvent'
  import CalendarMonth from './CalendarMonth'
  import CalendarMultiDay from './CalendarMultiDay'
  import CalendarAgenda from './CalendarAgenda'
  import CalendarDayColumn from './CalendarDayColumn'
  import CalendarTimeLabelColumn from './CalendarTimeLabelColumn'
  import CalendarDayLabels from './CalendarDayLabels'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import {
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
    mixins: [CalendarParentComponentMixin, CalendarMixin, CalendarEventMixin],
    props: {
      startDate: {
        type: [Object, Date],
        default: () => { return new Date() }
      },
      tabLabels: {
        type: Object,
        default: () => {
          return {
            month: 'Month',
            week: 'Week',
            threeDay: '3 Day',
            day: 'Day',
            agenda: 'Agenda'
          }
        }
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
        thisRefName: this.createRandomString()
      }
    },
    computed: {},
    methods: {
      setupEventsHandling: function () {
        this.$root.$on(
          this.eventRef + ':navMovePeriod',
          this.calPackageMoveTimePeriod
        )
        this.$root.$on(
          this.eventRef + ':moveToSingleDay',
          this.switchToSingleDay
        )
        this.$root.$on(
          'update-event-' + this.eventRef,
          this.handleEventUpdate
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
      },
      doUpdate: function () {
        this.mountSetDate()
      }
    },
    mounted () {
      this.mountSetDate()
      this.parseEventList()
      this.setupEventsHandling()
    },
    watch: {
      startDate: function () {
        this.handleStartChange()
      },
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

  .calendar-tabs
    .calendar-tab-pane-day,
    .calendar-tab-pane-week
      height 60vh
      max-height 60vh
      overflow hidden
    .q-tab-pane
      border none

</style>
