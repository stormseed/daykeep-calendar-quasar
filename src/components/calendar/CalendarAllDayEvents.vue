<template>
  <div class="calendar-all-day-events row no-wrap justify-end items-start">
    <div
      v-for="(addDays, index) in numberOfDays"
      :key="addDays"
      :style="{
        'width': cellWidth,
        'max-width': cellWidth
      }"
    >
      <calendar-event
        v-for="thisEvent in dateGetEvents(addDaysToDate(workingDate, addDays - 1))"
        :key="makeDT(addDaysToDate(workingDate, addDays - 1)).toISODate() + getEventIdString(thisEvent)"
        v-if="thisEvent.start.isAllDay || thisEvent.timeSpansMultipleDays"
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
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin
  } from './mixins'
  import CalendarEvent from './CalendarEvent'
  export default {
    name: 'CalendarAllDayEvents',
    props: {
      startDate: {
        type: [Object, Date],
        default: () => { return new Date() }
      },
      parsed: {
        type: Object,
        default: () => {}
      },
      numberOfDays: {
        type: Number,
        default: 7
      },
      eventRef: String,
      preventEventDetail: {
        type: Boolean,
        default: false
      },
      allowEditing: {
        type: Boolean,
        default: false
      }
    },
    components: {
      CalendarEvent
    },
    mixins: [CalendarMixin, CalendarEventMixin],
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: new Date(),
        workingDateObject: {},
        weekArray: []
      }
    },
    computed: {
      cellWidth: function () {
        return this.calculateDayCellWidth(this.numberOfDays)
      }
    },
    methods: {
      doUpdate: function () {
        this.mountSetDate()
      },
      addDaysToDate: function (thisDateObject, numDays) {
        return this.makeDT(thisDateObject).plus({ days: numDays })
      }
    },
    mounted () {
      this.mountSetDate()
    },
    updated () {
      this.mountSetDate()
    },
    watch: {
      startDate: 'handleStartChange'
    }
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
