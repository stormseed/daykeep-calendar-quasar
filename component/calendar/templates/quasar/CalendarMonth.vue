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
    CalendarMonthTemplateMixin
  } from '../../mixins'
  import {
    // CalendarEvent,
    // CalendarDayLabels,
    CalendarMonthInner
  } from '../common'
  // import {
  //   QBtn
  // } from 'quasar'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import CalendarEventDetail from './CalendarEventDetail'

  export default {
    name: 'CalendarMonth',
    components: {
      // CalendarEvent,
      // CalendarDayLabels,
      CalendarHeaderNav,
      CalendarEventDetail,
      CalendarMonthInner
      // QBtn
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
  @import '../../styles-common/calendar.vars.styl'

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
          .inner-span
            font-size 1.5em
        .calendar-day-number-current
          .inner-span
            font-size 1.25em
      .calendar-day-current
        background-color $currentDayBackgroundColor
      .calendar-day-weekend
        background-color $weekendDayBackgroundColor

</style>
