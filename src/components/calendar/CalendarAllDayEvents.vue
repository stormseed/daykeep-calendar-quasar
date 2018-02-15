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
                />
            </template>
        </div>
    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import CalendarEvent from './CalendarEvent'
  import { date } from 'quasar'
  export default {
    name: 'CalendarAllDayEvents',
    props: {
      startDate: {
        type: Date,
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
    mixins: [CalendarMixin],
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
        return date.addToDate(thisDateObject, { days: numDays })
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