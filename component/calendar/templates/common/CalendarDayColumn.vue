<template>
  <div :class="columnCss">
    <!-- underlying cells -->
    <template
      v-for="thisHour in 24"
    >
      <div
        :key="thisHour"
        :style="getCellStyle"
        :id="getDayHourId(eventRef, workingDate, thisHour - 1)"
      >
        <div class="calendar-day-time-content"></div>
      </div>
      <div
        v-if="showHalfHours"
        :style="getCellStyle"
        :key="thisHour + '-half'"
      >
        <div class="calendar-day-time-content-half"></div>
      </div>
    </template>

    <!-- events -->
    <template v-if="dateEvents.length > 0">
      <template v-for="eventObject in dateEvents">
        <div
          v-if="!eventObject.start.isAllDay && !eventObject.timeSpansMultipleDays"
          :key="makeDT(workingDate).toISODate() + getEventIdString(eventObject)"
          :class="calculateDayEventClass(eventObject)"
          :style="calculateDayEventStyle(eventObject)"
        >
          <calendar-event
            :event-object="eventObject"
            :event-ref="eventRef"
            :calendar-locale="calendarLocale"
            :calendar-timezone="calendarTimezone"
            :prevent-event-detail="preventEventDetail"
            :allow-editing="allowEditing"
            render-style="doubleLine"
          />
        </div>
      </template>
    </template>

    <!-- current time -->
    <div
      class="current-time-line"
      :style="timePosition"
    ></div>

  </div>
</template>

<script>
  import CalendarEvent from './CalendarEvent'
  import {
    CalendarMixin,
    CalendarDayColumnTemplateMixin
  } from '../../mixins'

  export default {
    name: 'CalendarDayColumn',
    components: {
      CalendarEvent
    },
    mixins: [
      CalendarMixin,
      CalendarDayColumnTemplateMixin
    ]
  }
</script>

<style lang="stylus">
  /*@import '../../styles-common/calendar.vars.styl'*/

  .calendar-day
    position relative
    .calendar-day-cell-height
      height 5rem
      max-height 5rem
    .calendar-day-column-label
      //
    .calendar-day-column-content
      position relative
    .calendar-day-column-current
      background-color $currentDayBackgroundColor
    .calendar-day-column-weekend
      background-color $weekendDayBackgroundColor
    .calendar-day-time
      padding-right .5em
      border-right $borderOuter
    .calendar-day-time-content
      border-top $borderThin
    .calendar-day-time-content-half
      border-top $borderThinner
    .calendar-day-event-overlap
      margin-left 1px
      ::after
        position absolute
        top -1px
        left -1px
        width: calc(100% + 2px)
        height: calc(100% + 2px)
        content ''
        border-radius 5px
        border 1px solid white
        box-sizing border-box
    .calendar-day-event-overlap-first
      margin-left 0
    .current-time-line
      position absolute
      border 1px solid red
      width 100%

</style>
