<template>
  <div
    v-if="agendaStyle === 'dot'"
    :class="getDotEventClass()"
    :style="getEventStyle()"
    @mouseup="handleClick"
  >
    <!-- dot style -->
    <div class="flex-col-auto calendar-agenda-event-dot" :class="getDotClass()"></div>
    <div
      v-if="showTime"
      class="flex-col-auto calendar-agenda-event-time"
    >
      <template v-if="eventObject.start.isAllDay || eventObject.timeSpansMultipleDays">
        All day
      </template>
      <template v-else>
        {{ formatTimeRange(eventObject.start.dateObject,
        eventObject.end.dateObject) }}
      </template>
    </div>
    <div class="flex-col calendar-agenda-event-summary">
      {{ eventObject.summary }}
    </div>
  </div>
  <div
    v-else
    :class="getEventClass()"
    :style="getEventStyle()"
    @mouseup="handleClick"
  >
    <!-- block style -->
    <div class="calendar-agenda-event-summary">
      {{ eventObject.summary }}
    </div>
    <div
      v-if="showTime && !eventObject.start.isAllDay"
      class="calendar-agenda-event-time"
    >
      {{ formatTimeRange(eventObject.start.dateObject,
      eventObject.end.dateObject) }}
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    EventPropsMixin,
    CalendarAgendaEventTemplateMixin
  } from '../../mixins'

  export default {
    name: 'CalendarAgendaEvent',
    mixins: [
      CalendarMixin,
      CalendarEventMixin,
      EventPropsMixin,
      CalendarAgendaEventTemplateMixin
    ]
  }
</script>

<style lang="stylus">
  @import '../../styles-common/calendar.vars.styl'
  .calendar-agenda-event-empty-slot
    display none
    background green

  .calendar-agenda-event-dot-style
    width 100%
    background-color inherit
    transition background-color 0.3s ease
    &:hover
      background-color $whiteHighlightBackgroundColor
      transition background-color 0.3s ease
    .calendar-agenda-event-time
      margin-left 1em
      width 160px
    .calendar-agenda-event-dot
      border-radius 12px
      width 12px
      height 12px
</style>
