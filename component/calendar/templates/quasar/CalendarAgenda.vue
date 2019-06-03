<template>
  <div class="calendar-test">
    <calendar-agenda-inner
      :agenda-style="agendaStyle"
      :num-days="numDays"
      :left-margin="leftMargin"
      :scroll-height="scrollHeight"
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
        <!-- calendar header -->
        <calendar-header-nav
          time-period-unit="days"
          :time-period-amount="1"
          :move-time-period-emit="eventRef + ':navMovePeriod'"
          :calendar-locale="calendarLocale"
        >
          {{ formatDate(workingDate, 'EEE, MMM d')}}
          -
          {{ formatDate(makeDT(workingDate).plus({ days: numJumpDays }), 'MMM d')}}
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
    </calendar-agenda-inner>

  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin,
    CalendarAgendaTemplateMixin,
    CalendarAgendaInner
  } from '@daykeep/calendar-core'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import CalendarEventDetail from './CalendarEventDetail'

  export default {
    name: 'CalendarAgenda',
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarAgendaTemplateMixin
    ],
    components: {
      CalendarHeaderNav,
      CalendarEventDetail,
      CalendarAgendaInner
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
