<template>
  <div class="calendar-month">
    <calendar-month-inner
      :start-date="startDate"
      :event-array="eventArray"
      :parsed-events="parsedEvents"
      :event-ref="eventRef"
      :prevent-event-detail="preventEventDetail"
      :calendar-locale="calendarLocale"
      :calendar-timezone="calendarTimezone"
      :sunday-first-day-of-week="sundayFirstDayOfWeek"
      :allow-editing="allowEditing"
      :render-html="renderHtml"
      :day-display-start-hour="dayDisplayStartHour"
      :full-component-ref="fullComponentRef"
    >
      <template v-slot:headernav="navVal">
        <calendar-header-nav
          :time-period-unit="navVal.timePeriodUnit"
          :time-period-amount="1"
          :move-time-period-emit="navVal.eventRef + ':navMovePeriod'"
        >
          {{ formatDate(navVal.workingDate, 'MMMM yyyy') }}
        </calendar-header-nav>
      </template>
      <template v-slot:eventdetail="eventVal">
        <calendar-event-detail
          :ref="eventVal.targetRef"
          v-if="!eventVal.preventEventDetail"
          :event-object="eventVal.eventObject"
          :calendar-locale="eventVal.calendarLocale"
          :calendar-timezone="eventVal.calendarTimezone"
          :event-ref="eventVal.eventRef"
          :allow-editing="eventVal.allowEditing"
          :render-html="eventVal.renderHtml"
        />
      </template>
    </calendar-month-inner>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin,
    CalendarMonthTemplateMixin,
    CalendarMonthInner
  } from '@daykeep/calendar-core'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import CalendarEventDetail from './CalendarEventDetail'

  export default {
    name: 'CalendarMonth',
    components: {
      CalendarHeaderNav,
      CalendarEventDetail,
      CalendarMonthInner
    },
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarMonthTemplateMixin
    ]
  }
</script>

<style lang="stylus">
</style>
