<template>
    <div class="calendar-all-day-events row no-wrap justify-end items-start">
        <div
            v-for="(addDays, index) in numberOfDays"
            :style="{
              'width': cellWidth,
              'max-width': cellWidth,
            }"
        >
            <div
                v-for="thisEvent in dateGetEvents(thisDayObject(addDays))"
            >
                <calendar-event
                    v-if="thisEvent.start.isAllDay"
                    :event-object="thisEvent"
                    :show-time="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'
  import CalendarMixin from './CalendarMixin'
  import CalendarEvent from './CalendarEvent'
  // import {} from 'quasar'
  export default {
    name: 'CalendarAllDayEvents',
    props: {
      startMonth: {
        type: Number,
        default: moment().month()
      },
      startYear: {
        type: Number,
        default: moment().year()
      },
      startDay: {
        type: Number,
        default: moment().date()
      },
      parsed: {
        type: Object,
        default: {}
      },
      numberOfDays: {
        type: Number,
        default: 7
      }
    },
    components: {
      CalendarEvent
    },
    mixins: [CalendarMixin],
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        yearNumber: moment().year(),
        monthNumber: moment().month(),
        weekNumber: moment().week(),
        dayNumber: moment().date(),
        workingDateObject: {},
        weekArray: []
      }
    },
    computed: {
      cellWidth: function () {
        return (100 / this.numberOfDays).toFixed(3) + '%'
      },
      // getDateObject: function () {
      //   return moment()
      //     .year(this.startYear)
      //     .month(this.startMonth)
      //     .date(this.startDay)
      // }
    },
    methods: {
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
      },
      isCurrentDayLabel: function (thisDayNum) {
        return this.isCurrentDate(this.getDateObject().clone().add((thisDayNum - 1), 'days').date())
      },
      thisDayObject: function (thisDayNum) {
        return this.getDateObject().clone().add((thisDayNum - 1), 'days')
      }
    },
    mounted () {
      this.mountSetDate()
    },
    updated () {
      // console.debug('day labels updated')
      // this.mountSetDate()
      this.workingDateObject
        .year(this.startYear)
        .month(this.startMonth)
        .date(this.startDay)
    },
    watch: {
      startYear: 'handleStartChange',
      startMonth: 'handleStartChange',
      startDay: 'handleStartChange'
    }
  }
</script>

<style lang="stylus">
    $cellWidth = 14.285%
    $cellHeight = 5em

    .calendar-day-labels
        .calendar-day-label
            font-size 1.1em
            .calendar-day-label-date
                font-size 1.75em
        .calendar-day-label-current
            font-weight bold

</style>