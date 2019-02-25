<template>
  <div class="calendar-test">
    <q-tabs
      v-model="currentTab"
      class="calendar-tabs"
      ref="fullCalendarTabs"
      inverted
    >
      <q-tab
        name="tab-month"
        icon="view_module"
        :label="tabLabels.month"
      />
      <q-tab
        name="tab-week-component"
        icon="view_week"
        :label="tabLabels.week"
      />
      <q-tab
        name="tab-days-component"
        icon="view_column"
        :label="tabLabels.threeDay"
      />
      <q-tab
        name="tab-single-day-component"
        icon="view_day"
        :label="tabLabels.day"
      />
      <q-tab
        name="tab-agenda"
        icon="view_agenda"
        :label="tabLabels.agenda"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="currentTab"
      animated
    >
      <q-tab-panel name="tab-month" class="calendar-tab-pane-month">
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
      </q-tab-panel>
      <q-tab-panel name="tab-week-component" class="calendar-tab-pane-week">
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
      </q-tab-panel>
      <q-tab-panel name="tab-days-component" class="calendar-tab-pane-week">
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
      </q-tab-panel>
      <q-tab-panel name="tab-single-day-component" class="calendar-tab-pane-week">
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
      </q-tab-panel>
      <q-tab-panel name="tab-agenda" class="calendar-tab-pane-agenda">
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
      </q-tab-panel>
    </q-tab-panels>

  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin
  } from './mixins'
  import CalendarMonth from './CalendarMonth'
  import CalendarMultiDay from './CalendarMultiDay'
  import CalendarAgenda from './CalendarAgenda'
  import {
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    QSeparator
  } from 'quasar'
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
      CalendarMonth,
      CalendarMultiDay,
      CalendarAgenda,
      QTabs,
      QTab,
      QTabPanels,
      QTabPanel,
      QSeparator
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
        currentTab: 'tab-month',
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
