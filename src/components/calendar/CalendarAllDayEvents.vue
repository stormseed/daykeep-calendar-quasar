<template>
    <div class="calendar-all-day-events row no-wrap justify-end items-start">
        <div
            v-for="(addDays, index) in numberOfDays"
            :style="{
              'width': cellWidth,
              'max-width': cellWidth
            }"
        >
            <template
                v-for="thisEvent in dateGetEvents(addDaysToDate(workingDate, addDays - 1))"
                v-if="thisEvent.start.isAllDay"
            >
                <calendar-event
                    :event-object="thisEvent"
                    :show-time="false"
                    :event-ref="eventRef"
                    :has-previous-day="thisEvent.hasPrev"
                    :has-next-day="thisEvent.hasNext"
                    :force-all-day="true"
                />
            </template>
        </div>
    </div>
</template>

<script>
  import CalendarMixin from './mixins/CalendarMixin'
  import CalendarEventMixin from './mixins/CalendarEventMixin'
  import CalendarEvent from './CalendarEvent'
  import { date } from 'quasar'
  const { DateTime } = require('luxon')
  export default {
    name: 'CalendarAllDayEvents',
    props: {
      startDate: {
        type: [Object, Date],
        default: () => { return new Date() }
      },
      parsed: {
        type: Object,
        default: {}
      },
      numberOfDays: {
        type: Number,
        default: 7
      },
      eventRef: String
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
      },
    },
    methods: {
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
      },
      addDaysToDate: function (thisDateObject, numDays) {
        return this.makeDT(thisDateObject).plus({ days: numDays })
        // return date.addToDate(thisDateObject, { days: numDays })
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
