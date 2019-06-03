<template>
  <div class="calendar-test">
    <q-tabs
      v-model="currentTab"
      class="text-primary calendar-tabs"
      ref="fullCalendarTabs"
      align="left"
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
      class="calendar-tab-panels"
      animated
    >
      <q-tab-panel name="tab-month" class="calendar-tab-panel-month">
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
      <q-tab-panel name="tab-week-component" class="calendar-tab-panel-week">
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
      <q-tab-panel name="tab-days-component" class="calendar-tab-panel-week">
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
      <q-tab-panel name="tab-single-day-component" class="calendar-tab-panel-week">
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
      <q-tab-panel name="tab-agenda" class="calendar-tab-panel-agenda">
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
    CalendarParentComponentMixin,
    CalendarTemplateMixin
  } from '@daykeep/calendar-core'
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
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarTemplateMixin
    ],
    components: {
      CalendarMonth,
      CalendarMultiDay,
      CalendarAgenda,
      QTabs,
      QTab,
      QTabPanels,
      QTabPanel,
      QSeparator
    }
  }
</script>

<style lang="stylus">
  @import '~@daykeep/calendar-core/component/calendar/styles-common/calendar.vars.styl'

  .calendar-tab-panels
    .calendar-tab-panel-day,
    .calendar-tab-panel-week
      height 60vh
      max-height 60vh
      overflow hidden
    .q-tab-panel
      border none

</style>
