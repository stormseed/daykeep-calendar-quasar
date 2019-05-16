<template>
  <div class="calendar-all-day-events flex-row flex-no-wrap flex-justify-end flex-items-start">
    <div
      v-for="(addDays, index) in numberOfDays"
      :key="addDays"
      :style="{
        'width': cellWidth,
        'max-width': cellWidth
      }"
    >
      <template v-for="thisEvent in dateGetEvents(addDaysToDate(workingDate, addDays - 1))">
        <calendar-event
          v-if="thisEvent.start.isAllDay || thisEvent.timeSpansMultipleDays"
          :key="makeDT(addDaysToDate(workingDate, addDays - 1)).toISODate() + getEventIdString(thisEvent)"
          :event-object="thisEvent"
          :show-time="thisEvent.timeSpansMultipleDays"
          :event-ref="eventRef"
          :prevent-event-detail="preventEventDetail"
          :has-previous-day="thisEvent.hasPrev"
          :has-next-day="thisEvent.hasNext"
          :force-all-day="true"
          :allow-editing="allowEditing"
          :is-leftmost-column="(index === 0)"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarAllDayEventsTemplateMixin
  } from '../../mixins'
  import CalendarEvent from './CalendarEvent'

  export default {
    name: 'CalendarAllDayEvents',
    components: {
      CalendarEvent
    },
    mixins: [
      CalendarMixin,
      CalendarEventMixin,
      CalendarAllDayEventsTemplateMixin
    ]
  }
</script>

<style lang="stylus">
  .calendar-day-labels
    .calendar-day-label
      font-size 1.1em
      .calendar-day-label-date
        font-size 1.75em
    .calendar-day-label-current
      font-weight bold

</style>
