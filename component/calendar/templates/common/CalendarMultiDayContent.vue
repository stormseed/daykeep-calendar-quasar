<template>
  <div class="flex-col calendar-multi-day-content">
    <div class="calendar-day flex-row">
      <calendar-time-label-column
        :calendar-locale="calendarLocale"
        :day-cell-height="dayCellHeight"
        :day-cell-height-unit="dayCellHeightUnit"
        :show-half-hours="showHalfHours"
      />
      <div class="calendar-multiple-days flex-col flex-row">
        <calendar-day-column
          v-for="thisDate in weekDateArray"
          :key="makeDT(thisDate).toISODate()"
          :start-date="thisDate"
          :date-events="dateGetEvents(thisDate, true)"
          column-css-class="calendar-day-column-content"
          :style="{ 'width': dayCellWidth }"
          :event-ref="eventRef"
          :prevent-event-detail="preventEventDetail"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :allow-editing="allowEditing"
          :day-cell-height="dayCellHeight"
          :day-cell-height-unit="dayCellHeightUnit"
          :show-half-hours="showHalfHours"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin,
    CalendarMultiDayContentTemplateMixin
  } from '../../mixins'
  import {
    CalendarDayColumn,
    CalendarTimeLabelColumn
  } from '../common'

  export default {
    name: 'CalendarMultiDayContent',
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarMultiDayContentTemplateMixin
    ],
    components: {
      CalendarDayColumn,
      CalendarTimeLabelColumn
    }
  }
</script>

<style lang="stylus">
  @import '../../styles-common/calendar.vars.styl'

  .calendar-multi-day-content
    //.calendar-time-margin
    //margin-left $dayTimeLabelWidth
    /*.calendar-header*/
    /*  .calendar-header-label*/
    /*    font-size 1.25em*/
    /*    font-weight bold*/
    .calendar-day
      margin-top 10px
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
